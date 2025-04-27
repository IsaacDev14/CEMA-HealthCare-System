const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const auth = require('../middleware/auth');
const Feedback = require('../models/Feedback');

// Get all feedback for the authenticated user
router.get('/', auth, async (req, res) => {
  try {
    const feedback = await Feedback.findAll({
      where: { userId: req.user.userId },
    });
    res.json(feedback);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Create feedback
router.post(
  '/',
  [
    auth,
    check('title', 'Title is required').notEmpty(),
    check('description', 'Description is required').notEmpty(),
    check('rating', 'Rating must be between 1 and 5').isInt({ min: 1, max: 5 }),
    check('category', 'Category is required').notEmpty(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ error: errors.array()[0].msg });
    }

    const { title, description, rating, category } = req.body;

    try {
      const feedback = await Feedback.create({
        title,
        description,
        rating,
        category,
        userId: req.user.userId,
      });
      res.status(201).json(feedback);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Server error' });
    }
  }
);

// Delete feedback
router.delete('/:id', auth, async (req, res) => {
  try {
    const feedback = await Feedback.findOne({
      where: { id: req.params.id, userId: req.user.userId },
    });
    if (!feedback) {
      return res.status(404).json({ error: 'Feedback not found' });
    }

    await feedback.destroy();
    res.json({ message: 'Feedback deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;