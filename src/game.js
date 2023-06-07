const games = {};

class Player {
    constructor(name,color,playerID,gameID){
        this.name=name;
        this.color=color;
        this.playerID = playerID;
        this.gameID = gameID;
    }
}

const addPlayer({gameID, name, playerID}) => {
    if (!games[gameID]){
        const color = Math.random() >  0.5 ? 'w' : 'b';
        const player = new Player(name, color, playerID, gameID);
        games[gameID] = [player];
        return{
            message: 'Joined game',
            opponent: null,
            player,
        };
    }
    // if there is more than one player already in the game
    if (games[gameID].length > 1){
        //then the game is full
        return{error: 'This game is full'}
    }


    // if there room in th game, allow a second player to be added.
    const opponent = games[gameID][0]
    const color = opponent.color === 'w'? 'b':'w';
    const player = new Player(name,color,playerID,gameID);
    games[gameID].push(player);

    return {
        message: 'Added successfully',
        opponent,
        player,

    };
};

const removePlayer = (playerID) => {
    for (const game in games) {
        let players = games[game];
        const index = players.findIndex((player1) => player1.playerID === playerID);

        if (index !== -1){
            return players.splice(index,1)[0];
        }
    }
}