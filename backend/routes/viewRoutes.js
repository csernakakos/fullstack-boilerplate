const express = require("express");
const router = express.Router();
const {
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
} = require("../controllers/viewController");


// GET
router.get("/", (req, res)=>{res.redirect("/home")});
router.get("/home", get_home);
router.get("/sign-up", get_signup)
router.get("/secret-passcode", get_secretPasscode);
router.get("/log-in", get_login);
router.get("/log-out", get_logout);
router.get("/new-message", get_newMessage);


// POST
router.post("/sign-up", post_signup);
router.post("/secret-passcode", post_secretPasscode);
router.post("/log-in", post_login);
router.post("/new-message", post_newMessage);
router.post("/messages/:messageID", delete_message);

module.exports = router;