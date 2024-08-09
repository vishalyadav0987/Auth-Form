const express = require('express');
const {
    signUp,
    verifyEmail,
} = require('../controllers/authController');
const router = express.Router();



router.route('/sign-up').post(signUp); // register


router.route('/verify-email').post(verifyEmail);


module.exports = router;