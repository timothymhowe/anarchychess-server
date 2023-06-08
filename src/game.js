const games = {};

/**
 * Class definition for the "Player" class
 * 
 * 
 */
class Player {
    /**
     * 
     * @param {str} PID The player id number
     * @param {str} GID The ID number of their current game
     * @param {str} name The player's username
     * @param {str} color The player's color in the current game
     */
    constructor(PID,GID,name,color){
        this.name=name;
        this.color=color;
        this.PID = PID;
        this.GID = GID;
    }
}

/**
 * Function for adding a player to a game.
 * 
 * @param {object} param0 3-tuple containing the GID, PID, and name of the player to be added
 * @returns  a status message, 
 *           the opposing PID,
 *          and the new player representing the user
 */
const addPlayer = ({GID, PID, name}) => {
    // if the Game ID number is not in the list of games, create a new game instance
    if (!games[GID]){
        
        // randomize the color of the player
        const color = Math.random() >  0.5 ? 'w' : 'b';

        // create a new player object
        const player = new Player(PID, GID, name, color);
        
        // add the player as a value for the key GID
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

    // if the opponent is playing white, then color is black, else white
    const color = opponent.color === 'w' ? 'b':'w';
    const player = new Player(PID,GID,name,color);

    // add the second player to the list of values under the key GID
    games[GID].push(player);

    return {
        message: 'Added successfully!',
        opponent,
        player,

    };
};

const removePlayer = (PID) => {
    //for each GID in the list of games
    for (const GID in games) {
        let players = games[GID];

        // find the index in the list of PIDs of the player that has left
        const index = players.findIndex((player) => player.PID === PID);

        if (index !== -1){
            return players.splice(index,1)[0];
        }
    };
};

const game = (GID) => games[GID];

const _addPlayer = addPlayer;
export { _addPlayer as addPlayer };
const _game = game;
export { _game as game };
const _removePlayer = removePlayer;
export { _removePlayer as removePlayer };
