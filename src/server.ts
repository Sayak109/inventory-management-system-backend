import express, { Application } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDatabase } from './config/database.config';

dotenv.config();
const PORT = process.env.PORT || 5001
const app: Application = express();
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.send('Inventory Management API is running');
});

const startServer = async (): Promise<void> => {
    await connectDatabase();
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
};

startServer();
