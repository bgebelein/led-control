#include <FastLED.h>
#include <Arduino.h>
#include <WiFi.h>
#include <AsyncTCP.h>
#include <ESPAsyncWebServer.h>
#include "SPIFFS.h"
#include <Arduino_JSON.h>

// LED stuff
#define NUM_LEDS  12
CRGB leds[NUM_LEDS];

// network credentials
const char* ssid = "YOUR WIFI SSID";
const char* password = "YOUR WIFI PASSWORD";

// Create AsyncWebServer object on port 80
AsyncWebServer server(80);

// Create a WebSocket object
AsyncWebSocket ws("/ws");

// Set LED GPIO
const int ledPin = 12;

String message = "";
uint8_t temperatureValue = 0;
uint8_t colorValue = 0;
int fadeSpeedValue = 100;
int rainbowSpeedValue = 100;
uint8_t brightnessValue = 0;
String modeValue = "color";

//Json Variable to Hold Slider Values
JSONVar ledValues;

//Get Slider Values
String getLedValues(){
  ledValues["temperatureValue"] = String(temperatureValue);
  ledValues["colorValue"] = String(colorValue);
  ledValues["fadeSpeedValue"] = String(fadeSpeedValue);
  ledValues["rainbowSpeedValue"] = String(rainbowSpeedValue);
  ledValues["brightnessValue"] = String(brightnessValue);
  ledValues["modeValue"] = String(modeValue);

  String jsonString = JSON.stringify(ledValues);
  return jsonString;
}

// Initialize SPIFFS
void initFS() {
  if (!SPIFFS.begin()) {
    Serial.println("An error has occurred while mounting SPIFFS");
  }
  else{
   Serial.println("SPIFFS mounted successfully");
  }
}

// Initialize WiFi
void initWiFi() {
  WiFi.mode(WIFI_STA);
  WiFi.begin(ssid, password);
  Serial.print("Connecting to WiFi ..");
  while (WiFi.status() != WL_CONNECTED) {
    Serial.print('.');
    delay(1000);
  }
  Serial.println(WiFi.localIP());
}

void notifyClients(String ledValues) {
  ws.textAll(ledValues);
}

void handleWebSocketMessage(void *arg, uint8_t *data, size_t len) {
  AwsFrameInfo *info = (AwsFrameInfo*)arg;
  if (info->final && info->index == 0 && info->len == len && info->opcode == WS_TEXT) {
    data[len] = 0;
    message = (char*)data;

    if (message.indexOf("temperatureValue") >= 0) {
      temperatureValue = message.substring(16).toInt();
      Serial.println(getLedValues());
      notifyClients(getLedValues());
    }
    
    if (message.indexOf("colorValue") >= 0) {
      colorValue = message.substring(10).toInt();
      Serial.println(getLedValues());
      notifyClients(getLedValues());
    }

    if (message.indexOf("fadeSpeedValue") >= 0) {
      fadeSpeedValue = message.substring(14).toInt();
      Serial.println(getLedValues());
      notifyClients(getLedValues());
    }

    if (message.indexOf("rainbowSpeedValue") >= 0) {
      rainbowSpeedValue = message.substring(17).toInt();
      Serial.println(getLedValues());
      notifyClients(getLedValues());
    }

    if (message.indexOf("brightnessValue") >= 0) {
      brightnessValue = message.substring(15).toInt();
      Serial.println(getLedValues());
      notifyClients(getLedValues());
    }

    if (message.indexOf("modeValue") >= 0) {
      modeValue = message.substring(9);
      Serial.println(getLedValues());
      notifyClients(getLedValues());
    }

    if (strcmp((char*)data, "getValues") == 0) {
      notifyClients(getLedValues());
    }
  }
}

void onEvent(AsyncWebSocket *server, AsyncWebSocketClient *client, AwsEventType type, void *arg, uint8_t *data, size_t len) {
  switch (type) {
    case WS_EVT_CONNECT:
      Serial.printf("WebSocket client #%u connected from %s\n", client->id(), client->remoteIP().toString().c_str());
      break;
    case WS_EVT_DISCONNECT:
      Serial.printf("WebSocket client #%u disconnected\n", client->id());
      break;
    case WS_EVT_DATA:
      handleWebSocketMessage(arg, data, len);
      break;
    case WS_EVT_PONG:
    case WS_EVT_ERROR:
      break;
  }
}

void initWebSocket() {
  ws.onEvent(onEvent);
  server.addHandler(&ws);
}


void setup() {
  Serial.begin(115200);
  pinMode(ledPin, OUTPUT);

  // LED setup
  FastLED.addLeds<WS2812B, ledPin, GRB>(leds, NUM_LEDS);

  // logging setup
  initFS();

  // WiFi setup
  initWiFi();

  // websocket setup
  initWebSocket();
  
  // Web Server Root URL
  server.on("/", HTTP_GET, [](AsyncWebServerRequest *request){
    request->send(SPIFFS, "/index.html", "text/html");
  });
  
  server.serveStatic("/", SPIFFS, "/");

  // Start server
  server.begin();

}

void loop() {
  ws.cleanupClients();

  if (modeValue == "white") {
    fill_solid(leds, NUM_LEDS, CHSV(30, 255 - temperatureValue, brightnessValue));
  }

  if (modeValue == "color") {
    fill_solid(leds, NUM_LEDS, CHSV(colorValue, 255, brightnessValue));
  }

  if (modeValue == "fade") {
    fill_solid(leds, NUM_LEDS, CHSV(colorValue, 255, brightnessValue));

    delay(fadeSpeedValue);

    colorValue++;
  }

  if (modeValue == "rainbow") {
    for (int i = 0; i < NUM_LEDS; i++) {
      leds[i] = CHSV(255 / NUM_LEDS * i + colorValue, 255, brightnessValue);
    }

    delay(rainbowSpeedValue);

    colorValue++;
  }

  FastLED.show();
}
