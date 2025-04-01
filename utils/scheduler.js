import cron from 'node-cron';
import Tournament from '../models/Tournament.js';


const parseDateString = (dateStr) => {
    const [day, month, year] = dateStr.split('/');
    return new Date(`${year}-${month}-${day}`);
};

export const updateTournamentStatuses = async () => {
    try {
        const tournaments = await Tournament.find();
        const currentDate = new Date();

        for (const tournament of tournaments) {
            const start = parseDateString(tournament.startDate);
            const end = parseDateString(tournament.endDate);
            // console.log(`${tournament.name} start date: ${start}`);

            let newStatus = tournament.tournamentStatus;

            if (currentDate < start) {
                newStatus = "UPCOMING";
            } else if (currentDate >= start && currentDate <= end) {
                newStatus = "ONGOING";
            } else if (currentDate > end) {
                newStatus = "COMPLETED";
            }

            if (newStatus !== tournament.tournamentStatus) {
                tournament.tournamentStatus = newStatus;
                await tournament.save();
            }
        }

        // console.log("Tournament status updated successfully");
    } catch (err) {
        console.error("Error updating tournament statuses");
    }
};

cron.schedule("0 * * * *", updateTournamentStatuses);