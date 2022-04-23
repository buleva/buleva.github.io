var firstToneEx1;
var secondToneEx1;
var toneLengthEx1;
var pauseLengthEx1;
var answerGiven = false;
var buttonDelay = 0;
var lastClick = 0;
var oscType;
var currentHTMLFile;
var soundeffectCorrect;
var soundeffectWrong;


// onload 
function onloadEx() {
    currentHTMLFile = 'Exercise';
    loadDefaults();
    if (localStorage.getItem('equalTonesEx1') == 'true') {
        document.getElementById('equalButton').style.display = 'block';
    } else {
        document.getElementById('equalButton').style.display = 'none';
    }
}

function updateLevelButtons() {
    var button1 = document.getElementById('level1');
    var button2 = document.getElementById('level2');
    var button3 = document.getElementById('level3');
    var button4 = document.getElementById('level4');
    switch (localStorage.getItem('currentLevelEx1')) {
        case '0':
            button1.style.backgroundColor = '';
            button1.style.color = '';
            button2.style.backgroundColor = '';
            button2.style.color = '';
            button3.style.backgroundColor = '';
            button3.style.color = '';
            button4.style.backgroundColor = '';
            button4.style.color = '';
            break;
        case '1':
            button1.style.backgroundColor = '#ffffff';
            button1.style.color = '#59B99D';
            button2.style.backgroundColor = '';
            button2.style.color = '';
            button3.style.backgroundColor = '';
            button3.style.color = '';
            button4.style.backgroundColor = '';
            button4.style.color = '';
            break;
        case '2':
            button1.style.backgroundColor = '';
            button1.style.color = '';
            button2.style.backgroundColor = '#ffffff';
            button2.style.color = '#59B99D';
            button3.style.backgroundColor = '';
            button3.style.color = '';
            button4.style.backgroundColor = '';
            button4.style.color = '';
            break;
        case '3':
            button1.style.backgroundColor = '';
            button1.style.color = '';
            button2.style.backgroundColor = '';
            button2.style.color = '';
            button3.style.backgroundColor = '#ffffff';
            button3.style.color = '#59B99D';
            button4.style.backgroundColor = '';
            button4.style.color = '';
            break;
        case '4':
            button1.style.backgroundColor = '';
            button1.style.color = '';
            button2.style.backgroundColor = '';
            button2.style.color = '';
            button3.style.backgroundColor = '';
            button3.style.color = '';
            button4.style.backgroundColor = '#ffffff';
            button4.style.color = '#59B99D';
            break;
        }
}

function onloadSettings() {
    var isChecked;
    var isTrue;
    updateLevelButtons();
    currentHTMLFile = 'Settings';
    document.getElementById('tone_length_slider').value = localStorage.getItem('toneLengthEx1');
    document.getElementById('tone_length_input_field').value = document.getElementById('tone_length_slider').value;
    document.getElementById('pause_length_slider').value = localStorage.getItem('pauseLengthEx1');
    document.getElementById('pause_length_input_field').value = document.getElementById('pause_length_slider').value;
    document.getElementById('volume_slider').value = localStorage.getItem('volume');
    document.getElementById('volume_input_field').value = localStorage.getItem('volume');
    isChecked = localStorage.getItem('equalTonesEx1');
    isTrue = isChecked == 'true';
    document.getElementById('checkbox_equal_tones').checked = isTrue;
    isChecked = localStorage.getItem('soundeffects');
    isTrue = isChecked == 'true';
    document.getElementById('checkbox_soundeffects').checked = isTrue;
    document.getElementById('dropdown_interval_size').value = localStorage.getItem('intervalSizeEx1');
    document.getElementById('dropdown_waveform').value = localStorage.getItem('waveformEx1');
}

//TODO put in script.js 
function playExercise1(freq, type, start, stop, fadeInTime, fadeOutTime) {
    const osc = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    let outputGain;
    outputGain = localStorage.getItem('volume')/100;
    osc.connect(gainNode).connect(audioContext.destination);
    osc.frequency.value = freq;
    osc.type = type;
    gainNode.gain.value = 0.001;
    osc.start(audioContext.currentTime + start);
    gainNode.gain.linearRampToValueAtTime(0.001, audioContext.currentTime + start);
    gainNode.gain.exponentialRampToValueAtTime(outputGain, audioContext.currentTime + start + fadeInTime);
    gainNode.gain.linearRampToValueAtTime(outputGain, audioContext.currentTime + stop - fadeOutTime)
    gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + stop);
    osc.stop(audioContext.currentTime + stop);
}

function nextExercise1() {
    let intervalArray;
    if (lastClick <= Date.now()-buttonDelay) {
        loadDefaults();
        toneLengthEx1 = parseFloat(parseFloat(localStorage.getItem('toneLengthEx1')).toFixed(2));
        pauseLengthEx1 = parseFloat(parseFloat(localStorage.getItem('pauseLengthEx1')).toFixed(2));
        oscType = localStorage.getItem('waveformEx1');
        switch (localStorage.getItem('intervalSizeEx1')) {
            case '50':
                intervalArray = [0.9707, 1.0293];
                break;
            case '30':
                intervalArray = [0.9825, 1.0175];
                break;
            case '20':
                intervalArray = [0.9884, 1.0116];
                break;
            case '10':
                intervalArray = [0.9942, 1.0058];
                break;
            case '5':
                intervalArray = [0.9971, 1.0029];
                break;
            case '3':
                intervalArray = [0.9983, 1.0017];
        }   
        firstToneEx1 = getRndInteger(100,400);
        if (localStorage.getItem('equalTonesEx1') == 'true') {
            intervalArray.push(1);
            secondToneEx1 = getRndFromArray(intervalArray)*firstToneEx1;
        } else {
            secondToneEx1 = getRndFromArray(intervalArray)*firstToneEx1;
        }
        document.getElementById('feedback_img').src = '../pictures/questionmark.png';
        if (pauseLengthEx1 == 0) {
            playExercise1(firstToneEx1, oscType, 0, toneLengthEx1, 0.05, 0.0);
            playExercise1(secondToneEx1, oscType, toneLengthEx1+pauseLengthEx1, 2*toneLengthEx1+pauseLengthEx1, 0.0, 0.05)
        } else {
            playExercise1(firstToneEx1, oscType, 0, toneLengthEx1, 0.05, 0.05);
            playExercise1(secondToneEx1, oscType, toneLengthEx1+pauseLengthEx1, 2*toneLengthEx1+pauseLengthEx1, 0.05, 0.05)
        }
        answerGiven = false;
        lastClick = Date.now();
        buttonDelay = (2*toneLengthEx1+pauseLengthEx1)*1000;
        localStorage.setItem('firstToneEx1', firstToneEx1);
        localStorage.setItem('secondToneEx1', secondToneEx1);
    }
}

function repeatExercise1() {
    if (lastClick <= Date.now()-buttonDelay) {
        loadDefaults();
        firstToneEx1 = localStorage.getItem('firstToneEx1');
        secondToneEx1 = localStorage.getItem('secondToneEx1');
        toneLengthEx1 = parseFloat(parseFloat(localStorage.getItem('toneLengthEx1')).toFixed(2));
        pauseLengthEx1 = parseFloat(parseFloat(localStorage.getItem('pauseLengthEx1')).toFixed(2));
        oscType = localStorage.getItem('waveformEx1');
        if (pauseLengthEx1 == 0) {
            playExercise1(firstToneEx1, oscType, 0, toneLengthEx1, 0.05, 0.0);
            playExercise1(secondToneEx1, oscType, toneLengthEx1+pauseLengthEx1, 2*toneLengthEx1+pauseLengthEx1, 0.0, 0.05)            
        } else {
            playExercise1(firstToneEx1, oscType, 0, toneLengthEx1, 0.05, 0.05);
            playExercise1(secondToneEx1, oscType, toneLengthEx1+pauseLengthEx1, 2*toneLengthEx1+pauseLengthEx1, 0.05, 0.05)        
        }
        lastClick = Date.now();
        buttonDelay = (2*toneLengthEx1+pauseLengthEx1)*1000;
        if (!answerGiven) {
            document.getElementById('feedback_img').src = '../pictures/questionmark.png';
        }
    }
}


// setting input funtions
function toneLengthSliderInput() {
    var input = document.getElementById('tone_length_slider').value;
    document.getElementById('tone_length_input_field').value = input;
    localStorage.setItem('toneLengthEx1', input);
    localStorage.setItem('currentLevelEx1', 0);
    updateLevelButtons();
}

function toneLengthFieldInput(min, max) {
    var input = document.getElementById('tone_length_input_field').value;
    if ((input >= min) && (input <= max)) {
        document.getElementById('tone_length_slider').value = input;
        localStorage.setItem('toneLengthEx1', input);
        localStorage.setItem('currentLevelEx1', 0);
        updateLevelButtons();
    } else {
        document.getElementById('tone_length_input_field').value = localStorage.getItem('toneLengthEx1');
        alert('please enter a value between '+min+' and '+max);
    }
}

function pauseLengthSliderInput() {
    var input = document.getElementById('pause_length_slider').value;
    document.getElementById('pause_length_input_field').value = input;
    localStorage.setItem('pauseLengthEx1', input);
    localStorage.setItem('currentLevelEx1', 0);
    updateLevelButtons();
}

function pauseLengthFieldInput(min, max) {
    var input = document.getElementById('pause_length_input_field').value;
    if ((input >= min) && (input <= max)) {
        document.getElementById('pause_length_slider').value = input;
        localStorage.setItem('pauseLengthEx1', input);
        localStorage.setItem('currentLevelEx1', 0);
        updateLevelButtons();
    } else {
        document.getElementById('pause_length_input_field').value = localStorage.getItem('pauseLengthEx1');
        alert('please enter a value between '+min+' and '+max);
    }
}

function equalTonesCheckboxInput() {
    localStorage.setItem('equalTonesEx1', document.getElementById('checkbox_equal_tones').checked);
    localStorage.setItem('currentLevelEx1', 0);
    updateLevelButtons();
}

function dropdownIntervalSizeInput() {
    localStorage.setItem('intervalSizeEx1', document.getElementById('dropdown_interval_size').value);
    localStorage.setItem('currentLevelEx1', 0);
    updateLevelButtons();
}

function dropdownWaveformInput() {
    localStorage.setItem('waveformEx1', document.getElementById('dropdown_waveform').value);
}

function levelButton(pToneLength, pPauseLength, pEqualTones, pIntervalSize, plevel) {
    localStorage.setItem('toneLengthEx1', pToneLength);
    localStorage.setItem('pauseLengthEx1', pPauseLength);
    localStorage.setItem('equalTonesEx1', pEqualTones);
    localStorage.setItem('intervalSizeEx1', pIntervalSize);
    localStorage.setItem('currentLevelEx1', plevel);
    document.getElementById('tone_length_slider').value = pToneLength;
    document.getElementById('tone_length_input_field').value = pToneLength;
    document.getElementById('pause_length_slider').value = pPauseLength;
    document.getElementById('pause_length_input_field').value = pPauseLength;
    document.getElementById('checkbox_equal_tones').checked = pEqualTones;
    document.getElementById('dropdown_interval_size').value = pIntervalSize;
    updateLevelButtons();
}

// answer buttons

function higher() {
    if (!answerGiven) {
        if (firstToneEx1 < secondToneEx1) {
            document.getElementById('feedback_img').src = '../pictures/correct.png';
            if (localStorage.getItem('soundeffects')=='true') {
                playCorrectSoundeffect();
            }        } else {
            showCorrectAnswer(firstToneEx1, secondToneEx1);
            if (localStorage.getItem('soundeffects')=='true') {
            }
        }
        answerGiven = true;
    }
}

function equal() {
    if (!answerGiven) {
        if (firstToneEx1 == secondToneEx1) {
            document.getElementById('feedback_img').src = '../pictures/correct.png';
            if (localStorage.getItem('soundeffects')=='true') {
                playCorrectSoundeffect();
            }
        } else {
            showCorrectAnswer(firstToneEx1, secondToneEx1);
            if (localStorage.getItem('soundeffects')=='true') {
            }
        }
        answerGiven = true;
    }
}    

function lower() {
    if (!answerGiven) {
        if (firstToneEx1 > secondToneEx1) {
            document.getElementById('feedback_img').src = '../pictures/correct.png';
            if (localStorage.getItem('soundeffects')=='true') {
                playCorrectSoundeffect();
            }        } else {
            showCorrectAnswer(firstToneEx1, secondToneEx1);
            if (localStorage.getItem('soundeffects')=='true') {
            }        }
        answerGiven = true;
    }
}

// keyboard shortcuts

document.addEventListener('keydown', function(key) {
    if (key.keyCode == 49) {
        if (currentHTMLFile=='Exercise') {
            repeatExercise1();
        }
    }
});

document.addEventListener('keydown', function(key) {
    if (key.keyCode == 50) {
        if (currentHTMLFile=='Exercise') {
            lower();            
        }
    }
});

document.addEventListener('keydown', function(key) {
    if (key.keyCode == 51) {
        if (currentHTMLFile=='Exercise') {
            if (localStorage.getItem('equalTonesEx1')=='true') {
                equal();
            } else {
                higher();
            }        
        }

    }
});

document.addEventListener('keydown', function(key) {
    if (key.keyCode == 52) {
        if (currentHTMLFile=='Exercise') {
            if (localStorage.getItem('equalTonesEx1')=='true') {
                higher();
            } else {
                nextExercise1();
            }        
        }
    }
});

document.addEventListener('keydown', function(key) {
    if (key.keyCode == 53) {
        if (currentHTMLFile=='Exercise') {
            if (localStorage.getItem('equalTonesEx1')=='true') {
                nextExercise1();
            }        
        }
    }
});

document.addEventListener('keydown', function(key) {
    if (key.keyCode == 32) {
        if (currentHTMLFile=='Exercise') {
            if (localStorage.getItem('equalTonesEx1')=='true') {
                nextExercise1();
            }        
        }
    }
});