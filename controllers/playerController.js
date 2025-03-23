import Player from "../models/Player.js";
import Tournament from "../models/Tournament.js";
import User from "../models/User.js"
import { createError } from "../utils/error.js";

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

export const updatePlayer = async (req, res, next) => {
    try {
        const player = await Player.findOneAndUpdate({ userId: req.params.id }, req.body, { new: true });
        res.status(201).json({ message: "Player updated successfully", data: player });
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
        if (!player) return res.status(404).json({ message: "Player not found!" });

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
        next(error);
        return res.status(500).json({ error: "Internal server error" });
    }
}

export const updatePaymentStatus = async (req, res, next) => {
    const userId = req.body.userId;
    const tournamentId = req.body.tournamentId;

    try {
        const player = await Player.findOne({ userId });
        if (!player) return res.status(404).json({ error: "Player not found" });

        const tournamentRegistration = player.tournamentRegistrations.find(
            (reg) => reg.tournamentId.toString() === tournamentId
        );

        if (!tournamentRegistration) return res.status(404).json({ error: "Tournament registration was not found" });

        tournamentRegistration.paymentStatus = "COMPLETED";
        await player.save();

        res.status(200).json({ message: "Payment status updated successfully" });
    } catch (error) {
        console.error("Error updating payment status: ", error.message);
        res.status(500).json({ error: "Internal server error" });
    }
}

export const getPlayersByTournamentAndPaymentStatus = async (req, res, next) => {
    const tournamentId = req.query.tournamentId;
    // console.log(tournamentId);

    try {
        const tournament = await Tournament.findById(tournamentId).populate({
            path: "playerRegistrations.playerId",
            select: "nameWithInitials fideId fideRating sex ageGroup birthday address country tournamentRegistrations",
        });

        if (!tournament) return next(createError(404, "Tournament not found"));

        const playersByPaymentStatus = {
            PENDING: [],
            COMPLETED: [],
        };

        tournament.playerRegistrations.forEach((registration) => {
            const player = registration.playerId;
            const playerRegistration = player.tournamentRegistrations.find(
                (reg) => reg.tournamentId.toString() === tournamentId
            );

            if (playerRegistration) {
                const playerData = {
                    playerId: player._id,
                    nameWithInitials: player.nameWithInitials,
                    fideId: player.fideId,
                    fideRating: player.fideRating,
                    sex: player.sex,
                    ageGroup: player.ageGroup,
                    birthday: player.birthday,
                    address: player.address,
                    country: player.country,
                    paymentStatus: playerRegistration.paymentStatus,
                };

                if (playerRegistration.paymentStatus === "PENDING") {
                    playersByPaymentStatus.PENDING.push(playerData);
                } else if (playerRegistration.paymentStatus === "COMPLETED") {
                    playersByPaymentStatus.COMPLETED.push(playerData);
                }
            }
        });

        res.status(200).json(playersByPaymentStatus);
    } catch (error) {
        console.log("Error fetching players by payment status: ", error);
        next(error);
    }
}

export const getPlayerTournamentRegistrations = async (req, res, next) => {
    const userId = req.query.userId;

    try {
        const player = await Player.findOne({ userId: userId }).populate({
            path: 'tournamentRegistrations.tournamentId',
            select: 'name'
        });
        if (!player) {
            return res.status(404).json({ message: "Player not found" });
        }

        const tournamentRegistrations = player.tournamentRegistrations.map(registration => ({
            name: registration.tournamentId.name, // Access the tournament name
            paymentStatus: registration.paymentStatus,
            fee: registration.paymentAmount
        }));
        console.log(tournamentRegistrations);

        res.status(200).json(tournamentRegistrations);
    } catch (error) {
        console.error('Error fetching tournament registrations:', error);
        res.status(500).json({ message: 'Internal server error' });
        next(error);
    }
};