const User = require("../models/userModel")
const { check, validationResult } = require("express-validator");

module.exports = {
    validateEmail:
    check("email")
        .trim()
        .normalizeEmail()
        .isEmail()
        .withMessage("This is not a valid email.")
        .custom(async (email) => {
            const existingUser = await User.find({"email": email});
            if (existingUser) {
                throw new Error("This email is already in use.");
            } 
        }),
}


