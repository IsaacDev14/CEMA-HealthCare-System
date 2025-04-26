const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const sequelize = require('./config/db');

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Log requests for debugging
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

// Root route
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to the CEMACare API' });
});

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/clients', require('./routes/clients'));
app.use('/api/programs', require('./routes/programs'));
app.use('/api/feedback', require('./routes/feedback'));
app.use('/api/suggestions', require('./routes/suggestions'));

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err.message);
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// Sync database and start server
const PORT = process.env.PORT || 5000;
sequelize.sync({ force: false }).then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`Test root route: curl http://localhost:${PORT}/`);
    console.log(`Test register: curl -X POST http://localhost:${PORT}/api/auth/register -H "Content-Type: application/json" -d '{"username":"test","password":"password123"}'`);
  });
}).catch((err) => {
  console.error('Unable to connect to the database:', err.message);
  process.exit(1);
});

// Define model associations
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
Program.belongsToMany(Client, { through: ClientProgram, foreignKey: 'programId' });