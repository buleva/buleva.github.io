var firstToneEx1;
var secondToneEx1;
let toneLengthEx1 = 0.7;
let pauseLengthEx1 = 0.2;
var answerGiven = false;
var buttonDelay = 0;
var lastClick = 0;
var oscType;
var currentHTMLFile;
var soundeffectCorrect;
var soundeffectWrong;
let intervalArray = [0.9707, 1.0293];


function playExercise1(freq, start, stop, fadeInTime, fadeOutTime) {
        const osc = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        let outputGain;
        outputGain = localStorage.getItem('volume')/100;
        osc.connect(gainNode).connect(audioContext.destination);
        osc.frequency.value = freq;
        osc.type = "sine";
        gainNode.gain.value = 0.001;
        osc.start(audioContext.currentTime + start);
        gainNode.gain.linearRampToValueAtTime(0.001, audioContext.currentTime + start);
        gainNode.gain.exponentialRampToValueAtTime(outputGain, audioContext.currentTime + start + fadeInTime);
        gainNode.gain.linearRampToValueAtTime(outputGain, audioContext.currentTime + stop - fadeOutTime)
        gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + stop);
        osc.stop(audioContext.currentTime + stop);
}


function nextExercise1() {
    if (lastClick <= Date.now()-buttonDelay) { 
        firstToneEx1 = getRndInteger(100,400); //define good range of freqs
        secondToneEx1 = getRndFromArray(intervalArray)*firstToneEx1;
        document.getElementById('feedback_img').src = '../pictures/questionmark.png';
        playExercise1(firstToneEx1, 0, toneLengthEx1, 0.05, 0.05);
        playExercise1(secondToneEx1, toneLengthEx1+pauseLengthEx1, 2*toneLengthEx1+pauseLengthEx1, 0.05, 0.05)
        answerGiven = false;
        lastClick = Date.now();
        buttonDelay = (2*toneLengthEx1+pauseLengthEx1)*1000;
        localStorage.setItem('firstTone', firstToneEx1);
        localStorage.setItem('secondTone', secondToneEx1);
    }
}

function repeatExercise1() {
    if (lastClick <= Date.now()-buttonDelay) {
        firstToneEx1 = localStorage.getItem('firstToneEx1');
        secondToneEx1 = localStorage.getItem('secondToneEx1');
        playExercise1(firstToneEx1, oscType, 0, toneLengthEx1, 0.05, 0.05);
        playExercise1(secondToneEx1, oscType, toneLengthEx1+pauseLengthEx1, 2*toneLengthEx1+pauseLengthEx1, 0.05, 0.05)        
        lastClick = Date.now();
        buttonDelay = (2*toneLengthEx1+pauseLengthEx1)*1000;
        if (!answerGiven) {
            document.getElementById('feedback_img').src = '../pictures/questionmark.png';
        }
    }
}


// answer buttons
function higher() {
    if (!answerGiven) {
        if (firstToneEx1 < secondToneEx1) {
            document.getElementById('feedback_img').src = '../pictures/correct.png';
            playCorrectSoundeffect();
        } else {
            showCorrectAnswer(firstToneEx1, secondToneEx1);
        }
        answerGiven = true;
    }
}  

function lower() {
    if (!answerGiven) {
        if (firstToneEx1 > secondToneEx1) {
            document.getElementById('feedback_img').src = '../pictures/correct.png';
            playCorrectSoundeffect();
        } else {
            showCorrectAnswer(firstToneEx1, secondToneEx1);
        }
        answerGiven = true;
    }
}




// initialize variables
const AudioContext = window.AudioContext || window.webkitAudioContext;
const audioContext = new AudioContext();
var answerGiven = false;
var buttonDelay = 0;
var lastClick = 0;
var soundeffectCorrect = new Audio('../sounds/correct.wav');
var soundeffectWrong = new Audio('../sounds/wrong.wav');

// finish js look through!!

function updateButton(button_id, design) {
    button = document.getElementById(button_id);
    if (design=='active') {
        button.style.backgroundColor = 'white';
        button.style.color = 'var(--cyan)';
    } else {
        button.style.backgroundColor = '';
        button.style.color = '';
    }
}


// outsourced functions

function getRndInteger(min, max) {
  return Math.floor(Math.random() * (max - min + 1) ) + min;
}

function getRndFromArray(Array) {
    return Array[Math.floor(Math.random()*Array.length)];
}


function showCorrectAnswer(firstTone, secondTone) {
    if (firstTone > secondTone) {
        document.getElementById('feedback_img').src = '../pictures/lower.png';
    } else if (firstTone == secondTone) {
        document.getElementById('feedback_img').src = '../pictures/equal.png';
    } else {
        document.getElementById('feedback_img').src = '../pictures/higher.png';
    }
    if (localStorage.getItem('soundeffects')=='true') {
        soundeffectWrong.volume = localStorage.getItem('volume')/100;
        soundeffectWrong.play();
    }
}

function playCorrectSoundeffect() {
    soundeffectCorrect.volume = localStorage.getItem('volume')/100;
    soundeffectCorrect.play();
}

