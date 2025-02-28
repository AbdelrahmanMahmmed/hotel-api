const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
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
        required: false,
        enum : [
            'Customer'
        ],
        default: 'Customer'
    },
    phone: {
        type: String,
        required: false,
    },
    profilePicture: {
        type: String,
        default: 'default_profile_picture.png',
    },
    Payments:{
        type: Array,
        default: []
    },
    isVerified: {
        type: Boolean,
        default: false,
    },
    passwordChanagedAt: {
        type: Date
    },
    UserResetCode: String,
    UserResetExpire: Date,

    passwordResetCode: String,
    passwordResetExpiret: Date,
    passwordResetVerifed: Boolean,
}, { timestamps: true });

UserSchema.pre("save", async function (next) {
    if (!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password, 12);
    next();
});

module.exports = mongoose.model('User', UserSchema);
