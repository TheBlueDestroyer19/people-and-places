const express=require('express');

const placesControllers = require('../controllers/places.controller');
const fileUpload=require('../middleware/file-upload');

const router=express.Router();

router.get('/:pid',placesControllers.getPlaceByID);

router.get('/user/:uid',placesControllers.getPlacesByCreator);

router.post('/',fileUpload.single('image'),placesControllers.createPlace);

router.patch('/:pid',placesControllers.updatePlace);

router.delete('/:pid',placesControllers.deletePlace);

module.exports=router;