const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const auth = require('../middleware/auth');
const Client = require('../models/Client');

// @route   GET /api/clients
// @desc    Get all clients for the authenticated user
// @access  Private
router.get('/', auth, async (req, res) => {
  console.log('GET /api/clients called');
  try {
    const clients = await Client.findAll({
      where: { userId: req.user.userId },
      include: [{ model: require('../models/Program'), as: 'Programs', attributes: ['id', 'name'] }],
    });
    res.json(clients);
  } catch (err) {
    console.error('Error fetching clients:', err.message);
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   POST /api/clients
// @desc    Create a new client
// @access  Private
router.post(
  '/',
  [
    auth,
    check('firstName', 'First name is required').notEmpty(),
    check('lastName', 'Last name is required').notEmpty(),
    check('email', 'Please include a valid email').isEmail(),
    check('dateOfBirth', 'Date of birth is required').notEmpty(),
  ],
  async (req, res) => {
    console.log('POST /api/clients called');
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ error: errors.array()[0].msg });
    }

    const { firstName, lastName, email, dateOfBirth } = req.body;

    try {
      const dob = new Date(dateOfBirth);
      if (isNaN(dob.getTime()) || dob >= new Date()) {
        return res.status(400).json({ error: 'Invalid date of birth' });
      }

      const client = await Client.create({
        firstName,
        lastName,
        email,
        dateOfBirth,
        userId: req.user.userId,
        registeredAt: new Date(),
      });

      res.status(201).json(client);
    } catch (err) {
      console.error('Error creating client:', err.message);
      res.status(500).json({ error: 'Server error' });
    }
  }
);

// @route   PUT /api/clients/:id
// @desc    Update a client
// @access  Private
router.put(
  '/:id',
  [
    auth,
    check('firstName', 'First name is required').notEmpty(),
    check('lastName', 'Last name is required').notEmpty(),
    check('email', 'Please include a valid email').isEmail(),
    check('dateOfBirth', 'Date of birth is required').notEmpty(),
  ],
  async (req, res) => {
    console.log(`PUT /api/clients/${req.params.id} called`);
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ error: errors.array()[0].msg });
    }

    const { firstName, lastName, email, dateOfBirth } = req.body;

    try {
      const client = await Client.findOne({
        where: { id: req.params.id, userId: req.user.userId },
      });

      if (!client) {
        return res.status(404).json({ error: 'Client not found' });
      }

      const dob = new Date(dateOfBirth);
      if (isNaN(dob.getTime()) || dob >= new Date()) {
        return res.status(400).json({ error: 'Invalid date of birth' });
      }

      client.firstName = firstName;
      client.lastName = lastName;
      client.email = email;
      client.dateOfBirth = dateOfBirth;

      await client.save();

      res.json(client);
    } catch (err) {
      console.error('Error updating client:', err.message);
      res.status(500).json({ error: 'Server error' });
    }
  }
);

// @route   DELETE /api/clients/:id
// @desc    Delete a client
// @access  Private
router.delete('/:id', auth, async (req, res) => {
  console.log(`DELETE /api/clients/${req.params.id} called`);
  try {
    const client = await Client.findOne({
      where: { id: req.params.id, userId: req.user.userId },
    });

    if (!client) {
      return res.status(404).json({ error: 'Client not found' });
    }

    await client.destroy();
    res.json({ message: 'Client deleted' });
  } catch (err) {
    console.error('Error deleting client:', err.message);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;