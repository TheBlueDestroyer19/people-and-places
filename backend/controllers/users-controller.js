const User = require('../models/users');
const HttpError=require('../models/http-error');
const bcrypt=require('bcryptjs');
const webtoken=require('jsonwebtoken');

const getUsers = async (req,res,next) => {
    let allUsers;
    try{
        allUsers = await User.find({},'-password');
    } catch(err) {
        return next(new HttpError("Oops! Something went wrong!",404));
    }
    res.json({users:allUsers.map(user=>user.toObject({getters:true}))});
};

const createUser = async (req,res,next) => {
    const {name,email,password} = req.body;
    let existingUser;

    try {
        existingUser = await User.findOne({email:email});
    } catch(err) {
        return next(new HttpError("Oops! Something went wrong!",404));
    };

    if(existingUser) 
        return next(new HttpError("A user with this email ID already exists!",500));

    let hashedPwd;
    try{
        hashedPwd = await bcrypt.hash(password, 12);
    } catch(err) {
        return next(new HttpError("Could not create a user!",404));
    }


    const createdUser = new User({
        name,
        email,
        password: hashedPwd,
        image: req.file.path,
        places:[]
    });

    try {
        await createdUser.save();
    } catch(error) {
        return next(new HttpError("Saving failed!",500));
    }

    let token;
    try{
        token=webtoken.sign(
            {userID: createdUser.id, email: createdUser.email},
            "VistaEnclave__@jOrITaAcClOuNCy#newuserINTERvENTiOn__%detected90909",
            {expiresIn: '1h'}
        );
    } catch(err) {
        return next(new HttpError("Could not signup!!"));
    }

    res.status(200).json({userID: createdUser.id, email: createdUser.email, token:token});
};

const authenticateUser = async (req,res,next) => {
    const {email,password} = req.body;
    let existingUser;

    try {
        existingUser = await User.findOne({email:email});
    } catch(err) {
        return next(new HttpError("Something went wrong. Please try again later",404));
    }

    if(!existingUser) 
        return next(new HttpError("Invalid username or password!!",401));

    let isValidPassword=false;
    try{
        isValidPassword=await bcrypt.compare(password,existingUser.password);
        if(!isValidPassword) 
            return next(new HttpError("Invalid username or password!!",401));

    } catch(err) {
        return next(new HttpError("Could not log you in!!"));
    }

    let token;
    try{
        token=webtoken.sign(
            {userID: existingUser.id, email: existingUser.email},
            "VistaEnclave__@jOrITaAcClOuNCy#newuserINTERvENTiOn__%detected90909",
            {expiresIn: '1h'}
        );
    } catch(err) {
        return next(new HttpError("Could not log you in!!"));
    }
        
    res.status(200).json({userID: existingUser.id, email: existingUser.email, token: token});
};

exports.getUsers = getUsers;
exports.createUser = createUser;
exports.authenticateUser = authenticateUser;