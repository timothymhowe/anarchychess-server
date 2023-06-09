import { createServer } from 'http';
import { Server } from 'socket.io';
import express from 'express';
import cors from 'cors';
import { addPlayer, game, removePlayer } from './game.js';

// creates and configures an express.js middleware handler
const app = express();
app.use(cors());
app.use(express.json());
app.get('/', (req,res) => res.setEncoding({status:"healthy"}));

// initializes a new instance of a server.
const server = createServer(app);

// sets default server port as 5001
const PORT = 5001;
const io = new Server(server,{
    cors:{
        origin: "http://localhost:3000"
    }
});



server.listen(PORT,() => console.log('Server running on port ' + PORT));

// listens for connections to the server
io.on('connection', (socket) => {

    socket.on('join', ({ name, GID }, callback) => {
        const {error, player, opponent} = addPlayer({
            GID,
            PID: socket.id,
            name,
        });
        if (error) {
            return callback({ error });
        }
        socket.join(GID);
        callback({color:player.color});

        // Introductory message upon joining room
        socket.emit('welcome', {
            message: `Hello, ${player.name}, welcome to AnarchyChess`,
            opponent,
        });

        // notify player2 that player1 has joined room
        socket.broadcast.to(player.GID).emit('opponentJoin', {
            message: `${player.name} (${player.rating}) has joined the game`,
            opponent: player,
        });

        if (game(GID).length >= 2 ){
            const white = game(GID).find((player) => player.color === 'w');
            io.to(GID).emit('message',{
                message: `Start! ${white.name} to move.`
            });
        }
    });

    // when a move is made
    socket.on('move', ({GID,from,to}) => {
        socket.broadcast.to(GID).emit('opponentMove',{from,to});
    });


    // When a player disconnects from the room
    socket.on('disconnect', () => {
        const player = removePlayer(socket.id);
        if (player){
            io.to(player.game).emit('message', {
                message: `${player.name} has left the game.  Coward.`,
            });
            socket.broadcast.to(player.game).emit('opponentLeft');
        }
    });
});

