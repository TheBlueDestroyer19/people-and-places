const jwt=require('jsonwebtoken');

const HttpError = require("../models/http-error");

module.exports = (req,res,next) => {
    if(req.method==='OPTIONS')
        return next();
    try{
        const token = req.headers.authorization.split(' ')[1];
        if(!token) {
            return next(new HttpError("Authenication Failed!!", 401));
        }
        const decoded=jwt.verify(token,"VistaEnclave__@jOrITaAcClOuNCy#newuserINTERvENTiOn__%detected90909");
        req.userData={userID: decoded.userID}
        next();
    } catch(err) {
        return next(new HttpError("Authenication Failed!!", 401));
    }
}