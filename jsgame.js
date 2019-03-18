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

// Get deck
const deck = document.querySelector('.deck');
// Get cards
const cards = [].slice.call(deck.children);
        //.children ประมาณใช้เช็ค มั้งบอกไม่ถูก

// Create list of card symbols

var cardSymbols = ['youtube', 'instagram',
    'facebook', 'twitter', 'github', 'line',
    'youtube', 'instagram',
    'facebook', 'twitter', 'github', 'line',];

// List opened cards
let openCards = [];

//open card wrong
let moves = 0;

// Number of matches. Max is 8
let matches = 0;

//Total second sinced game start
let elapsedsec = 0;
let hour = 0;
let min = 0;
let sec = 0;

// Timer
let timer = undefined;
/*undefined ยังไม่ได้มอบค่าให้มันหรือยังไม่ได้ระบุค่า 
ต่างจากnullตรงมันระบุค่ามาแล้วว่าเป็นค่าnull*/
// Game status
let gameStarted = false;

//Event listeners
deck.addEventListener('click', openCard);
restartBtn.addEventListener('click', restartGame);
modalCloseBtn.addEventListener('click', closeModal);
modalReplayBtn.addEventListener('click', restartGame);

/* ---- Function Main Game --- */

restartGame();

//Function add Open&Show Card
function openCard(event) {

    startTimer();

    var target = event.target;
    //ใช้ค้นหาหรืออ้างอิง พาเร้นนั้นๆ
    const parent = target.parentElement;
    //เช็ค่วาelementนี้มีการaddclassมารึยัง

    if (parent.classList.contains('card')) {
        target = parent;
    }

    console.log(target, parent);

    //includes เอาไว้เปรียบเทียบว่าเหมือนกันรึป่าว
    if (!openCards.includes(target)) {
        target.classList.add('open', 'show');
        //เพิ่มเข้าไป
        openCards.push(target);
        checkMatch();
    }
}

function startTimer() {
    if (!gameStarted) {
        gameStarted = true;
        timer = setInterval(setTime, 1000);
        //1000 ms = 1sec ค่าความเร็วที่จะแสดงผล มั้งน่าจะใช่55
    }
}

function stopTimer() {
    gameStarted = false;
    clearInterval(timer);
}

function setTime() {
    let remainderSeconds = ++elapsedsec;
    hour = parseInt(remainderSeconds / 3600);
    timerHours.textContent = stringifyTime(hour);
    remainderSeconds = remainderSeconds % 3600;
    min = parseInt(remainderSeconds / 60)
    timerMins.textContent = stringifyTime(min);
    remainderSeconds = remainderSeconds % 60;
    sec = remainderSeconds;
    timerSeconds.textContent = stringifyTime(sec);
}

// Function remove 'open' & 'show'
function closeCard(card) {
    setTimeout(() => {
        card.classList.remove('open', 'show');
    }, 500)
    // => เหมือนfunction()
}


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
            // === เช็ค ว่าเป็นTypeเดียวกันด้วยหรือเปล่า
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
        movesTxt.textContent = ' Moves';
    } else {
        movesTxt.textContent = ' Moves';
    }
}


function incrementMatches() {
    matches++;
}

function checkGameWin() {
    if (matches === 6) {
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

    // Reset New game
    moves = 0;
    movesCount.textContent = moves;

    matches = 0;


    elapsedsec = 0;
    hour = 0;
    min = 0;
    sec = 0;
    timerHours.textContent = '00';
    timerMins.textContent = '00';
    timerSeconds.textContent = '00';

    stopTimer();
}

function resetDeck() {
    openCards = [];

    cardSymbols = shuffle(cardSymbols);
    /*---ForEach ลูปวนอาเรย์---*/
    cards.forEach((card, index) => {
        // Remove classes
        card.classList.remove('open', 'show', 'match', 'bounceIn');
        // Remove symbols  == เอาสัญลักษณ์ ออกรีเซ็ต
        removeClassByPrefix(card.children[0], 'fa-');

        // Attach new symbols to cards == เพิ่มสัญลักษณ์เข้าไปใหม่
        const symbol = `fa-${cardSymbols[index]}`;
        // ` สัญลักษณ์ นี้แทนค่าตัวแปลเข้าไปได้เลยดีกว่า'' สะดวกกว่า
        card.children[0].classList.add(symbol);
    });
}

function openModal() {
    modalHours.textContent = hour > 0 ? `${hour} hours, ` : '';
    modalMins.textContent = min > 0 ? `${min} minutes, ` : '';
    modalSeconds.textContent = `${sec} seconds`;
    modalMoves.textContent = `${moves} moves`;
    modal.style.display = 'block';
}

function closeModal() {
    modal.style.display = 'none';
}

// Helper Function

function removeClassByPrefix(el, prefix, replace = '') {
    var regx = new RegExp('\\b' + prefix + '(.*)?\\b', 'g');
    el.className = el.className.replace(regx, replace);
    return el;
    /*
    . = ทุกตัวอักษร ยกเว้นขึ้นบรรทัดใหม่
    * = >= 0
    ? = 0 or 1
    g   Perform a global match (find all matches rather than stopping after the first match)
    \d  Find a digit    
    \s  Find a whitespace character
    \b Find a match at the beginning or at the end of a word
    */
}


//Shuffle function from http://stackoverflow.com/a/2450976

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


function stringifyTime(val) {
    var valString = val + '';
    return valString.length >= 2 ? `${val}` : `0${val}`;
}