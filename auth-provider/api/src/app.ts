import express from 'express';
import passport from 'passport';
import './config/passport.js';
import { connectRabbit } from './config/rabbit.js';
import authRoutes from './routes/v1.js';

const app = express();

connectRabbit();

app.use(passport.initialize());
app.use('/api/auth/v1', authRoutes);
app.listen(process.env.APPLICATION_PORT || 5000, () => {
  console.log(`Auth provider running on port ${process.env.APPLICATION_PORT || 5000}`);
});