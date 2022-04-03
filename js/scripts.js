// initialize variables
const AudioContext = window.AudioContext || window.webkitAudioContext;
const audioContext = new AudioContext();
var firstTone;
var secondTone;
var toneLength;
var pauseLength;
var answerGiven = false;
var buttonDelay = 0;
var lastClick = 0;
var oscType;
var currentHTMLFile;
var soundeffectCorrect;
var soundeffectWrong;

// onload functions

function onloadIndex() {
    currentHTMLFile = 'Index';
    loadDefaults();
    if (localStorage.getItem('equalTones') == 'true') {
        document.getElementById('equalButton').style.display = 'block';
    } else {
        document.getElementById('equalButton').style.display = 'none';
    }
    soundeffectCorrect = new Audio('sounds/correct.wav');
    soundeffectWrong = new Audio('sounds/wrong.wav');
}

function onloadSettings() {
    var isChecked;
    var isTrue;
    currentHTMLFile = 'Settings';
    document.getElementById('tone_length_slider').value = localStorage.getItem('toneLength');
    document.getElementById('tone_length_input_field').value = document.getElementById('tone_length_slider').value;
    document.getElementById('pause_length_slider').value = localStorage.getItem('pauseLength');
    document.getElementById('pause_length_display').innerHTML = document.getElementById('pause_length_slider').value;
    document.getElementById('volume_slider').value = localStorage.getItem('volume');
    document.getElementById('volume_display').innerHTML = document.getElementById('volume_slider').value;
    isChecked = localStorage.getItem('equalTones');
    isTrue = isChecked == 'true';
    document.getElementById('checkbox_equal_tones').checked = isTrue;
    isChecked = localStorage.getItem('soundeffects');
    isTrue = isChecked == 'true';
    document.getElementById('checkbox_soundeffects').checked = isTrue;
    document.getElementById('dropdown_interval_size').value = localStorage.getItem('intervalSize');
    document.getElementById('dropdown_waveform').value = localStorage.getItem('waveform');
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
    if (!localStorage.getItem('toneLength')) {
        localStorage.setItem('toneLength', '1');
    }
    if (!localStorage.getItem('pauseLength')) {
        localStorage.setItem('pauseLength', '0.5');
    }
    if (!localStorage.getItem('volume')) {
        localStorage.setItem('volume', '100');
    }
    if (!localStorage.getItem('equalTones')) {
        localStorage.setItem('equalTones', 'false');
    }
    if (!localStorage.getItem('intervalSize')) {
        localStorage.setItem('intervalSize', '50');
    }
    if (!localStorage.getItem('firstTone')) {
        localStorage.setItem('firstTone', '440');
    }
    if (!localStorage.getItem('secondTone')) {
        localStorage.setItem('secondTone', '452.89');
    }
    if (!localStorage.getItem('waveform')) {
        localStorage.setItem('waveform', 'sine');
    }
    if (!localStorage.getItem('soundeffects')) {
        localStorage.setItem('soundeffects', 'true');
    }
}

function play(freq, type, start, stop, fadeInTime, fadeOutTime) {
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

function showCorrectAnswer() {
    if (firstTone > secondTone) {
        document.getElementById('feedback_img').src = 'pictures/lower.png';
    } else if (firstTone == secondTone) {
        document.getElementById('feedback_img').src = 'pictures/equal.png';
    } else {
        document.getElementById('feedback_img').src = 'pictures/higher.png';
    }
    soundeffectWrong.volume = localStorage.getItem('volume')/100;
    soundeffectWrong.play();
}


// front page button functions

function repeat() {
    if (lastClick <= Date.now()-buttonDelay) {
        loadDefaults();
        firstTone = localStorage.getItem('firstTone');
        secondTone = localStorage.getItem('secondTone');
        toneLength = parseFloat(parseFloat(localStorage.getItem('toneLength')).toFixed(2));
        pauseLength = parseFloat(parseFloat(localStorage.getItem('pauseLength')).toFixed(2));
        oscType = localStorage.getItem('waveform');
        if (pauseLength == 0) {
            play(firstTone, oscType, 0, toneLength, 0.05, 0.0);
            play(secondTone, oscType, toneLength+pauseLength, 2*toneLength+pauseLength, 0.0, 0.05)            
        } else {
            play(firstTone, oscType, 0, toneLength, 0.05, 0.05);
            play(secondTone, oscType, toneLength+pauseLength, 2*toneLength+pauseLength, 0.05, 0.05)        
        }
        lastClick = Date.now();
        buttonDelay = (2*toneLength+pauseLength)*1000;
        if (!answerGiven) {
            document.getElementById('feedback_img').src = 'pictures/questionmark.png';
        }
    }
}

function lower() {
    if (!answerGiven) {
        if (firstTone > secondTone) {
            document.getElementById('feedback_img').src = 'pictures/correct.png';
            if (localStorage.getItem('soundeffects')=='true') {
                soundeffectCorrect.volume = localStorage.getItem('volume')/100;
                soundeffectCorrect.play();
            }        } else {
            showCorrectAnswer();
            if (localStorage.getItem('soundeffects')=='true') {
            }        }
        answerGiven = true;
    }
}

function equal() {
    if (!answerGiven) {
        if (firstTone == secondTone) {
            document.getElementById('feedback_img').src = 'pictures/correct.png';
            if (localStorage.getItem('soundeffects')=='true') {
                soundeffectCorrect.volume = localStorage.getItem('volume')/100;
                soundeffectCorrect.play();
            }
        } else {
            showCorrectAnswer();
            if (localStorage.getItem('soundeffects')=='true') {
            }
        }
        answerGiven = true;
    }
}    

function higher() {
    if (!answerGiven) {
        if (firstTone < secondTone) {
            document.getElementById('feedback_img').src = 'pictures/correct.png';
            if (localStorage.getItem('soundeffects')=='true') {
                soundeffectCorrect.volume = localStorage.getItem('volume')/100;
                soundeffectCorrect.play();
            }        } else {
            showCorrectAnswer();
            if (localStorage.getItem('soundeffects')=='true') {
            }
        }
        answerGiven = true;
    }
}

function next() {
    let intervalArray;
    if (lastClick <= Date.now()-buttonDelay) {
        loadDefaults();
        toneLength = parseFloat(parseFloat(localStorage.getItem('toneLength')).toFixed(2));
        pauseLength = parseFloat(parseFloat(localStorage.getItem('pauseLength')).toFixed(2));
        oscType = localStorage.getItem('waveform');
        switch (localStorage.getItem('intervalSize')) {
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
        firstTone = getRndInteger(100,400);
        if (localStorage.getItem('equalTones') == 'true') {
            intervalArray.push(1);
            secondTone = getRndFromArray(intervalArray)*firstTone;
        } else {
            secondTone = getRndFromArray(intervalArray)*firstTone;
        }
        document.getElementById('feedback_img').src = 'pictures/questionmark.png';
        if (pauseLength == 0) {
            play(firstTone, oscType, 0, toneLength, 0.05, 0.0);
            play(secondTone, oscType, toneLength+pauseLength, 2*toneLength+pauseLength, 0.0, 0.05)
        } else {
            play(firstTone, oscType, 0, toneLength, 0.05, 0.05);
            play(secondTone, oscType, toneLength+pauseLength, 2*toneLength+pauseLength, 0.05, 0.05)
        }
        answerGiven = false;
        lastClick = Date.now();
        buttonDelay = (2*toneLength+pauseLength)*1000;
        localStorage.setItem('firstTone', firstTone);
        localStorage.setItem('secondTone', secondTone);
    }
}


// setting input funtions

function toneLengthSliderInput() {
    document.getElementById('tone_length_input_field').value = document.getElementById('tone_length_slider').value;
    localStorage.setItem('toneLength', document.getElementById('tone_length_slider').value);
}

function toneLengthFieldInput(min, max) {
    var input = document.getElementById('tone_length_input_field').value;
    if ((input > min) && (input < max)) {
        document.getElementById('tone_length_slider').value = document.getElementById('tone_length_input_field').value;
        localStorage.setItem('toneLength', document.getElementById('tone_length_input_field').value);
    } else {
        alert('please enter a value between 0.1 and 5')
    }
}

function pauseLengthSliderInput() {
    document.getElementById('pause_length_display').innerHTML = document.getElementById('pause_length_slider').value;
    localStorage.setItem('pauseLength', document.getElementById('pause_length_slider').value);
}

function volumeSliderInput() {
    document.getElementById('volume_display').innerHTML = document.getElementById('volume_slider').value;
    localStorage.setItem('volume', document.getElementById('volume_slider').value);
}

function equalTonesCheckboxInput() {
    localStorage.setItem('equalTones', document.getElementById('checkbox_equal_tones').checked);
}

function soundeffectCheckboxInput() {
    localStorage.setItem('soundeffects', document.getElementById('checkbox_soundeffects').checked);
}

function dropdownIntervalSizeInput() {
    localStorage.setItem('intervalSize', document.getElementById('dropdown_interval_size').value);
}

function dropdownWaveformInput() {
    localStorage.setItem('waveform', document.getElementById('dropdown_waveform').value);
}

function buttonLevel1() {
    localStorage.setItem('toneLength', '1.0');
    localStorage.setItem('pauseLength', '0.0');
    localStorage.setItem('equalTones', false);
    localStorage.setItem('intervalSize', '50');
    document.getElementById('tone_length_slider').value = 1;
    document.getElementById('tone_length_input_field').value = 1;
    document.getElementById('pause_length_slider').value = 0;
    document.getElementById('pause_length_display').innerHTML = '0';
    document.getElementById('checkbox_equal_tones').checked = false;
    document.getElementById('dropdown_interval_size').value = '50';
}

function buttonLevel2() {
    localStorage.setItem('toneLength', '1.0');
    localStorage.setItem('pauseLength', '0.3');
    localStorage.setItem('equalTones', false);
    localStorage.setItem('intervalSize', '30');
    document.getElementById('tone_length_slider').value = 1;
    document.getElementById('tone_length_input_field').value = 1;
    document.getElementById('pause_length_slider').value = 0.3;
    document.getElementById('pause_length_display').innerHTML = '0.3';
    document.getElementById('checkbox_equal_tones').checked = false;
    document.getElementById('dropdown_interval_size').value = '30';
}

function buttonLevel3() {
    localStorage.setItem('toneLength', '0.8');
    localStorage.setItem('pauseLength', '0.6');
    localStorage.setItem('equalTones', true);
    localStorage.setItem('intervalSize', '20');
    document.getElementById('tone_length_slider').value = 0.8;
    document.getElementById('tone_length_input_field').value = 0.8;
    document.getElementById('pause_length_slider').value = 0.6;
    document.getElementById('pause_length_display').innerHTML = '0.6';
    document.getElementById('checkbox_equal_tones').checked = true;
    document.getElementById('dropdown_interval_size').value = '20';
}

function buttonLevel4() {
    localStorage.setItem('toneLength', '0.7');
    localStorage.setItem('pauseLength', '1.0');
    localStorage.setItem('equalTones', true);
    localStorage.setItem('intervalSize', '10');
    document.getElementById('tone_length_slider').value = 0.7;
    document.getElementById('tone_length_input_field').value = 0.7;
    document.getElementById('pause_length_slider').value = 1;
    document.getElementById('pause_length_display').innerHTML = '1';
    document.getElementById('checkbox_equal_tones').checked = true;
    document.getElementById('dropdown_interval_size').value = '10';
}


// keyboard shortcuts

document.addEventListener('keydown', function(key) {
    if (key.keyCode == 49) {
        if (currentHTMLFile=='Index') {
            repeat();
        }
    }
});

document.addEventListener('keydown', function(key) {
    if (key.keyCode == 50) {
        if (currentHTMLFile=='Index') {
            lower();            
        }
    }
});

document.addEventListener('keydown', function(key) {
    if (key.keyCode == 51) {
        if (currentHTMLFile=='Index') {
            if (localStorage.getItem('equalTones')=='true') {
                equal();
            } else {
                higher();
            }        
        }

    }
});

document.addEventListener('keydown', function(key) {
    if (key.keyCode == 52) {
        if (currentHTMLFile=='Index') {
            if (localStorage.getItem('equalTones')=='true') {
                higher();
            } else {
                next();
            }        
        }
    }
});

document.addEventListener('keydown', function(key) {
    if (key.keyCode == 53) {
        if (currentHTMLFile=='Index') {
            if (localStorage.getItem('equalTones')=='true') {
                next();
            }        
        }
    }
});
