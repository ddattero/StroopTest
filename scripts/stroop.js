//colors
const blue = "blue";
const red = "red";
const green = "green";
const purple = "purple";
const colors = [red, blue, green, purple];

//2d array, sub arrays are [wordText, colorOfWord, isCongruous]
var words = [];
const wordsInEachCategory = 5;
const listLength = 2 * wordsInEachCategory;
var currentIndex = 0;
var currentColor = null;
const wordIdx = 0;
const colorIdx = 1;
const isCongruousIdx = 2;

//time to select correct color, 0 index is congruous, 1 is incongruous
var times = [[],[]];
const congruousTimeIdx = 0;
const incongruousTimeIdx = 1;

//global variable for the display p
var display;




//run when page is loaded
async function main() {
    //sets the p display
    display = document.getElementById("display");

    let choices = document.getElementById("choices");

    let restart = document.getElementById("restart");

    let prompt = document.getElementById("prompt");
    
    restart.style.display = "none";

    choices.style.display = "inline-block";

    prompt.style.display = "inline-block";

    createWordList();

    //runs through the list, with pauses for the countdown inbetween
    for (let i = 0; i < listLength; i++) {
        await countdown();
        await showNextWord();
    }

    //gets the congruous and incongruous time averages
    var congruousAvg = 0;
    var incongruousAvg = 0;

    let timesLen = times[congruousTimeIdx].length;

    for (let i = 0; i < times[congruousTimeIdx].length; i++) {
        congruousAvg += times[congruousTimeIdx][i];
        incongruousAvg += times[incongruousTimeIdx][i];
    }
    
    congruousAvg /= timesLen;
    incongruousAvg /= timesLen;

    //displays the averages
    display.innerHTML = `Congruous: ${congruousAvg}ms<br>Incongruous: ${incongruousAvg}ms`

    choices.style.display = "none";

    prompt.style.display = "none";

    restart.style.display = "inline-block";
}

//gets a random color out of the choices
function randomColor() {

    let randInt = Math.floor(Math.random() * colors.length);

    return colors[randInt];
}

//creates a word list consisting of 5 incongruous and 5 congruous words
function createWordList() {

    for (let i = 0; i < listLength/2; i++) {
        //gets the random color of the congruous word
        let randColor = randomColor();
        //add it to the list
        words.push([randColor, randColor, true]);

        //gets the random colors of the incongruous word
        randColor = randomColor();
        tmp = [randColor, null, false];
        randColor = randomColor();
        
        //if both the random colors are the same, get new colors until they are not
        while (randColor == tmp[0]) {
            randColor = randomColor();
        }
        
        //add it to the list
        tmp[1] = randColor;
        words.push(tmp);
    }

    //shuffles the word list
    for (let i = 0; i < words.length; i++) {
        let randIdx = Math.floor(Math.random() * words.length);
        let tmp = words[randIdx];
        words[randIdx] = words[i];
        words[i] = tmp;
    }
}

//sleep for countdown
async function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

//counts down 3 seconds then shows the next word
async function countdown() {
    for (let cd = 3; cd >= 1; cd--) {
        display.innerHTML = cd;
        await sleep(1000);
    }

}

//waits for the correct color to be chosen
async function waitForSelection(color) {
    return new Promise(function (resolve, reject) {
        (function waitForColorMatch(){
            if (currentColor == color) {
                return resolve();
            }
            else {
                setTimeout(waitForColorMatch, 1);
            }
        })();
    });
}

//displays the next word
async function showNextWord() {
    //display the word and its color
    display.innerHTML = words[currentIndex][wordIdx];
    display.style.color = words[currentIndex][colorIdx];

    //starts the timer
    let timer = new Date().getTime();
    console.log('before');
    await waitForSelection(words[currentIndex][colorIdx]);

    //stops and saves the timer
    timer = new Date().getTime() - timer;

    currentColor = null;

    //add the timer into appropriate sub array of times
    if (words[currentIndex][isCongruousIdx]) {
        times[congruousTimeIdx].push(timer);
    }
    else {
        times[incongruousTimeIdx].push(timer);
    }

    //increment the index of the words array
    currentIndex++;

    display.style.color = "black";

}

//change the variable to the string of the color of the button
//pressed
function answerClick(color) {
    currentColor = color;
}
function blueClick() {
    answerClick(blue);
}

function redClick() {
    answerClick(red);
}

function greenClick() {
    answerClick(green);
}

function purpleClick() {
    answerClick(purple);
}