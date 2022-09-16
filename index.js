/// Matrix Webcam.

// Webcam stream.
let video;

// Root canvas for the processed video.
let canvas;

// Sliders.
let gridSizeSlider;
let backgroundDarknessSlider;
let thresholdSlider;
let textSizeSlider;

// Settings.
let isPaused = false;

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

function createUI() {
  // Creates all required sliders and buttons with texts.
  createSpan("<h3>Settings</h3>");

  // Sliders.
  createSpan("Grid size: ");
  gridSizeSlider = createSlider(7, 25, 25);
  createSpan("(7 - 25) <br>Text size: ");
  textSizeSlider = createSlider(6, 32, 12);
  createSpan("(6 - 32) <br>Darkness: ");
  backgroundDarknessSlider = createSlider(1, 255, 255);
  createSpan("(1 - 255) <br>Threshold: ");
  thresholdSlider = createSlider(1, 8, 2);
  createSpan("(1 - 8)<br>");

  pauseCheckbox = createCheckbox("Pause", false);
  pauseCheckbox.changed(switchPause);

  // Buttons.
  createSpan("<br/>");
  let resetButton = createButton("Reset settings");
  resetButton.mouseClicked(() => {
    gridSizeSlider.value(25);
    textSizeSlider.value(12);
    backgroundDarknessSlider.value(255);
    thresholdSlider.value(2);
  });
  createSpan("&nbsp;");
  let screenshotButton = createButton(
    "Take screenshot (or press <strong>Space</strong>)"
  );
  screenshotButton.mouseClicked(takeScreenshot);
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
  canvas = createCanvas(w, h);
  createUI();
  loadVideo();
}

function draw() {
  if (isPaused) return;

  // Clear background.
  background(255);
  noStroke();

  drawProcessedVideo();
}

function drawProcessedVideo() {
  // Draws and processes video to the canvas.
  // Load stream.
  video.loadPixels();

  // Get sliders values.
  let gridSize = gridSizeSlider.value();
  let backgroundDarkness = backgroundDarknessSlider.value();
  let threshold = thresholdSlider.value();
  textSize(textSizeSlider.value());

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
  // Checking keyboard.

  if (keyCode === 32) {
    // Space bar.
    return takeScreenshot();
  }
  if (keyCode === 17) {
    // Control.
    // Not implemented yet!
    //return switchPause();
  }
}

function takeScreenshot() {
  // Save canvas as image and gives it to the user browser (Download).
  saveCanvas(canvas, "matrix-webcam", "jpg");
}

function switchPause() {
  isPaused = !isPaused;
}
