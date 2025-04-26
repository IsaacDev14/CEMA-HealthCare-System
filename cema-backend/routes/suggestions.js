const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const auth = require('../middleware/auth');
const Suggestion = require('../models/Suggestion');

// Get all suggestions for the authenticated user
router.get('/', auth, async (req, res) => {
  try {
    const suggestions = await Suggestion.findAll({
      where: { userId: req.user.userId },
    });
    res.json(suggestions);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Create a suggestion
router.post(
  '/',
  [
    auth,
    check('title', 'Title is required').notEmpty(),
    check('description', 'Description is required').notEmpty(),
    check('category', 'Category is required').notEmpty(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ error: errors.array()[0].msg });
    }

    const { title, description, category } = req.body;

    try {
      const suggestion = await Suggestion.create({
        title,
        description,
        category,
        userId: req.user.userId,
      });
      res.status(201).json(suggestion);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Server error' });
    }
  }
);

// Delete a suggestion
router.delete('/:id', auth, async (req, res) => {
  try {
    const suggestion = await Suggestion.findOne({
      where: { id: req.params.id, userId: req.user.userId },
    });
    if (!suggestion) {
      return res.status(404).json({ error: 'Suggestion not found' });
    }

    await suggestion.destroy();
    res.json({ message: 'Suggestion deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;