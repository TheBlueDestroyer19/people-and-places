const HttpError = require('../models/http-error');
const axios = require('axios');
const mongoose = require('mongoose');
const fs = require('fs');

const Place = require('../models/places');
const User = require('../models/users');

const LOCATIONIQ_API_KEY = 'pk.680bb86e728e59bf60a86e244120354c';

const getPlaceByID = async (req, res, next) => {
    const placeID = req.params.pid;
    let place;
    try {
        place = await Place.findById(placeID);
    } catch(error) {
        return next(new HttpError("Something went wrong! Please try again later",500));
    };
    if (!place) return next(new HttpError("Could Not Find the Place", 404));
    res.json({ place: place.toObject({getters: true}) });
};

const getPlacesByCreator = async (req, res, next) => {
    const userID = req.params.uid;
    let places;
    try{
        places=await Place.find({creator:userID});
    } catch(error) {
        return next(new HttpError("Something went wrong! Please try again later!",500));
    }
    if (!places || places.length === 0)
        return next(new HttpError("Could Not Find the User's Places", 404));
    res.json({ places:places.map(place=>place.toObject({getters:true})) });
};

const createPlace = async (req, res, next) => {
    const { title, description, address, creator } = req.body;

    let coordinates,resolvedAddress;
    try {
        const response = await axios.get('https://us1.locationiq.com/v1/search.php', {
            params: {
                key: LOCATIONIQ_API_KEY,
                q: address,
                format: 'json'
            }
        });

        if (!response.data || response.data.length === 0) {
            return next(new HttpError("Could not fetch coordinates for the given address", 422));
        }

        const loc = response.data[0];
        coordinates = {
            lat: parseFloat(loc.lat),
            lng: parseFloat(loc.lon)
        };
        resolvedAddress = loc.display_name || address;
    } catch (err) {
        console.error(err);
        return next(new HttpError("LocationIQ API error", 500));
    }

    let user;
    try{
        user = await User.findById(creator);
    } catch(err) {
        return next(new HttpError("Creating place failed!",500));
    }
    if(!user)
        return next(new HttpError("Could not find user for provided ID!",404));

    const createdPlace = new Place({
        title,
        description,
        address: resolvedAddress,
        location: coordinates,
        image: req.file.path,
        creator,
    });

    try{
        const session = await mongoose.startSession();
        session.startTransaction();
        await createdPlace.save({session});
        user.places.push(createdPlace);
        await user.save({session});
        await session.commitTransaction();
    } catch(error) {
        return next(new HttpError("Creating Place failed. Please try again later!",500));
    }
    res.status(201).json({ places: createdPlace.toObject({getters:true}) });
};

const updatePlace = async (req, res, next) => {
    const { title, description } = req.body;
    const id = req.params.pid;
    let place;
    try{
        place=await Place.findById(id);
        if(place.creator.toString()!==req.userData.userID)
            return next(new HttpError("You are not authorized to make any changes here!!", 401));
    } catch(err) {
        return next(new HttpError("Something went wrong. Please try again later!",500));
    }

    try{
        place=await Place.findByIdAndUpdate(id,{title,description},{new:true,runValidators:true});
    } catch(error) {
        return next(new HttpError("Something went wrong. Please try again later!",500));
    }

    res.status(200).json({  place: place.toObject({getters:true  }) });
};

const deletePlace = async (req, res, next) => {
    const id = req.params.pid;
    let place;

    try{
        place = await Place.findById(id).populate("creator");
        if(!place) 
            return next(new HttpError("Could not find the place!",404));
        else if(place.creator.id!==req.userData.userID)
            return next(new HttpError("You are not authorized to make any changes here!!", 401));

    } catch(err) {
        return next(new HttpError("Something went wrong. Please try again later!",500));
    }
    

    try{
        const session = await mongoose.startSession();
        session.startTransaction();
        await place.deleteOne({session});
        place.creator.places.pull(place._id);
        await place.creator.save({session});
        await session.commitTransaction();
    } catch(err) {
        return next(new HttpError("Deleting Place failed. Please try again later!",500));
    }

    fs.unlink(place.image, err=>{});
    res.status(200).json({ message: "Place deleted." });
};

exports.getPlaceByID = getPlaceByID;
exports.getPlacesByCreator = getPlacesByCreator;
exports.createPlace = createPlace;
exports.updatePlace = updatePlace;
exports.deletePlace = deletePlace;
