import Organizer from "../models/Organizer.js";
import Player from "../models/Player.js";
import Tournament from "../models/Tournament.js";
import { createError } from "../utils/error.js";

export const createTournament = async (req, res, next) => {
    try {
        // console.log("Started creating tournament...");
        const organizer = await Organizer.findById(req.body.organizerId);
        if (!organizer) return next(createError(404, "Organizer not found"));

        const newTournament = new Tournament({
            organizerId: req.body.organizerId,
            name: req.body.name,
            description: req.body.description,
            gameType: req.body.gameType,
            rounds: req.body.rounds,
            location: req.body.location,
            startDate: req.body.startDate,
            endDate: req.body.endDate,
            contactNumber: req.body.contactNumber,
            ageDetails: req.body.ageDetails || [],
            playerRegistrations: req.body.playerRegistrations || []
        });

        await newTournament.save();
        // console.log("Created tournament successfully...")

        organizer.tournaments.push(newTournament._id);
        await organizer.save();

        res.status(201).json({ message: "Tournament created successfully", tournament: newTournament });
    } catch (err) {
        next(err);
    }
}

export const updateTournament = async (req, res, next) => {
    try {
        const tournament = await Tournament.findById(req.params.id);
        if (!tournament) return next(createError(404, "Tournament not found"));

        const updatedTournament = await Tournament.findByIdAndUpdate(
            req.params.id,
            { $set: req.body },
            { new: true }
        );

        return res.status(200).json({ message: "Tournament updated successfully", tournament: updatedTournament });
    } catch (error) {
        next(error);
    }
}


export const getTournaments = async (req, res, next) => {
    try {
        const tournaments = await Tournament.find();
        res.status(200).json(tournaments);
    } catch (err) {
        next(err);
    }
}

export const getTournament = async (req, res, next) => {
    try {
        const tournament = await Tournament.findById(req.params.id);
        res.status(200).json(tournament);
    } catch (error) {
        next(error);
    }
}

export const getClassifiedTournaments = async (req, res, next) => {
    try {
        const tournaments = await Tournament.find();
        const classifiedTournaments = {
            Upcoming: [],
            Ongoing: [],
            Completed: [],
        };

        const organizerId = tournaments[0]?.organizerId;
        const organizer = await Organizer.findById(organizerId);

        tournaments.forEach((tournament) => {
            const entryType = tournament.ageDetails?.length > 0 ? "Paid" : "Free";
            const numPlayers = tournament.playerRegistrations?.length;
            const tournamentData = {
                name: tournament.name,
                club: organizer.clubName,
                location: tournament.location,
                entry: entryType,
                startDate: tournament.startDate,
                endDate: tournament.endDate,
                participations: numPlayers,
                ongoingRound: 3,
            };

            switch (tournament.tournamentStatus) {
                case 'UPCOMING':
                    classifiedTournaments.Upcoming.push(tournamentData);
                    break;
                case 'ONGOING':
                    classifiedTournaments.Ongoing.push(tournamentData);
                    break;
                case 'COMPLETED':
                    classifiedTournaments.Completed.push(tournamentData);
                    break;
                default:
                    break;
            };
        });

        res.status(200).json(classifiedTournaments);
    } catch (err) {
        console.error(`Error from the server: ${err.message}.`);
        res.status(500).json({ message: "Internal Server Error" });
        next(err);
    }
}

export const getTournamentByStatus = async (req, res, next) => {
    const status = req.query.status;
    const userId = req.query.userId;
    try {
        const player = await Player.findOne({ userId: userId });
        if (!player) res.status(404).json({ message: "Player not found" });

        const registeredTournamentIds = player.tournamentRegistrations.map(
            (registration) => registration.tournamentId.toString()
        );

        const tournaments = await Tournament.find({ tournamentStatus: status }, "_id name entryType organizerId playerRegistrations").populate({
            path: "organizerId",
            select: "clubName",
        });

        const formattedTournaments = tournaments.map((tournament) => ({
            _id: tournament._id,
            name: tournament.name,
            entryType: tournament.entryType,
            organizerName: tournament.organizerId?.clubName || "Unknown Organizer",
            isPlayerRegistered: registeredTournamentIds.includes(tournament._id.toString()),
        }));
        res.status(201).json(formattedTournaments);
    } catch (error) {
        next(error);
    }
}

// TOURNAMENT REGISTRATION
export const playerRegistration = async (req, res, next) => {
    // console.log(req.body);
    const {
        userId,
        fideId,
        fideRating,
        nameWithInitials,
        sex,
        birthday,
        ageGroup,
        address,
        country,
        paymentAmount,
        paymentMethod,
        paymentStatus
    } = req.body;
    const tournamentId = req.params.id;

    try {
        // CHECK IF THE TOURNAMENT EXIST
        const tournament = await Tournament.findById(tournamentId);
        if (!tournament) return next(createError(404, "Tournament not found"));

        // CHECK FOR THE PLAYER
        let player = await Player.findOne({ userId })
        if (!player) {
            player = new Player({
                userId,
                nameWithInitials,
                fideRating,
                sex,
                ageGroup,
                address,
                fideId,
                country,
                tournamentRegistrations: [],
            });
        };

        // CHECK IF THE PLAYER IS ALREADY REGISTERED
        const existingRegistration = player.tournamentRegistrations.find(
            (reg) => reg.tournamentId.toString() === tournamentId
        );
        if (existingRegistration) return next(createError(400, "Player is already registered for this tournament"));

        // ADD TOURNAMENT REGISTRATION FOR THE PLAYER OBJECT
        const tournamentRegistration = {
            tournamentId,
            registeredDate: new Date().toISOString(),
            paymentAmount,
            paymentMethod,
            paymentStatus,
        };
        player.tournamentRegistrations.push(tournamentRegistration);

        // ADD PLAYER REGISTRATION TO THE TOURNAMENT
        const playerRegistration = {
            playerId: player._id,
            name: nameWithInitials,
            birthDay: birthday,
            ageGroup,
            address,
            country,
        };
        tournament.playerRegistrations.push(playerRegistration);

        // SAVING THE TOURNAMENT AND PLAYER
        await player.save();
        await tournament.save();

        res.status(200).json({
            message: "Player registered successfully",
            tournamentRegistration,
            playerRegistration,
            playerId: player._id,
            tournamentId: tournament._id,
        });
    } catch (error) {
        next(error);
    }
}