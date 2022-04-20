// initialize variables
const AudioContext = window.AudioContext || window.webkitAudioContext;
const audioContext = new AudioContext();
var answerGiven = false;
var buttonDelay = 0;
var lastClick = 0;
var currentHTMLFile;
var soundeffectCorrect = new Audio('../sounds/correct.wav');
var soundeffectWrong = new Audio('../sounds/wrong.wav');

// onload functions
function onloadMenu() {
    currentHTMLFile = 'Menu';
}

function onloadSettingsMenu() {
    var isTrue;
    var isChecked;
    document.getElementById('volume_slider').value = localStorage.getItem('volume');
    document.getElementById('volume_input_field').value = localStorage.getItem('volume');
    isChecked = localStorage.getItem('soundeffects');
    isTrue = isChecked == 'true';
    document.getElementById('checkbox_soundeffects').checked = isTrue;
}

function onloadInfo() {
    currentHTMLFile = 'Info';
}


// outsourced functions

function getRndInteger(min, max) {
  return Math.floor(Math.random() * (max - min + 1) ) + min;
}

function getRndFromArray(Array) {
    return Array[Math.floor(Math.random()*Array.length)];
}

function loadDefaults() {
    // global
    if (!localStorage.getItem('soundeffects')) {
        localStorage.setItem('soundeffects', 'true');
    }
    if (!localStorage.getItem('volume')) {
        localStorage.setItem('volume', '100');
    }
    // exercise 1
    if (!localStorage.getItem('toneLengthEx1')) {
        localStorage.setItem('toneLengthEx1', '1');
    }
    if (!localStorage.getItem('pauseLengthEx1')) {
        localStorage.setItem('pauseLengthEx1', '0.5');
    }
    if (!localStorage.getItem('equalTonesEx1')) {
        localStorage.setItem('equalTonesEx1', 'false');
    }
    if (!localStorage.getItem('intervalSizeEx1')) {
        localStorage.setItem('intervalSizeEx1', '50');
    }
    if (!localStorage.getItem('firstToneEx1')) {
        localStorage.setItem('firstToneEx1', '440');
    }
    if (!localStorage.getItem('secondToneEx1')) {
        localStorage.setItem('secondToneEx1', '452.89');
    }
    if (!localStorage.getItem('waveformEx1')) {
        localStorage.setItem('waveformEx1', 'sine');
    }
    // exercise 2
    if (!localStorage.getItem('toneLengthEx2')) {
        localStorage.setItem('toneLengthEx2', '2');
    }
    if (!localStorage.getItem('equalTonesEx2')) {
        localStorage.setItem('equalTonesEx2', 'false');
    }
    if (!localStorage.getItem('intervalSizeEx2')) {
        localStorage.setItem('intervalSizeEx2', '50');
    }
    if (!localStorage.getItem('firstToneEx2')) {
        localStorage.setItem('firstToneEx2', '440');
    }
    if (!localStorage.getItem('secondToneEx2')) {
        localStorage.setItem('secondToneEx2', '452.89');
    }
    if (!localStorage.getItem('waveformEx2')) {
        localStorage.setItem('waveformEx2', 'sine');
    }
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

// settings
function volumeSliderInput() {
    var input = document.getElementById('volume_slider').value;
    document.getElementById('volume_input_field').value = input;
    localStorage.setItem('volume', input);
}

function volumeFieldInput(min, max) {
    var input = document.getElementById('volume_input_field').value;
    if ((input >= min) && (input <= max)) {
        document.getElementById('volume_slider').value = input;
        localStorage.setItem('volume', input);
    } else {
        document.getElementById('volume_input_field').value = localStorage.getItem('volume');
        alert('please enter a value between '+min+' and '+max);
    }
}

function soundeffectCheckboxInput() {
    localStorage.setItem('soundeffects', document.getElementById('checkbox_soundeffects').checked);
}