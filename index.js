// Webcamera stream.
let video;
let screenshot;

// Sliders.
let gridSizeSlider;
let backgroundDarknessSlider;
let thresholdSlider;
let textSizeSlider;

// Sizes.
const w = 640;
const h = 480;

// Matrix of the chars.
let matrix = "А+Б0В-Г1Д=Е2Ё Ж3З И4Й К5Л М6Н О7П Р8С Т9У Ф!Х Ц?Ч Ш.ЩЪ,Ы Ь:ЭЮ;Я";
matrix = matrix.split("");

function loadVideo() {
  // Creates video capture and loads video stream.
  video = createCapture(VIDEO);
  video.size(w, h);
  video.hide();
}

function createSliders() {
  // Creates all required sliders.

  createSpan("<h3>Settings</h3>");
  createSpan("Grid size: ");
  gridSizeSlider = createSlider(7, 25, 25);
  createSpan("(7 - 25) <br>Text size: ");
  textSizeSlider = createSlider(6, 32, 12);
  createSpan("(6 - 32) <br>Darkness: ");
  backgroundDarknessSlider = createSlider(1, 255, 255);
  createSpan("(1 - 255) <br>Threshold: ");
  thresholdSlider = createSlider(1, 8, 2);
  createSpan("(1 - 8)<br>");
  let resetButton = createButton("Reset");
  resetButton.mouseClicked(() => {
    gridSizeSlider.value(25);
    textSizeSlider.value(12);
    backgroundDarknessSlider.value(255);
    thresholdSlider.value(2);
  });
}
function createButtons(){
  screenshot=createButton("Screenshot!");
  let divButton=document.getElementById('#button');
  screenshot.parent(divButton);
  screenshot.mousePressed(takeScreenshot);
}

function videoGetPixel(index) {
  // Returns pixel (RGB) from video stream by index.
  let r = video.pixels[index + 0];
  let g = video.pixels[index + 1];
  let b = video.pixels[index + 2];
  return [r, g, b];
}

function getBrightnessFromRGB(r, g, b) {
  // Returns brightness from RGB color.
  return 0.267 * r + 0.642 * g + 0.091 * b;
}

function setup() {
  // Init.
  c= createCanvas(w, h);
  createSliders();
  createButtons();
  loadVideo();
}

function draw() {
  // Clear background.
  background(255);
  noStroke();
  textSize(textSizeSlider.value());

  // Load stream.
  video.loadPixels();

  // Get sliders values.
  let gridSize = gridSizeSlider.value();
  let backgroundDarkness = backgroundDarknessSlider.value();
  let threshold = thresholdSlider.value();
  for (let y = 0; y < video.height; y += gridSize) {
    for (let x = 0; x < video.width; x += gridSize) {
      // Iterate over video pixels.

      // Calculate  array index, and require pixel RGB.
      let index = (y * video.width + x) * 4;
      let [r, g, b] = videoGetPixel(index);

      // Calculate brightness.
      let brightness = getBrightnessFromRGB(r, g, b);

      if (brightness >= 255 / threshold) {
        // Foreground.
        fill(brightness, brightness, brightness);
      } else {
        // Background.
        let darkness = map(brightness, 0, 255, backgroundDarkness, 0);
        fill(0, darkness, 0);
      }

      // Get character from matrix by brightness and draw it.
      let charIndex = floor(map(brightness, 0, 255, 0, matrix.length, false));
      let char = matrix[charIndex];
      text(char, x, y);
    }
  }
}

function keyPressed() {
  if (keyCode === 32) {
    takeScreenshot();
    return false;
  }    
  return true;
}

function takeScreenshot(){
  saveCanvas(c, 'myScreenshot', 'jpg');
  //save(screenshot, 'myScreenshot.png');
}
