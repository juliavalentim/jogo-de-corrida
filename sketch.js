var canvas;
var backgroundImage;
var bgImg;
var database;
var form, player,game;
var playerCount;
var gameState;
var cars = []
var car1, car1img, car2, car2img
var track
var allPlayers
var obstacles, obsimg1, obsimg2
var fuels, fuelimg
var coins, coinimg
var lifeimg

function preload() {
  backgroundImage = loadImage("./assets/planodefundo.png");
  car1img = loadImage("./assets/car1.png")
  car2img = loadImage("./assets/car2.png")
  track = loadImage("./assets/PISTA.png")
  obsimg1 = loadImage("./assets/obstacle1.png")
  obsimg2 = loadImage("./assets/obstacle2.png")
  fuelimg = loadImage("./assets/fuel.png")
  coinimg = loadImage("./assets/goldCoin.png")
  lifeimg = loadImage("./assets/life.png")
}

function setup() {
  canvas = createCanvas(windowWidth, windowHeight);
  database = firebase.database();
  game = new Game();
  game.getState();
  game.start();

}

function draw() {
  background(backgroundImage);

  if (playerCount == 2) {
    game.updateState(1)
  }

  if (gameState == 1) {
    game.play()
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
