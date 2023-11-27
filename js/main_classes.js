
//CLASSES//

"use strict";


//Player scores//

class PlayerScores {
    
    #player1Score = 0;
    #player2Score = 0;
    
    updateScore(player) {
            if (player === "Player 1") this.#player1Score++;
            else this.#player2Score++;
        };

    showScoresOnPage() {
            document.querySelector("#player1 .playerScore").innerText = this.#player1Score;
            document.querySelector("#player2 .playerScore").innerText = this.#player2Score;
        };

    savePlayerPointsToLocalStorage() {
            const playerScores = {
                "Player 1": this.#player1Score,
                "Player 2": this.#player2Score
            };
            localStorage.setItem("Tic-Tac-Toe Scores", JSON.stringify(playerScores));
        };

    importPlayerPointsFromLocalStorage() {
            if (localStorage.getItem("Tic-Tac-Toe Scores")) {
                const playerPoints = JSON.parse(localStorage.getItem("Tic-Tac-Toe Scores"));
                this.#player1Score = playerPoints["Player 1"];
                this.#player2Score = playerPoints["Player 2"];
            }
        };

    resetScores() {
            this.#player1Score = 0;
            this.#player2Score = 0;
            this.showScoresOnPage();
            this.savePlayerPointsToLocalStorage();
        };
};

const playerScores = new PlayerScores();


//GAME LOGIC//

//Game board:

class PlayingBoard {
    
    #playingBoardObject = {
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

    #gameEnded = false;


    choseField(player, field) {
            this.displayPlayerMove(player, field);
            this.disableClickOnPlayedField(field);
            this.tempDisableClickOnOtherFieldsDuringAnimation();
            whichPlayerLogic.nextRound();
            whichPlayerLogic.saveCurrentRoundAndPlayerToLocalStorage();
            setTimeout(() => {
                if (player === "Player 1") {
                    this.#playingBoardObject[field] = "O";

                } else {
                    this.#playingBoardObject[field] = "X";
                }
                this.checkWinningCondition(player);
                this.savePlayingBoardToLocalStorage();
                this.saveGameStateToLocalStorage();
            }, 500);
    };

    checkWinningCondition(player) {

            const board = this.#playingBoardObject;

            if ( //ROWS:
                (board["A1"] && board["A1"] === board["B1"] && board["A1"] === board["C1"]) ||
                (board["A2"] && board["A2"] === board["B2"] && board["A2"] === board["C2"]) ||
                (board["A3"] && board["A3"] === board["B3"] && board["A3"] === board["C3"]) ||
                //COLUMNS:
                (board["A1"] && board["A1"] === board["A2"] && board["A1"] === board["A3"]) ||
                (board["B1"] && board["B1"] === board["B2"] && board["B1"] === board["B3"]) ||
                (board["C1"] && board["C1"] === board["C2"] && board["C1"] === board["C3"]) ||
                //DIAGONAL:
                (board["A1"] && board["A1"] === board["B2"] && board["A1"] === board["C3"]) ||
                (board["C1"] && board["C1"] === board["B2"] && board["C1"] === board["A3"])) {
                this.handleWin(player);
            }
    };

    handleWin(player) {
            this.showPopUpWindow(player);
            eventListenerHandler.removeEventListenersFromPlayingBoard();
            playerScores.updateScore(player);
            playerScores.savePlayerPointsToLocalStorage();
            playerScores.showScoresOnPage();
            whichPlayerLogic._round = 1;
            this.#gameEnded = true;
    };

    showPopUpWindow(player) {
            const modal = document.querySelector("#modal");
            const modalHeader = document.querySelector("#modal h2");
            const firstModalParagraph = document.querySelector("#first-line");
            const secondModalParagraph = document.querySelector("#second-line");

            modalHeader.innerText = `Congratulations ${player}, you have won the game!`;

            firstModalParagraph.innerText = "Here`s a dad joke for your effort:";
            secondModalParagraph.innerText = `"${fetchAPI.dadJoke}"`;

            modal.showModal();
    };

    displayPlayerMove(player, field) {
            if (player === "Player 1") {
                document.querySelector(`#${field} svg circle`).classList.remove("hidden");
            } else {
                document.querySelector(`#${field} svg .line1`).classList.remove("hidden");
                document.querySelector(`#${field} svg .line2`).classList.remove("hidden");
            }
    };

    tempDisableClickOnOtherFieldsDuringAnimation() {
            document.querySelectorAll(".grid-item").forEach(element => element.classList.add("disable-click-all"));
            setTimeout(() => {
                document.querySelectorAll(".grid-item").forEach(element => element.classList.remove("disable-click-all"));
            }, 500);
    };

    disableClickOnPlayedField(field) {
            document.querySelector(`#${field}`).classList.add("disable-click");
    };

    enableClickOnAllFields() {
            document.querySelectorAll(".grid-item").forEach(element => element.classList.remove("disable-click"));
    };

    savePlayingBoardToLocalStorage() {
            const playingBoardSetup = this.#playingBoardObject;
            localStorage.setItem("Tic-Tac-Toe PlayingBoard", JSON.stringify(playingBoardSetup));
    };

    importPlayingBoardFromLocalStorage() {
            if (localStorage.getItem("Tic-Tac-Toe PlayingBoard")) {
                const boardSetup = JSON.parse(localStorage.getItem("Tic-Tac-Toe PlayingBoard"));
                this.#playingBoardObject = boardSetup;

                for (let field in boardSetup) {
                    if (boardSetup[field]) {

                        this.disableClickOnPlayedField(field);

                        if (boardSetup[field] === "O") {
                            document.querySelector(`#${field} svg circle`).classList.remove("hidden");
                        } else {
                            document.querySelector(`#${field} svg .line1`).classList.remove("hidden");
                            document.querySelector(`#${field} svg .line2`).classList.remove("hidden");
                        }
                    }
                }
            }
    };

    saveGameStateToLocalStorage() {
            localStorage.setItem("Tic-Tac-Toe GameEnded", this.#gameEnded);
    };

    importGameStateFromLocalStorage() {
        this.#gameEnded = JSON.parse(localStorage.getItem("Tic-Tac-Toe GameEnded"));
            if (this.#gameEnded) {
                eventListenerHandler.removeEventListenersFromPlayingBoard();
            }
    };

    newGameResetBoard() {

            whichPlayerLogic._round = 1;
            whichPlayerLogic._currentPlayer = "Player 1";

            const boardSetup = this.#playingBoardObject;
            for (let field in boardSetup) {
                if (boardSetup[field]) {
                    if (boardSetup[field] === "O") {
                        document.querySelector(`#${field} svg circle`).classList.add("hidden");
                    } else {
                        document.querySelector(`#${field} svg .line1`).classList.add("hidden");
                        document.querySelector(`#${field} svg .line2`).classList.add("hidden");
                    }
                }
            }

            if (this.#gameEnded) {
                eventListenerHandler.addEventListenersToPlayingBoard();
            }

            this.#gameEnded = false;

            this.#playingBoardObject = {
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
            fetchAPI.fetchDadJoke();
    };
};

const playingBoard = new PlayingBoard();


//Alternating players:

class WhichPlayerLogic {

    constructor() {
        this._round = 1;
        this._currentPlayer = "Player 1";
    }

    nextRound() {
            this._round++;
            this.alternatePlayers();
    };

    alternatePlayers() {
            if (this._round % 2 === 1) {
                this._currentPlayer = "Player 1";
            } else {
                this._currentPlayer = "Player 2";
            }
    };

    saveCurrentRoundAndPlayerToLocalStorage() {
            const currentRoundAndPlayer = {
                round: this._round,
                player: this._currentPlayer
            };
            localStorage.setItem("Tic-Tac-Toe RoundAndPlayer", JSON.stringify(currentRoundAndPlayer));
    };

    importCurrentRoundAndPlayerFromLocalStorage() {
            if (localStorage.getItem("Tic-Tac-Toe RoundAndPlayer")) {
                const currentRoundAndPlayer = JSON.parse(localStorage.getItem("Tic-Tac-Toe RoundAndPlayer"));
                this._round = currentRoundAndPlayer.round;
                this._currentPlayer = currentRoundAndPlayer.player;
            }
    };
};

const whichPlayerLogic = new WhichPlayerLogic();



//Fetch API//

class FetchAPI {

    #dadJoke = null;
    
    fetchDadJoke() {

        const url = "https://api.api-ninjas.com/v1/dadjokes?limit=1";
        fetch(url, {
            headers: {
                'X-Api-Key': 'l6OOWd+mSRT7PJialtqkUQ==ai1bCtCXuqTka7oR'
            }
        })
            .then(res => {
                if (!res.ok) {
                    throw new Error("Network response was not OK");
                }
                return res.json();
            })
            .then(data => {
                this.#dadJoke = data[0].joke;
            })
            .catch(err => {
                console.log("Error: ", err);
            });
        };

    get dadJoke() {
        return this.#dadJoke;
    }
};

const fetchAPI = new FetchAPI();


//Event listeners//

class EventListenerHandler {

    passPlayDataForEventListener(item) {
            playingBoard.choseField(whichPlayerLogic._currentPlayer, item.currentTarget.id);
    };

    addEventListenersToPlayingBoard() {
            document.querySelectorAll(".grid-item").forEach(item => item.addEventListener("click", this.passPlayDataForEventListener));
    };

    removeEventListenersFromPlayingBoard() {
            document.querySelectorAll(".grid-item").forEach(item => item.removeEventListener("click", this.passPlayDataForEventListener));
    };

    addResetScoreEventListener() {
            document.querySelector("#resetButton").addEventListener("click", () => {
                playerScores.resetScores();
            });
    };

    addNewGameEventListener() {
            document.querySelector("#newGameButton").addEventListener("click", () => {
                playingBoard.newGameResetBoard();
            });
    };

    addModalCloseButtonEventListener() {
            document.querySelector(".close-button").addEventListener("click", () => {
                const modal = document.querySelector("#modal");
                modal.close();
            });
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
fetchAPI.fetchDadJoke();

