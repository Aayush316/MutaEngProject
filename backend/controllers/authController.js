const axios = require('axios');
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');

const verifyRecaptcha = async (recaptchaToken) => {
  const secretKey = process.env.RECAPTCHA_SECRET_KEY; // Add your secret key to .env
  const response = await axios.post(`https://www.google.com/recaptcha/api/siteverify`, null, {
    params: {
      secret: secretKey,
      response: recaptchaToken,
    },
  });
  return response.data.success;
};


const signup = async (req, res) => {
  const { name, email, password, recaptchaToken } = req.body;

  try {
    const isRecaptchaValid = await verifyRecaptcha(recaptchaToken);
    if (!isRecaptchaValid) {
      return res.status(400).json({ message: 'reCAPTCHA verification failed' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hashedPassword });
    
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    
    console.log('JWT Token created:', token);
    
    res.status(201).json({ token, message: 'JWT Token created' });
  } catch (error) {
    res.status(400).json({ message: 'Error signing up', error });
  }
};

const login = async (req, res) => {
  const { email, password, recaptchaToken } = req.body;

  try {
    const isRecaptchaValid = await verifyRecaptcha(recaptchaToken);
    if (!isRecaptchaValid) {
      return res.status(400).json({ message: 'reCAPTCHA verification failed' });
    }

    const user = await User.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    
    console.log('JWT Token created:', token);
    
    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
      message: 'JWT Token created',
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error logging in', error });
  }
};


const requestOTP = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });
    console.log(user)
    if (!user) return res.status(404).json({ message: 'User not found' });

    const otp = Math.floor(100000 + Math.random() * 900000).toString(); // Generate 6-digit OTP
    user.otp = otp;
    user.otpExpires = Date.now() + 10 * 60 * 1000; // OTP valid for 10 minutes
    await user.save();

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    
    const mailOptions = {
      to: user.email,
      subject: 'Your OTP for Password Reset',
      text: `Your OTP for resetting your password is: ${otp}\n\n` +
            `This OTP is valid for 10 minutes.`,
    };

    console.log("hi")
    
    await transporter.sendMail(mailOptions);
    console.log("hi22")
    res.json({ message: 'OTP sent to your email' });
  } catch (error) {
    res.status(500).json({ message: 'Error sending OTP', error });
  }
};

// Verify OTP
const verifyOTP = async (req, res) => {
  const { email, otp } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user || user.otp !== otp || user.otpExpires < Date.now()) {
      return res.status(400).json({ message: 'Invalid or expired OTP' });
    }

    // Clear OTP after successful verification
    user.otp = undefined;
    user.otpExpires = undefined;
    await user.save();

    res.json({ message: 'OTP verified successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error verifying OTP', error });
  }
};

// Reset Password
// Reset Password
const resetPassword = async (req, res) => {
  const { email, password } = req.body; // Assuming the email is sent with the reset request

  try {
    // Validate input
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    // Find the user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Validate password
    if (password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters long.' });
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Update the user's password
    user.password = hashedPassword;
    await user.save();

    res.status(200).json({ message: 'Password reset successful' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Error resetting password', error });
  }
};

module.exports = { signup, login, requestOTP, verifyOTP, resetPassword };
