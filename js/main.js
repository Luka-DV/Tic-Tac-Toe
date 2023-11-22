
"use strict";



//Players


const playerScores = {
    _player1Score: 0,
    _player2Score: 0,

    updateScore: function(player) {
        if(player === "Player 1") this._player1Score++
        else this._player2Score++
    },

    showScoresOnPage: function() {
        document.querySelector("#player1 .playerScore").innerText = this._player1Score;
        document.querySelector("#player2 .playerScore").innerText = this._player2Score;
    },

    savePlayerPointsToLocalStorage: function() {
        const playerScores = {
            "Player 1": this._player1Score,
            "Player 2": this._player2Score
        };
        localStorage.setItem("Tic-Tac-Toe Scores", JSON.stringify(playerScores));
    },

    importPlayerPointsFromLocalStorage: function() {
        if(localStorage.getItem("Tic-Tac-Toe Scores")) {
            const playerPoints = JSON.parse(localStorage.getItem("Tic-Tac-Toe Scores"));
            this._player1Score = playerPoints["Player 1"];
            this._player2Score = playerPoints["Player 2"];
        }
    },

    resetScores: function() {
        this._player1Score = 0;
        this._player2Score = 0;
        this.showScoresOnPage();
        this.savePlayerPointsToLocalStorage();
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
        this.displayPlayerMove(player, field);
        this.disableClickOnPlayedField(field);
        this.tempDisableClickOnOtherFieldsDuringAnimation();
        whichPlayer.nextRound();
        setTimeout(()=> {
            if(player === "Player 1") {
                this._playingBoardArray[field] = "O";
    
            } else {
                this._playingBoardArray[field] = "X";
            }
            this.savePlayingBoardToLocalStorage();
            this.checkWinner(player);
        }, 500)
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
            eventListenerHandler.removeEventListenersFromPlayingBoard();
            playerScores.updateScore(player);
            playerScores.savePlayerPointsToLocalStorage();
            playerScores.showScoresOnPage()
            whichPlayer._round = 1;
           
        } /* else {
            whichPlayer.nextRound();
        } */
    },

    displayPlayerMove: function(player, field) {
        if(player === "Player 1") {
            document.querySelector(`#${field} svg circle`).classList.remove("hidden");
        } else {
            document.querySelector(`#${field} svg .line1`).classList.remove("hidden");
            document.querySelector(`#${field} svg .line2`).classList.remove("hidden");
        }
    },

    tempDisableClickOnOtherFieldsDuringAnimation: function() {
        document.querySelector(".container").style.pointerEvents = "none";
        setTimeout(() => {
            document.querySelector(".container").style.pointerEvents = "auto";
        }, 500)
    },

    disableClickOnPlayedField: function(field) {
        document.querySelector(`#${field}`).style.pointerEvents = "none";
    },

    enableClickOnAllFields: function() {
        document.querySelectorAll(".container>section").forEach(element => element.style.pointerEvents = "auto");
    },

    savePlayingBoardToLocalStorage: function() {
        const playingBoardSetup = this._playingBoardArray;
        localStorage.setItem("Tic-Tac-Toe PlayingBoard", JSON.stringify(playingBoardSetup));
    },

    importPlayingBoardFromLocalStorage: function() {
        if(localStorage.getItem("Tic-Tac-Toe PlayingBoard")) {
            const boardSetup = JSON.parse(localStorage.getItem("Tic-Tac-Toe PlayingBoard"));
            this._playingBoardArray = boardSetup;

            for(let field in boardSetup) {
                if(boardSetup[field]) {
                    if(boardSetup[field] === "O") {
                        document.querySelector(`#${field} svg circle`).classList.remove("hidden");
                    } else {
                        document.querySelector(`#${field} svg .line1`).classList.remove("hidden");
                        document.querySelector(`#${field} svg .line2`).classList.remove("hidden");
                    }
                }
            }
        }
    },

    resetBoard: function() {
        //finish the function
        //dont forget about local storage!
    }




}

const whichPlayer = {
    _round: 1,
    currentPlayer: "Player 1",
    nextRound: function() {
        this._round++
        this.alternatePlayers();
        console.log(this._round)
    },
    alternatePlayers: function() {
        if(this._round % 2 === 1) {
            this.currentPlayer = "Player 1"
        } else {
            this.currentPlayer = "Player 2"
        }
    }
}

const eventListenerHandler = {
    passPlayDataForEventListener: function(item){
        playingBoard.choseField(whichPlayer.currentPlayer, item.currentTarget.id);
    },

    addEventListenersToPlayingBoard: function() {
        document.querySelectorAll(".grid-item").forEach(item => item.addEventListener("click", this.passPlayDataForEventListener));
    },

    removeEventListenersFromPlayingBoard: function() {
        document.querySelectorAll(".grid-item").forEach(item => item.removeEventListener("click", this.passPlayDataForEventListener));
    },

    addResetScoreEventListener: function() {
        document.querySelector("#resetButton").addEventListener("click", () => {
            playerScores.resetScores();
        })
    },

    addNewGameEventListener: function() {
        document.querySelector("#newGameButton").addEventListener("click", () => {
            playingBoard.resetBoard();
        })
    }
}




playerScores.importPlayerPointsFromLocalStorage();
playerScores.showScoresOnPage();
playingBoard.importPlayingBoardFromLocalStorage();
eventListenerHandler.addEventListenersToPlayingBoard();
eventListenerHandler.addResetScoreEventListener();