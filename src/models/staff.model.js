const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const StaffSchema = new mongoose.Schema({
    HotelId : {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Hotel",
        required: true,
    },
    name: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 20,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        index: true
    },
    password: {
        type: String,
        required: true,
        minlength: 6,
    },
    role: {
        type: String,
        required: true,
        enum: [
            'Owner',
            'Manager',
            'Receptionist',
            'Cleaner'
        ],
    },
    phone: {
        type: String,
        required: false,
    },
    isVerified: {
        type: Boolean,
        default: true,
    },
    passwordChanagedAt: {
        type: Date
    },
    StaffResetCode: String,
    StaffResetExpire: Date,

    passwordResetCode: String,
    passwordResetExpiret: Date,
    passwordResetVerifed: Boolean,
}, { timestamps: true });

StaffSchema.pre("save", async function (next) {
    if (!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password, 12);
    next();
});

module.exports = mongoose.model('Staff', StaffSchema);