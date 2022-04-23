var mediaRecorder;

function play() {
    if (lastClick <= Date.now()-buttonDelay) {
        playExercise3(getRndInteger(100,400), 'sine', 0, 1, 0.05, 0.05);
        lastClick = Date.now();
        buttonDelay = 1000;
    }
}

function record() {
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        console.log('getUserMedia supported');
        navigator.mediaDevices.getUserMedia({audio:true})
            .then(function(stream) {
                mediaRecorder = new MediaRecorder(stream);
                mediaRecorder.start();
            })
            .catch(function(err) {
                console.log('The following getUserMedia error occurred: '+err);
            });
    } else {
        console.log('getUserMedia not supported on your browser');
    }
}

function stop() {
    mediaRecorder.stop();
    const blob = new Blob(chunks, {'type':'audio/ogg; codecs=opus'});
    var chunks = [];
    const audioURL = window.URL.createObjectURL(blob);
    audio.src = audioURL;
}

function playback() {

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