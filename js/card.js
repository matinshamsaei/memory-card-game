export class Card {
  static getAllFruits() {
    return [
      "🍎",
      "🍐",
      "🍊",
      "🍋",
      "🍌",
      "🍉",
      "🍇",
      "🍓",
      "🍈",
      "🍒",
      "🍑",
      "🥭",
      "🍍",
      "🥥",
      "🥝",
      "🍅",
    ];
  }

  constructor(value, index) {
    this.value = value;
    this.index = index;
    this.isFlipped = false;
    this.isMatched = false;
    this.element = this.createElement();
  }

  createElement() {
    const card = document.createElement("div");
    card.className = "card";
    card.dataset.index = this.index;

    const cardInner = document.createElement("div");
    cardInner.className = "card-inner";

    const cardFront = document.createElement("div");
    cardFront.className = "card-front";
    cardFront.textContent = this.value;

    const cardBack = document.createElement("div");
    cardBack.className = "card-back";
    cardBack.textContent = "?";

    cardInner.appendChild(cardFront);
    cardInner.appendChild(cardBack);
    card.appendChild(cardInner);

    return card;
  }

  flip() {
    this.isFlipped = !this.isFlipped;
    this.element.classList.toggle("flipped");
  }

  match() {
    this.isMatched = true;
    this.element.classList.add("matched");
  }

  reset() {
    this.isFlipped = false;
    this.isMatched = false;
    this.element.classList.remove("flipped", "matched");
  }
}
