const express = require('express');
require('dotenv').config();
const cors = require('cors');
const path = require('path');

// Import routes
const dossierRoutes = require('./Routes/dossierRoutes');
const divisionRoutes = require('./Routes/divisionRoutes');
const serviceRoutes = require('./Routes/serviceRoutes');
const instructionRoutes = require('./Routes/instructionRoutes');
const SuiviRoutes = require('./Routes/SuiviRoutes');
const situationRoutes = require('./Routes/situationRoutes');
const statsRoutes = require('./Routes/statsRoutes');
const profileRoutes = require('./Routes/profileRoutes');
const permissionRoutes = require('./Routes/permissionRoutes');
const notificationRoutes = require('./Routes/notificationRoutes');
const userRoutes = require('./Routes/userRoutes');

const { sequelize } = require('./Models');

const app = express();

// Middleware
app.use(express.json());

// CORS configuration
const allowedOrigins = [
  'http://localhost:3000',
  'https://gestion-dossiers-66z6.vercel.app',
  'https://gestion-dossiers-yuo9.vercel.app' // <-- add this
];

app.use(cors({
  origin: allowedOrigins,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));


app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Health check route
app.get('/', (req, res) => {
  res.json({ 
    message: 'Backend API is running!', 
    environment: process.env.NODE_ENV,
    timestamp: new Date().toISOString()
  });
});

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', message: 'Server is running' });
});

// API Routes
app.use('/api/users', userRoutes);
app.use('/api/dossiers', dossierRoutes);
app.use('/api/divisions', divisionRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/instructions', instructionRoutes);
app.use('/api/Suivi', SuiviRoutes);
app.use('/api/situations', situationRoutes);
app.use('/api/dashboard', statsRoutes);
app.use('/api/profiles', profileRoutes);
app.use('/api/permissions', permissionRoutes);
app.use('/api/notifications', notificationRoutes);

// Sync database and start server
const PORT = process.env.PORT || 5000;

console.log('🔧 Starting server...');
console.log('📊 Environment:', process.env.NODE_ENV);
console.log('🔌 Port:', PORT);

sequelize.sync({ alter: true })
  .then(() => {
    console.log('✅ Database connected and synced successfully');
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`🌐 Health check: http://localhost:${PORT}/health`);
    });
  })
  .catch(err => {
    console.error('❌ Error syncing the database:', err);
    process.exit(1);
  });