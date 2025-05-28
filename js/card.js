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

  static getAllNumbers() {
    return ["1", "2", "3", "4", "5", "6", "7", "8"];
  }

  static getAllImages() {
    return [
      "photo_2025-05-28_10-43-54.jpg",
      "photo_2025-05-28_10-43-16.jpg",
      "photo_2025-05-28_10-43-01.jpg",
      "photo_2025-05-28_10-42-36.jpg",
      "photo_2025-05-28_10-42-23.jpg",
      "photo_2025-05-28_10-42-14.jpg",
      "photo_2025-05-28_10-17-18.jpg",
      "photo_2025-05-28_10-14-24.jpg",
      "photo_2025-05-28_10-14-08.jpg",
      "photo_2025-05-28_10-14-00.jpg",
      "photo_2025-05-28_10-13-54.jpg",
      "photo_2025-05-28_10-13-40.jpg",
      "photo_2025-05-28_10-13-23.jpg",
      "photo_2025-05-28_10-13-11.jpg",
    ];
  }

  constructor(value, index, contentType) {
    this.value = value;
    this.index = index;
    this.contentType = contentType;
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

    if (this.contentType === "images") {
      const img = document.createElement("img");
      img.src = "images/" + this.value;
      img.alt = "Card Image";
      img.style.width = "100%";
      img.style.height = "100%";
      img.style.objectFit = "cover";
      cardFront.appendChild(img);
    } else {
      cardFront.textContent = this.value;
    }

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
