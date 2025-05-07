import { Server } from "socket.io";

const waitingPlayers = []; // Queue for matchmaking

export const initializeSocket = (server) => {
    const io = new Server(server, {
        cors: {
            origin: process.env.CLIENT_ORIGIN, // Allow requests from your React app
            methods: ["GET", "POST"],
        },
    });

    io.on("connection", (socket) => {
        console.log("A user connected:", socket.id);

        // Add player to matchmaking queue
        waitingPlayers.push(socket);

        // Notify the player they are waiting for an opponent
        socket.emit("waiting-for-opponent");

        // Match players if there are at least two in the queue
        if (waitingPlayers.length >= 2) {
            const player1 = waitingPlayers.shift();
            const player2 = waitingPlayers.shift();

            const roomId = `room-${player1.id}-${player2.id}`;
            player1.join(roomId);
            player2.join(roomId);

            // Notify players about the match
            io.to(player1.id).emit("match-found", { roomId, color: "white" });
            io.to(player2.id).emit("match-found", { roomId, color: "black" });
        }

        // Handle moves
        socket.on("move", ({ roomId, move }) => {
            socket.to(roomId).emit("opponent-move", move);
        });

        // Handle draw requests
        socket.on("request-draw", ({ roomId }) => {
            socket.to(roomId).emit("draw-requested");
        });

        socket.on("draw-accepted", ({ roomId }) => {
            io.to(roomId).emit("draw-accepted");
        });

        socket.on("draw-rejected", ({ roomId }) => {
            io.to(roomId).emit("draw-rejected");
        });

        // Handle resignation
        socket.on("resign", ({ roomId }) => {
            socket.to(roomId).emit("opponent-resigned");
        });

        // Handle disconnection
        socket.on("disconnect", () => {
            console.log("A user disconnected:", socket.id);
            const index = waitingPlayers.indexOf(socket);
            if (index !== -1) waitingPlayers.splice(index, 1);
        });
    });
};