var mediaRecorder;
var dataArray = [];

navigator.mediaDevices.getUserMedia({audio:true})
    .then(function (mediaStreamObj) {
        let start = document.getElementById('btnRecord');
        let stop = document.getElementById('btnStop');
        let mediaRecorder = new MediaRecorder(mediaStreamObj);
        start.addEventListener('click', function (ev) {
            mediaRecorder.start();
        })
        stop.addEventListener('click', function (ev) {
            mediaRecorder.stop();
        });
        mediaRecorder.ondataavailable = function (ev) {
            dataArray.push(ev.data);
        }
        let dataArray = [];
        mediaRecorder.onstop = function (ev) {
            let audioData = new Blob(dataArray, {'type': 'audio/mp3;'});
            dataArray = [];
            let audioSrc = window.URL.createObjectURL(audioData);
            document.getElementById('audio').src = audioSrc;
        }
    })
    .catch(function (err) {
        console.log(err.name, err.message);
    });

function play() {
    if (lastClick <= Date.now()-buttonDelay) {
        playExercise3(getRndInteger(100,400), 'sine', 0, 1, 0.05, 0.05);
        lastClick = Date.now();
        buttonDelay = 1000;
    }
}

function playback() {
    document.getElementById('audio').play();
}

function playExercise3(freq, type, start, stop, fadeInTime, fadeOutTime) {
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