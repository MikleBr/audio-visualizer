const progressWrapper = document.querySelector('.progress');
const progress = progressWrapper.querySelector('.progressBar')
const timingEl = document.querySelector('.timing');
const currentTimeEl = document.querySelector('.currentTime');
const fullTimeEl = document.querySelector('.fullTime')


function visualize(audio, analyser) {
    const canvas = document.querySelector(".visualizer");
    const canvasCtx = canvas.getContext("2d");
    const intendedWidth = document.querySelector(".wrapper").clientWidth;
    canvas.setAttribute("width", intendedWidth);
    WIDTH = canvas.width;
    HEIGHT = canvas.height;
    analyser.fftSize = 256;
    const bufferLengthAlt = analyser.frequencyBinCount;
    const dataArrayAlt = new Uint8Array(bufferLengthAlt);

    canvasCtx.clearRect(0, 0, WIDTH, HEIGHT);

    const draw = () => {
        drawVisual = requestAnimationFrame(draw);
        analyser.getByteFrequencyData(dataArrayAlt);
        canvasCtx.fillStyle = "#0f172a";
        canvasCtx.fillRect(0, 0, WIDTH, HEIGHT);

        piece = audio.currentTime / audio.duration;

        progress.style.width = piece * 100 + '%';
        currentTimeEl.innerHTML = formatTime(audio.currentTime.toFixed(0))
        fullTimeEl.innerHTML = formatTime(audio.duration.toFixed(0))
        const barWidth = (WIDTH / bufferLengthAlt) * 2.5;
        let barHeight;
        let x = 0;

        for (let i = 0; i < bufferLengthAlt; i++) {
            barHeight = dataArrayAlt[i];
            canvasCtx.fillStyle = `rgb(${barHeight + 100}, 0 , 255)`;
            canvasCtx.fillRect(
                x,
                HEIGHT - barHeight,
                barWidth,
                barHeight
            );

            x += barWidth + 1;
        }
    };

    draw();
}

const AudioContext = window.AudioContext || window.webkitAudioContext;

const audioContext = new AudioContext();

const audio = document.querySelector('audio')
const playButton = document.querySelector('.play-btn');

const volumeSlider = new SliderInput({
    min: 0,
    max: 1,
    step: 0.1,
    onInput: (value) => {
        audio.volume = value
    }
})

const wrapper = document.querySelector('.wrapper');
wrapper.prepend(volumeSlider.element)

const length = progressWrapper.getBoundingClientRect().width;

function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60)
    const restSeconds = seconds % 60
    const restSecondsStr = restSeconds < 10 ? '0' + restSeconds : restSeconds

    return `${minutes}:${restSecondsStr}`
}


function mouseMove(e) {
    const secondsDuration = audio.duration
    const mouseCoordinate = e.pageX - progressWrapper.offsetLeft;
    const percent = (mouseCoordinate / length).toFixed(4)

    const formattedTiming = formatTime((secondsDuration * percent).toFixed(0));

    timingEl.style.left = `calc(${percent * 100}% - 23px)`
    timingEl.innerHTML = formattedTiming
}

function clickTrack(e) {
    const secondsDuration = audio.duration;
    const mouseCoordinate = e.pageX - progressWrapper.offsetLeft;
    const percent = (mouseCoordinate / length).toFixed(2);
    const timing = (secondsDuration * percent).toFixed(0)
    audio.currentTime = timing
}

progressWrapper.addEventListener('mouseover', (e) => {
    progressWrapper.addEventListener('mousemove', mouseMove);
    timingEl.style.display = 'flex';
})

progressWrapper.addEventListener('mouseout', (e) => {
    progressWrapper.removeEventListener('mousemove', mouseMove);
    timingEl.style.display = 'none';
})



progressWrapper.addEventListener('click', clickTrack)



const frequencies = [60, 170, 310, 600, 1000, 3000, 6000, 12000, 14000, 16000];

const frequenciesEl = document.querySelector('.frequencies');


const equalizer = new Equalizer(frequencies);
const filters = equalizer.filters;

frequencies.forEach((it, i) => {
    const frequencySlider = new SliderInput({
        label: it,
        onInput: (value) => {
            filters[i].gain.value = value;
        }
    });
    frequenciesEl.append(frequencySlider.element);
})



const track = audioContext.createMediaElementSource(audio);

const analyser = audioContext.createAnalyser();
analyser.minDecibels = -90;
analyser.maxDecibels = 0;
analyser.smoothingTimeConstant = 0.85;

track.connect(filters[0]);
filters[filters.length - 1].connect(analyser);

analyser.connect(audioContext.destination);





playButton.addEventListener(
    "click",
    () => {
        if (audioContext.state === "suspended") {
            audioContext.resume();
        }

        if (playButton.dataset.playing === "false") {
            audio.play();
            playButton.innerHTML = `<img src="./assets/icons/pause.svg" alt="play"></img>`
            playButton.dataset.playing = "true";
        } else if (playButton.dataset.playing === "true") {
            audio.pause();
            playButton.innerHTML = `<img src="./assets/icons/play.svg" alt="play"></img>`
            playButton.dataset.playing = "false";
        }
    },
    false
);






visualize(audio, analyser);

