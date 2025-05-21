let playerCards = []; // Player's cards is set to an empty array
let dealerCards = [];
let playerScore = 0; // Player's score is set to 0
let dealerScore = 0;
let dealerCardsRevealed = false; // Flag to check if dealer's cards are revealed

const suits = ["♠", "♣", "♥", "♦"]; // Array of suits
const values = [
  //const means that the variable is block-scoped and cannot be redeclared
  "A",
  "2",
  "3",
  "4",
  "5",
  "6",
  "7",
  "8",
  "9",
  "10",
  "J",
  "Q",
  "K",
]; // Array of card values

function getRandomCard() {
  const suit = suits[Math.floor(Math.random() * suits.length)]; // Randomly select a suit using Math.random() and Math.floor
  // Math.random() generates a random number between 0 and 1, which is multiplied by the length of the suits array to get a random index
  // Math.floor() rounds down to the nearest whole number
  // This ensures that the index is always a valid number within the bounds of the array
  const value = values[Math.floor(Math.random() * values.length)];
  return { suit, value };
}

function getCardValue(card) {
  if (["J", "Q", "K"].includes(card.value)) return 10; // Face cards are worth 10 // The includes() method checks if the value is one of the face cards
  if (card.value === "A") return 11; // Ace is worth 11 // If the value is an Ace, it returns 11
  return parseInt(card.value); //parseInt() converts the string value to an integer
}

function updateUI() {
  document.getElementById("player-cards").innerHTML = playerCards
    .map((card) => renderCard(card))
    .join("");
  document.getElementById("dealer-cards").innerHTML = dealerCards //getElementById("dealer-cards") is the id of the dealer cards
    .map((card, index) => {
      //this line maps over the dealer cards and returns a new array of HTML strings
      // Hide second dealer card if dealerCardsRevealed is false and index === 1
      if (!dealerCardsRevealed && index === 1) {
        //index is the index of the card in the array
        return renderCard(card, true);
      } else {
        return renderCard(card);
      }
    })
    .join("");
  document.getElementById("player-score").textContent = `Score: ${playerScore}`;

  // Show dealer score only if cards revealed; else hide or show '?'
  document.getElementById("dealer-score").textContent = dealerCardsRevealed
    ? `Score: ${dealerScore}`
    : "Score: ?";
}

function renderCard(card, ishidden = false) {
  if (ishidden) {
    return `<img src="svg-cards/card_back_red.svg" alt="Hidden Card" class="card-img" />`;
  }
  // Normalize suit names to file naming
  const suitMap = {
    "♠": "spades", // Map the suit symbols to their respective names map means that the suit symbols are replaced with their corresponding names
    "♣": "clubs",
    "♥": "hearts",
    "♦": "diamonds",
  };

  const valueMap = {
    A: "ace",
    J: "jack",
    Q: "queen",
    K: "king",
  };

  const suit = suitMap[card.suit];
  const value = valueMap[card.value] || card.value;

  const filename = `${value}_of_${suit}.svg`;

  return `<img src="svg-cards/${filename}" alt="${card.value} of ${card.suit}" class="card-img" />`;
}

function calculateScore(cards) {
  let score = 0;
  let aces = 0;
  cards.forEach((card) => {
    const val = getCardValue(card);
    score += val;
    if (card.value === "A") aces += 1;
  });
  while (score > 21 && aces > 0) {
    score -= 10;
    aces -= 1;
  }
  return score;
}

function checkWinner() {
  if (playerScore > 21) return "Player Busts! Dealer Wins!";
  if (dealerScore > 21) return "Dealer Busts! Player Wins!";
  if (playerScore === 21) return "Blackjack! Player Wins!";
  if (dealerScore === 21) return "Blackjack! Dealer Wins!";
  if (playerScore > dealerScore && dealerScore >= 17) return "Player Wins!";
  if (dealerScore > playerScore && dealerScore >= 17) return "Dealer Wins!";
  if (dealerScore === playerScore && dealerScore >= 17) return "It's a Tie!";
  return "";
}

function dealInitialCards() {
  playerCards = [getRandomCard(), getRandomCard()];
  dealerCards = [getRandomCard(), getRandomCard()];
  playerScore = calculateScore(playerCards);
  dealerScore = calculateScore(dealerCards);
  updateUI();
}

function playerHit() {
  playerCards.push(getRandomCard());
  playerScore = calculateScore(playerCards);
  updateUI();
  const result = checkWinner();
  if (result) document.getElementById("result-text").textContent = result;
}

function dealerPlay() {
  dealerCardsRevealed = true; // Set the flag to true when dealer plays

  while (dealerScore < 17) {
    dealerCards.push(getRandomCard());
    dealerScore = calculateScore(dealerCards);
  }
  updateUI();

  const result = checkWinner();
  document.getElementById("result-text").textContent = result;
}

document.getElementById("hit-btn").addEventListener("click", playerHit);
document.getElementById("stand-btn").addEventListener("click", dealerPlay);
document.getElementById("restart-btn").addEventListener("click", () => {
  playerCards = [];
  dealerCards = [];
  playerScore = 0;
  dealerScore = 0;
  dealerCardsRevealed = false; // Reset the flag
  document.getElementById("result-text").textContent = "";
  dealInitialCards();
});

// Start game
dealInitialCards(); // Deal initial cards when the page loads
