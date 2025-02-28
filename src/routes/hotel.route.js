const express = require('express');
const router = express.Router();

const {
    AddHotelVaildators,
    getHotelByIdValiadtors,
    updateHotelValiadtors,
    deleteHotelValiadtors,
} = require('../validators/hotel.Validator.js');

const {
    addhotel,
    gethotel,
    deletehotel,
    updatehotel,
    gethotels,
} = require('../controllers/hotel.controller.js');

const { upload } = require('../utils/UploadImage.js');
const { ProtectedRotersForStaff, allwedToStaff } = require('../controllers/user.controller.js');

router.use(ProtectedRotersForStaff);

router.post(
    '/owner/create',
    allwedToStaff('Owner'),
    upload.array('images', 4),
    AddHotelVaildators,
    addhotel
);

router
    .route('/owner/:id')
    .get(allwedToStaff('Owner'), getHotelByIdValiadtors, gethotel)
    .put(allwedToStaff('Owner'), updateHotelValiadtors, updatehotel)
    .delete(allwedToStaff('Owner'), deleteHotelValiadtors, deletehotel);

router.get('/owner', allwedToStaff('Owner'), gethotels);

module.exports = router;