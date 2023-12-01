
//CONSTRUCTORS + IIFE//

"use strict";


//Player scores//

//IIFE:

const playerScores = (function() {
    let player1Score = 0;
    let player2Score=  0;

    return {

    updateScore: function(player) {
        if(player === "Player 1") player1Score++;
        else player2Score++;
    },

    showScoresOnPage: function() {
        document.querySelector("#player1 .playerScore").innerText = player1Score;
        document.querySelector("#player2 .playerScore").innerText = player2Score;
    },

    savePlayerPointsToLocalStorage: function() {
        const playerScores = {
            "Player 1": player1Score,
            "Player 2": player2Score
        };
        localStorage.setItem("Tic-Tac-Toe Scores", JSON.stringify(playerScores));
    },

    importPlayerPointsFromLocalStorage: function() {
        if(localStorage.getItem("Tic-Tac-Toe Scores")) {
            const playerPoints = JSON.parse(localStorage.getItem("Tic-Tac-Toe Scores"));
            player1Score = playerPoints["Player 1"];
            player2Score = playerPoints["Player 2"];
        }
    },

    resetScores: function() {
        player1Score = 0;
        player2Score = 0;
        this.showScoresOnPage();
        this.savePlayerPointsToLocalStorage();
    }
}
})();

//const playerScores = new PlayerScores();


//GAME LOGIC//

//Game board:

function PlayingBoard() {
    let playingBoardObject = {
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

    let gameEnded = false;

    this.choseField = function(player, field) {
        this.displayPlayerMove(player, field);
        this.disableClickOnPlayedField(field);
        this.tempDisableClickOnOtherFieldsDuringAnimation();
        whichPlayerLogic.nextRound();
        whichPlayerLogic.saveCurrentRoundAndPlayerToLocalStorage();
        setTimeout(()=> {
            if(player === "Player 1") {
                playingBoardObject[field] = "O";
    
            } else {
                playingBoardObject[field] = "X";
            }
            this.checkWinningCondition(player);
            this.savePlayingBoardToLocalStorage();
            this.saveGameStateToLocalStorage();
        }, 500)
    };

    this.checkWinningCondition = function(player) {

        const board = playingBoardObject;
        
        if(  //ROWS:
        (board["A1"] && board["A1"] === board["B1"] && board["A1"] === board["C1"]) ||
        (board["A2"] && board["A2"] === board["B2"] && board["A2"] === board["C2"]) ||
        (board["A3"] && board["A3"] === board["B3"] && board["A3"] === board["C3"]) ||
        //COLUMNS:
        (board["A1"] && board["A1"] === board["A2"] && board["A1"] === board["A3"]) ||
        (board["B1"] && board["B1"] === board["B2"] && board["B1"] === board["B3"]) ||
        (board["C1"] && board["C1"] === board["C2"] && board["C1"] === board["C3"]) ||
        //DIAGONAL:
        (board["A1"] && board["A1"] === board["B2"] && board["A1"] === board["C3"]) ||
        (board["C1"] && board["C1"] === board["B2"] && board["C1"] === board["A3"])
        ) {
           this.handleWin(player);
        } 
    };

    this.handleWin = function(player) {
        this.showPopUpWindow(player);
        eventListenerHandler.removeEventListenersFromPlayingBoard();
        playerScores.updateScore(player);
        playerScores.savePlayerPointsToLocalStorage();
        playerScores.showScoresOnPage()
        whichPlayerLogic._round = 1;
        gameEnded = true;  
    };

    this.showPopUpWindow = function(player) {
        const modal = document.querySelector("#modal");
        const modalHeader = document.querySelector("#modal h2");
        const firstModalParagraph = document.querySelector("#first-line");
        const secondModalParagraph = document.querySelector("#second-line");

        modalHeader.innerText = `Congratulations ${player}, you have won the game!`;

        firstModalParagraph.innerText = "Here`s a dad joke for your effort:"
        secondModalParagraph.innerText = `"${fetchAPI.dadJoke}"`

        modal.showModal();
    };

    this.displayPlayerMove = function(player, field) {
        if(player === "Player 1") {
            document.querySelector(`#${field} svg circle`).classList.remove("hidden");
        } else {
            document.querySelector(`#${field} svg .line1`).classList.remove("hidden");
            document.querySelector(`#${field} svg .line2`).classList.remove("hidden");
        }
    };

    this.tempDisableClickOnOtherFieldsDuringAnimation = function() {
        document.querySelectorAll(".grid-item").forEach(element => element.classList.add("disable-click-all"));
        setTimeout(() => {
            document.querySelectorAll(".grid-item").forEach(element => element.classList.remove("disable-click-all"));
        }, 500)
    }; 

    this.disableClickOnPlayedField = function(field) {
        document.querySelector(`#${field}`).classList.add("disable-click");
    };

    this.enableClickOnAllFields = function() {
        document.querySelectorAll(".grid-item").forEach(element => element.classList.remove("disable-click"));
    };

    this.savePlayingBoardToLocalStorage = function() {
        const playingBoardSetup = playingBoardObject;
        localStorage.setItem("Tic-Tac-Toe PlayingBoard", JSON.stringify(playingBoardSetup));
    };

    this.importPlayingBoardFromLocalStorage = function() {
        if(localStorage.getItem("Tic-Tac-Toe PlayingBoard")) {
            const boardSetup = JSON.parse(localStorage.getItem("Tic-Tac-Toe PlayingBoard"));
            playingBoardObject = boardSetup;

            for(let field in boardSetup) {
                if(boardSetup[field]) {

                    this.disableClickOnPlayedField(field);

                    if(boardSetup[field] === "O") {
                        document.querySelector(`#${field} svg circle`).classList.remove("hidden");
                    } else {
                        document.querySelector(`#${field} svg .line1`).classList.remove("hidden");
                        document.querySelector(`#${field} svg .line2`).classList.remove("hidden");
                    }
                }
            } 
        }
    };

    this.saveGameStateToLocalStorage = function() {
        localStorage.setItem("Tic-Tac-Toe GameEnded", gameEnded );
    };

    this.importGameStateFromLocalStorage = function() {
        gameEnded = JSON.parse(localStorage.getItem("Tic-Tac-Toe GameEnded"));
        if(gameEnded) {
            eventListenerHandler.removeEventListenersFromPlayingBoard();
        }
    };

    this.newGameResetBoard = function() {

        whichPlayerLogic._round = 1;
        whichPlayerLogic._currentPlayer = "Player 1";
        
        const boardSetup = playingBoardObject;
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

        if(gameEnded) {
            eventListenerHandler.addEventListenersToPlayingBoard();
        } 

        gameEnded = false;

        playingBoardObject = {
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
        this.saveGameStateToLocalStorage();
        whichPlayerLogic.saveCurrentRoundAndPlayerToLocalStorage();
  
        this.enableClickOnAllFields();
        fetchAPI.getDadJoke();  
    };
};

const playingBoard = new PlayingBoard();


//Alternating players:

function WhichPlayerLogic() {
    this._round = 1;
    this._currentPlayer = "Player 1";

    this.nextRound = function() {
        this._round++;
        this.alternatePlayers();
    };

    this.alternatePlayers = function() {
        if(this._round % 2 === 1) {
            this._currentPlayer = "Player 1";
        } else {
            this._currentPlayer = "Player 2";
        }
    };

    this.saveCurrentRoundAndPlayerToLocalStorage = function() {
        const currentRoundAndPlayer = {
            round: this._round,
            player: this._currentPlayer
        };
        localStorage.setItem("Tic-Tac-Toe RoundAndPlayer", JSON.stringify(currentRoundAndPlayer));
    };

    this.importCurrentRoundAndPlayerFromLocalStorage = function() {
        if(localStorage.getItem("Tic-Tac-Toe RoundAndPlayer")) {
            const currentRoundAndPlayer = JSON.parse(localStorage.getItem("Tic-Tac-Toe RoundAndPlayer"));
            this._round = currentRoundAndPlayer.round;
            this._currentPlayer = currentRoundAndPlayer.player;
        }
    };
};

const whichPlayerLogic = new WhichPlayerLogic();



//Fetch API//

function FetchAPI() {

    let dadJoke = null;

    this.getDadJoke = function() {

        const url = "https://api.api-ninjas.com/v1/dadjokes?limit=1"
        fetch(url, {
              headers: {
                'X-Api-Key': 'l6OOWd+mSRT7PJialtqkUQ==ai1bCtCXuqTka7oR'
              }
        })
        .then(res => {
            if(!res.ok) {
                throw new Error ("Network response was not OK");
            }
            return res.json();
        })
        .then( data => {
            dadJoke = data[0].joke;
        })
        .catch(err => {
            console.log("Error: ", err)
        })
    };

    Object.defineProperty(this, "dadJoke", {
        get: function() {
            return dadJoke;
        }
    });
};

const fetchAPI = new FetchAPI();


//Event listeners//

function EventListenerHandler() {
    this.passPlayDataForEventListener = function(item) {
        playingBoard.choseField(whichPlayerLogic._currentPlayer, item.currentTarget.id);
    };

    this.addEventListenersToPlayingBoard = function() {
        document.querySelectorAll(".grid-item").forEach(item => item.addEventListener("click", this.passPlayDataForEventListener));
    };

    this.removeEventListenersFromPlayingBoard = function() {
        document.querySelectorAll(".grid-item").forEach(item => item.removeEventListener("click", this.passPlayDataForEventListener));
    };

    this.addResetScoreEventListener = function() {
        document.querySelector("#resetButton").addEventListener("click", () => {
            playerScores.resetScores();
        })
    };

    this.addNewGameEventListener = function() {
        document.querySelector("#newGameButton").addEventListener("click", () => {
            playingBoard.newGameResetBoard();
        })
    };

    this.addModalCloseButtonEventListener = function() {
        document.querySelector(".close-button").addEventListener("click", () => {
            const modal = document.querySelector("#modal");
            modal.close();
        })
    };
};

const eventListenerHandler = new EventListenerHandler();


//Initialization//

eventListenerHandler.addEventListenersToPlayingBoard();
playerScores.importPlayerPointsFromLocalStorage();
playerScores.showScoresOnPage();
playingBoard.importPlayingBoardFromLocalStorage();
playingBoard.importGameStateFromLocalStorage();
whichPlayerLogic.importCurrentRoundAndPlayerFromLocalStorage();
eventListenerHandler.addResetScoreEventListener();
eventListenerHandler.addNewGameEventListener();
eventListenerHandler.addModalCloseButtonEventListener();
fetchAPI.getDadJoke();

