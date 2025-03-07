const express = require('express');
const router = express.Router();
const {
    createRoomVaildators,       // for Owner
    getRoomIdVaildators,        // for Owner
    updateRoomVaildators,       // for Owner
    DeleteRoomVaildators,       // for Owner
    updateRoomImagesVaildators, // for Owner
    createRoomByManagerIdVaildators,   // for Manager
    deleteRoomByManagerIdVaildators,   // for Manager
    getRoomByManagerIdVaildators,      // for Manager
    updateRoomByManagerIdVaildators,   // for Manager
    updateRoomImagesByManagerIdVaildators,// for Manager
    changeRoomStatusVaildators,        // for Receptionist
    updateRoomDescriptionVaildators,   // for Receptionist
    updateRoomDiscountVaildators,      // for Receptionist
    updateRoomAmenitiesVaildators,     // for Receptionist
    changeRoomAvailabilityVaildators,  // for Cleaner
    checkoutFromRoomVaildators,        // for Customer
} = require('../validators/room.Validator.js');

const {
    getrooms,           // for Owner
    createRoom,         // for Owner
    getRoomById,        // for Owner
    updateRoom,         // for Owner         
    deleteRoom,         // for Owner
    updateRoomImages,   // for Owner
    getRoomsByStatus,                   // for Manager
    getRoomsByManagerId,                // for Manager
    createRoomByManagerId,              // for Manager
    deleteRoomByManagerId,              // for Manager
    updateRoomByManagerId,              // for Manager
    getRoomByManagerId,                 // for Manager
    updateRoomImagesByManagerId,        // for Manager
    updateRoomByReceptionistId,  // for Receptionist
    changeRoomStatus,            // for Receptionist
    updateRoomDescription,       // for Receptionist
    updateRoomDiscount,          // for Receptionist
    updateRoomAmenities,         // for Receptionist
    changeRoomAvailability,                               // for Cleaner
    getRoomsWithoutAvailability,                          // for Cleaner
    checkoutFromRoom                                                    // Customer
} = require('../controllers/room.controller.js');

const { upload } = require('../utils/UploadImage.js');
const { ProtectedRotersForStaff, allwedToStaff } = require('../controllers/user.controller.js');
const { ProtectedRoters } = require('../controllers/auth.controller.js');


// [Customer Routers]
router
    .route('/:id/checkout')
    .post(ProtectedRoters, checkoutFromRoomVaildators, checkoutFromRoom);


router.use(ProtectedRotersForStaff);

// [Owner Routers]
router
    .route('/owner/all')
    .get(allwedToStaff('Owner'), getrooms);

router
    .route('/owner/:id')
    .get(allwedToStaff('Owner'), getRoomIdVaildators, getRoomById)
    .put(allwedToStaff('Owner'),
        updateRoomVaildators,
        updateRoom
    )
    .delete(allwedToStaff('Owner'), DeleteRoomVaildators, deleteRoom);

router
    .route('/owner/:id/images')
    .put(allwedToStaff('Owner'), updateRoomImagesVaildators, updateRoomImages)

router.post(
    '/owner/create',
    allwedToStaff('Owner'),
    upload.array('images', 3),
    createRoomVaildators,
    createRoom
);


// [Manager Routers]

router
    .route('/manager/create')
    .post(allwedToStaff('Manager'),
        upload.array('images', 3),
        createRoomByManagerIdVaildators,
        createRoomByManagerId
    );

router
    .route('/manager/all')
    .get(allwedToStaff('Manager'), getRoomsByManagerId);

router
    .route('/manager/status')
    .get(allwedToStaff('Manager'), getRoomsByStatus);

router
    .route('/manager/:id')
    .delete(allwedToStaff('Manager'), deleteRoomByManagerIdVaildators, deleteRoomByManagerId)
    .put(allwedToStaff('Manager'),
        updateRoomByManagerIdVaildators,
        updateRoomByManagerId
    );

router
    .route('/owner/:id/images')
    .put(allwedToStaff('Manager'), updateRoomImagesByManagerIdVaildators, updateRoomImages)

router
    .route('/manager/:id')
    .get(allwedToStaff('Manager'), getRoomByManagerIdVaildators, getRoomByManagerId);

// [Receptionist Routers]

router
    .route('/receptionist/:id')
    .patch(allwedToStaff('Receptionist'),
        upload.array('images', 3),
        updateRoomByReceptionistId
    );

router
    .route('/receptionist/:id/status')
    .patch(allwedToStaff('Receptionist'), changeRoomStatusVaildators, changeRoomStatus);

router
    .route('/receptionist/:id/description')
    .patch(allwedToStaff('Receptionist'), updateRoomDescriptionVaildators, updateRoomDescription);

router
    .route('/receptionist/:id/discount')
    .patch(allwedToStaff('Receptionist'), updateRoomDiscountVaildators, updateRoomDiscount);

router
    .route('/receptionist/:id/amenities')
    .patch(allwedToStaff('Receptionist'), updateRoomAmenitiesVaildators, updateRoomAmenities);

// [Cleaner Routers]


router
    .route('/cleaner/:id/availability')
    .patch(allwedToStaff('Cleaner'), changeRoomAvailabilityVaildators, changeRoomAvailability);

router
    .route('/cleaner/without-availability')
    .get(allwedToStaff('Cleaner'), getRoomsWithoutAvailability);

module.exports = router;