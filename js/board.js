import { Card } from "./card.js";

export class Board {
  constructor(contentType) {
    this.cards = [];
    this.flippedCards = [];
    this.matchedPairs = 0;
    this.totalPairs = 8; // We'll use 8 pairs of fruits
    this.contentType = contentType;
    this.boardElement = document.getElementById("game-board");
    this.initializeBoard();
  }

  initializeBoard() {
    this.boardElement.innerHTML = "";
    this.cards = [];
    this.flippedCards = [];
    this.matchedPairs = 0;

    let allValues;
    switch (this.contentType) {
      case "fruits":
        allValues = Card.getAllFruits();
        break;
      case "numbers":
        allValues = Card.getAllNumbers();
        break;
      case "images":
        allValues = Card.getAllImages();
        break;
      default:
        allValues = Card.getAllFruits(); // Default to fruits if content type is invalid
    }

    // Randomly select 8 unique values
    const selectedValues = this.getRandomValues(allValues, this.totalPairs);

    // Create pairs of cards with selected values
    const cardValues = [...selectedValues, ...selectedValues];

    // Shuffle the cards
    this.shuffleArray(cardValues);

    // Create and add cards to the board
    cardValues.forEach((value, index) => {
      const card = new Card(value, index, this.contentType);
      this.cards.push(card);
      this.boardElement.appendChild(card.element);
    });
  }

  getRandomValues(allValues, count) {
    const shuffled = [...allValues];
    this.shuffleArray(shuffled);
    return shuffled.slice(0, count);
  }

  async showAllCardsBriefly() {
    // Flip all cards
    this.cards.forEach((card) => {
      if (!card.isFlipped) {
        card.flip();
      }
    });

    // Wait for 2 seconds
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Flip all cards back
    this.cards.forEach((card) => {
      if (card.isFlipped) {
        card.flip();
      }
    });
  }

  shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
  }

  flipCard(card) {
    if (this.flippedCards.length === 2) return;
    if (card.isFlipped || card.isMatched) return;

    card.flip();
    this.flippedCards.push(card);

    if (this.flippedCards.length === 2) {
      this.checkMatch();
    }
  }

  checkMatch() {
    const [card1, card2] = this.flippedCards;

    if (card1.value === card2.value) {
      this.handleMatch(card1, card2);
    } else {
      this.handleMismatch(card1, card2);
    }
  }

  handleMatch(card1, card2) {
    card1.match();
    card2.match();
    this.matchedPairs++;
    this.flippedCards = [];

    if (this.matchedPairs === this.totalPairs) {
      this.onGameComplete();
    }
  }

  handleMismatch(card1, card2) {
    setTimeout(() => {
      card1.flip();
      card2.flip();
      this.flippedCards = [];
    }, 1000);
  }

  reset() {
    this.cards.forEach((card) => card.reset());
    this.flippedCards = [];
    this.matchedPairs = 0;
  }

  onGameComplete() {
    const event = new CustomEvent("gameComplete");
    document.dispatchEvent(event);
  }
}
