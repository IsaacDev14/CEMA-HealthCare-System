const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const sequelize = require('./config/db');

dotenv.config();

const app = express();

// Middleware
app.use(
  cors({
    origin: process.env.VERCEL_URL || 'http://localhost:5173', // Vercel URL or local dev
    credentials: true,
  })
);
app.use(helmet());
app.use(express.json());

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per window
  message: 'Too many requests, please try again later.',
});
app.use(limiter);

app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

// Models
const User = require('./models/User');
const Client = require('./models/Client');
const Program = require('./models/Program');
const ClientProgram = require('./models/ClientProgram');
const Feedback = require('./models/Feedback');
const Suggestion = require('./models/Suggestion');

// Model Associations
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

// Routes
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to the CEMACare API' });
});

app.use('/api/auth', require('./routes/auth'));
app.use('/api/clients', require('./routes/clients'));
app.use('/api/programs', require('./routes/programs'));
app.use('/api/feedback', require('./routes/feedback'));
app.use('/api/suggestions', require('./routes/suggestions'));

// Error for unmatched routes
app.use((req, res) => {
  console.log(`Unmatched route: ${req.method} ${req.url}`);
  res.status(404).json({ error: 'Route not found' });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Error:', err.message);
  console.error(err.stack);
  if (res.headersSent) {
    return next(err);
  }
  res.status(500).json({ error: 'Something went wrong!' });
});

// Sync database and start server (for local dev)
if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 5000;
  sequelize
    .sync({ force: false })
    .then(() => {
      app.listen(PORT, () => {
        console.log(`🚀 Server running on port ${PORT}`);
        console.log(`👉 Test root route: curl http://localhost:${PORT}/`);
      });
    })
    .catch((err) => {
      console.error('❌ Unable to connect to the database:', err.message);
      process.exit(1);
    });
}

// Export for Vercel
module.exports = app;