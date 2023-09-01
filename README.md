# LED Control

Custom LED control app.

![Image](https://raw.githubusercontent.com/bgebelein/led-control/main/showcase/screenshot.png?token=GHSAT0AAAAAACHBCKG2XYMQMZKO5SLEED6EZHR4E2Q)

Based on a tutorial from [randomnerdtutorials.com](https://randomnerdtutorials.com/esp32-web-server-websocket-sliders/)

## Required Hardware

- ESP 32 Microcontroller (f.e. Lolin S2 Mini, which fits well into the battery compartment.)

- 5V RGB LED Ring (WS2812B)
  
- [LED Cat](https://de.aliexpress.com/w/wholesale-led-cat.html?catId=0&initiative_id=SB_20230901045352&SearchText=led+cat)
  
- USB Cable + Power Supply

## Required Software

- [Arduino IDE v1.8.x](https://www.arduino.cc/en/software#legacy-ide-18x) (See why v1.8.x is needed in About SPIFFS FileSystem Uploader Plugin in Arduino IDE section)

- [SPIFFS FileSystem Uploader Plugin in Arduino IDE](https://randomnerdtutorials.com/install-esp32-filesystem-uploader-arduino-ide/)

- [Arduino_JSON library by Arduino version 0.1.0](https://github.com/arduino-libraries/Arduino_JSON)

- [ESPAsyncWebServer](https://github.com/me-no-dev/ESPAsyncWebServer)

- [AsyncTCP](https://github.com/me-no-dev/AsyncTCP)
  
- [FastLED](https://fastled.io/)

## About SPIFFS FileSystem Uploader Plugin in Arduino IDE

**As of this writing, plugins like "SPIFFS FileSystem Uploader Plugin in Arduino IDE" are only supported by Arduino IDE v1.8.x.
So as long as V2 of Arduino IDE does not support the installation of plugins, we will have to stick to the older version of Arduino IDE instead.

### Install the plugin

- Go to the [releases page](https://github.com/me-no-dev/arduino-esp32fs-plugin/releases/) and download the latest `.zip` file.
- Go to the sketchbook location.<br>

  > Usually `C:\Users\YourUsername\Documents\Arduino` on a Windows PC and `Documents/Arduino` on a Mac
- Create a new folder named `tools`, if it does not already exists.
- Copy the `ESP32FS` folder in the downloaded .zip file to the **tools** folder you created in the previous step.
- Restart Arduino IDE.
- Make sure you can find the following menu item `Tools > ESP32 Sketch Data Upload`.

### Using the plugin

1. You will need to save an arduino sketch (can be empty).
2. Open the folder of your sketch.

   >`Sketch > Show Sketch Folder` in Arduino IDE
  
4. Create a folder named `data`, if it does not already exist.
5. Put all files you want to transfer to the ESP32 in the folder you created in the previous step.
6. Upload the files by selecting `Tools > ESP32 Sketch Data Upload` in the Arduino IDE

   > The uploader will overwrite anything you had already saved in the filesystem.
   
   >Some ESP32 development require you to press the on-board BOOT button when you see the *"Connecting …….____……"* message in the Arduino IDE Console.
  
7. The fileupload was successful, when you see the message *"SPIFFS Image Uploaded"*.
