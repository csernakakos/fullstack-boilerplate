const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");

const protectWithToken = asyncHandler(async(req, res, next) => {
    let token;

    if(req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
        try {
            token = req.headers.authorization.split(" ")[1];
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.user = await User.findById(decoded.payload).select("-password");

            next();
        } catch(error) {
            res.status(401)
            throw new Error("You're not authorized.")
        }
    }

    if(!token) {
        res.status(401)
        throw new Error("No token.");
    }
})

// This function will allow both authorized and non-authorized users to make a request.
const optionallyProtectWithToken = asyncHandler(async(req, res, next) => {
    let token;

    if(req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {

        token = req.headers.authorization.split(" ")[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = await User.findById(decoded.payload).select("-password");

        return next();
    }
        
    req.user = null;
    next();
})

module.exports = {
    protectWithToken,
    optionallyProtectWithToken,
}