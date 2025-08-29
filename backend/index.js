const express = require('express');

require('dotenv').config();
const cors = require('cors');
const dossierRoutes = require('./Routes/dossierRoutes');
const divisionRoutes = require('./Routes/divisionRoutes');
const serviceRoutes = require('./Routes/serviceRoutes');
const instructionRoutes = require('./Routes/instructionRoutes');
const SuiviRoutes=require('./Routes/SuiviRoutes')
const situationRoutes = require('./Routes/situationRoutes');
const statsRoutes=require('./Routes/statsRoutes')
const profileRoutes = require('./Routes/profileRoutes');
const permissionRoutes = require('./Routes/permissionRoutes');
const notificationRoutes = require('./Routes/notificationRoutes');
const path = require('path');


const { sequelize } = require('./Models'); // Import Sequelize and all models
const userRoutes = require('./Routes/userRoutes');

const app = express();
app.use(express.json());
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? ['https://your-vercel-app-name.vercel.app']
    : ['http://localhost:3000'],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


// Routes
app.use('/api/users', userRoutes);
app.use('/api/dossiers', dossierRoutes);
app.use('/api/divisions', divisionRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/instructions', instructionRoutes);
app.use('/api/Suivi',SuiviRoutes)
app.use('/api/situations', situationRoutes);
app.use('/api/dashboard', statsRoutes);
app.use('/api/profiles', profileRoutes);
app.use('/api/permissions', permissionRoutes);
app.use('/api/notifications', notificationRoutes);


// Sync database and start the server
sequelize.sync({ alter: true }) // alter: automatically update tables if needed
  .then(() => {
    console.log('✅ Database synced successfully');
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch(err => console.error('❌ Error syncing the database:', err));
