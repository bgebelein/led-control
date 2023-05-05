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

// Set Input Value on Websocket message
/*
function onMessage(event) {
    console.log(event.data);
    var ledObj = JSON.parse(event.data);
    var keys = Object.keys(ledObj);

    keys.forEach(function(key){
        switch (key) {
            case "modeValue":
                document.querySelector('input[value=' + ledObj[key] + ']').checked = true;
                break;
            case "colorValue":
                color.value = ledObj[key];
                break;
            case "brightnessValue":
                brightness.value = ledObj[key];
                break;
            default:
                console.log("Sorry, no keys available.");
        }
    });
}
*/

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
    
    sendValues();
}

// Update UI
const modes = document.querySelectorAll('input[type=radio]');

modes.forEach(function(item) {
    item.addEventListener('change', function(e) {
        setCurrentMode();
    });
});

// Set temperature
const temperatureInput = document.querySelector('#temperature-value');

function setTemperature() {
    hue1 = 30;
    document.documentElement.style.setProperty('--hue-1', hue1);

    hue2 = 30;
    document.documentElement.style.setProperty('--hue-2', hue2);

    sat = (100 - Math.round(temperatureInput.value / 2.55)) + '%';
    document.documentElement.style.setProperty('--sat', sat);

    lit = (50 + Math.round(temperatureInput.value / 5.1)) + '%';
    document.documentElement.style.setProperty('--lit', lit);
}

// Set color
const colorInput = document.querySelector('#color-value');

function setColor() {
    hue1 = Math.round(colorInput.value * 1.41176);
    document.documentElement.style.setProperty('--hue-1', hue1);

    hue2 = Math.round(colorInput.value * 1.41176);
    document.documentElement.style.setProperty('--hue-2', hue2);

    sat = '100%';
    document.documentElement.style.setProperty('--sat', sat);

    setBrightness();
}

// Set gradient
const gradientValInput1 = document.querySelector('#gradient-value-1');
const gradientValInput2 = document.querySelector('#gradient-value-2');

function setGradient() {
    hue1 = Math.round(gradientValInput1.value * 1.41176);
    document.documentElement.style.setProperty('--hue-1', hue1);

    hue2 = Math.round(gradientValInput2.value * 1.41176);
    document.documentElement.style.setProperty('--hue-2', hue2);

    sat = '100%';
    document.documentElement.style.setProperty('--sat', sat);

    setBrightness();
}

// Set fade
const fadeSpeedInput = document.querySelector('#fade-value');

function setFadeSpeed() {
    hue2 = hue1;
    document.documentElement.style.setProperty('--hue-2', hue2);

    sat = '100%';
    document.documentElement.style.setProperty('--sat', sat);

    setBrightness();

    document.documentElement.style.setProperty('--speed', 10000 - fadeSpeedInput.value + 'ms');
}

// Detect rainbow speed
const rainbowSpeed = document.querySelector('#rainbow-speed-value');

function setRainbowSpeed() {
    hue2 = hue1 + 40;
    document.documentElement.style.setProperty('--hue-2', hue2);

    document.documentElement.style.setProperty('--speed', 10000 - rainbowSpeed.value + 'ms');
}

// Set Breathe
const breatheColorInput = document.querySelector('#breathe-color-value');
const breatheSpeedInput = document.querySelector('#breathe-speed-value');

function setBreathe() {
    hue1 = Math.round(breatheColorInput.value * 1.41176);
    document.documentElement.style.setProperty('--hue-1', hue1);

    hue2 = hue1;
    document.documentElement.style.setProperty('--hue-2', hue2);

    sat = '100%';
    document.documentElement.style.setProperty('--sat', sat);

    document.documentElement.style.setProperty('--speed', 10000 - breatheSpeedInput.value + 'ms');

    setBrightness();
}

// Set Motion
const motionColorInput = document.querySelector('#motion-color-value');
const motionSpeedInput = document.querySelector('#motion-speed-value');

function setMotion() {
    hue1 = Math.round(motionColorInput.value * 1.41176);
    document.documentElement.style.setProperty('--hue-1', hue1);

    hue2 = hue1;
    document.documentElement.style.setProperty('--hue-2', hue2);

    sat = '100%';
    document.documentElement.style.setProperty('--sat', sat);

    document.documentElement.style.setProperty('--speed', 10000 - motionSpeedInput.value + 'ms');

    setBrightness();
}

// Set sparkle
const sparkleColorInput = document.querySelector('#sparkle-color-value');
const sparkleSpeedInput = document.querySelector('#sparkle-speed-value');

function setSparkleColor() {
    hue1 = Math.round(sparkleColorInput.value * 1.41176);
    document.documentElement.style.setProperty('--hue-1', hue1);

    hue2 = hue1;
    document.documentElement.style.setProperty('--hue-2', hue2);

    sat = '100%';
    document.documentElement.style.setProperty('--sat', sat);

    document.documentElement.style.setProperty('--speed', 10000 - sparkleSpeedInput.valu + 'ms');

    setBrightness();
}

// Brightness Controls
const brightness = document.querySelector('#brightness > input[type="range"]');

function setBrightness() {
    lit = Math.round(brightness.value / 5.1) + '%';
    document.documentElement.style.setProperty('--lit', lit);
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



function sendValues() {
    console.log(`Mode: ${currentMode}`);
    console.log(`HHSL: ${hue1}, ${hue2}, ${sat}, ${lit}`);

    websocket.send("modeValue" + currentMode.toString());

    websocket.send("temperatureValue" + temperatureInput.value.toString());

    websocket.send("colorValue" + colorInput.value.toString());

    websocket.send("gradientValue1" + gradientValInput1.value.toString());
    websocket.send("gradientValue1" + gradientValInput2.value.toString());

    websocket.send("fadeSpeedValue" + speed.toString());

    websocket.send("rainbowSpeedValue" + speed.toString());

    websocket.send("breatheColorValue" + breatheColor.toString());
    websocket.send("breatheSpeedValue" + speed.toString());

    websocket.send("motionColorValue" + motionColor.toString());
    websocket.send("motionSpeedValue" + speed.toString());

    websocket.send("sparkleColorValue" + sparkleColor.toString());
    websocket.send("sparkleSpeedValue" + speed.toString());

    websocket.send("brightnessValue" + brightness.value.toString());
}