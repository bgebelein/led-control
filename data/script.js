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
const temperatureInput = document.querySelector('#temperature-value');

function setTemperature() {
    let temperature = temperatureInput.value;

    hue1 = 30;
    document.documentElement.style.setProperty('--hue-1', hue1);

    hue2 = 30;
    document.documentElement.style.setProperty('--hue-2', hue2);

    sat = (100 - Math.round(temperature / 2.55)) + '%';
    document.documentElement.style.setProperty('--sat', sat);

    lit = (50 + Math.round(temperature / 5.1)) + '%';
    document.documentElement.style.setProperty('--lit', lit);

    console.log(`Mode: ${currentMode}`);
    console.log(`HHSL: ${hue1}, ${hue2}, ${sat}, ${lit}`);

    websocket.send("temperatureValue" + temperature.toString());
}

// Set color
const colorInput = document.querySelector('#color-value');

function setColor() {
    let color = colorInput.value;

    hue1 = Math.round(color * 1.41176);
    document.documentElement.style.setProperty('--hue-1', hue1);

    hue2 = Math.round(color * 1.41176);
    document.documentElement.style.setProperty('--hue-2', hue2);

    sat = '100%';
    document.documentElement.style.setProperty('--sat', sat);

    setBrightness();

    console.log(`Mode: ${currentMode}`);
    console.log(`HHSL: ${hue1}, ${hue2}, ${sat}, ${lit}`);

    websocket.send("colorValue" + color.toString());
}

// Set gradient
const gradientValInput1 = document.querySelector('#gradient-value-1');
const gradientValInput2 = document.querySelector('#gradient-value-2');

function setGradient() {
    let gradientColor1 = gradientValInput1.value;
    let gradientColor2 = gradientValInput2.value;

    hue1 = Math.round(gradientColor1 * 1.41176);
    document.documentElement.style.setProperty('--hue-1', hue1);

    hue2 = Math.round(gradientColor2 * 1.41176);
    document.documentElement.style.setProperty('--hue-2', hue2);

    sat = '100%';
    document.documentElement.style.setProperty('--sat', sat);

    setBrightness();

    console.log(`Mode: ${currentMode}`);
    console.log(`HHSL: ${hue1}, ${hue2}, ${sat}, ${lit}`);

    websocket.send("gradientValue1" + gradientColor1.toString());
    websocket.send("gradientValue1" + gradientColor2.toString());
}

// Set fade
const fadeSpeedInput = document.querySelector('#fade-value');

function setFadeSpeed() {
    hue2 = hue1;
    document.documentElement.style.setProperty('--hue-2', hue2);

    sat = '100%';
    document.documentElement.style.setProperty('--sat', sat);

    setBrightness();

    speed = 10000 - fadeSpeedInput.value;
    document.documentElement.style.setProperty('--speed', speed + 'ms');

    console.log(`Mode: ${currentMode}`);
    console.log(`HHSL: ${hue1}, ${hue2}, ${sat}, ${lit}`);

    websocket.send("fadeSpeedValue" + speed.toString());
}

// Detect rainbow speed
const rainbowSpeed = document.querySelector('#rainbow-speed-value');

function setRainbowSpeed() {
    hue2 = hue1 + 40;
    document.documentElement.style.setProperty('--hue-2', hue2);

    speed = 10000 - rainbowSpeed.value;
    document.documentElement.style.setProperty('--speed', speed + 'ms');

    console.log(`Mode: ${currentMode}`);
    console.log(`HHSL: ${hue1}, ${hue2}, ${sat}, ${lit}`);

    websocket.send("rainbowSpeedValue" + speed.toString());
}

// Set Breathe
const breatheColorInput = document.querySelector('#breathe-color-value');
const breatheSpeedInput = document.querySelector('#breathe-speed-value');

function setBreathe() {
    let breatheColor = breatheColorInput.value;

    hue1 = Math.round(breatheColor * 1.41176);
    document.documentElement.style.setProperty('--hue-1', hue1);

    hue2 = Math.round(breatheColor * 1.41176);
    document.documentElement.style.setProperty('--hue-2', hue2);

    sat = '100%';
    document.documentElement.style.setProperty('--sat', sat);

    speed = 10000 - breatheSpeedInput.value;
    document.documentElement.style.setProperty('--speed', speed + 'ms');

    setBrightness();

    console.log(`Mode: ${currentMode}`);
    console.log(`HHSL: ${hue1}, ${hue2}, ${sat}, ${lit}`);

    websocket.send("breatheColorValue" + breatheColor.toString());
    websocket.send("breatheSpeedValue" + speed.toString());
}

// Set Motion
const motionColorInput = document.querySelector('#motion-color-value');
const motionSpeedInput = document.querySelector('#motion-speed-value');

function setMotion() {
    let motionColor = motionColorInput.value;

    hue1 = Math.round(motionColor * 1.41176);
    document.documentElement.style.setProperty('--hue-1', hue1);

    hue2 = hue1;
    document.documentElement.style.setProperty('--hue-2', hue2);

    sat = '100%';
    document.documentElement.style.setProperty('--sat', sat);

    speed = 10000 - motionSpeedInput.value;
    document.documentElement.style.setProperty('--speed', speed + 'ms');

    setBrightness();

    console.log(`Mode: ${currentMode}`);
    console.log(`HHSL: ${hue1}, ${hue2}, ${sat}, ${lit}`);

    websocket.send("motionColorValue" + motionColor.toString());
    websocket.send("motionSpeedValue" + speed.toString());
}

// Set sparkle
const sparkleColorInput = document.querySelector('#sparkle-color-value');
const sparkleSpeedInput = document.querySelector('#sparkle-speed-value');

function setSparkleColor() {
    let sparkleColor = sparkleColorInput.value;

    hue1 = Math.round(sparkleColor * 1.41176);
    document.documentElement.style.setProperty('--hue-1', hue1);

    hue2 = hue1;
    document.documentElement.style.setProperty('--hue-2', hue2);

    sat = '100%';
    document.documentElement.style.setProperty('--sat', sat);

    speed = 10000 - sparkleSpeedInput.value;
    document.documentElement.style.setProperty('--speed', speed + 'ms');

    console.log(`Mode: ${currentMode}`);
    console.log(`HHSL: ${hue1}, ${hue2}, ${sat}, ${lit}`);

    setBrightness();

    websocket.send("sparkleColorValue" + sparkleColor.toString());
    websocket.send("sparkleSpeedValue" + speed.toString());
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
