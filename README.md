# LED Control

Custom LED control app.

![Image](https://raw.githubusercontent.com/bgebelein/led-control/main/showcase/screenshot.png?token=GHSAT0AAAAAACHBCKG2XYMQMZKO5SLEED6EZHR4E2Q)

Based on a tutorial from [randomnerdtutorials.com](https://randomnerdtutorials.com/esp32-web-server-websocket-sliders/)

## Required Hardware

- ESP Microcontroller (f.e. Lolin S2 Mini, which fits well into the battery compartment.)

- 5V RGB LED Ring (WS2812B)
  
- [LED Cat](https://de.aliexpress.com/w/wholesale-led-cat.html?catId=0&initiative_id=SB_20230901045352&SearchText=led+cat)
  
- USB Cable + Power Supply

## Required Software

- [Arduino IDE v1.8.x](https://www.arduino.cc/en/software#legacy-ide-18x)

- [SPIFFS FileSystem Uploader Plugin in Arduino IDE](https://randomnerdtutorials.com/install-esp32-filesystem-uploader-arduino-ide/) (Will only work with Arduino IDE v1.8.x, as of this writing. See [this issue](https://github.com/me-no-dev/arduino-esp32fs-plugin/issues/44) for updates)

- [Arduino_JSON library by Arduino version 0.1.0](https://github.com/arduino-libraries/Arduino_JSON)

- [ESPAsyncWebServer](https://github.com/me-no-dev/ESPAsyncWebServer)

- [AsyncTCP](https://github.com/me-no-dev/AsyncTCP)
  
- [FastLED](https://fastled.io/)
