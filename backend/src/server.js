import express from "express";
import connectDB from "./config/db.js";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import notFound from "./middlewares/notFound.js";
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import trajetRoutes from "./routes/trajetRoutes.js";
import camionRoutes from "./routes/camionRoutes.js";
import remorqueRoutes from "./routes/remorqueRoutes.js";
import pneuRoutes from "./routes/pneuRoutes.js";
import maintenanceRoutes from "./routes/maintenanceRoutes.js";
import fuelLogRoutes from "./routes/fuelLogRoutes.js";
import { authenticate } from "./middlewares/authMiddleware.js";
import helmet from 'helmet';
import cors from 'cors';
import { requireAdmin } from "./middlewares/roleMiddleware.js";

const app = express();

dotenv.config();

const Port = process.env.PORT || 3000;
const MongoUri = process.env.MONGO_URI;

app.use(
  cors({
    origin: true, // l'URL exacte de ton frontend
    credentials: true,
  })
);

app.use(cookieParser());
app.use(express.json());

// Routes publiques
app.use('/api/auth', authRoutes);
// Routes protégées par authentification
app.use('/api/users', authenticate , requireAdmin , userRoutes);
app.use('/api/trajets', authenticate  , trajetRoutes);
app.use('/api/camions', authenticate  ,  camionRoutes);
app.use('/api/remorques', authenticate  , remorqueRoutes);
app.use('/api/pneus', authenticate , requireAdmin  , pneuRoutes);
app.use('/api/maintenances', authenticate , requireAdmin  ,maintenanceRoutes);
app.use('/api/fuel-logs', authenticate  , fuelLogRoutes);

app.use(notFound);

if (process.env.NODE_ENV !== 'test') {
    await connectDB(MongoUri);
    app.listen(Port, () => {
        console.log(`Server successfully connected to http://localhost:${Port}`);
    });
}

export default app;