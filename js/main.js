
"use strict";


//finish the game logic


document.querySelectorAll()



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
    "A1": null,
    "B1": null,
    "C1": null,

    "A2": null,
    "B2": null, 
    "C2": null,

    "A3": null,
    "B3": null, 
    "C3": null
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
        (this._playingBoardArray["A1"] && this._playingBoardArray["A1"] === this._playingBoardArray["B1"] && this._playingBoardArray["A1"] === this._playingBoardArray["C1"]) ||
        (this._playingBoardArray["A2"] && this._playingBoardArray["A2"] === this._playingBoardArray["B2"] && this._playingBoardArray["A2"] === this._playingBoardArray["C2"]) ||
        (this._playingBoardArray["A3"] && this._playingBoardArray["A3"] === this._playingBoardArray["B3"] && this._playingBoardArray["A3"] === this._playingBoardArray["C3"]) ||
        //COLUMNS:
        (this._playingBoardArray["A1"] && this._playingBoardArray["A1"] === this._playingBoardArray["A2"] && this._playingBoardArray["A1"] === this._playingBoardArray["A3"]) ||
        (this._playingBoardArray["B1"] && this._playingBoardArray["B1"] === this._playingBoardArray["B2"] && this._playingBoardArray["B1"] === this._playingBoardArray["B3"]) ||
        (this._playingBoardArray["C1"] && this._playingBoardArray["C1"] === this._playingBoardArray["C2"] && this._playingBoardArray["C1"] === this._playingBoardArray["C3"]) ||
        //DIAGONAL:
        (this._playingBoardArray["A1"] && this._playingBoardArray["A1"] === this._playingBoardArray["B2"] && this._playingBoardArray["A1"] === this._playingBoardArray["C3"]) ||
        (this._playingBoardArray["C1"] && this._playingBoardArray["C1"] === this._playingBoardArray["B2"] && this._playingBoardArray["C1"] === this._playingBoardArray["A3"])
        ) {
            alert(`${player} won the game!`)
            updatePlayerScore.update(player);
            whichPlayer.round = 1;
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


