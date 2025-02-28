const mongoose = require("mongoose");

const roomSchema = new mongoose.Schema({
    HotelId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Hotel",
        required: true
    },
    roomNumber: {
        type: String,
        required: true,
        unique: true
    },
    roomType: {
        type: String,
        enum: ["single", "double", "suite", "deluxe"],
        required: true
    },
    floor: {
        type: Number,
        required:true
    },
    pricePerNight: {
        type: Number,
        required: true
    },
    discounts: {
        type: Number,
        default: 0
    },
    availability: {
        type: Boolean,
        default: true
    },
    checkInDate: {
        type: Date
    },
    checkOutDate: {
        type: Date
    },
    bedType: {
        type: String,
        enum: ["single", "double", "queen", "king"],
        required: true
    },
    maxOccupancy: {
        type: Number,
        required: true
    },
    roomSize: {
        type: Number,
        required: true
    },
    bathroomType: {
        type: String, enum: ["private", "shared"],
        required: true
    },
    view: {
        type: String,
        enum: ["sea", "city", "garden", "pool"],
        required: true
    },
    smokingPolicy: {
        type: String,
        enum: ["allowed", "not allowed"],
        required: true
    },
    roomAmenities: {
        type: [String]
    },
    reservationStatus: {
        type: String,
        enum: ["confirmed", "pending", "cancelled"],
        default: "pending"
    },
    specialRequests: {
        type: String,
        default: ""
    },
    roomImages: {
        type: [String]
    },
    description: {
        type: String
    },
}, { timestamps: true });

const Room = mongoose.model("Room", roomSchema);

module.exports = Room;