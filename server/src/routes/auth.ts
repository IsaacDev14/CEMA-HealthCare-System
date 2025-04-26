import express, { Request, Response, RequestHandler } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User';

const router = express.Router();

// Register a new user
const registerHandler: RequestHandler = async (req: Request, res: Response): Promise<void> => {
  try {
    const { username, password } = req.body;

    console.log('Register attempt for username:', username);
    if (!username || !password) {
      console.log('Missing username or password');
      res.status(400).json({ error: 'Username and password are required' });
      return;
    }

    if (password.length < 6) {
      console.log('Password too short for username:', username);
      res.status(400).json({ error: 'Password must be at least 6 characters' });
      return;
    }

    console.log('Checking for existing user:', username);
    const existingUser = await User.findOne({ where: { username } });
    if (existingUser) {
      console.log('Username already exists:', username);
      res.status(400).json({ error: 'Username already exists' });
      return;
    }

    const saltRounds = 10;
    console.log('Hashing password for username:', username);
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    console.log('Creating user:', username);
    const user = await User.create({
      username,
      password: hashedPassword,
    });

    res.status(201).json({ message: 'User registered successfully', userId: user.id });
  } catch (err: unknown) {
    console.error('Register error:', err instanceof Error ? err.message : err, err instanceof Error ? err.stack : '');
    res.status(500).json({ error: 'Server error' });
  }
};

// Login a user
const loginHandler: RequestHandler = async (req: Request, res: Response): Promise<void> => {
  try {
    const { username, password } = req.body;

    console.log('Login attempt for username:', username);
    if (!username || !password) {
      console.log('Missing username or password');
      res.status(400).json({ error: 'Username and password are required' });
      return;
    }

    console.log('Searching for user:', username);
    const user = await User.findOne({ where: { username } });
    if (!user) {
      console.log('User not found:', username);
      res.status(401).json({ error: 'Invalid credentials' });
      return;
    }

    console.log('Comparing password for user:', username);
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      console.log('Invalid password for user:', username);
      res.status(401).json({ error: 'Invalid credentials' });
      return;
    }

    console.log('Password valid, checking JWT_SECRET for user:', username);
    if (!process.env.JWT_SECRET) {
      console.error('JWT_SECRET is not defined in .env');
      throw new Error('JWT_SECRET not defined');
    }

    console.log('Generating JWT for user:', username);
    const token = jwt.sign(
      { userId: user.id, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    console.log('Login successful for user:', username);
    res.json({ message: 'Login successful', token });
  } catch (err: unknown) {
    console.error('Login error:', err instanceof Error ? err.message : err, err instanceof Error ? err.stack : '');
    res.status(500).json({ error: 'Server error' });
  }
};

router.post('/register', registerHandler);
router.post('/login', loginHandler);

export default router;