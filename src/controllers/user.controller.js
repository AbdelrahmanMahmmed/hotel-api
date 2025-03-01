const { json } = require('express');
const Staff = require('../models/staff.model');
const User = require('../models/user.model');
const Hotel = require('../models/hotel.model');
const ApiError = require('../utils/APIError');
const asyncHandler = require('express-async-handler')
const jwt = require('jsonwebtoken');
const { uploadImage } = require('../utils/UploadImage');
const SendEmail = require('../utils/sendEmail.js');
const cookieParser = require('cookie-parser');
const bcyrpt = require('bcryptjs');
const logger = require('../utils/logger.js');

// Get Profile Customer
exports.getUser = asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    const user = await User.findById(id).select('-password -createdAt -updatedAt -__v -_id -role');
    if (!user) {
        return next(new ApiError(`No User found for ID: ${id}`, 404));
    }
    res.status(200).json({
        data: user
    });
});
exports.getProfile = asyncHandler(async (req, res, next) => {
    req.params.id = req.user._id;
    next();
});

// Get Profile Staff
exports.getStafUser = asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    const staff = await Staff.findById(id)
        .select('-password -createdAt -updatedAt -__v -_id')
        .populate({
            path: 'HotelId',
            select: 'name -_id',
            populate: {
                path: 'managerId',
                select: 'name email -_id'
            }
        });
    if (!staff) {
        return next(new ApiError(`No Staff found for ID: ${id}`, 404));
    }
    res.status(200).json({
        data: staff
    });
});
exports.getStaffProfile = asyncHandler(async (req, res, next) => {
    req.params.id = req.staff._id;
    next();
});
// Upload Picture User
exports.uploadimageProfile = asyncHandler(async (req, res, next) => {
    try {
        let imageUrl = '';
        if (req.file) {
            const result = await uploadImage(req.file);
            imageUrl = result.secure_url;
        }
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        user.profilePicture = imageUrl;
        await user.save();
        res.status(200).json({ message: 'Image updated successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});
// Update Name User
exports.UpdateName = asyncHandler(async (req, res) => {
    // const { id } = req.params;
    const user = await User.findByIdAndUpdate(req.user.id, {
        name: req.body.name,
    }, { new: true });
    if (!user) {
        return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json({
        message: 'name updated successfully',
    });
});
// Delete me
exports.DeleteMe = asyncHandler(async (req, res) => {
    const user = await User.findByIdAndDelete(req.user.id);
    if (!user) {
        return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json({ message: 'User deleted successfully' });
});


// all router authorization Manager
//Get All User
exports.getEmployees = asyncHandler(async (req, res, next) => {
    const { page = 1, limit = 5 } = req.query;
    const staffStartIndex = (page - 1) * limit;
    const userStartIndex = (page - 1) * limit;

    const totalStaffs = await Staff.countDocuments();
    const totalUsers = await User.countDocuments();

    const staffs = await Staff.find({})
        .select('-password -createdAt -updatedAt -__v -_id')
        .skip(staffStartIndex)
        .limit(limit);

    const customers = await User.find({})
        .select('-password -createdAt -updatedAt -__v -_id')
        .skip(userStartIndex)
        .limit(limit);

    res.status(200).json({
        message: 'Users fetched successfully',
        Staff: staffs,
        Customers: customers,
        totalUsers: totalUsers + totalStaffs,
        currentPage: Number(page),
        pageSize: Number(limit),
    });
});
exports.getEmployees_Manager = asyncHandler(async (req, res, next) => {
    try {
        const managerId = req.staff._id;
        const manager = await Staff.findById(managerId).select("name");
        const hotel = await Hotel.findOne({ managerId }).populate({
            path: "staffsIds",
            select: "name role -_id",
        });
        if (!hotel) {
            return res.status(404).json({ message: "Hotel not found" });
        }
        res.status(200).json({
            message: `Staff IDs Under Manager: ${manager.name}`,
            staff: hotel.staffsIds || [],
        });
    } catch (error) {
        next(error);
    }
});
// Get User by ID
exports.getEmployeeById = asyncHandler(async (req, res, next) => {
    const staff = await Staff.findById(req.params.id).select('-password -createdAt -updatedAt -__v -_id');
    if (!staff) {
        return next(new ApiError(`User not found for ID: ${req.params.id}`, 404));
    }
    res.status(200).json({
        data: staff
    });
});
// Create Employee
exports.createEmployee = asyncHandler(async (req, res, next) => {
    const { name, email, password, role, HotelId } = req.body;
    const hotel = await Hotel.findById(HotelId);
    if (!hotel) {
        return res.status(404).json({ message: "Hotel not found" });
    }
    const staff = new Staff({
        name,
        email,
        password,
        role,
        HotelId
    });
    await staff.save();
    if (role === "Manager") {
        hotel.managerId = staff._id;
        await hotel.save();
    }
    if (role !== "Manager") {
        hotel.staffsIds.push(staff._id);
        await hotel.save();
    }
    const token = jwt.sign({ StaffId: staff._id }, process.env.JWT_SECRET_KEY, {
        expiresIn: process.env.JWT_EXPIRES_TIME,
    });
    res.cookie('token', token, {
        httpOnly: true,
        secure: true,
        maxAge: process.env.COOKIE_EXPIRES_TIME,
        sameSite: "Lax"
    });
    res.status(201).json({
        message: "Created successfully",
        staff,
        token
    });
});
// Update User
exports.updateEmployee = asyncHandler(async (req, res, next) => {
    const staff = await Staff.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!staff) {
        return next(new ApiError(`User not found for ID: ${req.params.id}`, 404));
    }
    res.status(200).json({
        message: 'User updated successfully',
    });
});
exports.UpdateRoleById = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { role } = req.body;
    if (!role) {
        return res.status(400).json({ message: "Role is required" });
    }
    const staff = await Staff.findById(id);
    if (!staff) {
        return res.status(404).json({ message: "Staff not found" });
    }
    staff.role = role;
    await staff.save();
    res.status(200).json({
        message: "Role updated successfully",
        data: staff,
    });
});
// Delete User
exports.deleteEmployee = asyncHandler(async (req, res, next) => {
    const staff = await Staff.findByIdAndDelete(req.params.id);
    if (!staff) {
        return next(new ApiError(`User not found for ID: ${req.params.id}`, 404));
    }
    res.status(200).json({
        message: 'User deleted successfully',
    });
});
// Chanage password for user with email
exports.ChanagePassword = asyncHandler(async (req, res, next) => {
    const staff = await Staff.findOne({ email: req.body.email });
    if (!staff) {
        return next(new ApiError('There is no user with email ' + req.body.email, 404));
    }
    staff.password = req.body.NewPassword;
    await staff.save();
    const token = jwt.sign({ StaffId: staff._id }, process.env.JWT_SECRET_KEY, {
        expiresIn: process.env.JWT_EXPIRES_TIME
    });
    // Send Email
    const message = `Your password has been changed successfully`;
    try {
        await SendEmail({
            to: req.body.email,
            subject: 'Password changed successfully',
            text: message
        });
    } catch (err) {
        console.error("Error while sending email:", err);
        return next(new ApiError('Failed to send email, please try again later', 500));
    }
    res.cookie('token', token, {
        httpOnly: true,
        secure: true,
        maxAge: process.env.COOKIE_EXPIRES_TIME
    });
    res.status(200).json({
        message: 'Password has been reset successfully',
        token
    });
});
// Login Staff
exports.LoginStaff = asyncHandler(async (req, res, next) => {
    const staff = await Staff.findOne({ email: req.body.email });
    if (!staff || !(await bcyrpt.compare(req.body.password, staff.password))) {
        throw new ApiError('Invalid email or password', 401);
    }
    const token = jwt.sign({ StaffId: staff._id }, process.env.JWT_SECRET_KEY, {
        expiresIn: process.env.JWT_EXPIRES_TIME
    });
    // Send Email
    const message = `You are logged in successfully`;
    try {
        await SendEmail({
            to: staff.email,
            subject: 'Logged in successfully',
            text: message
        });
    } catch (err) {
        console.error("Error while sending email:", err);
        return next(new ApiError('Failed to send email, please try again later', 500));
    }
    res.cookie('token', token, {
        httpOnly: true,
        secure: true,
        maxAge: process.env.COOKIE_EXPIRES_TIME,
        sameSite: "Lax"
    });
    //logger.info(`staff logged in: ${staff.email}, IP: ${req.ip}, Time: ${new Date().toISOString()}`);
    res.json({ staff, token });
});
// Protected Routers and Allowed
exports.ProtectedRotersForStaff = asyncHandler(async (req, res, next) => {
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
        token = req.headers.authorization.split(' ')[1];
    }
    if (!token) {
        return next(new ApiError("You are not logged in", 401));
    }
    // 2- Verify token (no chanage happens , expired token)
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    // 3- check if user is Exist or Not
    const staff = await Staff.findById(decoded.StaffId);
    if (!staff) {
        return next(new ApiError('User no longer exists', 401));
    }
    // 4- check if user chanage is password after token created
    if (staff.passwordChanagedAt) {
        const passChanagedTimestamp = parseInt(staff.passwordChanagedAt.getTime() / 1000, 10);
        // if password chanaged after token created then return error
        if (passChanagedTimestamp > decoded.iat) {
            return next(new ApiError('Your password has been changed, please login again', 401));
        }
    }
    req.staff = staff;
    next();
});

exports.allwedToStaff = (...roles) => asyncHandler(async (req, res, next) => {
    if (!(roles.includes(req.staff.role))) {
        return next(new ApiError('You are not authorized to access this route', 403));
    }
    next();
});