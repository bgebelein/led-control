// Websocket Connection

var gateway = `ws://${window.location.hostname}/ws`;
var websocket;
window.addEventListener('load', onload);

function onload(event) {
    initWebSocket();
}

function initWebSocket() {
    console.log('Trying to open a WebSocket connection…');
    websocket = new WebSocket(gateway);
    websocket.onopen = onOpen;
    websocket.onclose = onClose;
    websocket.onmessage = onMessage;
}

function getValues(){
    websocket.send("getValues");
}

function onOpen(event) {
    console.log('Connection opened');
    getValues();
}

function onClose(event) {
    console.log('Connection closed');
    setTimeout(initWebSocket, 2000);
}

function onMessage(event) {
    console.log(event.data);
    var ledObj = JSON.parse(event.data);
    var keys = Object.keys(ledObj);

    for (var i = 0; i < keys.length; i++){
        var key = keys[i];

        switch (key) {
            case "colorValue":
                color.value = ledObj[key];
                break;
            case "brightnessValue":
                brightness.value = ledObj[key];
                break;
            case "modeValue":
                document.querySelector('input[value=' + ledObj[key] + ']').checked = true;
                break;
            default:
                console.log("Sorry, no keys available.");
          }
    }
}

// Colormodes etc.

let currentMode;
let hue1 = getComputedStyle(document.documentElement).getPropertyValue('--hue-1');
let hue2 = getComputedStyle(document.documentElement).getPropertyValue('--hue-2');
let sat = getComputedStyle(document.documentElement).getPropertyValue('--sat');
let lit = getComputedStyle(document.documentElement).getPropertyValue('--lit');
let speed = getComputedStyle(document.documentElement).getPropertyValue('--speed');

// Detect current mode
function setCurrentMode(){
    currentMode = document.querySelector('input[type=radio]:checked').value;
    console.log('Current mode: ' + currentMode);

    document.querySelectorAll('section').forEach(section => section.setAttribute('hidden', true));
    document.querySelector('section#' + currentMode).removeAttribute('hidden');

    document.querySelectorAll('.cat').forEach(cat => cat.classList.remove('fade', 'breathe', 'sparkle'));

    if (currentMode === 'white') {
        setTemperature();
    }

    if (currentMode === 'color') {
        setColor();
    }

    if (currentMode === 'gradient') {
        setGradient();
    }

    if (currentMode === 'fade') {
        document.querySelectorAll('.cat').forEach(cat => cat.classList.add('fade'));
        setFadeSpeed();
    }

    if (currentMode === 'rainbow') {
        document.querySelectorAll('.cat').forEach(cat => cat.classList.add('fade'));
        setRainbowSpeed();
    }

    if (currentMode === 'breathe') {
        document.querySelectorAll('.cat').forEach(cat => cat.classList.add('breathe'));
        setBreathe();
    }
    
    if (currentMode === 'motion') {
        document.querySelectorAll('.cat').forEach(cat => cat.classList.add('breathe'));
        setMotion();
    }

    if (currentMode === 'sparkle') {
        document.querySelectorAll('.cat').forEach(cat => cat.classList.add('sparkle'));
        setSparkleColor();
    }
    
    setBrightness();

    websocket.send("modeValue" + currentMode.toString());
}

// Update UI
const modes = document.querySelectorAll('input[type=radio]');

modes.forEach(function(item) {
    item.addEventListener('change', function(e) {
        setCurrentMode();
    });
});

// Set temperature
const temperature = document.querySelector('#temperature-value');

function setTemperature() {
    console.log('Temperature: ' + temperature.value);

    hue1 = 30;
    document.documentElement.style.setProperty('--hue-1', hue1);

    hue2 = 30;
    document.documentElement.style.setProperty('--hue-2', hue2);

    sat = (100 - Math.round(temperature.value / 2.55)) + '%';
    document.documentElement.style.setProperty('--sat', sat);

    lit = (50 + Math.round(temperature.value / 5.1)) + '%';
    document.documentElement.style.setProperty('--lit', lit);

    websocket.send("temperatureValue" + temperature.value.toString());
}

// Set color
const color = document.querySelector('#color-value');

function setColor() {
    console.log('Color: ' + color.value);

    hue1 = Math.round(color.value * 1.41176);
    document.documentElement.style.setProperty('--hue-1', hue1);

    hue2 = Math.round(color.value * 1.41176);
    document.documentElement.style.setProperty('--hue-2', hue2);

    sat = '100%';
    document.documentElement.style.setProperty('--sat', sat);

    setBrightness();

    websocket.send("colorValue" + color.value.toString());
}

// Set gradient
const gradientValue1 = document.querySelector('#gradient-value-1');
const gradientValue2 = document.querySelector('#gradient-value-2');

function setGradient() {
    console.log('Color 1: ' + gradientValue1.value);
    console.log('Color 2: ' + gradientValue2.value);

    hue1 = Math.round(gradientValue1.value * 1.41176);
    document.documentElement.style.setProperty('--hue-1', hue1);

    hue2 = Math.round(gradientValue2.value * 1.41176);
    document.documentElement.style.setProperty('--hue-2', hue2);

    sat = '100%';
    document.documentElement.style.setProperty('--sat', sat);

    setBrightness();

    websocket.send("GradientValue1" + gradientValue1.value.toString());
    websocket.send("GradientValue1" + gradientValue2.value.toString());
}

// Set fade
const fadeSpeed = document.querySelector('#fade-value');

function setFadeSpeed() {
    console.log('Speed: ' + fadeSpeed.value);

    hue1 = Math.round(gradientValue1.value * 1.41176);
    document.documentElement.style.setProperty('--hue-1', hue1);

    hue2 = hue1;
    document.documentElement.style.setProperty('--hue-2', hue2);

    sat = '100%';
    document.documentElement.style.setProperty('--sat', sat);

    speed = (10000 - fadeSpeed.value) + 'ms';
    document.documentElement.style.setProperty('--speed', speed);

    setBrightness();

    let fadeSpeedValue = 1000 - fadeSpeed.value;
    websocket.send("fadeSpeedValue" + fadeSpeedValue.toString());
}

// Detect rainbow speed
const rainbowSpeed = document.querySelector('#rainbow-speed-value');

function setRainbowSpeed() {
    console.log('Rainbowsize: ' + rainbowSpeed.value);

    let rainbowSpeedValue = 1000 - rainbowSpeed.value;

    speed = 10000 - rainbowSpeed.value * 10 + 'ms';
    document.documentElement.style.setProperty('--speed', speed);

    websocket.send("rainbowSpeedValue" + rainbowSpeedValue.toString());
}

// Set Breathe
const breatheColor = document.querySelector('#breathe-color-value');
const breatheSpeed = document.querySelector('#breathe-speed-value');

function setBreathe() {
    console.log('Color: ' + breatheColor.value);
    console.log('Speed: ' + breatheSpeed.value);

    hue1 = Math.round(breatheColor.value * 1.41176);
    document.documentElement.style.setProperty('--hue-1', hue1);

    hue2 = Math.round(breatheColor.value * 1.41176);
    document.documentElement.style.setProperty('--hue-2', hue2);

    sat = '100%';
    document.documentElement.style.setProperty('--sat', sat);

    speed = (10000 - breatheSpeed.value) + 'ms';
    document.documentElement.style.setProperty('--speed', speed);

    setBrightness();

    websocket.send("BreatheColorValue" + breatheColor.value.toString());
    websocket.send("BreatheSpeedValue" + breatheSpeed.value.toString());
}

// Set Motion
const motionColor = document.querySelector('#motion-color-value');
const motionSpeed = document.querySelector('#motion-speed-value');

function setMotion() {
    console.log('Color: ' + motionColor.value);
    console.log('Speed: ' + motionSpeed.value);

    hue1 = Math.round(motionColor.value * 1.41176);
    document.documentElement.style.setProperty('--hue-1', hue1);

    hue2 = Math.round(motionColor.value * 1.41176);
    document.documentElement.style.setProperty('--hue-2', hue2);

    sat = '100%';
    document.documentElement.style.setProperty('--sat', sat);

    speed = (10000 - motionSpeed.value) + 'ms';
    document.documentElement.style.setProperty('--speed', speed);

    setBrightness();

    websocket.send("motionColorValue" + motionColor.value.toString());
    websocket.send("motionSpeedValue" + motionSpeed.value.toString());
}

// Set sparkle
const sparkleColor = document.querySelector('#sparkle-color-value');
const sparkleSpeed = document.querySelector('#sparkle-speed-value');

function setSparkleColor() {
    console.log('Color: ' + sparkleColor.value);

    hue1 = Math.round(sparkleColor.value * 1.41176);
    document.documentElement.style.setProperty('--hue-1', hue1);

    hue2 = Math.round(sparkleColor.value * 1.41176);
    document.documentElement.style.setProperty('--hue-2', hue2);

    sat = '100%';
    document.documentElement.style.setProperty('--sat', sat);

    speed = (10000 - sparkleSpeed.value) + 'ms';
    document.documentElement.style.setProperty('--speed', speed);

    setBrightness();

    websocket.send("colorValue" + sparkleColor.value.toString());
}

// Brightness Controls
const brightness = document.querySelector('#brightness > input[type="range"]');

function setBrightness() {
    console.log('Brightness: ' + brightness.value);

    lit = Math.round(brightness.value / 5.1) + '%';
    document.documentElement.style.setProperty('--lit', lit);

    websocket.send("brightnessValue" + brightness.value.toString());
}

const btn = document.querySelector('button');

btn.addEventListener('click', function() {
    if (brightness.value < 1) {
        brightness.value = 255;
    } else {
        brightness.value = 0;
    }
    setBrightness();
});

setCurrentMode();