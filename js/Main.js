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
  menu.init();
  camera.init();
  currentRoom = rooms[0];
  player.init("Player", 9, 7);
  initializeObjectsInRoom(); // Rooms.js 

  setInterval(mainLoop, 1000/fps);

}

function mainLoop()
{
  if (gameState == gameStates.GAME)
  {
    player.update();

    drawTiles(); // Tiles.js
    objects.forEach(object => {
      if (currentRoom == object.room)
        object.draw()
    });
  }

  if (gameState == gameStates.MENU)
  {
    menu.update();

    menu.drawMenu();
  }
}
