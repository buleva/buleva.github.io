var firstToneEx2;
var secondToneEx2;
var toneLengthEx2;
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
    if (localStorage.getItem('equalTonesEx2') == 'true') {
        document.getElementById('equalButton').style.display = 'block';
    } else {
        document.getElementById('equalButton').style.display = 'none';
    }
}

//TODO remember current level button and change css
function updateLevelButtons() {
    var button1 = document.getElementById('level1');
    var button2 = document.getElementById('level2');
    var button3 = document.getElementById('level3');
    var button4 = document.getElementById('level4');
    switch (localStorage.getItem('currentLevelEx2')) {
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
    document.getElementById('tone_length_slider').value = localStorage.getItem('toneLengthEx2');
    document.getElementById('tone_length_input_field').value = document.getElementById('tone_length_slider').value;
    document.getElementById('volume_slider').value = localStorage.getItem('volume');
    document.getElementById('volume_input_field').value = localStorage.getItem('volume');
    isChecked = localStorage.getItem('equalTonesEx2');
    isTrue = isChecked == 'true';
    document.getElementById('checkbox_equal_tones').checked = isTrue;
    isChecked = localStorage.getItem('soundeffects');
    isTrue = isChecked == 'true';
    document.getElementById('checkbox_soundeffects').checked = isTrue;
    document.getElementById('dropdown_interval_size').value = localStorage.getItem('intervalSizeEx2');
    document.getElementById('dropdown_waveform').value = localStorage.getItem('waveformEx2');
    var x = document.getElementById('tone_length_slider').value/document.getElementById('tone_length_slider').max;
    x = x*100;
    var color = 'linear-gradient(90deg, var(--pink) '+x+'%, white '+x+'%)'
    document.getElementById('tone_length_slider').style.background = color;
    var x = document.getElementById('volume_slider').value/document.getElementById('volume_slider').max;
    x = x*100;
    var color = 'linear-gradient(90deg, var(--pink) '+x+'%, white '+x+'%)'
    document.getElementById('volume_slider').style.background = color;
}


function playExercise2(freq1, freq2, type, start, stop, fadeInTime, fadeOutTime) {
    const osc = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    let outputGain;
    outputGain = localStorage.getItem('volume')/100;
    osc.connect(gainNode).connect(audioContext.destination);
    osc.frequency.value = freq1;
    osc.type = type;
    gainNode.gain.value = 0.001;
    osc.start(audioContext.currentTime + start);
    gainNode.gain.linearRampToValueAtTime(0.001, audioContext.currentTime + start);
    gainNode.gain.exponentialRampToValueAtTime(outputGain, audioContext.currentTime + start + fadeInTime);
    osc.frequency.linearRampToValueAtTime(freq2, audioContext.currentTime + stop - fadeOutTime)
    gainNode.gain.linearRampToValueAtTime(outputGain, audioContext.currentTime + stop - fadeOutTime)
    gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + stop);
    osc.stop(audioContext.currentTime + stop);
}  

function nextExercise2() {
    let intervalArray;
    if (lastClick <= Date.now()-buttonDelay) {
        loadDefaults();
        toneLengthEx2 = parseFloat(parseFloat(localStorage.getItem('toneLengthEx2')).toFixed(2));
        oscType = localStorage.getItem('waveformEx2');
        switch (localStorage.getItem('intervalSizeEx2')) {
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
        firstToneEx2 = getRndInteger(100,400);
        if (localStorage.getItem('equalTonesEx2') == 'true') {
            intervalArray.push(1);
            secondToneEx2 = getRndFromArray(intervalArray)*firstToneEx2;
        } else {
            secondToneEx2 = getRndFromArray(intervalArray)*firstToneEx2;
        }
        document.getElementById('feedback_img').src = '../pictures/questionmark.png';
        playExercise2(firstToneEx2, secondToneEx2, oscType, 0, toneLengthEx2, 0.05, 0.05);
        answerGiven = false;
        lastClick = Date.now();
        buttonDelay = (toneLengthEx2)*1000;
        localStorage.setItem('firstToneEx2', firstToneEx2);
        localStorage.setItem('secondToneEx2', secondToneEx2);
    }
}

function repeatExercise2() {
    if (lastClick <= Date.now()-buttonDelay) {
        loadDefaults();
        firstToneEx2 = localStorage.getItem('firstToneEx2');
        secondToneEx2 = localStorage.getItem('secondToneEx2');
        toneLengthEx2 = parseFloat(parseFloat(localStorage.getItem('toneLengthEx2')).toFixed(2));
        oscType = localStorage.getItem('waveformEx2');
        playExercise2(firstToneEx2, secondToneEx2, oscType, 0, toneLengthEx2, 0.05, 0.05);
        lastClick = Date.now();
        buttonDelay = (toneLengthEx2)*1000;
        if (!answerGiven) {
            document.getElementById('feedback_img').src = '../pictures/questionmark.png';
        }
    }
}


// setting input funtions
function toneLengthSliderInput() {
    var input = document.getElementById('tone_length_slider').value;
    document.getElementById('tone_length_input_field').value = input;
    localStorage.setItem('toneLengthEx2', input);
    localStorage.setItem('currentLevelEx2', 0);
    updateLevelButtons();
    var x = input/document.getElementById('tone_length_slider').max;
    x = x*100;
    var color = 'linear-gradient(90deg, var(--pink) '+x+'%, white '+x+'%)'
    document.getElementById('tone_length_slider').style.background = color;
}

function toneLengthFieldInput(min, max) {
    var input = document.getElementById('tone_length_input_field').value;
    if ((input >= min) && (input <= max)) {
        document.getElementById('tone_length_slider').value = input;
        localStorage.setItem('toneLengthEx2', input);
        localStorage.setItem('currentLevelEx2', 0);
        updateLevelButtons();
    } else {
        document.getElementById('tone_length_input_field').value = localStorage.getItem('toneLengthEx2');
        alert('please enter a value between '+min+' and '+max);
    }
}

function equalTonesCheckboxInput() {
    localStorage.setItem('equalTonesEx2', document.getElementById('checkbox_equal_tones').checked);
    localStorage.setItem('currentLevelEx2', 0);
    updateLevelButtons();
}

function dropdownIntervalSizeInput() {
    localStorage.setItem('intervalSizeEx2', document.getElementById('dropdown_interval_size').value);
    localStorage.setItem('currentLevelEx2', 0);
    updateLevelButtons();
}

function dropdownWaveformInput() {
    localStorage.setItem('waveformEx2', document.getElementById('dropdown_waveform').value);
}

function levelButton(pToneLength, pEqualTones, pIntervalSize, plevel) {
    localStorage.setItem('toneLengthEx2', pToneLength);
    localStorage.setItem('equalTonesEx2', pEqualTones);
    localStorage.setItem('intervalSizeEx2', pIntervalSize);
    localStorage.setItem('currentLevelEx2', plevel);
    document.getElementById('tone_length_slider').value = pToneLength;
    document.getElementById('tone_length_input_field').value = pToneLength;
    document.getElementById('checkbox_equal_tones').checked = pEqualTones;
    document.getElementById('dropdown_interval_size').value = pIntervalSize;
    updateLevelButtons();
}

// answer buttons

function higher() {
    if (!answerGiven) {
        if (firstToneEx2 < secondToneEx2) {
            document.getElementById('feedback_img').src = '../pictures/correct.png';
            if (localStorage.getItem('soundeffects')=='true') {
                playCorrectSoundeffect();
            }        } else {
            showCorrectAnswer(firstToneEx2, secondToneEx2);
            if (localStorage.getItem('soundeffects')=='true') {
            }
        }
        answerGiven = true;
    }
}

function equal() {
    if (!answerGiven) {
        if (firstToneEx2 == secondToneEx2) {
            document.getElementById('feedback_img').src = '../pictures/correct.png';
            if (localStorage.getItem('soundeffects')=='true') {
                playCorrectSoundeffect();
            }
        } else {
            showCorrectAnswer(firstToneEx2, secondToneEx2);
            if (localStorage.getItem('soundeffects')=='true') {
            }
        }
        answerGiven = true;
    }
}    

function lower() {
    if (!answerGiven) {
        if (firstToneEx2 > secondToneEx2) {
            document.getElementById('feedback_img').src = '../pictures/correct.png';
            if (localStorage.getItem('soundeffects')=='true') {
                playCorrectSoundeffect();
            }        } else {
            showCorrectAnswer(firstToneEx2, secondToneEx2);
            if (localStorage.getItem('soundeffects')=='true') {
            }        }
        answerGiven = true;
    }
}

// keyboard shortcuts
document.addEventListener('keydown', function(key) {
    if (key.keyCode == 49) {
        if (currentHTMLFile=='Exercise') {
            repeatExercise2();
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
            if (localStorage.getItem('equalTonesEx2')=='true') {
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
            if (localStorage.getItem('equalTonesEx2')=='true') {
                higher();
            } else {
                nextExercise2();
            }        
        }
    }
});

document.addEventListener('keydown', function(key) {
    if (key.keyCode == 53) {
        if (currentHTMLFile=='Exercise') {
            if (localStorage.getItem('equalTonesEx2')=='true') {
                nextExercise2();
            }        
        }
    }
});

document.addEventListener('keydown', function(key) {
    if (key.keyCode == 32) {
        if (currentHTMLFile=='Exercise') {
            if (localStorage.getItem('equalTonesEx2')=='true') {
                nextExercise2();
            }        
        }
    }
});