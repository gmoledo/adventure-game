c = document.getElementById("editCanvas");
cc = c.getContext("2d");

const ART = "Art";
const COLLISION = "Collision";
const OBJECT = "Object";

images = 
{
  ground:       {file: "images/tile_ground.png",        tile: 0,  type: ART},
  sand:         {file: "images/tile_sand.png",          tile: 1,  type: ART},
  grass:        {file: "images/tile_grass.png",         tile: 2,  type: ART},
  grass1:       {file: "images/tile_grass_1.png",       tile: 21, type: ART},
  grass2:       {file: "images/tile_grass_2.png",       tile: 22, type: ART},
  grass3:       {file: "images/tile_grass_3.png",       tile: 23, type: ART},
  dirt:         {file: "images/tile_dirt.png",          tile: 3,  type: ART},
  dirt1:        {file: "images/tile_dirt_1.png",        tile: 31, type: ART},
  dirt2:        {file: "images/tile_dirt_2.png",        tile: 32, type: ART},
  caveGround:   {file: "images/tile_cave_ground.png",   tile: 4,  type: ART},
  wall:         {file: "images/tile_wall.png",          tile: 10, type: ART},

  noCollision:  {file: "images/tile_no_collision.png",  tile: 0,  type: COLLISION},
  collision:    {file: "images/tile_collision.png",     tile: 1,  type: COLLISION},

  noObject:     {file: "images/tile_no_object.png",     tile: 0,  type: OBJECT},
  player:       {file: "images/character_player.png",   tile: 1,  type: OBJECT}
}
imageMap = new Map();

tiles = [];

var tileMap = new Map();
for (var imageIndex in images)
{
  var image = images[imageIndex];
  if (image.type == ART)
    tileMap.set(image.tile, image.file);
}

var objectMap = new Map();
objectMap.set(images.player.tile,   images.player.file);


const TILE_SIZE = 32;
var rows = 15;
var cols = 19;

function create2DArray(rows) {
  var arr = [];

  for (var i=0;i<rows;i++) {
     arr[i] = [];
  }

  return arr;
}

var artTileGrid = create2DArray(rows);
for (var i=0; i<rows; i++)
{
  for (var j=0; j<cols; j++)
  {
    artTileGrid[i][j] = images.ground.tile;
  }

}

var colTileGrid = create2DArray(rows);
for (var i=0; i<rows; i++)
{
  for (var j=0; j<cols; j++)
  {
    colTileGrid[i][j] = images.noCollision.tile;
  }
}

var objTileGrid = create2DArray(rows);
for (var i=0; i<rows; i++)
{
  for (var j=0; j<cols; j++)
  {
    objTileGrid[i][j] = images.noObject.tile;
  }

}

var mouseDown = false;
var mouseLastPos = {x: 0, y: 0};
var selectionScroll = {x: 0, y: 0};
var gridScroll = {x: 0, y: 0};
var shiftKeyDown = false;

var brush = -1;
var border = {draw:false, x:0, y:0};

window.onload = function()
{
  loadImages();

  c.addEventListener("mousedown", onMouseDown);
  c.addEventListener("mousemove", onMouseMove);
  document.addEventListener("mouseup", onMouseUp);

  document.addEventListener("keydown", onKeyDown);
  document.addEventListener("keyup", onKeyUp);

  createTileBlueprints();

  setInterval(update, 1000/144)
}

function loadImages()
{
  for (var image in images)
  {
    beginLoadingImage(images[image].file);
  }
}

function beginLoadingImage(imageFile)
{  
  var docImage = document.createElement("img");
  imageMap.set(imageFile, docImage);

  docImage.src = imageFile;
}

function createTileBlueprints()
{
  var newTile;
  var i = 0;
  for (var imageIndex in images)
  {
    var image = images[imageIndex];
    newTile = new Tile();
    newTile.init(10+50*(i%3), 10+50*Math.floor(i/3),
                  imageMap.get(image.file), image.tile, image.type);
    tiles.push(newTile);
    i++;
  }
}

function update()
{
  drawRight();
  drawArtTileGrid();
  drawObjTileGrid();
  drawColTileGrid();
  drawLeft();

  tiles.forEach(function(tile){
    tile.draw();
  });
}

function drawLeft()
{
  cc.fillStyle = "grey";
  cc.fillRect(0, 0, 200, c.height);
}

function drawRight()
{
  cc.fillStyle = "teal";
  cc.fillRect(200, 0, 800, 640);
}

function drawArtTileGrid()
{
  for (var i=0; i<artTileGrid.length; i++)
  {
    for (var j=0; j<artTileGrid[i].length; j++)
    {
      var tileType = artTileGrid[i][j];
      var tileImageId = tileMap.get(tileType);
      cc.drawImage(imageMap.get(tileImageId), 200+j*TILE_SIZE+gridScroll.x, i*TILE_SIZE+gridScroll.y);
    }
  }
}

function drawColTileGrid()
{
  for (var i=0; i<colTileGrid.length; i++)
  {
    for (var j=0; j<colTileGrid[i].length; j++)
    {
      if (colTileGrid[i][j] == 1)
      {
        cc.drawImage(imageMap.get(images.collision.file), 200+j*TILE_SIZE+gridScroll.x, i*TILE_SIZE+gridScroll.y);
      }     
    }
  }
}

function drawObjTileGrid()
{
  for (var i=0; i<objTileGrid.length; i++)
  {
    for (var j=0; j<objTileGrid[i].length; j++)
    {
      if (objTileGrid[i][j] == 1)
      {
        var tileType = objTileGrid[i][j];
        var tileImageId = objectMap.get(tileType);
        cc.drawImage(imageMap.get(tileImageId), 200+j*TILE_SIZE+gridScroll.x, i*TILE_SIZE+gridScroll.y);
      }
    }
  }
}

function drawBorder(x, y)
{
  var borderX = x - 2;
  var borderY = y - 2;
  cc.fillStyle = "black";
  cc.lineWidth = 2;
  cc.strokeRect(borderX, borderY, TILE_SIZE+4, TILE_SIZE+4);
}

function Tile()
{
  this.x;
  this.y;
  this.sprite;
  this.border = false;

  this.init = function(x, y, image, type, layer)
  {
    this.x = x;
    this.y = y;
    this.sprite = image;
    this.type = type;
    this.layer = layer;
  }

  this.draw = function()
  {
    cc.drawImage(this.sprite, this.x, this.y);

    if (this.border)
      drawBorder(this.x, this.y);
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
        brushLayer = tile.layer;
        tile.border = true;
        found = true;
        if (brush == images.player.tile && brushLayer == OBJECT)
        {
          alert("Player should only be placed once");
          mouseDown = false;
        }
      }
      else if (!found)
      {
        brush = -1;
        tile.border = false;
      }
      else
      {
        tile.border = false;
      }
    });
  }
  else if (mousePos.x >= 200 && !shiftKeyDown)
  {
    paintTile(mousePos);
  }
}

function onMouseMove(e)
{
  var mousePos = getMousePos(e);
  if (mouseDown && mousePos.x >= 200)
  {
    if (!shiftKeyDown)
    {
      paintTile(mousePos);
    }
    else
    {
      selectionScroll.x = mousePos.x - mouseLastPos.x;
      selectionScroll.y = mousePos.y - mouseLastPos.y;
      gridScroll.x += selectionScroll.x;
      gridScroll.y += selectionScroll.y;
    }
  }
  else if (mouseDown && mousePos.x < 200)
  {
    selectionScroll.y = mousePos.y - mouseLastPos.y;
    tiles.forEach(function(tile){
      tile.y += selectionScroll.y;
    });
  }
  mouseLastPos.x = mousePos.x;
  mouseLastPos.y = mousePos.y;
}

function onMouseUp(e)
{
  mouseDown = false;
}

function paintTile(mousePos)
{
  var tile = mousePosToTileGrid(mousePos);
  if (brush != -1 && tile != undefined)
  {      
    if (brushLayer == ART)
    {
      artTileGrid[tile.row][tile.col] = brush;
    }
    else if (brushLayer == COLLISION)
    {
      colTileGrid[tile.row][tile.col] = brush;
    }
    else
    {
      objTileGrid[tile.row][tile.col] = brush;
    }
  } 
}

function mousePosToTileGrid(mousePos)
{
  var tileX = Math.floor((mousePos.x - gridScroll.x - 200) / TILE_SIZE);
  var tileY = Math.floor((mousePos.y - gridScroll.y) / TILE_SIZE);
  if (tileX >= cols || tileY >= rows || tileX < 0 || tileY < 0)
    return undefined;
  return {row: tileY, col: tileX};
}



function getMousePos(evt) {
  var rect = c.getBoundingClientRect();
  var mouseX = evt.clientX - rect.left;
  var mouseY = evt.clientY - rect.top;
  return {
    x:mouseX,
    y:mouseY
  };
}

function onKeyDown(e)
{
  if (e.keyCode == 16)
  {
    shiftKeyDown = true;
  }
}

function onKeyUp(e)
{
  if (e.keyCode == 16)
  {
    shiftKeyDown = false;
  }
}

function buttonPressed()
{
  var tgElement = 0;
  var elementLength = 0;

  var textArea = document.getElementById("levelInfo");
  var roomName = document.getElementById("roomName").value;

  var doorNames = document.getElementById("doorNames").value;
  var doorXFlags = document.getElementById("doorXFlags").value;
  var doorYFlags = document.getElementById("doorYFlags").value;
  var doorXWarps = document.getElementById("doorXWarp").value;
  var doorYWarps = document.getElementById("doorYWarp").value;

  var doorNamesArray = doorNames.split(",");
  var doorXFlagsArray = doorXFlags.split("|");
  var doorYFlagsArray = doorYFlags.split("|");
  var doorXWarpsArray = doorXWarps.split(",");
  var doorYWarpsArray = doorYWarps.split(",");

  textArea.value = "new Room(\n\t";
  textArea.value += "\"" + roomName + "\", "+cols+", "+rows+",\n\t";
  textArea.value += "[\n\t";
  for (var i=0; i<rows; i++)
  {
    for (var j=0; j<cols; j++)
    {
      tgElement = artTileGrid[i*cols + j].toString();
      elementLength = tgElement.length;
      for (var k=0; k<4-elementLength; k++)
      {
        textArea.value += " ";
      }
      textArea.value += tgElement+",";
    }
    textArea.value += "\n\t";
  }
  textArea.value = textArea.value.substr(0, textArea.value.length-3)+"\n\t";
  textArea.value += "],\n\t";


  tgElement = 0;
  elementLength = 0;

  textArea.value += "[\n\t";
  for (var i=0; i<rows; i++)
  {
    for (var j=0; j<cols; j++)
    {
      tgElement = colTileGrid[i*cols + j].toString();
      elementLength = tgElement.length;
      for (var k=0; k<4-elementLength; k++)
      {
        textArea.value += " ";
      }
      textArea.value += tgElement+",";
    }
    textArea.value += "\n\t";
  }
  textArea.value = textArea.value.substr(0, textArea.value.length-3)+"\n\t";
  textArea.value += "],\n\t";

  tgElement = 0;
  elementLength = 0;

  textArea.value += "[\n\t";
  for (var i=0; i<rows; i++)
  {
    for (var j=0; j<cols; j++)
    {
      tgElement = objTileGrid[i*cols + j].toString();
      elementLength = tgElement.length;
      for (var k=0; k<4-elementLength; k++)
      {
        textArea.value += " ";
      }
      textArea.value += tgElement+",";
    }
    textArea.value += "\n\t";
  }
  textArea.value = textArea.value.substr(0, textArea.value.length-3)+"\n\t";
  textArea.value += "],\n\t";


  textArea.value += "[\n\t\t";
  for (var i=0; i<doorNamesArray.length; i++)
  {
    textArea.value += "new Door(";
    textArea.value += "\""+doorNamesArray[i]+"\", ";
    textArea.value += doorXFlagsArray[i]+", ";
    textArea.value += doorYFlagsArray[i]+", ";
    textArea.value += doorXWarpsArray[i]+", ";
    if (i < doorNamesArray.length-1)
      textArea.value += doorYWarpsArray[i]+"),\n\t\t";
    else
      textArea.value += doorYWarpsArray[i]+")\n\t";
  }
  textArea.value += "]\n";
  textArea.value += ");";
}

function copyInfo()
{
  var copyText = document.getElementById("levelInfo");
  copyText.select();
  document.execCommand("Copy");
  alert("Copied Level Info to clipboard");
}

function getRowsAndCols()
{
  var oldRows = rows;
  var oldCols = cols;
  rows = Number(document.getElementById("rows").value);
  cols = Number(document.getElementById("cols").value);
  var diffRows = rows - oldRows;
  var diffCols = cols - oldCols;
  var newArtTileGrid = [];
  var newColTileGrid = [];  

  if (diffRows >= 0)
  {
    for (var i=0; i<diffRows; i++)
    {
      artTileGrid[oldRows+i] = [];
      for (var col=0; col<oldCols; col++)
      {
        artTileGrid[oldRows+i][col] = 0;
      }
    }
  }
  else
  {
    artTileGrid.splice(artTileGrid.length+diffRows);
  }

  if (diffCols >= 0)
  {
    for (var i=0; i<rows; i++)
    {
      for (var j=0; j<diffCols; j++)
      {
        artTileGrid[i].push(0);
      }
    }
  }
  else
  {
    for (var i=0; i<rows; i++)
    {
      artTileGrid[i].splice(artTileGrid[i].length+diffCols);
    }
  }

  colTileGrid = newColTileGrid;
  gridScroll.x = 0;
  gridScroll.y = 0;
}