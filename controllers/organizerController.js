import Organizer from "../models/Organizer.js";
import User from "../models/User.js";
import { createError } from "../utils/error.js";

export const createOrganizer = async (req, res, next) => {
    try {
        // CHECK IF THE USER EXIST
        const user = await User.findById(req.body.userId);
        if (!user) return next(createError(404, "User not found"));

        // CHECK IF THE USER HAVE A ORGANIZER PROFILE
        const existingOrganizer = await Organizer.findOne({ userId: req.body.userId });
        if (existingOrganizer) return existingOrganizer;

        // CREATE A NEW ORGANIZER
        const newOrganizer = new Organizer({
            userId: req.body.userId,
            clubName: req.body.clubName,
            tournaments: req.body.tournaments || [],
        });

        await newOrganizer.save();

        res.status(201).json({ message: "Organizer created successfully", organizer: newOrganizer });
    } catch (err) {
        next(err);
    }
}

export const getOrganizer = async (req, res, next) => {
    try {
        const organizer = await Organizer.findById(req.params.id);
        if (!organizer) return next(createError(404, "Organizer not found"));

        res.status(200).json(organizer);
    } catch (err) {
        next(err);
    }
}

export const getOrganizerByUser = async (req, res, next) => {
    try {
        const response = await Organizer.findOne({ userId: req.params.id });
        res.status(200).json(response);
    } catch (err) {
        next(err);
    }
}