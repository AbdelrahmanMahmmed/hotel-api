const express = require('express');
const router = express.Router();

const {
    CreateEmployeeValiadtors,
    getEmployeeByIdValiadtors,
    updateEmployeeValiadtors,
    deleteEmployeeValiadtors,
    ChangePasswordValiadtors
} = require('../validators/User.Validator.js');

const {
    getUser,
    getProfile,
    getStafUser,
    getStaffProfile,
    uploadimageProfile,
    UpdateName,
    UpdateRoleById,
    DeleteMe,
    getEmployees,
    getEmployeeById,
    updateEmployee,
    createEmployee,
    deleteEmployee,
    ChanagePassword,
    getEmployees_Manager,
    LoginStaff
} = require('../controllers/user.controller.js');

const { upload } = require('../utils/UploadImage.js');
const { ProtectedRoters } = require('../controllers/auth.controller.js');
const { ProtectedRotersForStaff, allwedToStaff } = require('../controllers/user.controller.js');

// User Customer
router.get('/profile', ProtectedRoters, getProfile, getUser);
router.post('/profile/upload-image', ProtectedRoters, upload.single('profilePicture'), uploadimageProfile);
router.put('/profile/update-name', ProtectedRoters, UpdateName);
router.delete('/profile', ProtectedRoters, DeleteMe);

// Owner & Manager Routes
router.get('/owner/all-users', ProtectedRotersForStaff, allwedToStaff('Owner'), getEmployees);
router.get('/manager/all-users', ProtectedRotersForStaff, allwedToStaff('Manager', 'Owner'), getEmployees_Manager);
router.get('/staff/profile', ProtectedRotersForStaff, getStaffProfile, getStafUser);
router.post('/admin/create-user', ProtectedRotersForStaff, allwedToStaff('Manager', 'Owner'), CreateEmployeeValiadtors, createEmployee);
router.put('/admin/update-role/:id', ProtectedRotersForStaff, allwedToStaff('Manager', 'Owner'), UpdateRoleById);
router.put('/admin/change-password', ProtectedRotersForStaff, allwedToStaff('Manager', 'Owner'), ChangePasswordValiadtors, ChanagePassword);

router
    .route('/admin/:id')
    .get(ProtectedRotersForStaff, allwedToStaff('Manager', 'Owner'), getEmployeeByIdValiadtors, getEmployeeById)
    .put(ProtectedRotersForStaff, allwedToStaff('Manager', 'Owner'), updateEmployeeValiadtors, updateEmployee)
    .delete(ProtectedRotersForStaff, allwedToStaff('Manager', 'Owner'), deleteEmployeeValiadtors, deleteEmployee);

router.post('/staff/login', LoginStaff);
module.exports = router;