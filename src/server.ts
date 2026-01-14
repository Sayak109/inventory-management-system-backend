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
import purchaseOrderRoutes from './modules/purchase-order/purchaseOrder.routes';
import salesOrderRoutes from './modules/sales-orders/sales-order.routes';

const PORT = process.env.PORT || 5001
const app: Application = express();
app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true,
}));
app.use(express.json());
app.use(cookieParser());


app.use(`${process.env.API_PREFIX}/auth`, authRoutes);
app.use(`${process.env.API_PREFIX}/user`, userRoutes);
app.use(`${process.env.API_PREFIX}/product`, productRoutes);
app.use(`${process.env.API_PREFIX}/purchase-order`, purchaseOrderRoutes);
app.use(`${process.env.API_PREFIX}/sales-order`, salesOrderRoutes);


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
