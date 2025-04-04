import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import cors from 'cors';

dotenv.config();

import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import playerRoutes from "./routes/playerRoutes.js";
import organizerRoutes from "./routes/organizerRoutes.js";
import tournamentRoutes from "./routes/tournamentRoutes.js";
import checkoutRoutes from "./routes/checkoutRoutes.js";
import imageRoutes from "./routes/imageRoutes.js";
import { updateTournamentStatuses } from './utils/scheduler.js';

const app = express();

const port = process.env.PORT;


const connect = async () => {
    try {
        await mongoose.connect(process.env.MONGO);
        console.log("Connected to MongoDB");
    } catch (err) {
        console.log("Error connecting to MongoDB");
        throw err;
    }
};

app.use(cors({
    origin: process.env.CLIENT_ORIGIN,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
}));

app.use(bodyParser.urlencoded({ extended: true }));

// ISOLATING WEBHOOK ROUTE FOR RAW BODY PARSING
app.use('/api/v1/checkout/webhook', express.raw({ type: 'application/json' }));

app.use(express.json());

// ROUTES
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/players", playerRoutes);
app.use("/api/v1/organizers", organizerRoutes);
app.use("/api/v1/tournaments", tournamentRoutes);
app.use("/api/v1/checkout", checkoutRoutes);
app.use("/api/v1/images", imageRoutes);

// Schedulers
updateTournamentStatuses();

app.use((err, req, res, next) => {
    const errorStatus = err.status || 500;
    const errorMessage = err.message || "Something went wrong!";
    return res.status(errorStatus).json({
        success: false,
        status: errorStatus,
        message: errorMessage,
        stack: err.stack,
    });
});

app.listen(port, () => {
    connect();
    console.log(`Server initialized on port ${port}`);
});