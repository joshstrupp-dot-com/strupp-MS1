let mammoth;

function preload() {
  // Load the 3D model with normalized coordinates
  mammoth = loadModel("assets/woolly-mammoth-150k.obj", true);
}

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
}

function draw() {
  background(200);

  // Set up ambient and directional lights
  //   ambientLight(60, 60, 60);
  directionalLight(255, 255, 255, 0, 0, -1);

  // Moving point lights based on mouse position
  let locX = mouseX - width / 2;
  let locY = mouseY - height / 2;

  pointLight(255, 0, 0, locX, locY, 250);
  pointLight(0, 0, 255, -locX, -locY, 250);
  // Rotate the model based on mouse position
  let rotationX = map(mouseY, 0, height, -PI, PI);
  let rotationY = map(mouseX, 0, width, -PI, PI);
  rotateX(rotationX);
  rotateY(rotationY);

  // Display the model
  noStroke();
  scale(2); // Adjust the scale as needed
  model(mammoth);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
