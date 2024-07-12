const absolads = [
    {
        name: "bernardo",
        birthMonth: "november",
        homeState: "oregon",
        nationality: "brazil"
    },
    {
        name: "andy",
        birthMonth: "july",
        homeState: "arizona",
        nationality: "china"
    },
    {
        name: "nick",
        birthMonth: "july",
        homeState: "arizona",
        nationality: "brazil"
    },
    {
        name: "huy",
        birthMonth: "november",
        homeState: "oregon",
        nationality: "vietnam"
    },
    {
        name: "raed",
        birthMonth: "november",
        homeState: "oregon",
        nationality: "bangladesh"
    },
    {
        name: "justin",
        birthMonth: "september",
        homeState: "arizona",
        nationality: "korea"
    },
    {
        name: "danny",
        birthMonth: "may",
        homeState: "oregon",
        nationality: "korea"
    },
    {
        name: "calvin",
        birthMonth: "november",
        homeState: "nevada",
        nationality: "mix"
    },
    {
        name: "trevor",
        birthMonth: "november",
        homeState: "arizona",
        nationality: "mix"
    },
    {
        name: "bao",
        birthMonth: "july",
        homeState: "oregon",
        nationality: "vietnam"
    }
]

const startButton = document.getElementById("start-btn");
const startNewButton = document.getElementById("start-new-btn");
const gameArea = document.getElementById("game-area");
const textInput = document.getElementById("text-input");
const guessTable = document.getElementById("guess-table");
const showResultsButton = document.getElementById("show-results-btn");

const winModal = document.getElementById("win-modal");
const winMsg = document.getElementById("win-msg");
const closeBtn = document.getElementById("close-btn");
const shareResultsBtn = document.getElementById("share-results-btn");

const date = new Date();
const minutes = date.getMinutes();
const day = date.getDate();
const month = date.getMonth() + 1;
const year = date.getFullYear();
//const formattedDate = `${month}${day}${year}${minutes}`;
const formattedDate = `${month}${day}${year}`;

let guessData = JSON.parse(localStorage.getItem("data")) || [];
let gameEnded = JSON.parse(localStorage.getItem("gameEnded")) || "false";
let storedDate = JSON.parse(localStorage.getItem("storedDate")) || 0; 
let mysteryAbsolad = {};
let numGuesses = 0;
startNewButton.classList.toggle('hidden');


const clearLocalStorageForNewDay = () => {
    guessData = [];
    storedDate = 0;
    localStorage.removeItem("data");
    localStorage.removeItem("gameEnded");
    localStorage.removeItem("storedDate");
    gameEnded = "false";
    localStorage.setItem("gameEnded", JSON.stringify(gameEnded));
}

const startGame = () => {
    console.log(storedDate);
    console.log(formattedDate);
    if(storedDate !== formattedDate) {
        clearLocalStorageForNewDay();
    }

    startButton.classList.toggle("hidden");
    //startNewButton.classList.toggle("hidden");
    gameArea.classList.toggle("hidden");

    mysteryAbsolad = generateRandomAbsolad();
    console.log(mysteryAbsolad);

    guessData.forEach(guessedPerson => {
        addRow(guessedPerson);
    })
    textInput.setAttribute('placeholder', numGuesses === 0 ? 'Start by entering any ABSOLAD' : `${3 - numGuesses} more guesses`);
    console.log(gameEnded);
    if (gameEnded !== "false") endGame(gameEnded);
}

const endGame = (winString) => {
    showResultsButton.classList.toggle("hidden");
    textInput.disabled = true;
    gameEnded = winString;
    localStorage.setItem("gameEnded", JSON.stringify(gameEnded));
    //Modal element
    displayModal();
    const message = winString = "won" ? "Congrats!" : "Fucking Idiot...";
    winMsg.innerText = message;
    console.log(message);
}

const displayModal = () => {
    winModal.classList.remove("hidden");
    winModal.style.display = "block";
}

const checkGuess = (input) => {
    const guessedPerson = absolads.find(person => person.name === input);
    addRow(guessedPerson);
    guessData.push(guessedPerson);
    localStorage.setItem("data", JSON.stringify(guessData));
    localStorage.setItem("storedDate", JSON.stringify(formattedDate));
    //console.log(JSON.stringify(guessData));
    if (guessedPerson === mysteryAbsolad) endGame("won");
    updateInput();
}

const updateInput = () => {
    // checks if the number of allowed guesses has been exceeded, and if so, end the game.
    // updates the text input placeholder to match situation
    if (numGuesses >= 3 && gameEnded != "won") {
        textInput.setAttribute('placeholder', `No more guesses allowed`);
        endGame("lost");
    } else {
        textInput.setAttribute('placeholder', `${3 - numGuesses} more guesses`);
    }
    
}

const addRow = (guess) => {
    numGuesses++;
    // new row element added to the table
    const newGuessRow = guessTable.insertRow(-1);
    // cell to contain the name of the guessed absolad
    let color = guess.name === mysteryAbsolad.name ? 'green' : 'red';
    addCell(newGuessRow, guess.name, color);
    // cell to contain the birth month of the guessed absolad
    color = guess.birthMonth === mysteryAbsolad.birthMonth ? 'green' : 'red';
    addCell(newGuessRow, guess.birthMonth, color);
    // cell to contain the home state of the guessed absolad
    color = guess.homeState === mysteryAbsolad.homeState ? 'green' : 'red';
    addCell(newGuessRow, guess.homeState, color);
    // cell to contain the nationality of the guessed absolad
    color = guess.nationality === mysteryAbsolad.nationality ? 'green' : 'red';
    addCell(newGuessRow, guess.nationality, color);
}


const addCell = (row, text, color) => {
    //create a new cell and set the values to the correct text/color, then append it to the row
    const newCell = document.createElement('td');
    newCell.innerText = text;
    newCell.style.backgroundColor = color;
    row.appendChild(newCell);
}


const seedRandom = (seed) => {
    let rand = Math.sin(seed) * 10000;
    return rand - Math.floor(rand);
}

const generateRandomAbsolad = () => {
    const randomIndex = Math.floor(absolads.length * seedRandom(formattedDate));
    return absolads[randomIndex];
}

showResultsButton.addEventListener("click", displayModal);

closeBtn.addEventListener("click", () => {
    winModal.style.display = "none";
});

startButton.addEventListener("click", startGame);

startNewButton.addEventListener("click", () => {
    clearLocalStorageForNewDay();
    startGame();
})

textInput.addEventListener('keypress', function (e) {
    if (e.key === 'Enter') {
        const userInput = textInput.value.trim().toLowerCase();
        if (!absolads.some(person => person.name === userInput)) {
            alert("Please input a valid Absolad");
        } else {
            checkGuess(userInput);
            // set the text input to a black box
            textInput.value = "";
        }
    }
})

const generateResultsString = () => {
    let resultsString = `ABSOLADLE ${month}/${day}/${year}: ${numGuesses}/3\n\n`;
    guessData.forEach(person => {
        resultsString += person.name === mysteryAbsolad.name ? '🟩 ' : '🟥 ';
        resultsString += person.birthMonth === mysteryAbsolad.birthMonth ? '🟩 ' : '🟥 ';
        resultsString += person.homeState === mysteryAbsolad.homeState ? '🟩 ' : '🟥 ';
        resultsString += person.nationality === mysteryAbsolad.nationality ? '🟩 ' : '🟥 ';
        resultsString += '\n';
    });
    return resultsString;
}

shareResultsBtn.addEventListener("click", () => {
    const resultsString = generateResultsString();
    navigator.clipboard.writeText(resultsString);
    alert("Results were copied to clipboard!");
})

