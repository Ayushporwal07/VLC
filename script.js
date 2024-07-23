const speedUp = document.querySelector("#speedUp");
const speedDown = document.querySelector("#speedDown");
const volumeUp = document.querySelector("#volumeUp");
const volumeDown = document.querySelector("#volumeDown");
const videoBtn = document.querySelector("#videoBtn");
const videoInput = document.querySelector("#videoInput");
const videoPlayer = document.querySelector("#main");
const toast = document.querySelector(".toast");
const playElement = document.querySelector("#play");
const pauseElement = document.querySelector("#pause");
const fullScreenElem = document.querySelector("#fullScreen");
const backwardElem = document.querySelector("#backward");
const forwardElem = document.querySelector("#forward");
const body = document.querySelector("body");
const currentTimeElem = document.querySelector("#currentTime");
const totalTimeElem = document.querySelector("#totalTime");
const slider = document.querySelector("#slider");

let videoElement = null; // Initially null
let isPlaying = false;
let duration;
let timerObj;
let currentPlayTime = 0;

// Handle video input selection
const handleInput = () => {
    videoInput.click();
};

const acceptInputHandler = (event) => {
    const selectedVideo = event.target.files[0];
    if (selectedVideo && selectedVideo.type.startsWith('video/')) {
        const link = URL.createObjectURL(selectedVideo);

        // Remove existing video element if any
        if (videoElement) {
            videoPlayer.removeChild(videoElement);
        }

        videoElement = document.createElement("video");
        videoElement.src = link;
        videoElement.setAttribute("class", "video");
        videoPlayer.appendChild(videoElement);
        videoElement.volume = 0.5; // Setting initial volume
        videoElement.playbackRate = 1.0; // Setting initial playback rate

        videoElement.addEventListener('loadedmetadata', () => {
            duration = videoElement.duration;
            totalTimeElem.innerText = timeFormat(duration);
            slider.max = duration;
            startTimer();
            videoElement.play();
        });
    } else {
        showToast('Please select a video file.');
    }
};

videoBtn.addEventListener("click", handleInput);
videoInput.addEventListener("change", acceptInputHandler);

// Speed control functions
const speedUpHandler = () => {
    if (videoElement && videoElement.playbackRate < 3.0) {
        videoElement.playbackRate += 0.5;
        showToast(`Speed: ${videoElement.playbackRate.toFixed(1)}x`);
    }
};

const speedDownHandler = () => {
    if (videoElement && videoElement.playbackRate > 0.5) {
        videoElement.playbackRate -= 0.5;
        showToast(`Speed: ${videoElement.playbackRate.toFixed(1)}x`);
    }
};

// Volume control functions
const volumeUpHandler = () => {
    if (videoElement && videoElement.volume < 1.0) {
        videoElement.volume = Math.min(videoElement.volume + 0.1, 1.0);
        showToast(`Volume: ${(videoElement.volume * 100).toFixed(0)}%`);
    }
};

const volumeDownHandler = () => {
    if (videoElement && videoElement.volume > 0.0) {
        videoElement.volume = Math.max(videoElement.volume - 0.1, 0.0);
        showToast(`Volume: ${(videoElement.volume * 100).toFixed(0)}%`);
    }
};

// Show toast message
function showToast(message) {
    toast.textContent = message;
    toast.style.display = "block";
    setTimeout(() => {
        toast.style.display = "none";
    }, 3000); // 3 seconds
}

speedUp.addEventListener("click", speedUpHandler);
speedDown.addEventListener("click", speedDownHandler);
volumeUp.addEventListener("click", volumeUpHandler);
volumeDown.addEventListener("click", volumeDownHandler);

// Play and Pause functions
const handlePlay = () => {
    if (videoElement) {
        videoElement.play();
        isPlaying = true;
        startTimer();
    }
};

const handlePause = () => {
    if (videoElement) {
        videoElement.pause();
        isPlaying = false;
        stopTimer();
    }
};

playElement.addEventListener("click", handlePlay);
pauseElement.addEventListener("click", handlePause);

// Fullscreen function
const handleFullScreen = () => {
    if (videoPlayer.requestFullscreen) {
        videoPlayer.requestFullscreen();
    } else if (videoPlayer.mozRequestFullScreen) { // Firefox
        videoPlayer.mozRequestFullScreen();
    } else if (videoPlayer.webkitRequestFullscreen) { // Chrome, Safari and Opera
        videoPlayer.webkitRequestFullscreen();
    } else if (videoPlayer.msRequestFullscreen) { // IE/Edge
        videoPlayer.msRequestFullscreen();
    }
};

fullScreenElem.addEventListener("click", handleFullScreen);

// Adding seek behavior in slider
slider.addEventListener("change", function (e) {
    let value = e.target.value;
    videoElement.currentTime = value;
});

// Seek functions
const handleBackwardSeek = () => {
    if (videoElement) {
        videoElement.currentTime = Math.max(videoElement.currentTime - 5, 0);
        slider.value = videoElement.currentTime;
        showToast("Backward By 5 Sec");
        let time = timeFormat(videoElement.currentTime);
        currentTimeElem.innerText = time;
    }
};

const handleForwardSeek = () => {
    if (videoElement) {
        videoElement.currentTime = Math.min(videoElement.currentTime + 5, videoElement.duration);
        slider.value = videoElement.currentTime;
        showToast("Forward By 5 sec");
        let time = timeFormat(videoElement.currentTime);
        currentTimeElem.innerText = time;
    }
};

backwardElem.addEventListener("click", handleBackwardSeek);
forwardElem.addEventListener("click", handleForwardSeek);


/***************utility function to convert secs into hrs :mns : seconds*****************/
function timeFormat(timeCount) {
    let time = '';
    const sec = parseInt(timeCount, 10);
    let hours = Math.floor(sec / 3600);
    let minutes = Math.floor((sec - (hours * 3600)) / 60);
    let seconds = sec - (hours * 3600) - (minutes * 60);
    if (hours < 10) {
        hours = "0" + hours;
    }
    if (minutes < 10) {
        minutes = "0" + minutes;
    }
    if (seconds < 10) {
        seconds = "0" + seconds;
    }
    time = `${hours}:${minutes}:${seconds}`;
    return time;
}


// function that runs the slider and timer  
function startTimer() {
    stopTimer(); // Clear any existing timer
    timerObj = setInterval(function () {
        currentPlayTime = Math.round(videoElement.currentTime);
        slider.value = currentPlayTime;
        const time = timeFormat(currentPlayTime);
        currentTimeElem.innerText = time;
        if (currentPlayTime === duration) {
            stopTimer();
            handlePause();
            videoPlayer.removeChild(videoElement);
            videoElement = null;
            currentTimeElem.innerText = "00:00:00";
            totalTimeElem.innerText = "--/--/--";
            slider.value = 0;
        }
    }, 1000);
}

function stopTimer() {
    clearInterval(timerObj);
}

/****
 * Enable Drag and Drop
 */

videoPlayer.addEventListener('dragenter', (e) => {
    e.preventDefault();
});

videoPlayer.addEventListener('dragover', (e) => {
    e.preventDefault();
});

videoPlayer.addEventListener('dragleave', (e) => {
    e.preventDefault();
});

videoPlayer.addEventListener('drop', (e) => {
    e.preventDefault();
    if (e.dataTransfer.files.length > 0) {
        const file = e.dataTransfer.files[0];
        if (file.type.startsWith('video/')) {
            const dataTransfer = { target: { files: [file] } };
            acceptInputHandler(dataTransfer);
        } else {
            showToast('Please drop a video file.');
        }
    }
});

// Keyboard event handling
body.addEventListener("keyup", (e) => {
    if (!videoElement) return;

    switch (e.key) {
        case " ":
            isPlaying ? handlePause() : handlePlay();
            break;
        case "ArrowUp":
            volumeUpHandler();
            break;
        case "ArrowDown":
            volumeDownHandler();
            break;
        case "+":
            speedUpHandler();
            break;
        case "-":
            speedDownHandler();
            break;
        case "ArrowRight":
            handleForwardSeek();
            break;
        case "ArrowLeft":
            handleBackwardSeek();
            break;
        default:
            alert("Invalid Key Pressed");
    }
});
