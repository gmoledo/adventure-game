var canvas, canvasContext;
var fps = 144;

// Game states to control flow of logic and input handling in
// different contexts, such as menu controls vs main gameplay
const gameStates = Object.freeze({
  MENU: Symbol("menu"),
  GAME: Symbol("game")
});
gameState = gameStates.GAME;


window.onload = function()
{
  canvas = document.getElementById("gameCanvas");
  canvasContext = canvas.getContext("2d");

  loadImages(); // ImageHandling.js
}

function startGame()
{
  initInput();
  player.init("Earl");
  menu.init();
  camera.init();
  currentRoom = rooms[0];

  setInterval(mainLoop, 1000/fps);

}

function mainLoop()
{
  if (gameState == gameStates.GAME)
  {
    player.update();

    drawTiles(); // Tiles.js
    player.draw();
  }

  if (gameState == gameStates.MENU)
  {
    menu.update();

    menu.drawMenu();
  }
}