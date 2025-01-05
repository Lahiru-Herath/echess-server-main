import Player from "../models/Player.js";
import Tournament from "../models/Tournament.js";
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

export const getPlayerByUser = async (req, res, next) => {
    try {
        const response = await Player.findOne({ userId: req.params.id });
        res.status(200).json(response);
    } catch (err) {
        next(err);
    }
}

export const getPlayerTournaments = async (req, res, next) => {
    try {
        const player = await Player.findOne({ userId: req.params.id });
        if (!player) res.status(404).json({ message: "Player not found!" });

        const tournamentIds = player.tournamentRegistrations.map(
            (registration) => registration.tournamentId
        );

        if (tournamentIds.length === 0) {
            return res.status(200).json({ message: "No Registered Tournament", tournaments: [] });
        }

        const tournaments = await Tournament.find({
            _id: { $in: tournamentIds },
        }, "_id name entryType organizerId").populate({
            path: "organizerId",
            select: "clubName",
        });

        const formattedTournaments = tournaments.map((tournament) => ({
            _id: tournament._id,
            name: tournament.name,
            entryType: tournament.entryType,
            organizerName: tournament.organizerId?.clubName || "Unknown Organizer"
        }))

        return res.status(200).json(formattedTournaments);
    } catch (error) {
        console.error("Error fetchind tournaments for player: ", error);
        return res.status(500).json({ error: "Internal server error" });
    }
}