
"use strict";

//Player scores

const playerScores = {
    _player1Score: 0,
    _player2Score: 0,

    updateScore: function(player) {
        if(player === "Player 1") this._player1Score++;
        else this._player2Score++;
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
    _playingBoardObject: {
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

    _gameEnded: false,

    choseField: function(player, field) {
        this.displayPlayerMove(player, field);
        this.disableClickOnPlayedField(field);
        this.tempDisableClickOnOtherFieldsDuringAnimation();
        whichPlayerLogic.nextRound();
        whichPlayerLogic.saveCurrentRoundAndPlayerToLocalStorage();
        setTimeout(()=> {
            if(player === "Player 1") {
                this._playingBoardObject[field] = "O";
    
            } else {
                this._playingBoardObject[field] = "X";
            }
            this.checkWinner(player);
            this.savePlayingBoardToLocalStorage();
        }, 500)
    },

    checkWinner: function(player) {
        if(  //ROWS:
        (this._playingBoardObject["A1"] && this._playingBoardObject["A1"] === this._playingBoardObject["B1"] && this._playingBoardObject["A1"] === this._playingBoardObject["C1"]) ||
        (this._playingBoardObject["A2"] && this._playingBoardObject["A2"] === this._playingBoardObject["B2"] && this._playingBoardObject["A2"] === this._playingBoardObject["C2"]) ||
        (this._playingBoardObject["A3"] && this._playingBoardObject["A3"] === this._playingBoardObject["B3"] && this._playingBoardObject["A3"] === this._playingBoardObject["C3"]) ||
        //COLUMNS:
        (this._playingBoardObject["A1"] && this._playingBoardObject["A1"] === this._playingBoardObject["A2"] && this._playingBoardObject["A1"] === this._playingBoardObject["A3"]) ||
        (this._playingBoardObject["B1"] && this._playingBoardObject["B1"] === this._playingBoardObject["B2"] && this._playingBoardObject["B1"] === this._playingBoardObject["B3"]) ||
        (this._playingBoardObject["C1"] && this._playingBoardObject["C1"] === this._playingBoardObject["C2"] && this._playingBoardObject["C1"] === this._playingBoardObject["C3"]) ||
        //DIAGONAL:
        (this._playingBoardObject["A1"] && this._playingBoardObject["A1"] === this._playingBoardObject["B2"] && this._playingBoardObject["A1"] === this._playingBoardObject["C3"]) ||
        (this._playingBoardObject["C1"] && this._playingBoardObject["C1"] === this._playingBoardObject["B2"] && this._playingBoardObject["C1"] === this._playingBoardObject["A3"])
        ) {
            alert(`${player} won the game!`)
            eventListenerHandler.removeEventListenersFromPlayingBoard();
            playerScores.updateScore(player);
            playerScores.savePlayerPointsToLocalStorage();
            playerScores.showScoresOnPage()
            whichPlayerLogic._round = 1;
            this._gameEnded = true;  
        } 
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
        document.querySelectorAll(".grid-item").forEach(element => element.classList.add("disable-click-all"));
        setTimeout(() => {
            document.querySelectorAll(".grid-item").forEach(element => element.classList.remove("disable-click-all"));
        }, 500)
    }, 

    disableClickOnPlayedField: function(field) {
        document.querySelector(`#${field}`).classList.add("disable-click");
    },

    enableClickOnAllFields: function() {
        document.querySelectorAll(".grid-item").forEach(element => element.classList.remove("disable-click"));
    },

    savePlayingBoardToLocalStorage: function() {
        const playingBoardSetup = this._playingBoardObject;
        localStorage.setItem("Tic-Tac-Toe PlayingBoard", JSON.stringify(playingBoardSetup));
        localStorage.setItem("Tic-Tac-Toe GameEnded", this._gameEnded );
    },

    importPlayingBoardFromLocalStorage: function() {
        if(localStorage.getItem("Tic-Tac-Toe PlayingBoard")) {
            const boardSetup = JSON.parse(localStorage.getItem("Tic-Tac-Toe PlayingBoard"));
            this._playingBoardObject = boardSetup;

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

            this._gameEnded = JSON.parse(localStorage.getItem("Tic-Tac-Toe GameEnded"));
            if(this._gameEnded) {
                eventListenerHandler.removeEventListenersFromPlayingBoard();
            }
        }
    },

    newGameResetBoard: function() {

        whichPlayerLogic._round = 1;
        whichPlayerLogic.currentPlayer = "Player 1";
        

        const boardSetup = this._playingBoardObject;
        for(let field in boardSetup) {
            if(boardSetup[field]) {
                if(boardSetup[field] === "O") {
                    document.querySelector(`#${field} svg circle`).classList.add("hidden");
                } else {
                    document.querySelector(`#${field} svg .line1`).classList.add("hidden");
                    document.querySelector(`#${field} svg .line2`).classList.add("hidden");
                }
            }
        }

        if(playingBoard._gameEnded) {
            eventListenerHandler.addEventListenersToPlayingBoard();
        } 

        this._gameEnded = false;

        this._playingBoardObject = {
            "A1": null,
            "B1": null,
            "C1": null,
        
            "A2": null,
            "B2": null, 
            "C2": null,
        
            "A3": null,
            "B3": null, 
            "C3": null
            };

        this.savePlayingBoardToLocalStorage();
  
        this.enableClickOnAllFields();
        
    }

}

const whichPlayerLogic = {
    _round: 1,
    currentPlayer: "Player 1",
    nextRound: function() {
        this._round++
        this.alternatePlayers();
    },
    alternatePlayers: function() {
        if(this._round % 2 === 1) {
            this.currentPlayer = "Player 1"
        } else {
            this.currentPlayer = "Player 2"
        }
    },

    saveCurrentRoundAndPlayerToLocalStorage: function() {
        const currentRoundAndPlayer = {
            round: this._round,
            player: this.currentPlayer
        }
        localStorage.setItem("Tic-Tac-Toe RoundAndPlayer", JSON.stringify(currentRoundAndPlayer));
    },

    importCurrentRoundAndPlayerFromLocalStorage: function() {
        if(localStorage.getItem("Tic-Tac-Toe RoundAndPlayer")) {
            const currentRoundAndPlayer = JSON.parse(localStorage.getItem("Tic-Tac-Toe RoundAndPlayer"));
            this._round = currentRoundAndPlayer.round;
            this.currentPlayer = currentRoundAndPlayer.player;
        }
    }
}


//Event listeners

const eventListenerHandler = {
    passPlayDataForEventListener: function(item){
        playingBoard.choseField(whichPlayerLogic.currentPlayer, item.currentTarget.id);
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
            playingBoard.newGameResetBoard();
        })
    }
}

eventListenerHandler.addEventListenersToPlayingBoard();
playerScores.importPlayerPointsFromLocalStorage();
playerScores.showScoresOnPage();
playingBoard.importPlayingBoardFromLocalStorage();
whichPlayerLogic.importCurrentRoundAndPlayerFromLocalStorage();
eventListenerHandler.addResetScoreEventListener();
eventListenerHandler.addNewGameEventListener();