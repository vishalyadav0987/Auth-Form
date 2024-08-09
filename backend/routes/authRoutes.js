const express = require('express');
const {
    signUp,
} = require('../controllers/authController');
const router = express.Router();



router.route('/sign-up').post(signUp); // register


module.exports = router;