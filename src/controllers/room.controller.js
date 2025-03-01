const { json } = require('express');
const Room = require('../models/room.model.js');
const Hotel = require('../models/hotel.model.js');
const ApiError = require('../utils/APIError.js');
const asyncHandler = require('express-async-handler')
const logger = require('../utils/logger.js');
const { uploadImage } = require('../utils/UploadImage.js')

// [Owner Controllers]

// Get all rooms in all hotels
exports.getrooms = asyncHandler(async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const startIndex = (page - 1) * limit;
    const totalRooms = await Room.countDocuments();
    const { StatusRoom } = req.query;
    const filter = StatusRoom ? { reservationStatus: StatusRoom } : {};

    const Rooms = await Room.find(filter)
        .select('-createdAt -updatedAt -__v -_id')
        .populate({
            path: 'HotelId',
            select: 'name managerId -_id',
            populate: {
                path: 'managerId',
                select: 'name email -_id'
            }
        })
        .skip(startIndex)
        .limit(limit);

    //logger.info(`GET /api/rooms?page=${page}&limit=${limit}&StatusRoom=${StatusRoom}`);
    res.status(200).json({
        totalRooms,
        message: 'Rooms fetched successfully',
        DetailsOfRooms: Rooms,
        currentPage: page,
        pageSize: limit,
    });
});
// Create a room in any hotel
exports.createRoom = asyncHandler(async (req, res) => {
    const {
        hotelId, roomNumber, roomType, floor, pricePerNight, discounts, availability,
        checkInDate, checkOutDate, bedType, maxOccupancy, roomSize, bathroomType,
        view, smokingPolicy, roomAmenities, reservationStatus, specialRequests,
        description
    } = req.body;

    const hotel = await Hotel.findById(hotelId);
    if (!hotel) {
        throw new ApiError('Hotel not found', 404);
    }

    let uploadedImages = [];
    if (req.files && Array.isArray(req.files)) {
        uploadedImages = await Promise.all(req.files.map(async (file) => {
            const result = await uploadImage(file);
            return result.secure_url;
        }));
    }

    const newRoom = new Room({
        HotelId: hotelId,
        roomNumber,
        roomType,
        floor,
        pricePerNight,
        discounts,
        availability,
        checkInDate,
        checkOutDate,
        bedType,
        maxOccupancy,
        roomSize,
        bathroomType,
        view,
        smokingPolicy,
        roomAmenities,
        reservationStatus,
        specialRequests,
        roomImages: uploadedImages,
        description
    });

    await newRoom.save();

    //logger.info(`POST /api/rooms?hotelId=${hotelId}`);
    res.status(201).json({
        success: true,
        message: 'Room created successfully',
        room: newRoom,
    });
});
// Get the Room By Id
exports.getRoomById = asyncHandler(async (req, res) => {
    const room = await Room.findById(req.params.id)
        .select('-createdAt -updatedAt -__v -_id')
        .populate({
            path: 'HotelId',
            select: 'name managerId -_id',
            populate: {
                path: 'managerId',
                select: 'name email -_id'
            }
        })
    if (!room) {
        throw new ApiError(404, 'Room not found');
    }
    //logger.info(`GET /api/rooms/${req.params.id}`);
    res.status(200).json({
        DetailsOfRoom: room,
    });
});
// Update a Room in any hotel
exports.updateRoom = asyncHandler(async (req, res) => {
    const {
        hotelId, roomNumber, roomType, floor, pricePerNight, discounts, availability,
        checkInDate, checkOutDate, bedType, maxOccupancy, roomSize, bathroomType,
        view, smokingPolicy, roomAmenities, reservationStatus, specialRequests,
        description
    } = req.body;
    const hotel = await Hotel.findById(hotelId);
    if (!hotel) {
        throw new ApiError(404, 'Hotel not found');
    }
    const updatedRoom = await Room.findByIdAndUpdate(req.params.id, {
        roomNumber,
        roomType,
        floor,
        pricePerNight,
        discounts,
        availability,
        checkInDate,
        checkOutDate,
        bedType,
        maxOccupancy,
        roomSize,
        bathroomType,
        view,
        smokingPolicy,
        roomAmenities,
        reservationStatus,
        specialRequests,
        description
    }, { new: true });
    if (!updatedRoom) {
        throw new ApiError(404, 'Room not found');
    }
    //logger.info(`PUT /api/rooms/${req.params.id}`);
    res.status(200).json({
        message: 'Room updated successfully',
    });
});
// Update a Images Room in any hotel
exports.updateRoomImages = asyncHandler(async (req, res) => {
    const { roomId } = req.params;
    let uploadedImages = [];
    if (req.files && Array.isArray(req.files)) {
        uploadedImages = await Promise.all(req.files.map(async (file) => {
            const result = await uploadImage(file);
            return result.secure_url;
        }));
    }    const hotel = await Hotel.findById(req.staff.hotelId);
    if (!hotel) {
        throw new ApiError(404, 'Hotel not found');
    }
    const room = await Room.findByIdAndUpdate(roomId, {
        roomImages: uploadedImages
    }, { new: true });
    if (!room) {
        throw new ApiError(404, 'Room not found');
    }
    //logger.info(`PUT /api/rooms/${roomId}/images`);
    res.status(200).json({
        message: 'Room images updated successfully',
    });
});
// Delete a Room in any hotel
exports.deleteRoom = asyncHandler(async (req, res) => {
    const room = await Room.findByIdAndDelete(req.params.id)
    if (!room) {
        throw new ApiError(404, 'Room not found');
    }
    if (room.reservationStatus === "confirmed") {
        throw new ApiError(400, 'Cannot delete a confirmed reservation');
    }
    //logger.info(`DELETE /api/rooms/${req.params.id}`);
    res.status(200).json({
        message: 'Room deleted successfully',
    });
});




// [Manager Controllers]

// Get all rooms in a hotel by managerId
exports.getRoomsByManagerId = asyncHandler(async (req, res, next) => {
    const managerId = req.staff._id;

    const hotel = await Hotel.findOne({ managerId });
    if (!hotel) {
        return next(new ApiError('Hotel not found', 404));
    }

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const startIndex = (page - 1) * limit;
    const totalRooms = await Room.countDocuments({ HotelId: hotel._id });
    const rooms = await Room.find({ HotelId: hotel._id })
        .select('-createdAt -updatedAt -__v -_id')
        .populate({
            path: 'HotelId',
            select: 'name -_id',
            populate: {
                path: 'managerId',
                select: 'name email -_id'
            }
        })
        .skip(startIndex)
        .limit(limit);

    // if (logger) {
    //     logger.info(`GET /api/rooms/manager/${managerId}`);
    // }

    res.status(200).json({
        totalRooms,
        message: 'Rooms fetched successfully',
        DetailsOfRooms: rooms,
        currentPage: page,
        pageSize: limit,
    });
});
// Get all rooms By reservationStatus in a hotel by managerId
exports.getRoomsByStatus = asyncHandler(async (req, res, next) => {
    const managerId = req.staff._id;
    const hotel = await Hotel.findOne({ managerId });
    if (!hotel) {
        return next(new ApiError('Hotel not found', 404));
    }

    const { reservationStatus } = req.query;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const startIndex = (page - 1) * limit;
    const totalRooms = await Room.countDocuments({ HotelId: hotel._id, reservationStatus });
    const rooms = await Room.find({ HotelId: hotel._id, reservationStatus })
        .select('-createdAt -updatedAt -__v -_id')
        .populate({
            path: 'HotelId',
            select: 'name -_id',
            populate: {
                path: 'managerId',
                select: 'name email -_id'
            }
        }).skip(startIndex).limit(limit);

    //logger.info(`GET /api/rooms/manager/${managerId}?reservationStatus=${reservationStatus}`);
    res.status(200).json({
        totalRooms,
        message: 'Rooms fetched successfully',
        DetailsOfRooms: rooms,
        currentPage: page,
        pageSize: limit,
    });
});
//Create a room within the hotel managed by the manager By managerId
exports.createRoomByManagerId = asyncHandler(async (req, res, next) => {
    const managerId = req.staff._id;
    const hotel = await Hotel.findOne({ managerId });
    if (!hotel) {
        return next(new ApiError('Hotel not found', 404));
    }
    const {
        roomNumber, roomType, floor, pricePerNight, discounts, availability,
        checkInDate, checkOutDate, bedType, maxOccupancy, roomSize, bathroomType,
        view, smokingPolicy, roomAmenities, reservationStatus, specialRequests,
        description
    } = req.body;

    let uploadedImages = [];
    if (req.files && Array.isArray(req.files)) {
        uploadedImages = await Promise.all(req.files.map(async (file) => {
            const result = await uploadImage(file);
            return result.secure_url;
        }));
    };

    const newRoom = new Room({
        HotelId: hotel._id,
        roomNumber,
        roomType,
        floor,
        pricePerNight,
        discounts,
        availability,
        checkInDate,
        checkOutDate,
        bedType,
        maxOccupancy,
        roomSize,
        bathroomType,
        view,
        smokingPolicy,
        roomAmenities,
        reservationStatus,
        specialRequests,
        roomImages: uploadedImages,
        description
    });
    await newRoom.save();
    //logger.info(`POST /api/rooms/manager/${managerId}`);
    res.status(201).json({
        message: 'Room created successfully',
        room: newRoom,
    });
});
// Delete a room by its ID if the room exists within the same hotel managed by the manager with managerId
exports.deleteRoomByManagerId = asyncHandler(async (req, res, next) => {
    const managerId = req.staff._id;
    const hotel = await Hotel.findOne({ managerId });
    if (!hotel) {
        return next(new ApiError('Hotel not found', 404));
    }
    const room = await Room.findByIdAndDelete(req.params.id);
    if (!room) {
        return next(new ApiError(`Room not found in hotel ${hotel.name}`, 404));
    }
    if (room.reservationStatus === "confirmed") {
        return next(new ApiError('Cannot delete a confirmed reservation', 400));
    }
    //logger.info(`DELETE /api/rooms/manager/${managerId}/${req.params.id}`);
    res.status(200).json({
        message: 'Room deleted successfully',
    });
});
// Update a room by its ID if the room exists within the same hotel managed by the manager with managerId
exports.updateRoomByManagerId = asyncHandler(async (req, res, next) => {
    const managerId = req.staff._id;
    const hotel = await Hotel.findOne({ managerId });
    if (!hotel) {
        return next(new ApiError('Hotel not found', 404));
    }
    const {
        roomNumber, roomType, floor, pricePerNight, discounts, availability,
        checkInDate, checkOutDate, bedType, maxOccupancy, roomSize, bathroomType,
        view, smokingPolicy, roomAmenities, reservationStatus, specialRequests,
        description
    } = req.body;
    const updatedRoom = await Room.findByIdAndUpdate(req.params.id, {
        roomNumber,
        roomType,
        floor,
        pricePerNight,
        discounts,
        availability,
        checkInDate,
        checkOutDate,
        bedType,
        maxOccupancy,
        roomSize,
        bathroomType,
        view,
        smokingPolicy,
        roomAmenities,
        reservationStatus,
        specialRequests,
        description
    }, { new: true });
    if (!updatedRoom) {
        return next(new ApiError(`Room not found in hotel ${hotel.name}`, 404));
    }
    //logger.info(`PUT /api/rooms/manager/${managerId}/${req.params.id}`);
    res.status(200).json({
        message: 'Room updated successfully',
    });
});

// Update a Images room by its ID if the room exists within the same hotel managed by the manager with managerId
exports.updateRoomImagesByManagerId = asyncHandler(async (req, res, next) => {
    const managerId = req.staff._id;
    const hotel = await Hotel.findOne({ managerId });
    if (!hotel) {
        return next(new ApiError('Hotel not found', 404));
    }
    let uploadedImages = [];
    if (req.files && Array.isArray(req.files)) {
        uploadedImages = await Promise.all(req.files.map(async (file) => {
            const result = await uploadImage(file);
            return result.secure_url;
        }));
    }
    const room = await Room.findByIdAndUpdate(req.params.id, {
        roomImages: uploadedImages
    }, { new: true });

    if (!room) {
        return next(new ApiError(`Room not found in hotel ${hotel.name}`, 404));
    }

    //logger.info(`PUT /api/rooms/images/manager/${managerId}/${req.params.id}`);
    res.status(200).json({
        message: 'Room images updated successfully',
    });
});
// Retrieve room data if it is located within the hotel managed by the manager with managerId
exports.getRoomByManagerId = asyncHandler(async (req, res, next) => {
    const managerId = req.staff._id;
    const hotel = await Hotel.findOne({ managerId });

    if (!hotel) {
        return next(new ApiError('Hotel not found', 404));
    }

    const room = await Room.findOne({ _id: req.params.id, HotelId: hotel._id })
        .select('-createdAt -updatedAt -__v -_id')
        .populate({
            path: 'HotelId',
            select: 'name -_id',
            populate: {
                path: 'managerId',
                select: 'name email -_id'
            }
        });

    if (!room) {
        return next(new ApiError(`Room not found or does not belong to hotel : ${hotel.name}`, 404));
    }

    //logger.info(`GET /api/rooms/manager/${req.params.id}`);
    res.status(200).json({
        message: 'Room fetched successfully',
        room,
    });
});



// [Receptionist Controllers]

// Update room in a hotel by receptionistId
exports.updateRoomByReceptionistId = asyncHandler(async (req, res, next) => {
    const receptionistId = req.staff._id;

    const hotel = await Hotel.findOne({ staffsIds: { $in: [receptionistId] } });
    if (!hotel) {
        return next(new ApiError('Hotel not found', 404));
    }

    const {
        roomNumber, roomType, floor, pricePerNight, discounts, availability,
        checkInDate, checkOutDate, bedType, maxOccupancy, roomSize, bathroomType,
        view, smokingPolicy, roomAmenities, reservationStatus, specialRequests,
        description
    } = req.body;
    const updatedRoom = await Room.findByIdAndUpdate(req.params.id, {
        roomNumber,
        roomType,
        floor,
        pricePerNight,
        discounts,
        availability,
        checkInDate,
        checkOutDate,
        bedType,
        maxOccupancy,
        roomSize,
        bathroomType,
        view,
        smokingPolicy,
        roomAmenities,
        reservationStatus,
        specialRequests,
        description
    }, { new: true });
    if (!updatedRoom) {
        return next(new ApiError(`Room not found in hotel ${hotel.name}`, 404));
    }
    //logger.info(`PUT /api/rooms/manager/${receptionistId}/${req.params.id}`);
    res.status(200).json({
        message: 'Room updated successfully',
    });
});
// Update room status in a hotel by receptionistId
exports.changeRoomStatus = asyncHandler(async (req, res, next) => {
    const receptionistId = req.staff._id;
    const hotel = await Hotel.findOne({ staffsIds: { $in: [receptionistId] } });
    if (!hotel) {
        return next(new ApiError('Hotel not found', 404));
    }
    const room = await Room.findById(req.params.id);
    if (!room) {
        return next(new ApiError(`Room not found in hotel ${hotel.name}`, 404));
    }
    const updatedRoom = await Room.findByIdAndUpdate(req.params.id, { reservationStatus: req.body.status }, { new: true });
    if (!updatedRoom) {
        return next(new ApiError(`Room not found in hotel ${hotel.name}`, 404));
    }
    //logger.info(`PUT /api/rooms/receptionist/${receptionistId}/${req.params.id}/status`);
    res.status(200).json({
        message: 'Room status updated successfully',
        data: updatedRoom.reservationStatus
    });
});
// Update room description in a hotel by receptionistId
exports.updateRoomDescription = asyncHandler(async (req, res, next) => {
    const receptionistId = req.staff._id;
    const hotel = await Hotel.findOne({ staffsIds: { $in: [receptionistId] } });
    if (!hotel) {
        return next(new ApiError('Hotel not found', 404));
    }
    const room = await Room.findById(req.params.id);
    if (!room) {
        return next(new ApiError(`Room not found in hotel ${hotel.name}`, 404));
    }
    const updatedRoom = await Room.findByIdAndUpdate(req.params.id, { description: req.body.description }, { new: true });
    if (!updatedRoom) {
        return next(new ApiError(`Room not found in hotel ${hotel.name}`, 404));
    }
    //logger.info(`PUT /api/rooms/receptionist/${receptionistId}/${req.params.id}/description`);
    res.status(200).json({
        message: 'Room description updated successfully',
        data: updatedRoom.description
    });
});
// Update room discount in a hotel by receptionistId
exports.updateRoomDiscount = asyncHandler(async (req, res, next) => {
    const receptionistId = req.staff._id;
    const hotel = await Hotel.findOne({ staffsIds: { $in: [receptionistId] } });
    if (!hotel) {
        return next(new ApiError('Hotel not found', 404));
    }
    const room = await Room.findById(req.params.id);
    if (!room) {
        return next(new ApiError(`Room not found in hotel ${hotel.name}`, 404));
    }
    const updatedRoom = await Room.findByIdAndUpdate(req.params.id, { discounts: req.body.discount }, { new: true });
    if (!updatedRoom) {
        return next(new ApiError(`Room not found in hotel ${hotel.name}`, 404));
    }
    //logger.info(`PUT /api/rooms/receptionist/${receptionistId}/${req.params.id}/discount`);
    res.status(200).json({
        message: 'Room discount updated successfully',
        data: updatedRoom.discounts
    });
});
// Update room amenities in a hotel by receptionistId
exports.updateRoomAmenities = asyncHandler(async (req, res, next) => {
    const receptionistId = req.staff._id;
    const hotel = await Hotel.findOne({ staffsIds: { $in: [receptionistId] } });
    if (!hotel) {
        return next(new ApiError('Hotel not found', 404));
    }
    const room = await Room.findById(req.params.id);
    if (!room) {
        return next(new ApiError(`Room not found in hotel ${hotel.name}`, 404));
    }
    const updatedRoom = await Room.findByIdAndUpdate(req.params.id, { roomAmenities: req.body.amenities }, { new: true });
    if (!updatedRoom) {
        return next(new ApiError(`Room not found in hotel ${hotel.name}`, 404));
    }
    //logger.info(`PUT /api/rooms/receptionist/${receptionistId}/${req.params.id}/amenities`);
    res.status(200).json({
        message: 'Room amenities updated successfully',
        data: updatedRoom.roomAmenities
    });
});




// [Cleaner Controllers]

// Update room availability in a hotel by CleanerId
exports.changeRoomAvailability = asyncHandler(async (req, res, next) => {
    const cleanerId = req.staff._id;
    const hotel = await Hotel.findOne({ staffsIds: { $in: [cleanerId] } });
    if (!hotel) {
        return next(new ApiError('Hotel not found', 404));
    }
    const room = await Room.findById(req.params.id);
    if (!room) {
        return next(new ApiError(`Room not found in hotel ${hotel.name}`, 404));
    }
    const updatedRoom = await Room.findByIdAndUpdate(req.params.id, { availability: true }, { new: true });
    if (!updatedRoom) {
        return next(new ApiError(`Room not found in hotel ${hotel.name}`, 404));
    }
    //logger.info(`PUT /api/rooms/receptionist/${cleanerId}/${req.params.id}/availability`);
    res.status(200).json({
        message: 'Room availability updated successfully',
        data: updatedRoom.availability
    });
});
// Get all rooms availability is false in a hotel by CleanerId
exports.getRoomsWithoutAvailability = asyncHandler(async (req, res, next) => {
    const cleanerId = req.staff._id;
    const hotel = await Hotel.findOne({ staffsIds: { $in: [cleanerId] } });
    if (!hotel) {
        return next(new ApiError('Hotel not found', 404));
    }
    const rooms = await Room.find({ HotelId: hotel._id, availability: false })
        .select('roomNumber floor -_id');
    if (rooms.length === 0) {
        return next(new ApiError('No rooms found without availability', 404));
    }
    //logger.info(`GET /api/rooms/receptionist/${cleanerId}/without-availability`);
    res.status(200).json({
        data: rooms
    });
});

// [Customer Controllers]

// Checkout from room service
exports.checkoutFromRoom = asyncHandler(async (req, res, next) => {
    const room = await Room.findById(req.params.id);
    if (!room) {
        return next(new ApiError(`Room not found with id ${room}`, 404));
    }
    if (room.availability === false) {
        return next(new ApiError('Room is not available', 400));
    }
    const updatedRoom = await Room.findByIdAndUpdate(req.params.id, {
        availability: false,
        reservationStatus: 'pending',
        checkOutDate: new Date()
    }, { new: true });

    //logger.info(`POST /api/rooms/customer/${req.params.id}/checkout`);
    res.status(200).json({
        message: 'Room checkout successful',
    });
});