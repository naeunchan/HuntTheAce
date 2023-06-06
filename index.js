// variables
const cardObjectDefinitions = [
    {
        id: 1,
        imagePath: "./images/card-KingHearts.png",
    },
    {
        id: 2,
        imagePath: "./images/card-JackClubs.png",
    },
    {
        id: 3,
        imagePath: "./images/card-QueenDiamonds.png",
    },
    {
        id: 4,
        imagePath: "./images/card-AceSpades.png",
    },
];
const aceId = 4;
const playGameButtonElem = document.getElementById("playGame");
const cardBackImgPath = "./images/card-back-Blue.png";
const collapsedGridAreaTemplate = '"a a" "a a"';
const cardCollectionCellClass = ".card-pos-a";
const numCards = cardObjectDefinitions.length;
const currentGameStatusElem = document.querySelector(".current-status");
const winColor = "green";
const loseColor = "red";
const primaryColor = "black";

// elements
const cardContainerElem = document.querySelector(".card-container");
const scoreContainerElem = document.querySelector(".header-score-container");
const scoreElem = document.querySelector(".score");
const roundContainerElem = document.querySelector(".header-round-container");
const roundElem = document.querySelector(".round");

let cards = [];
let cardPositions = [];
let gameInProgress = false;
let shufflingInProgress = false;
let cardsRevealed = false;
let roundNum = 0;
let maxRounds = 4;
let score = 0;

// functions
function loadGame() {
    createCards();

    cards = document.querySelectorAll(".card");

    cardFlyInEffect();

    playGameButtonElem.addEventListener("click", () => startGame());

    updateStatusElement(scoreContainerElem, "none");
    updateStatusElement(roundContainerElem, "none");
}

function gameOver() {
    updateStatusElement(scoreContainerElem, "none");
    updateStatusElement(roundContainerElem, "none");

    const gameOverMessage = `Game Over! Final Score - <span class = "badge">${score}</span> Click 'Play Game' button to play again`;

    updateStatusElement(currentGameStatusElem, "block", primaryColor, gameOverMessage);

    gameInProgress = false;
    playGameButtonElem.disabled = false;
}

function endRound() {
    setTimeout(() => {
        if (roundNum == maxRounds) {
            gameOver();
            return;
        } else {
            startRound();
        }
    }, 3000);
}

function chooseCard(card) {
    if (canChooseCard()) {
        evaluateCardChoice(card);
        flipCard(card, false);

        setTimeout(() => {
            flipCards(false);
            updateStatusElement(currentGameStatusElem, "block", primaryColor, "Card positions revealed");

            endRound();
        }, 3000);

        cardsRevealed = true;
    }
}

function calculateScoreToAdd(roundNum) {
    switch (roundNum) {
        case 1:
            return 100;
        case 2:
            return 50;
        case 3:
            return 25;
        default:
            return10;
    }
}

function calculateScore() {
    const scoreToAdd = calculateScoreToAdd(roundNum);
    score += scoreToAdd;
}

function updateScore() {
    calculateScore();
    updateStatusElement(scoreElem, "block", primaryColor, `<span class="badge">${score}</span>`);
}

function updateStatusElement(elem, display, color, innerHTML) {
    elem.style.display = display;

    if (arguments.length > 2) {
        elem.style.color = color;
        elem.innerHTML = innerHTML;
    }
}

function outputChoiceFeedBack(hit) {
    if (hit) {
        updateStatusElement(currentGameStatusElem, "block", winColor, "Hit!! - Well Done!! :)");
    } else {
        updateStatusElement(currentGameStatusElem, "block", loseColor, "Missed!! :(");
    }
}

function evaluateCardChoice(card) {
    if (parseInt(card.id) === parseInt(aceId)) {
        updateScore();
        outputChoiceFeedBack(true);
    } else {
        outputChoiceFeedBack(false);
    }
}

function canChooseCard() {
    return gameInProgress === true && !shufflingInProgress && !cardsRevealed;
}

function initializeNewGame() {
    score = 0;
    roundNum = 0;
    shufflingInProgress = false;

    updateStatusElement(scoreContainerElem, "flex");
    updateStatusElement(roundContainerElem, "flex");
    updateStatusElement(scoreElem, "block", primaryColor, `Score <span class='badge'>${score}</span>`);
    updateStatusElement(roundElem, "block", primaryColor, `Round <span class='badge'>${roundNum}</span>`);
}

function initializeNewRound() {
    roundNum++;
    playGameButtonElem.disabled = true;
    gameInProgress = true;
    shufflingInProgress = true;
    cardsRevealed = false;

    updateStatusElement(currentGameStatusElem, "block", primaryColor, "Shuffling...");
    updateStatusElement(roundElem, "block", primaryColor, `Round <span class='badge'>${roundNum}</span>`);
}

function startGame() {
    initializeNewGame();
    startRound();
}

function startRound() {
    initializeNewRound();
    collectionCards();
    flipCards(true);
    shuffleCards();
}

function collectionCards() {
    transformGridArea(collapsedGridAreaTemplate);
    addCardsToGridAreaCell(cardCollectionCellClass);
}

function transformGridArea(areas) {
    cardContainerElem.style.gridTemplateAreas = areas;
}

function addCardsToGridAreaCell(cellPositionClassName) {
    const cellPositionElem = document.querySelector(cellPositionClassName);

    cards.forEach((card) => {
        addChildElement(cellPositionElem, card);
    });
}

function removeShuffleClasses() {
    cards.forEach((card) => {
        card.classList.remove("shuffle-left");
        card.classList.remove("shuffle-right");
    });
}

function cardFlyInEffect() {
    const id = setInterval(flyIn, 3);
    let cardCount = 0;

    let count = 0;

    function flyIn() {
        count++;

        if (cardCount === numCards) {
            clearInterval(id);
        }

        if (count === 1 || count === 250 || count === 500 || count === 750) {
            cardCount++;
            let card = document.getElementById(cardCount);
            card.classList.remove("fly-in");
        }
    }
}

function animateShuffle(shuffleCount) {
    const random1 = Math.floor(Math.random() * numCards) + 1;
    const random2 = Math.floor(Math.random() * numCards) + 1;

    let card1 = document.getElementById(random1);
    let card2 = document.getElementById(random2);

    if (shuffleCount % 4 === 0) {
        card1.classList.toggle("shuffle-left");
        card1.style.zIndex = 100;
    }

    if (shuffleCount % 10 === 0) {
        card2.classList.toggle("shuffle-right");
        card2.style.zIndex = 200;
    }
}

function shuffleCards() {
    let shuffleCount = 0;
    const shuffle = () => {
        randomizeCardPositions();
        animateShuffle(shuffleCount);

        if (shuffleCount === 500) {
            clearInterval(id);
            shufflingInProgress = false;
            removeShuffleClasses();
            dealCard();
            updateStatusElement(currentGameStatusElem, "block", primaryColor, "Please click the card that you think is the Ace of Spades...");
        } else {
            shuffleCount++;
        }
    };
    const id = setInterval(shuffle, 12);
}

function randomizeCardPositions() {
    const random1 = Math.floor(Math.random() * numCards) + 1;
    const random2 = Math.floor(Math.random() * numCards) + 1;
    const temp = cardPositions[random1 - 1];

    cardPositions[random1 - 1] = cardPositions[random2 - 1];
    cardPositions[random2 - 1] = temp;
}

function dealCard() {
    addCardsToAppropriateCell();

    const areasTemplate = returnGridAreaMappedToCardPos();
    transformGridArea(areasTemplate);
}

function returnGridAreaMappedToCardPos() {
    let firstPart = "";
    let secondPart = "";
    let areas = "";

    cards.forEach((card, index) => {
        switch (cardPositions[index]) {
            case "1":
                areas += "a ";
                break;
            case "2":
                areas += "b ";
                break;
            case "3":
                areas += "c ";
                break;
            case "4":
                areas += "d ";
                break;
        }

        if (index === 1) {
            firstPart = areas.substring(0, areas.length - 1);
            areas = "";
        } else if (index === 3) {
            secondPart = areas.substring(0, areas.length - 1);
        }
    });

    return `"${firstPart}" "${secondPart}"`;
}

function addCardsToAppropriateCell() {
    cards.forEach((card) => {
        addCardToGridCell(card);
    });
}

function flipCard(card, flipToBack) {
    const innerCardElem = card.firstChild;

    if (flipToBack && !innerCardElem.classList.contains("flip-it")) {
        innerCardElem.classList.add("flip-it");
    } else if (innerCardElem.classList.contains("flip-it")) {
        innerCardElem.classList.remove("flip-it");
    }
}

function flipCards(flipToBack) {
    cards.forEach((card, index) => {
        setTimeout(() => {
            flipCard(card, flipToBack);
        }, index * 100);
    });
}

function createCards() {
    cardObjectDefinitions.forEach((cardItem) => {
        createCard(cardItem);
    });
}

function attachClickEventHandlerToCard(card) {
    card.addEventListener("click", () => chooseCard(card));
}

function initializeCardPositions(card) {
    cardPositions.push(card.id);
}

function createCard(cardItem) {
    const cardElem = createElement("div");
    const cardInnerElem = createElement("div");
    const cardFrontElem = createElement("div");
    const cardBackElem = createElement("div");

    const cardFrontImg = createElement("img");
    const cardBackImg = createElement("img");

    addClassToElement(cardElem, "card");
    addClassToElement(cardElem, "fly-in");
    addIdToElement(cardElem, cardItem.id);

    addClassToElement(cardInnerElem, "card-inner");
    addClassToElement(cardFrontElem, "card-front");
    addClassToElement(cardBackElem, "card-back");

    addSrcToImageElement(cardBackImg, cardBackImgPath);
    addSrcToImageElement(cardFrontImg, cardItem.imagePath);

    addClassToElement(cardBackImg, "card-img");
    addClassToElement(cardFrontImg, "card-img");

    addChildElement(cardFrontElem, cardFrontImg);
    addChildElement(cardBackElem, cardBackImg);

    addChildElement(cardInnerElem, cardFrontElem);
    addChildElement(cardInnerElem, cardBackElem);

    addChildElement(cardElem, cardInnerElem);

    addCardToGridCell(cardElem);
    initializeCardPositions(cardElem);
    attachClickEventHandlerToCard(cardElem);
}

function createElement(elemType) {
    return document.createElement(elemType);
}

function addClassToElement(elem, className) {
    elem.classList.add(className);
}

function addIdToElement(elem, id) {
    elem.id = id;
}

function addSrcToImageElement(imgElem, src) {
    imgElem.src = src;
}

function addChildElement(parentElem, childElem) {
    parentElem.appendChild(childElem);
}

function addCardToGridCell(card) {
    const cardPositionClassName = mapCardIdToGridCell(card);
    const cardPosElem = document.querySelector(cardPositionClassName);

    addChildElement(cardPosElem, card);
}

function mapCardIdToGridCell(card) {
    switch (card.id) {
        case "1":
            return ".card-pos-a";
        case "2":
            return ".card-pos-b";
        case "3":
            return ".card-pos-c";
        case "4":
            return ".card-pos-d";
    }
}

// initialize
loadGame();
