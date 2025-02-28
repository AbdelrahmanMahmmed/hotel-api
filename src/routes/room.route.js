const express = require('express');
const router = express.Router();
// const {
//     AddHotelVaildators,
//     getHotelByIdValiadtors,
//     updateHotelValiadtors,
//     deleteHotelValiadtors,
//     addManagerValiadtors
// } = require('../validators/room.Validator.js');

const {
    getrooms,     // for Owner
    createRoom,   // for Owner
    getRoomById,  // for Owner
    updateRoom,   // for Owner
    deleteRoom,   // for Owner
    getRoomsByManagerId,       // for Manager
    getRoomsByStatus,          // for Manager
    createRoomByManagerId,     //for Manager
    deleteRoomByManagerId,     //for Manager
    updateRoomByManagerId,     // for Manager
    getRoomByManagerId,        // for Manager
    updateRoomByReceptionistId,       // for Receptionist
    changeRoomStatus,                 // for Receptionist
    updateRoomDescription,            // for Receptionist
    updateRoomDiscount,               // for Receptionist
    updateRoomAmenities,              // for Receptionist
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
    .post(ProtectedRoters , checkoutFromRoom);


router.use(ProtectedRotersForStaff);

// [Owner Routers]
router
    .route('/owner/all')
    .get(allwedToStaff('Owner'), getrooms);

router
    .route('/owner/:id')
    .get(allwedToStaff('Owner'), getRoomById)
    .put(allwedToStaff('Owner'), updateRoom)
    .delete(allwedToStaff('Owner'), deleteRoom);

router.post(
    '/owner/create',
    allwedToStaff('Owner'),
    upload.array('images', 3),
    createRoom
);


// [Manager Routers]

router
    .route('/manager/create')
    .post(allwedToStaff('Manager'),
        upload.array('images', 3),
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
    .delete(allwedToStaff('Manager'), deleteRoomByManagerId)
    .put(allwedToStaff('Manager'),
        upload.array('images', 3),
        updateRoomByManagerId
    );

router
    .route('/manager/:id')
    .get(allwedToStaff('Manager'), getRoomByManagerId);

// [Receptionist Routers]

router
    .route('/receptionist/:id')
    .patch(allwedToStaff('Receptionist'),
        upload.array('images', 3),
        updateRoomByReceptionistId
    );

router
    .route('/receptionist/:id/status')
    .patch(allwedToStaff('Receptionist'), changeRoomStatus);

router
    .route('/receptionist/:id/description')
    .patch(allwedToStaff('Receptionist'), updateRoomDescription);

router
    .route('/receptionist/:id/discount')
    .patch(allwedToStaff('Receptionist'), updateRoomDiscount);

router
    .route('/receptionist/:id/amenities')
    .patch(allwedToStaff('Receptionist'), updateRoomAmenities);

// [Cleaner Routers]


router
    .route('/cleaner/:id/availability')
    .patch(allwedToStaff('Cleaner'), changeRoomAvailability);

router
    .route('/cleaner/without-availability')
    .get(allwedToStaff('Cleaner'), getRoomsWithoutAvailability);

module.exports = router;