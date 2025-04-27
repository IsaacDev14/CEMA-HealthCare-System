const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const sequelize = require('./config/db');

dotenv.config();

console.log('Starting cema-backend/server.js');

const app = express();

app.use(
  cors({
    origin: process.env.VERCEL_URL || 'http://localhost:5173',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);
app.use(helmet());
app.use(express.json());

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: 'Too many requests, please try again later.',
});
app.use(limiter);

app.use((req, res, next) => {
  console.log(`Request: ${req.method} ${req.url}`);
  next();
});

const User = require('./models/User');
const Client = require('./models/Client');
const Program = require('./models/Program');
const ClientProgram = require('./models/ClientProgram');
const Feedback = require('./models/Feedback');
const Suggestion = require('./models/Suggestion');

User.hasMany(Client, { foreignKey: 'userId' });
Client.belongsTo(User, { foreignKey: 'userId' });

User.hasMany(Program, { foreignKey: 'userId' });
Program.belongsTo(User, { foreignKey: 'userId' });

User.hasMany(Feedback, { foreignKey: 'userId' });
Feedback.belongsTo(User, { foreignKey: 'userId' });

User.hasMany(Suggestion, { foreignKey: 'userId' });
Suggestion.belongsTo(User, { foreignKey: 'userId' });

Client.belongsToMany(Program, { through: ClientProgram, foreignKey: 'clientId', as: 'Programs' });
Program.belongsToMany(Client, { through: ClientProgram, foreignKey: 'programId', as: 'Clients' });

app.get('/api', (req, res) => {
  console.log('Hit root route /api');
  res.json({ message: 'Welcome to the CEMACare API' });
});

app.use('/api/auth', require('./routes/auth'));
app.use('/api/clients', require('./routes/clients'));
app.use('/api/programs', require('./routes/programs'));
app.use('/api/feedback', require('./routes/feedback'));
app.use('/api/suggestions', require('./routes/suggestions'));

app.use((req, res) => {
  console.log(`Unmatched route: ${req.method} ${req.url}`);
  res.status(404).json({ error: 'Route not found' });
});

app.use((err, req, res, next) => {
  console.error('Error:', err.message);
  console.error(err.stack);
  if (res.headersSent) {
    return next(err);
  }
  res.status(500).json({ error: 'Something went wrong!' });
});

if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 5000;
  sequelize
    .authenticate()
    .then(() => {
      console.log('Database connected');
      return sequelize.sync({ force: false });
    })
    .then(() => {
      console.log('Database synced');
      app.listen(PORT, () => {
        console.log(`🚀 Server running on port ${PORT}`);
        console.log(`👉 Test root route: curl http://localhost:${PORT}/api`);
      });
    })
    .catch((err) => {
      console.error('❌ Unable to connect to the database:', err.message);
      process.exit(1);
    });
}

module.exports = app;