const User = require("../models/userModel");
const Message = require("../models/messageModel");
const siteName = "Clubhouse";
const {validationResult} = require("express-validator");
const asyncHandler = require("express-async-handler");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");


const get_home = asyncHandler(async(req, res) => {
    // If cookie session is empty:
    if(req.session === {} || !req.session) {
        res.status(200).render("home", {
            title: `Welcome | ${siteName}`,
        })
    };

    // Error message ->
    let error;
    if (req.session.error) {
        error = req.session.error
    };
    // <- Error message

    const {username, membershipStatus, isLoggedIn, isAdmin} = req.session;
    const messages = await Message.find().sort({createdAt: 'descending'}).populate("createdBy", "username");

    res.status(200).render("home", {
        title: `Welcome | ${siteName}`,
        username,
        membershipStatus,
        isLoggedIn,
        messages,
        isAdmin,
        // error,
    })
});

const get_signup = asyncHandler(async(req, res) => {
    // Error message ->
    let error;
    if (req.session.error) {
        error = req.session.error
    };
    // <- Error message

    res.status(200).render("sign-up", {error})
});

const post_signup = asyncHandler(async(req, res) => {
    // Turn isAdmin into a boolean
    req.body.isAdmin === "on" ? req.body.isAdmin = true : req.body.isAdmin = false;

    // Does the request contain all the necessary data?
    if (!req.body.username || !req.body.email || !req.body.password || !req.body.passwordConfirmation) {
        res.status(400)
        req.session.error = "Fill in all the fields and try again.";
        return res.redirect(req.originalUrl);
    }

    // Destructure req.body into variables
    const {username, email, password, passwordConfirmation, isAdmin} = req.body;

    // If username or email already exists, or if passwords don't match
    const existingUser = await User.findOne({username});
    const existingEmail = await User.findOne({email});
    if (existingUser || existingEmail || password !== passwordConfirmation
    ) {
        res.status(400)
        req.session.error = "This username or email is already in use. \n Or, the passwords you entered do not match.";
        return res.redirect(req.originalUrl);
    };

    // Generate password
    const salt = await bcrypt.genSalt(8);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user
    const user = User.create({
        username,
        email,
        password: hashedPassword,
        isAdmin,
    });

    // Add user email to cookie
    req.session.email = email;
    req.session.error = null;

    res.status(201).redirect("/secret-passcode")
});

const get_secretPasscode = asyncHandler(async(req, res) => {

    // Error message ->
    let error;
    if (req.session.error) {
        error = req.session.error
    };
    // <- Error message

    if (!req.session.email) {
        res.status(410)
        req.session.error = "Session expired.";
        return res.redirect(req.originalUrl);
    };
    const email = req.session.email;
    const user = await User.find({email});

    res.status(200).render("secret-passcode", {error});
});

const post_secretPasscode = asyncHandler(async(req, res) => {
    // If cookie session contains no email:
    if (!req.session.email) {
        res.status(410)
        req.session.error = "Session expired.";
        return res.redirect(req.originalUrl);
    };

    // Get user from database by email
    const email = req.session.email;
    let user = await User.findOne({email});
    console.log(user, "<<<<<<<<<<")
    // If wrong secret, then do not modify user. Redirect to /home
    // Add current user data to req.session, to be available on /home
    if (req.body.secret !== process.env.PASSCODESECRET) {
        req.session = {
            username: user.username,
            email: user.email,
            membershipStatus: user.membershipStatus,
            isLoggedIn: true,
            isAdmin: user.isAdmin,
            error: null,
        }

        return res.status(200).redirect("/home");
    };

    // The secret is correct. If user is "user", and if user is not an admin already, then upgrade user to "privilegedUser"
    if (user.membershipStatus === "user" && !user.isAdmin) {
        user = await User.findByIdAndUpdate(user._id, {membershipStatus: "privilegedUser"}, {new: true, runValidators: true});
        req.session = {
            username: user.username,
            email: user.email,
            membershipStatus: user.membershipStatus,
            isLoggedIn: true,
            isAdmin: user.isAdmin,
            error: null,
        }
        return res.status(200).redirect("/home");
    };

});

const get_login = asyncHandler(async(req, res) => {

    // Error message ->
    let error;
    if (req.session.error) {
        error = req.session.error
    };
    // <- Error message

    res.status(200).render("log-in", {title: `Log in | ${siteName}`, error});
});

const get_logout = asyncHandler(async(req, res) => {
    req.session = null;
    res.status(200).redirect("/log-in");
});

const post_login = asyncHandler(async(req, res) => {
    
    // If no email or password was provided:
    if (!req.body.email || !req.body.password) {
        res.status(400)
        req.session.error = "Please provide both the email and the password!";
        return res.redirect(req.originalUrl);
    }
    
    const {email, password} = req.body;
    const user = await User.findOne({email}).select("+password");

    if(!user) {
        res.status(400)
        req.session.error = "This user does not exist.";
        return res.redirect(req.originalUrl);
    }

    if(await bcrypt.compare(password, user.password)) {
        req.session = {
            username: user.username,
            email: user.email,
            membershipStatus: user.membershipStatus,
            isLoggedIn: true,
            isAdmin: user.isAdmin,
            error: null,
        };
        res.status(200)
        res.redirect("/home");

    } else {
        res.status(400)
        req.session.error = "Missing or wrong login credentials.";
        return res.redirect(req.originalUrl);
    }
});

const get_newMessage = asyncHandler(async(req, res) => {
    const {username, membershipStatus, isLoggedIn} = req.session;

    // Error message ->
    let error;
    if (req.session.error) {
        error = req.session.error
    };
    // <- Error message


    res.status(200).render("new-message", {
        title: `Post a message | ${siteName}`,
        username,
        membershipStatus,
        isLoggedIn,
        error,
    });
});

const post_newMessage = asyncHandler(async(req, res) => {
    if(req.session === {} || !req.session) {
        res.status(410)
        req.session.error = "Session expired.";
        return res.redirect(req.originalUrl);
    }

    if (!req.body.title || !req.body.body) {
        res.status(400)
        req.session.error = "Please add both a message title and a message body.";
        return res.redirect(req.originalUrl);
    }

    req.session.error = null;
    const {title, body} = req.body;
    const {email} = req.session;
    const user = await User.findOne({email});
    const message = await Message.create({
        title,
        body,
        createdBy: user._id
    });


    res.status(200)
    res.redirect("/home")
});

const delete_message = asyncHandler(async(req, res) => {
    if(req.session === {} || !req.session) {
        res.status(410)
        req.session.error = "Session expired.";
        return res.redirect(req.originalUrl);
    }

    if(!req.session.isAdmin) {
        res.status(403)
        req.session.error = "You are not authorized to delete messages.";
        return res.redirect(req.originalUrl);
    }

    req.session.error = null;
    await Message.findByIdAndDelete(req.params.messageID);
    res.status(200)
    res.redirect("/home");

});

module.exports = {
    get_home,
    get_signup,
    post_signup,
    get_secretPasscode,
    post_secretPasscode,
    get_login,
    post_login,
    get_logout,
    get_newMessage,
    post_newMessage,
    delete_message,
}