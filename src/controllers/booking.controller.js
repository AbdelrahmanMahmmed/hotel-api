const { json } = require('express');
const Booking = require('../models/booking.model.js');
const Room = require('../models/room.model.js');
const Hotel = require('../models/hotel.model.js');
const asyncHandler = require('express-async-handler')
const SendEmail = require('../utils/sendEmail.js');
// [Customer Controllers]

// Add a new booking
exports.addBooking = asyncHandler(async (req, res) => {
    const { room, checkInDate, checkOutDate, guests, status, NumberOfDays, paymentStatus } = req.body;

    const roomId = await Room.findById(room);

    if (!roomId) {
        return res.status(404).json({ message: "Room not found" });
    }

    if (!roomId.availability) {
        return res.status(400).json({ message: "Room price is not available" });
    }

    const user = req.user._id;
    const hotel = roomId.HotelId;

    const checkIn = new Date(checkInDate);
    const checkOut = new Date(checkOutDate);

    const numberOfDays = NumberOfDays || Math.ceil((checkOut - checkIn) / (1000 * 60 * 60 * 24));

    const totalPrice = numberOfDays * roomId.pricePerNight;

    const newBooking = new Booking({
        user,
        room,
        hotel,
        checkInDate: checkIn,
        checkOutDate: checkOut,
        guests,
        NumberOfDays,
        totalPrice,
        status,
        paymentStatus,
    });
    await newBooking.save();

    // send Eamil

    const message = `
        Hello ${req.user.name},
        
        Your booking for ${numberOfDays} days has been confirmed.
        Your booking details:
        - Check-in: ${checkInDate}
        - Check-out: ${checkOutDate}
        - Room: ${roomId.roomNumber}
        - Total price: ${totalPrice}
        
        Kindly contact our customer service at 123-456-7890 to make any changes or confirm your payment.
        
        Thank you for choosing Hotel.
        
        Regards,
        Hotel Team
    `;

    try {
        await SendEmail({
            to: req.user.email,
            subject: 'Booking Confirmation',
            text: message
        });
    } catch (err) {
        console.error("Error while sending email:", err);
        return next(new ApiError('Failed to send email, please try again later', 500));
    }

    res.status(201).json({
        message: "Booking added successfully",
        booking: newBooking
    });
});
//Become a booking to Cancelled
exports.cancelBooking = asyncHandler(async (req, res) => {
    const booking = await Booking.findById(req.params.id);
    if (!booking) {
        return res.status(404).json({ message: "Booking not found" });
    }
    if (booking.status === "cancelled") {
        return res.status(400).json({ message: "Booking is already cancelled" });
    }
    else {
        booking.status = "cancelled";
        await booking.save();
        res.status(200).json({
            message: "Booking cancelled successfully",
        });
    }
});

// [Manager & Receptionist Controllers]

// Get all bookings for a specific hotel
exports.getBookings = asyncHandler(async (req, res) => {
    const staffId = req.staff._id;
    const staffRole = req.staff.role;

    if (staffRole === 'Receptionist') {
        const hotel = await Hotel.findOne({ staffsIds: { $in: [staffId] } });
        if (!hotel) {
            return res.status(404).json({ message: "Hotel not found" });
        }
        const bookings = await Booking.find({ hotel: hotel._id, status: { $ne: "cancelled" } })
            .select('-status -_id -createdAt -updatedAt -__v -checkOutDate')
            .populate('user', 'name email -_id')
            .populate('room', 'roomNumber roomType availability floor -_id')
            .populate({
                path: 'hotel',
                select: 'name managerId -_id',
                populate: {
                    path: 'managerId',
                    select: 'name -_id'
                }
            });
        return res.status(200).json({
            bookings: bookings,
        });
    }

    if (staffRole === 'Manager') {
        const hotel = await Hotel.findOne({ managerId: staffId });
        if (!hotel) {
            return res.status(404).json({ message: "Hotel not found" });
        }
        const bookings = await Booking.find({ hotel: hotel._id, status: { $ne: "cancelled" } })
            .select('-status -_id -createdAt -updatedAt -__v -checkOutDate')
            .populate('user', 'name email -_id')
            .populate('room', 'roomNumber roomType availability floor -_id')
            .populate({
                path: 'hotel',
                select: 'name managerId -_id',
                populate: {
                    path: 'managerId',
                    select: 'name -_id'
                }
            });
        return res.status(200).json({
            bookings: bookings,
        });
    }

    res.status(403).json({ message: "Unauthorized role" });
});
//Get all bookings across all hotels
exports.getAllBookings = asyncHandler(async (req, res) => {
    const staffId = req.staff._id
    // pagination
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const total = await Booking.countDocuments();
    const bookings = await Booking.find()
        .select('-status -_id -createdAt -updatedAt -__v -checkOutDate')
        .populate('user', 'name email -_id')
        .populate('room', 'roomNumber roomType availability floor -_id')
        .populate({
            path: 'hotel',
            select: 'name managerId -_id',
            populate: {
                path: 'managerId',
                select: 'name -_id'
            }
        })
        .sort({ createdAt: -1 })
        .limit(limit)
        .skip(startIndex);
    res.json({
        page,
        limit,
        totalPages: Math.ceil(total / limit),
        bookings
    });
});
// Get a specific booking by ID
exports.getBookingById = asyncHandler(async (req, res) => {
    const staffId = req.staff._id;
    const staffRole = req.staff.role;
    const booking = await Booking.findById(req.params.id)
        .select('-status -_id -createdAt -updatedAt -__v -checkOutDate')
        .populate('user', 'name email -_id')
        .populate('room', 'roomNumber roomType availability floor -_id')
        .populate({
            path: 'hotel',
            select: 'name managerId -_id',
            populate: {
                path: 'managerId',
                select: 'name -_id'
            }
        });
    if (!booking) {
        return res.status(404).json({ message: "Booking not found" });
    }
    if (!booking.hotel) {
        return res.status(400).json({ message: "Hotel information is missing in this booking" });
    }
    const isOwner = staffRole === 'Owner';
    const isManagerOrReceptionist = (staffRole === 'Manager' || staffRole === 'Receptionist') &&
        booking.hotel.managerId?.toString() === staffId.toString();
    if (isOwner || isManagerOrReceptionist) {
        return res.json(booking);
    }
    return res.status(403).json({ message: "Unauthorized" });
});