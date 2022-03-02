const express = require("express");
const router = express.Router();
const {
    get_users,
    signup_user,
    enter_secret_passcode_user,
    login_user,
    logout_user,
} = require("../controllers/userController");
const {protectWithToken} = require("./../config/authHandler");


router.get("/", get_users);
router.post("/sign-up", signup_user)
router.post("/secret-passcode", protectWithToken, enter_secret_passcode_user)
router.post("/log-in", login_user)
router.post("/log-out", protectWithToken, logout_user)

module.exports = router;