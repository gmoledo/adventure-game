c = document.getElementById("editCanvas");
cc = c.getContext("2d");

var levelEditorBg = document.createElement("img");
levelEditorBg.src = "images/background_level_editor.png";
var player = document.createElement("img");
player.src =  "images/character_player.png";
var ground = document.createElement("img");
ground.src = "images/tile_ground.png";
var sand = document.createElement("img");
sand.src = "images/tile_sand.png";
var wall = document.createElement("img");
wall.src = "images/tile_wall.png";


tiles = [];

const TILE_SIZE = 40;
const ROWS = 15;
const COLS = 20;

const TILE_GROUND = 0;
const TILE_SAND = 1;
const TILE_WALL = 10;

var tileGrid = [];
for (var i=0; i<ROWS*COLS; i++)
{
  tileGrid[i] = TILE_GROUND;
}
var tileMap = new Map();
tileMap.set(TILE_GROUND, ground);
tileMap.set(TILE_SAND, sand);
tileMap.set(TILE_WALL, wall);

var mouseDown = false;
var brush = -1;
var border = {draw:false, x:0, y:0};

window.onload = function()
{


  c.addEventListener("mousedown", onMouseDown);
  c.addEventListener("mousemove", onMouseMove);
  c.addEventListener("mouseup", onMouseUp);

  createTileBlueprints();

  setInterval(update, 1000/144)
}

function createTileBlueprints()
{
  var groundTile = new Tile();
  groundTile.init(10, 10, ground, TILE_GROUND);
  tiles.push(groundTile);

  var sandTile = new Tile();
  sandTile.init(10, 110, sand, TILE_SAND);
  tiles.push(sandTile);

  var wallTile = new Tile();
  wallTile.init(10, 60, wall, TILE_WALL);
  tiles.push(wallTile);
}

function update()
{
  draw();
  drawTileGrid();
  //console.log(tiles);
  tiles.forEach(function(tile){
    tile.draw();
  });
}

function draw()
{
  cc.fillStyle = "grey";
  cc.fillRect(0, 0, 200, c.height);

  cc.fillStyle = "teal";
  cc.drawImage(levelEditorBg, 200, 0);

  if (border.draw)
    drawBorder(border.x, border.y);
}

function drawTileGrid()
{
  for (var i=0; i<tileGrid.length; i++)
  {
    cc.drawImage(tileMap.get(tileGrid[i]), 200+i%COLS*TILE_SIZE, Math.floor(i/COLS)*TILE_SIZE);
  }
}

function drawBorder(x, y)
{
  var borderX = x - 2;
  var borderY = y - 2;
  cc.fillStyle = "black";
  cc.lineWidth = 2;
  cc.strokeRect(borderX, borderY, 44, 44);
}

function Tile()
{
  this.x;
  this.y;
  this.sprite;

  this.init = function(x, y, image, type)
  {
    this.x = x;
    this.y = y;
    this.sprite = image;
    this.type = type;
  }

  this.draw = function()
  {
    //console.log(levelEditorBg);
    cc.drawImage(this.sprite, this.x, this.y);
  }
}

function onMouseDown(e)
{
  mouseDown = true;
  var mousePos = getMousePos(e);
  var found = false;
  if (mousePos.x < 200)
  {
    tiles.forEach(function(tile) {
      if (mousePos.x >= tile.x && mousePos.x < tile.x+tile.sprite.width &&
          mousePos.y >= tile.y && mousePos.y < tile.y+tile.sprite.height)
      {
        brush = tile.type;
        border = {draw:true, x:tile.x, y:tile.y};
        found = true;
      }
      else if (!found)
      {
        brush = -1;
        border = {draw:false, x:0, y:0};
      }
    });
  }
  else
  {
    var tile = mousePosToTileGrid(mousePos);
    //console.log(tile);
    if (brush != -1)
    {
      tileGrid[tile] = brush;
    }
  }
}

function mousePosToTileGrid(mousePos)
{
  var tileX = Math.floor((mousePos.x - 200) / TILE_SIZE);
  console.log(tileX);
  var tileY = Math.floor(mousePos.y / TILE_SIZE);
  console.log(tileY);
  return tileY * COLS + tileX;
}

function onMouseMove(e)
{
  var mousePos = getMousePos(e);
  if (mouseDown && mousePos.x >= 200)
  {
    var tile = mousePosToTileGrid(mousePos);
    if (brush != -1)
    {
      tileGrid[tile] = brush;
    }
  }

}

function onMouseUp(e)
{
  mouseDown = false;
}

function getMousePos(evt) {
  var rect = c.getBoundingClientRect();
  var root = document.documentElement;
  var mouseX = evt.clientX - rect.left - root.scrollLeft;
  var mouseY = evt.clientY - rect.top - root.scrollTop;
  return {
    x:mouseX,
    y:mouseY
  };
}

function buttonPressed()
{
  var tgString = tileGrid.toString();
  var tgArray = tgString.split(",");
  var tgElement = 0;
  var elementLength = 0;
  var textArea = document.getElementById("levelInfo");
  textArea.value = "[\n"
  for (var i=0; i<ROWS; i++)
  {
    for (var j=0; j<COLS; j++)
    {
      tgElement = tileGrid[i*COLS + j].toString();
      elementLength = tgElement.length;
      for (var k=0; k<4-elementLength; k++)
      {
        textArea.value += " ";
      }
      textArea.value += tgElement+",";
    }
    textArea.value += "\n";
  }
  textArea.value = textArea.value.substr(0, textArea.value.length-2)+"\n";
  textArea.value += "]";
}

function copyInfo()
{
  var copyText = document.getElementById("levelInfo");
  copyText.select();
  document.execCommand("Copy");
  alert("Copied Level Info to clipboard");
}