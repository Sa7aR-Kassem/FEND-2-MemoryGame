/*
 * Create a list that holds all of your cards
 */

// Deck
const iconsArray = ['fa-diamond', 'fa-paper-plane-o', 'fa-anchor', 'fa-bolt', 'fa-cube', 'fa-anchor', 'fa-leaf', 'fa-bicycle', 'fa-diamond', 'fa-paper-plane-o', 'fa-anchor', 'fa-bolt', 'fa-cube', 'fa-anchor', 'fa-leaf', 'fa-bicycle'],
    deck = document.querySelector('.deck');

let openedCards = [],
    matchedCardsArr = [];
//score panel
const scorePanel = document.querySelector(".score-panel");
// Timer
let timerOn = false,
    second = 0,
    minute = 0,
    hour = 0,
    interval;
const timer = document.querySelector(".timer");
// Restart
const restart = document.querySelector(".restart");
// Moves
let moves = 0;
const movesCounter = document.querySelector(".moves");
// star Rating 
const stars = document.querySelector('.stars').children;
const starsForRate = document.querySelector('.stars');
// Modal
const modal = document.querySelector('.modal');
const timeModal = document.querySelector('.time-modal');
const ratingModal = document.querySelector('.rating-modal');
const movesModal = document.querySelector('.moves-modal');
const btnModal = document.querySelector('.btn-modal');

/*
 * Display the cards on the page
 *   - shuffle the list of cards using the provided "shuffle" method below
 *   - loop through each card and create its HTML
 *   - add each card's HTML to the page
 */

// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
    var currentIndex = array.length,
        temporaryValue, randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}

createCards();

// Create cards board and append symbls randomly
function createCards() {
    deck.innerHTML = '';
    // create ul for cards
    let shuffledArr = shuffle(iconsArray);
    let fragment = document.createDocumentFragment();
    for (let i = 0; i < shuffledArr.length; i++) {
        let li = document.createElement('li');
        li.classList.add('card');
        li.innerHTML = `<i class="fa ${shuffledArr[i]}" ></i>`;
        fragment.appendChild(li);
        li.addEventListener('click', onCardClicked);
    }
    deck.appendChild(fragment)

}


/*
 * set up the event listener for a card. If a card is clicked:
 *  - display the card's symbol (put this functionality in another function that you call from this one)
 *  - add the card to a *list* of "open" cards (put this functionality in another function that you call from this one)
 *  - if the list already has another card, check to see if the two cards match
 *    + if the cards do match, lock the cards in the open position (put this functionality in another function that you call from this one)
 *    + if the cards do not match, remove the cards from the list and hide the card's symbol (put this functionality in another function that you call from this one)
 *    + increment the move counter and display it on the page (put this functionality in another function that you call from this one)
 *    + if all cards have matched, display a message with the final score (put this functionality in another function that you call from this one)
 */

/****************************************************
 ****************** Card Clicked ********************
 ****************************************************/
function onCardClicked(e) {
    let selectedCard = e.target;
    if (selectedCard.classList.contains("card") &&
        !selectedCard.classList.contains("open", "show", "match")) {
        // to start the timer once 
        if (timerOn === false) {
            startTimer();
            timerOn = true;
        }
        // add open & show class to the opened cards
        selectedCard.classList.add('open', 'show');
        // push to opened cards to an array
        openedCards.push(selectedCard);
        checkOpenedCards();
    }
}

/****************************************************
 ****************** Start Timer *********************
 ****************************************************/
function startTimer() {
    interval = setInterval(function () {
        timer.innerHTML = hour + " hour : " + minute + " min : " + second + " sec";
        second++;
        if (second == 60) {
            minute++;
            second = 0;
        }
        if (minute == 60) {
            hour++;
            minute = 0;
        }
    }, 1000);
}

/****************************************************
 ****************** Check Opened Cards **************
 ****************************************************/
function checkOpenedCards() {
    if (openedCards.length == 2) {
        // add class stop prevent to prevent click
        deck.classList.add("stop-event");
        // increase move numbers
        increaseMoves();
        // check if the 2 cards matchec or not
        if (openedCards[0].innerHTML == openedCards[1].innerHTML) {
            matchedCards();
        } else {
            setTimeout(notMatchedCards, 1000);
        }
    }
    winnigGame();
}

/****************************************************
 ****************** Increase Moves ******************
 ****************************************************/
function increaseMoves() {
    moves++;
    if (moves > 1) {
        movesCounter.innerHTML = `${moves} Moves`;
    } else {
        movesCounter.innerHTML = `${moves} Move`;
    }

    starRating();
}

/****************************************************
 ****************** Matched Cards *******************
 ****************************************************/
function matchedCards() {
    // add match classes from both cards
    openedCards[0].classList.add('match', 'stop-event');
    openedCards[1].classList.add('match', 'stop-event');
    // push both cards to the matchedCards array
    matchedCardsArr.push(openedCards[0]);
    matchedCardsArr.push(openedCards[1]);
    // remove cards from checkOpenedCards array
    openedCards = [];
    deck.classList.remove("stop-event");
}


/****************************************************
 ****************** Not Matched Cards ***************
 ****************************************************/
function notMatchedCards() {
    // add unmatched classes from both cards
    openedCards[0].classList.add("unmatch");
    openedCards[1].classList.add("unmatch");
    setTimeout(function () {
        // remove open & show classes from both cards
        openedCards[0].classList.remove("open", "show", "unmatch");
        openedCards[1].classList.remove("open", "show", "unmatch");
        // remove cards from checkOpenedCards array
        openedCards = [];
    }, 1000)
    deck.classList.remove("stop-event");
}

/****************************************************
 ****************** Star Rating ********************
 ****************************************************/
function starRating() {
    if (moves > 8 && moves < 12) {
        for (i = 0; i < 3; i++) {
            if (i > 1) {
                console.log(stars[i]);
                stars[i].classList.add('visibility');
            }
        }
    } else if (moves > 13) {
        for (i = 0; i < 3; i++) {
            if (i > 0) {
                stars[i].classList.add('visibility');
            }
        }
    }
}

/****************************************************
 ****************** Wining Game ********************
 ****************************************************/
function winnigGame() {
    //when the player finish the game
    if (matchedCardsArr.length === 16) {
        // to add the stats to the modal
        timeModal.innerText = timer.innerText;
        ratingModal.innerHTML = starsForRate.innerHTML;
        movesModal.innerHTML = movesCounter.innerHTML.slice(0, 3);
        //stop the timer and show the modal
        clearInterval(interval);
        setTimeout(function () {
            modal.classList.add('is-active');
            scorePanel.classList.add('visibility');
            deck.style.display = 'none';
        }, 1000);
    }
}

/****************************************************
 ****************** Restart Game ********************
 ****************************************************/
function restartGame() {
    timerOn = false;
    timer.innerHTML = 0 + " hour : " + 0 + " min : " + 0 + " sec";
    moves = 0;
    movesCounter.innerHTML = `0 Moves`;
    matchedCards = [];
    checkOpenedCards = [];
    createCards();
    clearInterval(interval);
    for (const star of stars) {
        star.classList.remove('visibility');
    }
}

// to restart  the game when the player click on the restart icon
restart.addEventListener("click", restartGame);


btnModal.addEventListener('click', function () {
    restartGame();
    scorePanel.classList.remove('visibility');
    setTimeout(function () {
        deck.style.display = 'flex';
        // to close the modal and restart the game
        modal.classList.remove('is-active');
    }, 1000);
    // restartGame();
    timerOn = false;
})