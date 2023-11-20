
"use strict";



//Players

const player1 = {
    score: 0
}

const player2 = {
    score: 0
}

const updatePlayerScore = {
    update: function(player) {
        if(player === "Player 1") player1.score++
        else player2.score++
    }
}


//Game Logic

const playingBoard = {
    _playingBoardArray: {
    "1A": null,
    "1B": null,
    "1C": null,

    "2A": null,
    "2B": null, 
    "2C": null,

    "3A": null,
    "3B": null, 
    "3C": null
    },

    choseField: function(player, field) {
        if(player === "Player 1") {
            this._playingBoardArray[field] = "O";
            this.checkWinner(player);
        } else {
            this._playingBoardArray[field] = "X";
            this.checkWinner(player);
        }
    },

    checkWinner: function(player) {
        if(  //ROWS:
        (this._playingBoardArray["1A"] && this._playingBoardArray["1A"] === this._playingBoardArray["1B"] && this._playingBoardArray["1A"] === this._playingBoardArray["1C"]) ||
        (this._playingBoardArray["2A"] && this._playingBoardArray["2A"] === this._playingBoardArray["2B"] && this._playingBoardArray["2A"] === this._playingBoardArray["2C"]) ||
        (this._playingBoardArray["3A"] && this._playingBoardArray["3A"] === this._playingBoardArray["3B"] && this._playingBoardArray["3A"] === this._playingBoardArray["3C"]) ||
        //COLUMNS:
        (this._playingBoardArray["1A"] && this._playingBoardArray["1A"] === this._playingBoardArray["2A"] && this._playingBoardArray["1A"] === this._playingBoardArray["3A"]) ||
        (this._playingBoardArray["1B"] && this._playingBoardArray["1B"] === this._playingBoardArray["2B"] && this._playingBoardArray["1B"] === this._playingBoardArray["3B"]) ||
        (this._playingBoardArray["1C"] && this._playingBoardArray["1C"] === this._playingBoardArray["2C"] && this._playingBoardArray["1C"] === this._playingBoardArray["3C"]) ||
        //DIAGONAL:
        (this._playingBoardArray["1A"] && this._playingBoardArray["1A"] === this._playingBoardArray["2B"] && this._playingBoardArray["1A"] === this._playingBoardArray["3C"]) ||
        (this._playingBoardArray["1C"] && this._playingBoardArray["1C"] === this._playingBoardArray["2B"] && this._playingBoardArray["1C"] === this._playingBoardArray["3A"])
        ) {
            alert(`${player} won the game!`)
            updatePlayerScore.update(player);
        }
        
    }
}

const whichPlayer = {
    round: 1,
    currentPlayer: null,
    nextRound: function() {
        this.round++
    },
    alternatePlayers: function() {
        if(this.round % 2 === 1) {
            this.currentPlayer = "Player 1"
        } else {
            this.currentPlayer = "Player 2"
        }
    }
}


