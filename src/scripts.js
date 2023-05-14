var firstTone;
var secondTone;
let toneLength = 0.7;
let pauseLength = 0.2;
var oscType = "sine";
var soundeffectCorrect;
var soundeffectWrong;
let intervalArray = [0.9707, 1.0293];
const AudioContext = window.AudioContext || window.webkitAudioContext;
const audioContext = new AudioContext();
var answerGiven = false;
var buttonDelay = 0;
var lastClick = 0;
var soundeffectCorrect = new Audio('./sounds/correct.wav');
var soundeffectWrong = new Audio('./sounds/wrong.wav');


function play(freq, start, stop, fadeInTime, fadeOutTime) {
        const osc = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        osc.connect(gainNode).connect(audioContext.destination);
        osc.frequency.value = freq;
        osc.type = oscType;
        gainNode.gain.value = 0.001;
        osc.start(audioContext.currentTime + start);
        gainNode.gain.linearRampToValueAtTime(0.001, audioContext.currentTime + start);
        gainNode.gain.exponentialRampToValueAtTime(1, audioContext.currentTime + start + fadeInTime);
        gainNode.gain.linearRampToValueAtTime(1, audioContext.currentTime + stop - fadeOutTime)
        gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + stop);
        osc.stop(audioContext.currentTime + stop);
}

function next() {
    if (lastClick <= Date.now()-buttonDelay) { 
        firstTone = getRndInteger(100,400); //define good range of freqs
        secondTone = getRndFromArray(intervalArray)*firstTone;
        document.getElementById('feedback_img').src = './images/questionmark.png';
        play(firstTone, 0, toneLength, 0.05, 0.05);
        play(secondTone, toneLength+pauseLength, 2*toneLength+pauseLength, 0.05, 0.05);
        answerGiven = false;
        lastClick = Date.now();
        buttonDelay = (2*toneLength+pauseLength)*1000;
        localStorage.setItem('firstTone', firstTone);
        localStorage.setItem('secondTone', secondTone);
    }
}

function repeat() {
    if (lastClick <= Date.now()-buttonDelay) {
        if (localStorage.getItem('firstTone') == '') {localStorage.setItem('firstTone', 250)}
        if (localStorage.getItem('secondTone') == '') {localStorage.setItem('secondTone', 242.675)}
        firstTone = localStorage.getItem('firstTone');
        secondTone = localStorage.getItem('secondTone');
        play(firstTone, 0, toneLength, 0.05, 0.05);
        play(secondTone, toneLength+pauseLength, 2*toneLength+pauseLength, 0.05, 0.05);        
        lastClick = Date.now();
        buttonDelay = (2*toneLength+pauseLength)*1000;
        if (!answerGiven) {
            document.getElementById('feedback_img').src = './images/questionmark.png';
        }
    }
}

function higher() {
    if (!answerGiven) {
        if (firstTone < secondTone) {
            document.getElementById('feedback_img').src = './images/checkmark.png';
            soundeffectCorrect.play();
        } else {
            showCorrectAnswer(firstTone, secondTone);
        }
        answerGiven = true;
    }
}  

function lower() {
    if (!answerGiven) {
        if (firstTone > secondTone) {
            document.getElementById('feedback_img').src = './images/checkmark.png';
            soundeffectCorrect.play();
        } else {
            showCorrectAnswer(firstTone, secondTone);
        }
        answerGiven = true;
    }
}

function getRndInteger(min, max) {
  return Math.floor(Math.random() * (max - min + 1) ) + min;
}

function getRndFromArray(Array) {
    return Array[Math.floor(Math.random()*Array.length)];
}

function showCorrectAnswer(firstTone, secondTone) {
    if (firstTone > secondTone) {
        document.getElementById('feedback_img').src = './images/arrow.down.png';
    } else {
        document.getElementById('feedback_img').src = './images/arrow.up.png';
    }
    soundeffectWrong.play();
}