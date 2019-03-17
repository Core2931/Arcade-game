/* ----------- Variable declarations ----------- */

const stars = document.querySelectorAll('.star');
const movesCount = document.querySelector('.moves-count');
const movesTxt = document.querySelector('.moves-text');
const timerHours = document.querySelector('#timer .hours');
const timerMins = document.querySelector('#timer .minutes');
const timerSeconds = document.querySelector('#timer .seconds');
const restartBtn = document.querySelector('#restart');
const modal = document.querySelector('#simpleModal');
const modalCloseBtn = document.querySelector('.modal-close-btn');
const modalReplayBtn = document.querySelector('.modal-replay-btn');
const modalMoves = document.querySelector('.modal-body .moves-count');
const modalHours = document.querySelector('.modal-body .hours');
const modalMins = document.querySelector('.modal-body .mins');
const modalSeconds = document.querySelector('.modal-body .seconds');
const modalRating = document.querySelector('.modal-body .rating');

// Get deck
const deck = document.querySelector('.deck');
// Get list of cards
const cards = [].slice.call(deck.children);
// Create list of card symbols
let cardSymbols = ['js-square', 'html5', 'css3-alt',
    'python', 'react', 'angular', 'sass', 'less',
    'js-square', 'html5', 'css3-alt',
    'python', 'react', 'angular', 'sass', 'less'];

// List of opened cards
let openCards = [];

// Number of start
let rating = 3;

// Number of wrong moves
let moves = 0;

// Number of matches. Max is 8
let matches = 0;

// Total seconds elapsed since game start
let elapsedSeconds = 0;
let hour = 0;
let min = 0;
let sec = 0;

// Timer
let timer = undefined;
/*undefined ยังไม่ได้มอบค่าให้มันหรือยังไม่ได้ระบุค่า 
ต่างจากnullตรงมันระบุค่ามาแล้วว่าเป็นค่าnull*/

// Game status
let gameStarted = false;

/* ----------- Event listeners ----------- */

// Click event listener attached to cards
deck.addEventListener('click', openCard);

// Click event listener attached to restart button
restartBtn.addEventListener('click', restartGame);

// Click event listener attached to x button to close modal
modalCloseBtn.addEventListener('click', closeModal);

// Click event listener attached to modal's replay button to restart the game
modalReplayBtn.addEventListener('click', restartGame);

/* ----------- Main game logic ----------- */

// Start new game
restartGame();

// Function to add 'open' & 'show' classes to card
function openCard(event) {

    startTimer();

    var target = event.target;
    const parent = target.parentElement;
    if (parent.classList.contains('card')) {
        target = parent;
    }

    if (!openCards.includes(target)) {
        target.classList.add('open', 'show');
        openCards.push(target);
        checkMatch();
    }
}

function startTimer() {
    if (!gameStarted) {
        gameStarted = true;
        timer = setInterval(setTime, 1000);
    }
}

function stopTimer() {
    gameStarted = false;
    clearInterval(timer);
}

function setTime() {
    let remainderSeconds = ++elapsedSeconds;
    hour = parseInt(remainderSeconds / 3600);
    timerHours.textContent = stringifyTime(hour);
    remainderSeconds = remainderSeconds % 3600;
    min = parseInt(remainderSeconds / 60)
    timerMins.textContent = stringifyTime(min);
    remainderSeconds = remainderSeconds % 60;
    sec = remainderSeconds;
    timerSeconds.textContent = stringifyTime(sec);
}

// Function to remove 'open' & 'show' classes to card
function closeCard(card) {
    setTimeout(() => {
        card.classList.remove('open', 'show');
    }, 500)
}

// Function to add 'match' class to card
function matchCard(card) {
    setTimeout(() => {
        card.classList.add('match', 'bounceIn');
    }, 500)
}

function checkMatch() {
    const length = openCards.length;
    if (length === 2) {

        const last = openCards[1];
        const preLast = openCards[0];

        if (last.children[0].classList.toString() ===
            preLast.children[0].classList.toString()) {
            incrementMatches();
            matchCard(last);
            matchCard(preLast);
        } else {
            closeCard(last);
            closeCard(preLast);
        }
        incrementMove();
        openCards = [];
        checkGameWin();
    }
}

function incrementMove() {
    moves++;
    movesCount.textContent = moves;
    if (moves === 1) {
        movesTxt.textContent = ' Move';
    } else {
        movesTxt.textContent = ' Moves';
    }
    determineRating();
}

function determineRating() {
    if (moves === 17) {
        rating--;
        stars[2].classList.add('empty-star');
    } else if (moves === 26) {
        rating--;
        stars[1].classList.add('empty-star');
    } else if (moves === 34) {
        rating--;
        stars[0].classList.add('empty-star');
    }
}

function incrementMatches() {
    matches++;
}

function checkGameWin() {
    if (matches === 8) {
        stopTimer();
        openModal();
    }
}

function restartGame() {
    closeModal();
    resetScore();
    resetDeck();
}

function resetScore() {

    // Reset rating
    rating = 3;
    stars.forEach(star => removeClassByPrefix(star, 'empty-star'));

    // Reset moves
    moves = 0;
    movesCount.textContent = moves;

    // Reset matches
    matches = 0;

    // Reset time
    elapsedSeconds = 0;
    hour = 0;
    min = 0;
    sec = 0;
    timerHours.textContent = '00';
    timerMins.textContent = '00';
    timerSeconds.textContent = '00';

    // Stop timer
    stopTimer();
}

function resetDeck() {

    // Clear openedCards array
    openCards = [];

    // Shuffle symbols
    cardSymbols = shuffle(cardSymbols);

    // Iterate over all cards
    cards.forEach((card, index) => {
        // Remove classes
        card.classList.remove('open', 'show', 'match', 'bounceIn');
        // Remove symbols
        removeClassByPrefix(card.children[0], 'fa-');

        // Attach new symbols to cards
        const symbol = `fa-${cardSymbols[index]}`;
        card.children[0].classList.add(symbol);
    });
}

function openModal() {
    modalHours.textContent = hour > 0 ? `${hour} hours, ` : '';
    modalMins.textContent = min > 0 ? `${min} minutes, ` : '';
    modalSeconds.textContent = `${sec} seconds`;
    modalMoves.textContent = `${moves} moves`;
    modalRating.textContent = rating;
    modal.style.display = 'block';
}

function closeModal() {
    modal.style.display = 'none';
}

/* ----------- Helper functions ----------- */

/*
* @description Removes element's class based on pattern
*/
function removeClassByPrefix(el, prefix, replace = '') {
    var regx = new RegExp('\\b' + prefix + '(.*)?\\b', 'g');
    el.className = el.className.replace(regx, replace);
    return el;
}

/*
* @description Shuffle elements of array
*
* Shuffle function from http://stackoverflow.com/a/2450976
*/
function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}

/*
* @description Convert min, hour & seconds into string
*
* Shuffle function from http://stackoverflow.com/a/2450976
*/
function stringifyTime(val) {
    var valString = val + '';
    return valString.length >= 2 ? `${val}` : `0${val}`;
}