import mongoose from 'mongoose';

const TournamentRegistrationSchema = new mongoose.Schema({
    tournamentId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
    },
    registeredDate: {
        type: String,
        required: true,
    },
    paymentAmount: {
        type: Number,
        requied: true,
    },
    paymentMethod: {
        type: String,
        required: true,
    },
    paymentStatus: {
        type: String,
        required: true,
    }
})

const PlayerSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
    },
    nameWithInitials: {
        type: String,
        required: true,
    },
    fideId: {
        type: String,
        required: false,
    },
    fideRating: {
        type: Number,
        required: false,
    },
    sex: {
        type: String,
        required: true,
    },
    ageGroup: {
        type: String,
        required: true,
    },
    birthday: {
        type: String,
        required: true,
    },
    address: {
        type: String,
        required: false,
    },
    country: {
        type: String,
        required: false,
    },
    tournamentRegistrations: {
        type: [TournamentRegistrationSchema],
        required: false,
    },
},
    { timestamps: true }
);

export default mongoose.model("Player", PlayerSchema);