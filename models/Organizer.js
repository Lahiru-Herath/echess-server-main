import mongoose from 'mongoose';

const OrganizerSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    clubName: {
        type: String,
        required: true,
    },
    tournaments: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Tournament',
    }],
},
    { timestamps: true }
);

export default mongoose.model("Organizer", OrganizerSchema);