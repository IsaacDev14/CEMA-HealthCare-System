const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { check, validationResult } = require('express-validator');
const User = require('../models/User');

const router = express.Router();

// Register route
router.post(
  '/register',
  [
    check('username', 'Username is required').notEmpty(),
    check('password', 'Password must be at least 6 characters').isLength({ min: 6 }),
  ],
  async (req, res) => {
    console.log('POST /api/auth/register called');
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ error: errors.array()[0].msg });
    }
    const { username, password } = req.body;
    try {
      let user = await User.findOne({ where: { username } });
      if (user) {
        return res.status(400).json({ error: 'Username already exists' });
      }
      user = await User.create({ username, password });
      const payload = { userId: user.id };
      const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });
      res.status(201).json({ token });
    } catch (err) {
      console.error('Error during registration:', err.message);
      res.status(500).json({ error: 'Server error' });
    }
  }
);

// Login route
router.post(
  '/login',
  [
    check('username', 'Username is required').notEmpty(),
    check('password', 'Password is required').notEmpty(),
  ],
  async (req, res) => {
    console.log('POST /api/auth/login called');
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ error: errors.array()[0].msg });
    }
    const { username, password } = req.body;
    try {
      const user = await User.findOne({ where: { username } });
      if (!user) {
        return res.status(400).json({ error: 'Invalid username or password' });
      }
      const isMatch = await user.comparePassword(password);
      if (!isMatch) {
        return res.status(400).json({ error: 'Invalid username or password' });
      }
      const payload = { userId: user.id };
      const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });
      res.status(200).json({ token });
    } catch (err) {
      console.error('Error during login:', err.message);
      res.status(500).json({ error: 'Server error' });
    }
  }
);

module.exports = router;