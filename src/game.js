const games = {};

class Player {
    constructor(name,color,PID,GID){
        this.name=name;
        this.color=color;
        this.PID = PID;
        this.GID = GID;
    }
}

const addPlayer({GID, name, PID}) => {
    if (!games[GID]){
        const color = Math.random() >  0.5 ? 'w' : 'b';
        const player = new Player(name, color, PID, GID);
        games[GID] = [player];
        return{
            message: 'Joined game',
            opponent: null,
            player,
        };
    }
    // if there is more than one player already in the game
    if (games[GID].length > 1){
        //then the game is full
        return{error: 'This game is full'}
    }


    // if there room in th game, allow a second player to be added.
    const opponent = games[GID][0]
    const color = opponent.color === 'w'? 'b':'w';
    const player = new Player(name,color,PID,GID);
    games[GID].push(player);

    return {
        message: 'Added successfully!',
        opponent,
        player,

    };
};

const removePlayer = (PID) => {
    for (const game in games) {
        let players = games[game];
        const index = players.findIndex((player1) => player1.PID === PID);

        if (index !== -1){
            return players.splice(index,1)[0];
        }
    };
};

const game = (id) => games[id];
module.exports = {
    addPlayer,
    game,
    removePlayer,
};