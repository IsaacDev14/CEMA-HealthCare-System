const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const auth = require('../middleware/auth');
const Program = require('../models/Program');

// @route   GET /api/programs
// @desc    Get all programs for the authenticated user
// @access  Private
router.get('/', auth, async (req, res) => {
  console.log('GET /api/programs called');
  try {
    const programs = await Program.findAll({
      where: { userId: req.user.userId },
    });
    res.json(programs);
  } catch (err) {
    console.error('Error fetching programs:', err.message);
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   POST /api/programs
// @desc    Create a new program
// @access  Private
router.post(
  '/',
  [
    auth,
    check('name', 'Program name is required').notEmpty(),
    check('description', 'Description is required').notEmpty(),
  ],
  async (req, res) => {
    console.log('POST /api/programs called');
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ error: errors.array()[0].msg });
    }

    const { name, description } = req.body;

    try {
      const program = await Program.create({
        name,
        description,
        userId: req.user.userId,
        createdAt: new Date(),
      });

      res.status(201).json(program);
    } catch (err) {
      console.error('Error creating program:', err.message);
      res.status(500).json({ error: 'Server error' });
    }
  }
);

// @route   PUT /api/programs/:id
// @desc    Update a program
// @access  Private
router.put(
  '/:id',
  [
    auth,
    check('name', 'Program name is required').notEmpty(),
    check('description', 'Description is required').notEmpty(),
  ],
  async (req, res) => {
    console.log(`PUT /api/programs/${req.params.id} called`);
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ error: errors.array()[0].msg });
    }

    const { name, description } = req.body;

    try {
      const program = await Program.findOne({
        where: { id: req.params.id, userId: req.user.userId },
      });

      if (!program) {
        return res.status(404).json({ error: 'Program not found' });
      }

      program.name = name;
      program.description = description;

      await program.save();

      res.json(program);
    } catch (err) {
      console.error('Error updating program:', err.message);
      res.status(500).json({ error: 'Server error' });
    }
  }
);

// @route   DELETE /api/programs/:id
// @desc    Delete a program
// @access  Private
router.delete('/:id', auth, async (req, res) => {
  console.log(`DELETE /api/programs/${req.params.id} called`);
  try {
    const program = await Program.findOne({
      where: { id: req.params.id, userId: req.user.userId },
    });

    if (!program) {
      return res.status(404).json({ error: 'Program not found' });
    }

    await program.destroy();
    res.json({ message: 'Program deleted' });
  } catch (err) {
    console.error('Error deleting program:', err.message);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;