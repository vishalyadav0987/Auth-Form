const express = require('express');
const {
    signUp,
    verifyEmail,
    signIn,
    logout,
} = require('../controllers/authController');
const router = express.Router();



router.route('/sign-up').post(signUp); // register
router.route('/sign-in').post(signIn); // login
router.route('/logout').post(logout); // logout


router.route('/verify-email').post(verifyEmail);


module.exports = router;