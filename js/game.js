import { Board } from "./board.js";

class Game {
  constructor() {
    this.board = new Board();
    this.moves = 0;
    this.timer = 0;
    this.timerInterval = null;
    this.isPlaying = false;
    this.bestScore = this.loadBestScore();
    this.gameHistory = this.loadGameHistory();

    this.initializeElements();
    this.initializeEventListeners();
    this.updateBestScore();
    this.renderGameHistory();
  }

  initializeElements() {
    this.movesElement = document.getElementById("moves");
    this.timerElement = document.getElementById("timer");
    this.bestScoreElement = document.getElementById("best-score");
    this.newGameButton = document.getElementById("new-game");
    this.playAgainButton = document.getElementById("play-again");
    this.closeModalButton = document.getElementById("close-modal");
    this.winModal = document.getElementById("win-modal");
    this.finalTimeElement = document.getElementById("final-time");
    this.finalMovesElement = document.getElementById("final-moves");
    this.historyList = document.getElementById("history-list");
  }

  initializeEventListeners() {
    // Card click events
    this.board.boardElement.addEventListener("click", (e) => {
      const cardElement = e.target.closest(".card");
      if (!cardElement || !this.isPlaying) return;

      const cardIndex = parseInt(cardElement.dataset.index);
      const card = this.board.cards[cardIndex];
      this.board.flipCard(card);
      this.incrementMoves();
    });

    // New game button
    this.newGameButton.addEventListener("click", () => this.startNewGame());

    // Play again button
    this.playAgainButton.addEventListener("click", () => {
      this.winModal.classList.remove("active");
      this.startNewGame();
    });

    // Close modal button
    this.closeModalButton.addEventListener("click", () => {
      this.winModal.classList.remove("active");
      this.resetGame();
      this.isPlaying = false;
    });

    // Game complete event
    document.addEventListener("gameComplete", () => this.handleGameComplete());
  }

  async startNewGame() {
    this.resetGame();
    await this.board.showAllCardsBriefly();
    this.isPlaying = true;
    this.startTimer();
  }

  resetGame() {
    this.moves = 0;
    this.timer = 0;
    this.updateMoves();
    this.updateTimer();
    this.board.initializeBoard();
    this.stopTimer();
  }

  incrementMoves() {
    this.moves++;
    this.updateMoves();
  }

  updateMoves() {
    this.movesElement.textContent = this.moves;
  }

  startTimer() {
    this.timerInterval = setInterval(() => {
      this.timer++;
      this.updateTimer();
    }, 1000);
  }

  stopTimer() {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
      this.timerInterval = null;
    }
  }

  updateTimer() {
    const minutes = Math.floor(this.timer / 60);
    const seconds = this.timer % 60;
    this.timerElement.textContent = `${minutes
      .toString()
      .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  }

  formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, "0")}:${remainingSeconds
      .toString()
      .padStart(2, "0")}`;
  }

  loadGameHistory() {
    const savedHistory = localStorage.getItem("memoryGameHistory");
    return savedHistory ? JSON.parse(savedHistory) : [];
  }

  saveGameHistory() {
    localStorage.setItem("memoryGameHistory", JSON.stringify(this.gameHistory));
  }

  addToHistory(time, moves) {
    const gameResult = {
      time,
      moves,
      date: new Date().toLocaleString(),
      id: Date.now(),
    };

    this.gameHistory.unshift(gameResult);
    // Keep only the last 5 games
    if (this.gameHistory.length > 5) {
      this.gameHistory.pop();
    }
    this.saveGameHistory();
    this.renderGameHistory();
  }

  renderGameHistory() {
    // Sort history by time (ascending)
    const sortedHistory = [...this.gameHistory].sort((a, b) => a.time - b.time);

    this.historyList.innerHTML = sortedHistory
      .map(
        (game, index) => `
      <div class="history-item ${index === 0 ? "best-result" : ""}">
        <span class="time">${this.formatTime(game.time)}</span>
        <span class="moves">${game.moves} moves</span>
        <span class="date">${game.date}</span>
      </div>
    `
      )
      .join("");
  }

  handleGameComplete() {
    if (!this.isPlaying) return; // Prevent multiple calls
    this.isPlaying = false;
    this.stopTimer();
    this.updateBestScore();
    this.addToHistory(this.timer, this.moves);
    this.showWinModal();
  }

  showWinModal() {
    this.finalTimeElement.textContent = this.formatTime(this.timer);
    this.finalMovesElement.textContent = this.moves;
    this.winModal.classList.add("active");
  }

  loadBestScore() {
    const savedScore = localStorage.getItem("memoryGameBestScore");
    return savedScore
      ? JSON.parse(savedScore)
      : { time: Infinity, moves: Infinity };
  }

  saveBestScore() {
    localStorage.setItem("memoryGameBestScore", JSON.stringify(this.bestScore));
  }

  updateBestScore() {
    if (
      this.timer < this.bestScore.time ||
      (this.timer === this.bestScore.time && this.moves < this.bestScore.moves)
    ) {
      this.bestScore = {
        time: this.timer,
        moves: this.moves,
      };
      this.saveBestScore();
    }
    this.bestScoreElement.textContent = this.formatTime(this.bestScore.time);
  }
}

// Initialize the game when the DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  new Game();
});
