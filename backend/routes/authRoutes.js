const express = require('express');
const {
    signUp,
    verifyEmail,
    signIn,
    logout,
    forgetPassword,
} = require('../controllers/authController');
const router = express.Router();



router.route('/sign-up').post(signUp); // register
router.route('/sign-in').post(signIn); // login
router.route('/logout').post(logout); // logout


router.route('/verify-email').post(verifyEmail);
router.route("/forget-password").post(forgetPassword);


module.exports = router;