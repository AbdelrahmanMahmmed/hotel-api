const express = require('express');
const {
    RegisterUserValidator,
    LoginUserValidator
} = require('../validators/Auth.Validator.js');

const router = express.Router();


const {
    RegisterUser,
    LoginUser,
    VerifyUser,
    verifyCode,
    ForgetPassword,
    Resetpassword,
    verifyCodePassword,
    checkVerification,
} = require('../controllers/auth.controller.js');

const {ProtectedRoters} = require('../controllers/auth.controller.js')

// Register User
router
    .route('/register')
    .post(RegisterUserValidator, RegisterUser);
router
    .route('/login')
    .post(checkVerification, LoginUserValidator, LoginUser);



// Verify User
router.post('/verify/user',
    VerifyUser);
router.post('/verify/code',
    verifyCode);


// Forgot Password
router
    .route('/password/forgot-password')
    .post(ForgetPassword);
router
    .route('/password/verify-otp')
    .post(verifyCodePassword);
router
    .route('/password/reset')
    .post(Resetpassword);

module.exports = router;