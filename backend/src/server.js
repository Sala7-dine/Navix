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

// secure headers
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" }
}));

// Middleware pour ajouter les headers cross-origin aux images
app.use('/images', (req, res, next) => {
  res.header('Cross-Origin-Resource-Policy', 'cross-origin');
  res.header('Access-Control-Allow-Origin', '*');
  next();
}, express.static('public'));

// Routes publiques
app.use('/api/auth', authRoutes);
// Routes protégées par authentification
app.use('/api/users', userRoutes);
app.use('/api/trajets', trajetRoutes);
app.use('/api/camions', camionRoutes);
app.use('/api/remorques', remorqueRoutes);
app.use('/api/pneus', pneuRoutes);
app.use('/api/maintenances', maintenanceRoutes);
app.use('/api/fuel-logs', fuelLogRoutes);

app.use(notFound);

if (process.env.NODE_ENV !== 'test') {
    await connectDB(MongoUri);
    app.listen(Port, () => {
        console.log(`Server successfully connected to http://localhost:${Port}`);
    });
}

export default app;