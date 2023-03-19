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
const loadGame = () => {
    createCards();

    cards = document.querySelectorAll(".card");

    playGameButtonElem.addEventListener("click", () => startGame());
};

const chooseCard = (card) => {
    if (canChooseCard()) {
        evaluateCardChoice(card);
        flipCard(card, false);

        setTimeout(() => {
            flipCard(false);
            updateStatusElement(currentGameStatusElem, "block", primaryColor, "Card positions revealed");
        }, 3000);

        cardsRevealed = true;
        // start 1:08:21
    }
};

const calculateScoreToAdd = (roundNum) => {
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
};

const calculateScore = () => {
    const scoreToAdd = calculateScoreToAdd(roundNum);
    score += scoreToAdd;
};

const updateScore = () => {
    calculateScore();
};

const updateStatusElement = (elem, display, color, innerHTML) => {
    elem.style.display = display;

    if (arguments.length > 2) {
        elem.style.color = color;
        elem.innerHTML = innerHTML;
    }
};

const outputChoiceFeedBack = (hit) => {
    if (hit) {
        updateStatusElement(currentGameStatusElem, "block", winColor, "Hit!! - Well Done!! :)");
    } else {
        updateStatusElement(currentGameStatusElem, "block", loseColor, "Missed!! :(");
    }
};

const evaluateCardChoice = (card) => {
    if (card.id === aceId) {
        updateScore();
        outputChoiceFeedBack(true);
    } else {
        outputChoiceFeedBack(false);
    }
};

const canChooseCard = () => {
    return gameInProgress === true && !shufflingInProgress && !cardsRevealed;
};

const initializeNewGame = () => {
    score = 0;
    roundNum = 0;
    shufflingInProgress = false;

    updateStatusElement(scoreContainerElem, "flex");
    updateStatusElement(roundContainerElem, "flex");
    updateStatusElement(scoreElem, "block", primaryColor, `Score <span class='badge'>${score}</span>`);
    updateStatusElement(roundElem, "block", primaryColor, `Score <span class='badge'>${round}</span>`);
};

const initializeNewRound = () => {
    roundNum++;
    playGameButtonElem.disabled = true;
    gameInProgress = true;
    shufflingInProgress = true;
    cardsRevealed = false;

    updateStatusElement(currentGameStatusElem, "block", primaryColor, "Shuffling...");
    updateStatusElement(roundElem, "block", primaryColor, `Score <span class='badge'>${round}</span>`);
};

const startGame = () => {
    initializeNewGame();
    startRound();
};

const startRound = () => {
    initializeNewRound();
    collectionCards();
    flipCards(true);
    shuffleCards();
};

const collectionCards = () => {
    transformGridArea(collapsedGridAreaTemplate);
    addCardsToGridAreaCell(cardCollectionCellClass);
};

const transformGridArea = (areas) => {
    cardContainerElem.style.gridTemplateAreas = areas;
};

const addCardsToGridAreaCell = (cellPositionClassName) => {
    const cellPositionElem = document.querySelector(cellPositionClassName);

    cards.forEach((card) => {
        addChildElement(cellPositionElem, card);
    });
};

const shuffleCards = () => {
    let shuffleCount = 0;
    const shuffle = () => {
        randomizeCardPositions();

        if (shuffleCount === 500) {
            clearInterval(id);
            dealCard();
        } else {
            shuffleCount++;
        }
    };
    const id = setInterval(shuffle, 12);
};

const randomizeCardPositions = () => {
    const random1 = Math.floor(Math.random() * numCards) + 1;
    const random2 = Math.floor(Math.random() * numCards) + 1;
    const temp = cardPositions[random1 - 1];

    cardPositions[random1 - 1] = cardPositions[random2 - 1];
    cardPositions[random2 - 1] = temp;
};

const dealCard = () => {
    addCardsToAppropriateCell();

    const areasTemplate = returnGridAreaMappedToCardPos();
    transformGridArea(areasTemplate);
};

const returnGridAreaMappedToCardPos = () => {
    let firstPart = "";
    let secondPart = "";
    let areas = "";

    cards.forEach((card, index) => {
        console.log(cardPositions[index]);
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
};

const addCardsToAppropriateCell = () => {
    cards.forEach((card) => {
        addCardToGridCell(card);
    });
};

const flipCard = (card, flipToBack) => {
    const innerCardElem = card.firstChild;
    console.log(innerCardElem);
    if (flipToBack && !innerCardElem.classList.contains("flip-it")) {
        innerCardElem.classList.add("flip-it");
    } else if (innerCardElem.classList.contains("flip-it")) {
        innerCardElem.classList.remove("flip-it");
    }
};

const flipCards = (flipToBack) => {
    cards.forEach((card, index) => {
        setTimeout(() => {
            flipCard(card, flipToBack);
        }, index * 100);
    });
};

const createCards = () => {
    cardObjectDefinitions.forEach((cardItem) => {
        createCard(cardItem);
    });
};

const initializeCardPositions = (card) => {
    cardPositions.push(card.id);
};

const createCard = (cardItem) => {
    const cardElem = createElement("div");
    const cardInnerElem = createElement("div");
    const cardFrontElem = createElement("div");
    const cardBackElem = createElement("div");

    const cardFrontImg = createElement("img");
    const cardBackImg = createElement("img");

    addClassToElement(cardElem, "card");
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
};

const createElement = (elemType) => {
    return document.createElement(elemType);
};

const addClassToElement = (elem, className) => {
    elem.classList.add(className);
};

const addIdToElement = (elem, id) => {
    elem.id = id;
};

const addSrcToImageElement = (imgElem, src) => {
    imgElem.src = src;
};

const addChildElement = (parentElem, childElem) => {
    parentElem.appendChild(childElem);
};

const addCardToGridCell = (card) => {
    const cardPositionClassName = mapCardIdToGridCell(card);
    const cardPosElem = document.querySelector(cardPositionClassName);

    addChildElement(cardPosElem, card);
};

const mapCardIdToGridCell = (card) => {
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
};

// initialize
loadGame();
