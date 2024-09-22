const express = require('express');
const {
  signup,
  login,
  requestOTP,
  verifyOTP,
  resetPassword
} = require('../controllers/authController');

const router = express.Router();

router.post('/signup', signup);
router.post('/login', login);
router.post('/request-otp', requestOTP);
router.post('/verify-otp', verifyOTP); 
router.post('/reset-password', resetPassword); 

module.exports = router;
