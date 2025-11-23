import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import sequelize from './config/database';
import './config/i18n';
import routes from './routes';
import { errorHandler } from './middleware/error.middleware';
import User from './models/User';
import { Language } from './types';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api', routes);

// Health check
app.get('/health', (_req, res) => {
  res.json({ status: 'healthy', timestamp: new Date().toISOString() });
});

// Error handling
app.use(errorHandler);

// Create default admin user if none exists
const createDefaultAdmin = async () => {
  try {
    const adminEmail = 'admin@eventplanner.local';
    const existingAdmin = await User.findOne({ where: { email: adminEmail } });

    if (!existingAdmin) {
      const hashedPassword = await bcrypt.hash('Admin123!', 10);
      await User.create({
        email: adminEmail,
        password: hashedPassword,
        name: 'Admin',
        language: Language.EN
      });
      console.log('Default admin user created:');
      console.log('  Email: admin@eventplanner.local');
      console.log('  Password: Admin123!');
      console.log('  (Please change this password after first login)');
    }
  } catch (error) {
    console.error('Error creating default admin:', error);
  }
};

// Database sync and server start
const startServer = async () => {
  try {
    await sequelize.authenticate();
    console.log('Database connection established successfully.');

    // Sync models - creates tables if they don't exist
    await sequelize.sync({ alter: true });
    console.log('Database models synchronized.');

    // Create default admin user
    await createDefaultAdmin();

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
      console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
    });
  } catch (error) {
    console.error('Unable to start server:', error);
    process.exit(1);
  }
};

startServer();

export default app;
