// Websocket Connection
/*
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



/* ------------------------------------ UI Stuff ------------------------------------ */

let currentMode = document.querySelector('input[type=radio]:checked').value;
let hue1 = getComputedStyle(document.documentElement).getPropertyValue('--hue-1');
let hue2 = getComputedStyle(document.documentElement).getPropertyValue('--hue-2');
let sat = getComputedStyle(document.documentElement).getPropertyValue('--sat');
let lit = getComputedStyle(document.documentElement).getPropertyValue('--lit');
let speed = getComputedStyle(document.documentElement).getPropertyValue('--speed');

const temperatureInput = document.querySelector('#temperature-input > input[type="range"]');
const hueInput1 = document.querySelector('#hue-input-1 > input[type="range"]');
const hueInput2 = document.querySelector('#hue-input-2 > input[type="range"]');
const speedInput = document.querySelector('#speed-input > input[type="range"]');
const brightnessInput = document.querySelector('#brightness > input[type="range"]');
const btn = document.querySelector('button');

function setMode(){
    // Update currentMode value
    currentMode = document.querySelector('input[type=radio]:checked').value;
    console.log(`Current mode selected: ${currentMode}`);

    // Remove Animations from cat
    document.querySelectorAll('.cat').forEach(cat => cat.classList.remove('fade', 'breathe', 'sparkle'));

    // Hide all UI
    temperatureInput.parentNode.hidden = true;
    hueInput1.parentNode.hidden = true;
    hueInput2.parentNode.hidden = true;
    speedInput.parentNode.hidden = true;

    // Show necessary UI
    switch (currentMode) {
        case 'white':
            temperatureInput.parentNode.hidden = false;
            setCssProps('30', '30', getCssProp('sat'), getCssProp('lit'), getCssProp('speed'));
            break;
        case 'color':
            hueInput1.parentNode.hidden = false;
            setCssProps(getCssProp('hue1'), getCssProp('hue1'), '100', getCssProp('lit'), getCssProp('speed'));
            break;
        case 'gradient':
            hueInput1.parentNode.hidden = false;
            hueInput2.parentNode.hidden = false;
            setCssProps(hueInput1.value, hueInput2.value, '100', getCssProp('lit'), getCssProp('speed'));
            break;
        case 'fade':
            document.querySelectorAll('.cat').forEach(cat => cat.classList.add('fade'));
            speedInput.parentNode.hidden = false;
            setCssProps(hueInput1.value, hueInput1.value, '100', getCssProp('lit'), speedInput.value);
            break;
        case 'rainbow':
            document.querySelectorAll('.cat').forEach(cat => cat.classList.add('fade'));
            speedInput.parentNode.hidden = false;
            setCssProps(hueInput1.value, parseInt(hueInput1.value) + 20, '100', getCssProp('lit'), speedInput.value);
            break;
        case 'breathe':
            document.querySelectorAll('.cat').forEach(cat => cat.classList.add('breathe'));
            hueInput1.parentNode.hidden = false;
            speedInput.parentNode.hidden = false;
            setCssProps(hueInput1.value, hueInput1.value, '100', getCssProp('lit'), speedInput.value);
            break;
        case 'motion':
            document.querySelectorAll('.cat').forEach(cat => cat.classList.add('breathe'));
            hueInput1.parentNode.hidden = false;
            speedInput.parentNode.hidden = false;
            setCssProps(hueInput1.value, hueInput1.value, '100', getCssProp('lit'), parseInt(speedInput.value) / 2);
            break;
        case 'sparkle':
            document.querySelectorAll('.cat').forEach(cat => cat.classList.add('sparkle'));
            hueInput1.parentNode.hidden = false;
            speedInput.parentNode.hidden = false;
            setCssProps(hueInput1.value, hueInput1.value, '100', getCssProp('lit'), speedInput.value);
            break;
    }
}

setMode();

// Helper

function setCssProps(hue1, hue2, sat, lit, speed) {
    document.documentElement.style.setProperty('--hue-1', hue1);
    document.documentElement.style.setProperty('--hue-2', hue2);
    document.documentElement.style.setProperty('--sat', sat + '%');
    document.documentElement.style.setProperty('--lit', lit + '%');
    document.documentElement.style.setProperty('--speed', speed + 'ms');
}

function getCssProp(prop) {
    if (prop === 'hue1') {
        return getComputedStyle(document.documentElement).getPropertyValue('--hue-1');
    }

    if (prop === 'hue2') {
        return getComputedStyle(document.documentElement).getPropertyValue('--hue-2');
    }

    if (prop === 'sat') {
        return getComputedStyle(document.documentElement).getPropertyValue('--sat').split('%')[0];
    }

    if (prop === 'lit') {
        return getComputedStyle(document.documentElement).getPropertyValue('--lit').split('%')[0];
    }

    if (prop === 'speed') {
        return getComputedStyle(document.documentElement).getPropertyValue('--speed').split('ms')[0];
    }
}

// Update UI according to input values

function setTemperature() {
    setCssProps(getCssProp('hue1'), getCssProp('hue2'), 100 - temperatureInput.value, getCssProp('lit'), getCssProp('speed'));
}

function setHue1() {
    if(currentMode === 'gradient' || currentMode === 'white') {
        setCssProps(hueInput1.value, getCssProp('hue2'), getCssProp('sat'), getCssProp('lit'), getCssProp('speed'));
    } else {
        setCssProps(hueInput1.value, hueInput1.value, '100', getCssProp('lit'), getCssProp('speed'));
    }
}

function setHue2() {
    setCssProps(getCssProp('hue1'), hueInput2.value, getCssProp('sat'), getCssProp('lit'), getCssProp('speed'));
}

function setSpeed() {
    setCssProps(getCssProp('hue1'), getCssProp('hue2'), getCssProp('sat'), getCssProp('lit'), 10000 - speedInput.value);
}

function setBrightness() {
    setCssProps(getCssProp('hue1'), getCssProp('hue2'), getCssProp('sat'), brightnessInput.value, getCssProp('hue2'));
}

btn.addEventListener('click', function() {
    if (brightnessInput.value < 1) {
        brightnessInput.value = 50;
    } else {
        brightnessInput.value = 0;
    }
    setBrightness();
});


/*
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

// Inputs
const modes = document.querySelectorAll('input[type=radio]');
const temperatureInput = document.querySelector('#temperature-value');
const colorInput = document.querySelector('#color-value');
const gradientValInput1 = document.querySelector('#gradient-value-1');
const gradientValInput2 = document.querySelector('#gradient-value-2');
const fadeSpeedInput = document.querySelector('#fade-value');
const rainbowSpeed = document.querySelector('#rainbow-speed-value');
const breatheColorInput = document.querySelector('#breathe-color-value');
const breatheSpeedInput = document.querySelector('#breathe-speed-value');
const motionColorInput = document.querySelector('#motion-color-value');
const motionSpeedInput = document.querySelector('#motion-speed-value');
const sparkleColorInput = document.querySelector('#sparkle-color-value');
const sparkleSpeedInput = document.querySelector('#sparkle-speed-value');

// Control modes

modes.forEach(function(item) {
    item.addEventListener('change', function(e) {
        setCurrentMode();
    });
});

function setTemperature() {
    hue1 = 30;
    document.documentElement.style.setProperty('--hue-1', hue1);

    hue2 = 30;
    document.documentElement.style.setProperty('--hue-2', hue2);

    sat = (100 - Math.round(temperatureInput.value / 2.55)) + '%';
    document.documentElement.style.setProperty('--sat', sat);

    lit = (50 + Math.round(temperatureInput.value / 5.1)) + '%';
    document.documentElement.style.setProperty('--lit', lit);

    websocket.send("temperatureValue" + temperatureInput.value.toString());
}

// Set color
function setColor() {
    hue1 = Math.round(colorInput.value * 1.41176);
    document.documentElement.style.setProperty('--hue-1', hue1);

    hue2 = hue1;
    document.documentElement.style.setProperty('--hue-2', hue2);

    sat = '100%';
    document.documentElement.style.setProperty('--sat', sat);

    setBrightness();

    websocket.send("colorValue" + colorInput.value.toString());
}

// Set gradient
function setGradient() {
    hue1 = Math.round(gradientValInput1.value * 1.41176);
    document.documentElement.style.setProperty('--hue-1', hue1);

    hue2 = Math.round(gradientValInput2.value * 1.41176);
    document.documentElement.style.setProperty('--hue-2', hue2);

    sat = '100%';
    document.documentElement.style.setProperty('--sat', sat);

    setBrightness();

    websocket.send("gradientValue1" + gradientValInput1.value.toString());
    websocket.send("gradientValue1" + gradientValInput2.value.toString());
}

// Set fade
function setFadeSpeed() {
    hue2 = hue1;
    document.documentElement.style.setProperty('--hue-2', hue2);

    sat = '100%';
    document.documentElement.style.setProperty('--sat', sat);

    document.documentElement.style.setProperty('--speed', 10000 - fadeSpeedInput.value + 'ms');

    setBrightness();

    document.documentElement.style.setProperty('--speed', 10000 - fadeSpeedInput.value + 'ms');
}

// Detect rainbow speed
function setRainbowSpeed() {
    hue2 = hue1 + 40;
    document.documentElement.style.setProperty('--hue-2', hue2);

    document.documentElement.style.setProperty('--speed', 10000 - rainbowSpeed.value + 'ms');

    websocket.send("rainbowSpeedValue" + rainbowSpeed.value.toString());
}

// Set Breathe
function setBreathe() {
    hue1 = Math.round(breatheColorInput.value * 1.41176);
    document.documentElement.style.setProperty('--hue-1', hue1);

    hue2 = hue1;
    document.documentElement.style.setProperty('--hue-2', hue2);

    sat = '100%';
    document.documentElement.style.setProperty('--sat', sat);

    document.documentElement.style.setProperty('--speed', 10000 - breatheSpeedInput.value + 'ms');

    setBrightness();

    websocket.send("breatheColorValue" + breatheColorInput.value.toString());
    websocket.send("breatheSpeedValue" + breatheSpeedInput.value.toString());
}

// Set Motion
function setMotion() {
    hue1 = Math.round(motionColorInput.value * 1.41176);
    document.documentElement.style.setProperty('--hue-1', hue1);

    hue2 = hue1;
    document.documentElement.style.setProperty('--hue-2', hue2);

    sat = '100%';
    document.documentElement.style.setProperty('--sat', sat);

    document.documentElement.style.setProperty('--speed', 10000 - motionSpeedInput.value + 'ms');

    setBrightness();

    websocket.send("motionColorValue" + motionColorInput.value.toString());
    websocket.send("motionSpeedValue" + motionSpeedInput.value.toString());
}

// Set sparkle
function setSparkleColor() {
    hue1 = Math.round(sparkleColorInput.value * 1.41176);
    document.documentElement.style.setProperty('--hue-1', hue1);

    hue2 = hue1;
    document.documentElement.style.setProperty('--hue-2', hue2);

    sat = '100%';
    document.documentElement.style.setProperty('--sat', sat);
    document.documentElement.style.setProperty('--speed', 10000 - sparkleSpeedInput.value + 'ms');

    setBrightness();

    websocket.send("sparkleColorValue" + sparkleColorInput.value.toString());
    websocket.send("sparkleSpeedValue" + sparkleSpeedInput.value.toString());
}

setCurrentMode();

*/

