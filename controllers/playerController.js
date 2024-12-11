import Player from "../models/Player.js";
import User from "../models/User.js"

export const createPlayer = async (req, res, next) => {
    try {
        // CHECK IF THE USER ID IN THE REQUEST BODY EXISTS
        const user = await User.findById(req.body.userId);
        if (!user) return next(createError(404, "User not found"));

        // CHECK IF THE USER ALREADY HAVE A PLAYER PROFILE
        const existingPlayer = await Player.findOne({ userId: req.body.userId });
        if (existingPlayer) return existingPlayer

        //CREATE NEW PLAYER
        const newPlayer = new Player({
            userId: req.body.userId,
            fideId: req.body.fideId,
            tournamentRegistrations: req.body.tournamentRegistrations || [],
        });

        await newPlayer.save();

        res.status(201).json({ message: "Player created successfully", player: newPlayer });
    } catch (err) {
        next(err);
    }
}