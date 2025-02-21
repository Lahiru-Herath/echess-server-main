import express from 'express';
import { acceptPlayerRegistration, createNews, createTournament, deleteNews, getCategorizedPlayers, getClassifiedTournaments, getTournament, getTournamentByStatus, getTournaments, playerRegistration, revokePlayerRegistration, updateNews } from '../controllers/tournamentController.js';
import { authorizeRoles, verifyToken } from '../controllers/authControllers.js';

const router = express.Router();

// STATIC ROUTES
router.get("/classified-tournaments", verifyToken, authorizeRoles('PLAYER', 'ORGANIZER'), getClassifiedTournaments);
router.get("/tournament-by-status", verifyToken, authorizeRoles('PLAYER', 'ORGANIZER'), getTournamentByStatus);
router.delete("/remove-player-registration", verifyToken, authorizeRoles('ORGANIZER'), revokePlayerRegistration);
router.put("/accept-player-registration", verifyToken, authorizeRoles('ORGANIZER'), acceptPlayerRegistration);

// DYNAMIC ROUTES
router.get("/:id", verifyToken, authorizeRoles('PLAYER', 'ORGANIZER'), getTournament);
router.post("/:id/register", verifyToken, authorizeRoles('PLAYER'), playerRegistration);
router.get("/:tournamentId/categorized-players", verifyToken, authorizeRoles('ORGANIZER'), getCategorizedPlayers);

// NEWS ROUTES
router.post("/news", verifyToken, authorizeRoles('ORGANIZER'), createNews);
router.put("/news", verifyToken, authorizeRoles('ORGANIZER'), updateNews);
router.delete("/news", verifyToken, authorizeRoles('ORGANIZER'), deleteNews);

// OTHER ROUTES
router.post("/", verifyToken, authorizeRoles('ORGANIZER'), createTournament);
router.get("/", verifyToken, authorizeRoles('PLAYER', 'ORGANIZER'), getTournaments);


export default router;