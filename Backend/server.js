// server.js

import express from 'express';
import dotenv from 'dotenv';
import connectDB from './config/db.js';

// Route files
import urlRoutes from './routes/urls.js';
import indexRoutes from './routes/index.js';
import authRoutes from './routes/auth.js';
import linkRoutes from './routes/links.js';

// --- CHANGE 1: Import the new error handler ---
import errorHandler from './middleware/errorMiddleware.js';

dotenv.config();

connectDB();

const app = express();

// Body parser middleware
app.use(express.json());

// Mount routers
app.use('/api/shorten', urlRoutes);
app.use('/', indexRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/links', linkRoutes);

// --- CHANGE 2: Add the error handler middleware ---
// This MUST be the last piece of middleware in the chain.
// Express knows it's an error handler because of its 4 arguments.
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));