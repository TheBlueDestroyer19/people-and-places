const express = require('express');
const usersControllers = require('../controllers/users-controller');
const fileUpload=require('../middleware/file-upload');

const router=express.Router();

router.get('/',usersControllers.getUsers);

router.post('/signup',fileUpload.single('image'),usersControllers.createUser);

router.post('/login',usersControllers.authenticateUser);

module.exports=router;