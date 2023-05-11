// Websocket Connection

let gateway = `ws://${window.location.hostname}/ws`;
let websocket;

// Start websocket

window.addEventListener('load', initWebSocket());

function initWebSocket() {
    console.log('Trying to open a WebSocket connection…');
    websocket = new WebSocket(gateway);

    // Create Callback functions
    websocket.onopen = onOpen;
    websocket.onclose = onClose;
    websocket.onmessage = onMessage;
}

// get values when websocket connection is opened

function onOpen() {
    console.log('Connection opened');
    websocket.send("getValues");
}

// Try to reconnect, when websocket connection is closed (accidentally)

function onClose() {
    console.log('Connection closed');
    setTimeout(initWebSocket, 2000);
}

// Set Input Value on Websocket message

function onMessage(event) {
    let ledObj = JSON.parse(event.data);
    let keys = Object.keys(ledObj);

    keys.forEach(function(key){
        switch (key) {
            case "mode":
                document.querySelector(`input[value="${ledObj[key]}"]`).checked = true;
                break;
            case "temp":
                tempInput.value = Math.round(ledObj[key] / 2.55);
                break;
            case "hue1":
                hueInput1.value = Math.round(ledObj[key] * 1.4117647059);
                break;
            case "hue2":
                hueInput2.value = Math.round(ledObj[key] * 1.4117647059);
                break;
            case "lit":
                brightnessInput.value = Math.round(ledObj[key] / 5.1);
                break;
            case "speed":
                speedInput.value = 3000 - ledObj[key];
                break;
            default:
                console.log("Sorry, no keys available.");
        }
    });

    setMode();
}

/* ------------------------------------ UI Stuff ------------------------------------ */

let currentMode = document.querySelector('input[type=radio]:checked').value;

const tempInput = document.querySelector('#temperature-input > input[type="range"]');
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
    tempInput.parentNode.hidden = true;
    hueInput1.parentNode.hidden = true;
    hueInput2.parentNode.hidden = true;
    speedInput.parentNode.hidden = true;

    // Show necessary UI
    switch (currentMode) {
        case 'white':
            tempInput.parentNode.hidden = false;
            setCssProps('30', '30', tempInput.value, getCssProp('lit'), getCssProp('speed'));
            break;
        case 'color':
            hueInput1.parentNode.hidden = false;
            setCssProps(hueInput1.value, hueInput1.value, '100', getCssProp('lit'), getCssProp('speed'));
            break;
        case 'gradient':
            hueInput1.parentNode.hidden = false;
            hueInput2.parentNode.hidden = false;
            setCssProps(hueInput1.value, hueInput2.value, '100', getCssProp('lit'), getCssProp('speed'));
            break;
        case 'fade':
            document.querySelectorAll('.cat').forEach(cat => cat.classList.add('fade'));
            speedInput.parentNode.hidden = false;
            setCssProps(hueInput1.value, hueInput1.value, '100', getCssProp('lit'), 3000 - parseInt(speedInput.value));
            break;
        case 'rainbow':
            document.querySelectorAll('.cat').forEach(cat => cat.classList.add('fade'));
            speedInput.parentNode.hidden = false;
            setCssProps(hueInput1.value, parseInt(hueInput1.value) + 20, '100', getCssProp('lit'), 3000 - parseInt(speedInput.value));
            break;
        case 'breathe':
            document.querySelectorAll('.cat').forEach(cat => cat.classList.add('breathe'));
            hueInput1.parentNode.hidden = false;
            speedInput.parentNode.hidden = false;
            setCssProps(hueInput1.value, hueInput1.value, '100', getCssProp('lit'), 3000 - parseInt(speedInput.value));
            break;
        case 'motion':
            document.querySelectorAll('.cat').forEach(cat => cat.classList.add('breathe'));
            hueInput1.parentNode.hidden = false;
            speedInput.parentNode.hidden = false;
            setCssProps(hueInput1.value, hueInput1.value, '100', getCssProp('lit'), 3000 - parseInt(speedInput.value));
            break;
        case 'sparkle':
            document.querySelectorAll('.cat').forEach(cat => cat.classList.add('sparkle'));
            hueInput1.parentNode.hidden = false;
            speedInput.parentNode.hidden = false;
            setCssProps(hueInput1.value, hueInput1.value, '100', getCssProp('lit'), 3000 - parseInt(speedInput.value));
            break;
    }
}

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
    setCssProps(getCssProp('hue1'), getCssProp('hue2'), 100 - tempInput.value, getCssProp('lit'), getCssProp('speed'));
}

function setHue1() {
    if(currentMode === 'gradient') {
        setCssProps(hueInput1.value, getCssProp('hue2'), getCssProp('sat'), getCssProp('lit'), getCssProp('speed'));
    } else {
        setCssProps(hueInput1.value, hueInput1.value, '100', getCssProp('lit'), getCssProp('speed'));
    }
}

function setHue2() {
    setCssProps(getCssProp('hue1'), hueInput2.value, getCssProp('sat'), getCssProp('lit'), getCssProp('speed'));
}

function setSpeed() {
    setCssProps(getCssProp('hue1'), getCssProp('hue2'), getCssProp('sat'), getCssProp('lit'), 3000 - speedInput.value);
}

function setBrightness() {
    setCssProps(getCssProp('hue1'), getCssProp('hue2'), getCssProp('sat'), brightnessInput.value, getCssProp('speed'));
}

btn.addEventListener('click', function() {
    // Update UI brightness slider
    if (brightnessInput.value < 1) {
        brightnessInput.value = 50;
    } else {
        brightnessInput.value = 0;
    }

    // set CSS properties
    setBrightness();

    // send WebSocket message
    websocket.send('lit' + brightnessInput.value);
});

/* ------------------------------------ Websocket Message ------------------------------------ */

document.querySelectorAll('input').forEach(function(input){
    input.addEventListener('change', function(){
        console.log(`Client: ${input.name} - ${input.value}`);
        websocket.send(input.name + input.value);
    });
});