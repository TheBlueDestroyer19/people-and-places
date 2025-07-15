const express=require('express');
const bodyParser=require('body-parser');
const mongoose=require('mongoose');
const fs=require('fs');
const path=require('path');

const placesRoutes=require('./routes/places-routes');
const userRoutes=require('./routes/users-routes');
const HttpError = require('./models/http-error');

const app=express();
app.use(bodyParser.json());

app.use('/uploads/images',express.static(path.join('uploads','images')));

app.use((req,res,next)=>{
    res.setHeader('Access-Control-Allow-Origin','*',);
    res.setHeader('Access-Control-Allow-Headers','Origin, X-Requested-With, Content-Type, Accept, Authorization');
    res.setHeader('Access-Control-Allow-Methods','GET, POST, PATCH, DELETE',);
    next();
})
app.use('/api/places',placesRoutes);

app.use('/api/users',userRoutes);

app.use((req,res,next)=>{
    const error=new HttpError('Could not find the route',404);
    throw error;
});

app.use((error,req,res,next)=>{
    if(req.file) {
        fs.unlink(req.file.path,err=>{});   
    }
    if(res.headerSent) {
        return next(error);
    } 
    res.status(error.code || 500);
    res.json({message: error.message || "Error: Request not found"});
})

mongoose
    .connect('mongodb+srv://salilnphanse:lbvIEIH2XSV8H6Y5@cluster0.sl48fyv.mongodb.net/places?retryWrites=true&w=majority&appName=Cluster0')
    .then(()=>{
        app.listen(5000,() =>{
            console.log("Servxer running at http://localhost:5000");
        });
    })
    .catch(error=>{
        console.log(error);
    });