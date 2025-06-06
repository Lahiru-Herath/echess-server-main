import mongoose from 'mongoose';

const ageDetailsSchema = new mongoose.Schema({
    ageGroup: {
        type: String,
        required: true,
    },
    ageDescription: {
        type: String,
        required: true,
    },
    registrationFee: {
        type: Number,
        required: true,
    }
});

const playerRegistrationSchema = new mongoose.Schema({
    playerId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Player',
    },
    name: {
        type: String,
        required: true,
    },
    birthDay: {
        type: String,
        required: true,
    },
    ageGroup: {
        type: String,
        required: true,
    },
    address: {
        type: String,
        required: true,
    },
    country: {
        type: String,
        required: true,
    }
});

const newsSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    image: {
        type: String,
        required: true,
    },
    createdDate: {
        type: Date,
        default: Date.now,
    }
});

const TournamentSchema = new mongoose.Schema({
    organizerId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "Organizer",
    },
    name: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    entryType: {
        type: String,
        default: "Paid",
    },
    gameType: {
        type: String,
        required: true,
    },
    rounds: {
        type: Number,
        required: true,
    },
    onGoingRound: {
        type: Number,
        required: false,
        default: 0,
    },
    nextRoundStartingDateTime: {
        type: Date,
        required: false,
    },
    location: {
        type: String,
        required: true,
    },
    startDate: {
        type: String,
        required: true,
    },
    endDate: {
        type: String,
        required: true,
    },
    tournamentStatus: {
        type: String,
        default: "UPCOMING"
    },
    contactNumber: {
        type: String,
        required: true,
    },
    logoImage: {
        type: String,
        required: false,
    },
    coverImage: {
        type: String,
        required: false,
    },
    ageDetails: {
        type: [ageDetailsSchema],
        required: false,
    },
    playerRegistrations: {
        type: [playerRegistrationSchema],
        required: false,
    },
    news: {
        type: [newsSchema],
        required: false,
    }
},
    { timestamps: true }
);

export default mongoose.model("Tournament", TournamentSchema);