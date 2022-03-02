const asyncHandler = require("express-async-handler");
const User = require("../models/userModel"); // REQUIRED FIELDS: username, email, password
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// JWT helper function:
function signToken(payload){
    return jwt.sign({payload}, process.env.JWT_SECRET, {expiresIn: "2d"})
}

// @desc    Get all users
// @route   GET /api/users
// @access  Private
const get_users = asyncHandler(async(req, res) => {
    const users = await User.find();

    res.status(200).json({
        status: "success",
        results: users.length,
        data: {
            users
        }
    })
});

// @desc    Create a user
// @route   POST /api/users/sign-up
// @access  Public
const signup_user = asyncHandler(async(req, res) => {
    
    // If browser sends "on"
    if (req.body.isAdmin === "on") {
        req.body.isAdmin = true;
    } else {
        req.body.isAdmin = false;
    }
    
    // Does the request contain all the necessary data?
    if (!req.body.username || !req.body.email || !req.body.password) {
        res.status(400)
        throw new Error("Make sure you entered a username, email, and password.")
    };

    const {username, email, password, isAdmin} = req.body;

    // Does the user already exist in our database?
    const userExists = await User.findOne({email});
    if (userExists) {
        res.status(400)
        throw new Error("This email is already registered.")
    };

    // Generate password
    const salt = await bcrypt.genSalt(9);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user
    const user = await User.create({
        username,
        email,
        isAdmin,
        password: hashedPassword
    });

    if (!user) {
        res.status(400)
        throw new Error("Invalid user data.")
    }
    
    res.status(201).json({
        status: "success",
        data: {
            user,
            token: signToken(user._id),
        }
    });
  
});

// @desc    Give user privilegedUser rights
// @route   POST /api/users/secret-passcode
// @access  Private
const enter_secret_passcode_user = asyncHandler(async(req, res) => {
    if (!req.body.secret) {
        res.status(400)
        throw new Error("Type in the secret.")
    }

    const {secret} = req.body;
    let user = req.user;

    // If user is 'admin', don't update them to 'privilegedUser'
    if (user.isAdmin) {
        return res.status(200).json({
            status: "no-change",
            note: "You're already an admin, so you cannot become a 'privilegedUser'.",
            data: {
                user
            }
        })
    }

    // If entered secret is not the correct passcodesecret:
    if (secret !== process.env.PASSCODESECRET) {
        return res.status(200).json({
            status: "success",
            note: "You'll stay a 'user'.",
            data: {
                user,
                token: signToken(user._id),
            },
        });
    };

    // If entered secret is correct, change the user's user rights:
    user = await User.findByIdAndUpdate(user._id, {membershipStatus: "privilegedUser"})
    res.status(200).json({
        status: "success",
        note: "you are now a 'privilegedUser'.",
        data: {
            user,
            token: signToken(user._id),
        },
    });
});

// @desc    Authenticate user
// @route   POST /api/users/log-in
// @access  Public
const login_user = asyncHandler(async(req, res) => {
    if(!req.body.email || !req.body.password) {
        res.status(400)
        throw new Error("Provide the email and the password!")
    };

    const {email, password} = req.body;
    const existingUser = await User.findOne({email}).select("+password");
    // Does the user exist?
    if(existingUser && await bcrypt.compare(password, existingUser.password)){
        res.status(200).json({
            status: "success",
            data: {
                user: existingUser,
                token: signToken(existingUser._id),
            }
        }); 
    } else {
        res.status(400)
        throw new Error("Missing or wrong login data.")
    };
});

// @desc    Log user out
// @route   POST /api/users/log-out
// @access  Private
const logout_user = asyncHandler(async(req, res) => {
    req.user = null;
    res.status(200).json({
        status: "success",
        session: req.session,
        data: {
            loggedOut: true,
            user: req.user
        }
    })
});


module.exports = {
    get_users,
    signup_user,
    enter_secret_passcode_user,
    login_user,
    logout_user,
}