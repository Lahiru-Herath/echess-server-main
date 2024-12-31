import Organizer from "../models/Organizer.js";
import Tournament from "../models/Tournament.js";

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


export const getTournaments = async (req, res, next) => {
    try {
        const tournaments = await Tournament.find();
        res.status(200).json(tournaments);
    } catch (err) {
        next(err);
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