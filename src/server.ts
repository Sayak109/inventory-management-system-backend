import express, { Application } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDatabase } from './config/database.config';
import { errorHandler } from './middlewares/error.middleware';
dotenv.config();
import cookieParser from 'cookie-parser';
import authRoutes from './modules/auth/auth.routes';
import userRoutes from './modules/users/user.routes';
import productRoutes from './modules/inventory/product.route';

const PORT = process.env.PORT || 5001
const app: Application = express();
app.use(cors());
app.use(express.json());
app.use(cookieParser());


app.use(`${process.env.API_PREFIX}/auth`, authRoutes);
app.use(`${process.env.API_PREFIX}/user`, userRoutes);
app.use(`${process.env.API_PREFIX}/product`, productRoutes);


app.use(errorHandler);
app.get('/', (req, res) => {
    res.send('Inventory Management System backend server is running');
});

const startServer = async (): Promise<void> => {
    await connectDatabase();
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
};

startServer();
