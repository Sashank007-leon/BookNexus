import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import path from "path";
import { connectDB } from './db/connectDB.js';
import authRoutes from './routes/authRoutes.js';
import bookRoutes from './routes/bookRoutes.js';
import cartRoutes from './routes/cartRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import reviewRoutes from './routes/reviewRoutes.js';
import serverStatus from './routes/serverStatus.js';

const app = express();

app.use(cors())

dotenv.config();

app.use(express.json());

app.use('/uploads', express.static(path.join(path.resolve(), 'uploads')));

const port = process.env.PORT || 5000;

connectDB();

app.use('/api/books', bookRoutes); 
app.use('/api/auth', authRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/order', orderRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/', serverStatus);

app.listen(port, () => {
  console.log(`http://localhost:${port}`);
});