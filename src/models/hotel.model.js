const mongoose = require("mongoose");
const hotelSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        unique: true,
    },
    location: {
        type: String,
        required: true,
        trim: true,
    },
    description: {
        type: String,
        trim: true
    },
    MainImage: {
        type: String,
        default: 'default_profile_picture.png',
    },
    image1: {
        type: String,
        default: 'default_profile_picture.png',
    },
    image2: {
        type: String,
        default: 'default_profile_picture.png',
    },
    image3: {
        type: String,
        default: 'default_profile_picture.png',
    },
    rating: {
        type: Number,
        min: 0,
        max: 5,
        default: 0
    },
    pricePerNight: {
        type: Number,
        required: true
    },
    amenities: {
        type: [String],
    },
    managerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Staff",
        required: false,
    },
    staffsIds: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Staff",
        required: true,
    }],
}, { timestamps: true });

const Hotel = mongoose.model("Hotel", hotelSchema);
module.exports = Hotel;