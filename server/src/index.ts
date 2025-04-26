import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth';
import { sequelize } from './config/database';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Allow multiple origins
const allowedOrigins = ['http://localhost:3000', 'http://127.0.0.1:5173'];
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
  })
);

app.use(express.json());

app.get('/', (req: Request, res: Response) => {
  res.json({ message: 'CEMACare Backend API' });
});

app.use('/api/auth', authRoutes);

async function startServer() {
  try {
    await sequelize.authenticate();
    await sequelize.sync({ force: false });
    console.log('✅ Database connected');
    app.listen(PORT, () => {
      console.log(`🚀 Server running at http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error('❌ Database connection failed:', err);
  }
}

startServer();