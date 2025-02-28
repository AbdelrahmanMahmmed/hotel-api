const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema({
    user: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "User", 
        required: true 
    },
    room: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "Room", 
        required: true 
    },
    hotel: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "Hotel", 
        required: true 
    },
    checkInDate: { 
        type: Date, 
        required: true 
    },
    checkOutDate: { 
        type: Date, 
        required: true
    },
    guests: { 
        adults: { 
            type: Number, 
            required: true 
        },
        children: { 
            type: Number, 
            default: 0 
        }
    },
    NumberOfDays : {
        type: Number, 
        required: true
    },
    totalPrice: { 
        type: Number, 
    },
    status: { 
        type: String, 
        enum: ["pending", "confirmed", "cancelled", "completed"], 
        default: "pending" 
    },
    paymentStatus: { 
        type: String, 
        enum: ["pending", "paid", "failed"], 
        default: "pending"
    }
}, {timestamps : true});

const Booking = mongoose.model("Booking", bookingSchema);

module.exports = Booking;