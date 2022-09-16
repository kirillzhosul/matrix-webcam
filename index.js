// Webcamera stream.
let video;

// Sliders.
let gridSizeSlider;
let backgroundDarknessSlider;
let thresholdSlider;

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
  gridSizeSlider = createSlider(7, 25, 25);
  backgroundDarknessSlider = createSlider(1, 255, 255);
  thresholdSlider = createSlider(1, 8, 2);
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
  createCanvas(w, h);
  createSliders();
  loadVideo();
}

function draw() {
  // Clear background.
  background(255);
  noStroke();

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
