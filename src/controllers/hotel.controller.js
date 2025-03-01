const { json } = require('express');
const Hotel = require('../models/hotel.model.js');
const ApiError = require('../utils/APIError.js');
const asyncHandler = require('express-async-handler')
const logger = require('../utils/logger.js');
const { uploadImage } = require('../utils/UploadImage.js')


// for [Owner Controllers]

// add New Hotel to system
exports.addhotel = asyncHandler(async (req, res) => {
    try {
        const { name, location, description, rating, pricePerNight, amenities } = req.body;
        if (!req.files || req.files.length < 1) {
            return res.status(400).json({ error: "At least one image is required" });
        }
        const uploadedImages = await Promise.all(req.files.map(async (file) => {
            const result = await uploadImage(file);
            return result.secure_url;
        }));
        const hotel = new Hotel({
            name,
            location,
            description,
            rating,
            pricePerNight,
            amenities,
            MainImage: uploadedImages[0] || '',
            image1: uploadedImages[1] || '',
            image2: uploadedImages[2] || '',
            image3: uploadedImages[3] || ''
        });
        await hotel.save();
        const userName = req.user ? req.user.name : "Unknown User";
        //logger.info(`Manager added a new hotel by: ${userName}, Time: ${new Date().toISOString()}`);
        res.status(201).json({ message: 'Hotel created successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});
// update hotel details
exports.updatehotel = asyncHandler(async (req, res, next) => {
    const hotel = await Hotel.findByIdAndUpdate(req.params.id, req.body, { new: true })
    if (!hotel) {
        return next(new ApiError(`Hotel not found for ID: ${req.params.id}`))
    }
    res.status(200).json({
        massage: "Updated hotel Successfully",
    })
})
// delete hotel
exports.deletehotel = asyncHandler(async (req, res) => {
    await Hotel.findByIdAndDelete(req.params.id)
    res.status(204).json({
        message: 'Hotel deleted successfully'
    })
});
// get hotel by id
exports.gethotel = asyncHandler(async (req, res, next) => {
    const hotel = await Hotel.findById(req.params.id)
        .select('-createdAt -updatedAt -__v -_id')
        .populate('managerId', 'name -_id')
        .populate('staffsIds', ' name email -_id');
    if (!hotel) {
        return next(new ApiError(`Hotel not found for ID: ${req.params.id}`))
    }
    res.status(200).json({
        data: hotel
    })
});
// get all hotel
exports.gethotels = asyncHandler(async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const startIndex = (page - 1) * limit;
    const totalHotels = await Hotel.countDocuments();

    const hotels = await Hotel.find()
        .select('-createdAt -updatedAt -__v -_id')
        .populate('managerId', 'name -_id')
        .populate('managerId', 'name -_id email')
        .skip(startIndex)
        .limit(limit);

    res.status(200).json({
        data: hotels,
        totalHotels: totalHotels,
        currentPage: page,
        pageSize: limit,
    });
});