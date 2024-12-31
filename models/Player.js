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
    fideId: {
        type: String,
        required: true,
    },
    tournamentRegsitrations: {
        type: [TournamentRegistrationSchema],
        required: false,
    },
},
    { timestamps: true }
);

export default mongoose.model("Player", PlayerSchema);