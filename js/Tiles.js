
const TILE_SIZE = 40;

const TILE_GROUND = 0;
const TILE_SAND   = 1;
const GROUND_CAP = 9;

const TILE_WALL   = 10;

var tileToImageIdMap = new Map();
tileToImageIdMap.set(TILE_GROUND,  images.ground);
tileToImageIdMap.set(TILE_WALL,    images.wall);
tileToImageIdMap.set(TILE_SAND,    images.sand);

function tileXYToTileGrid(tileX,  tileY)
{
  if (tileX > COLS-1 || tileX < 0 || tileY > ROWS-1 || tileY < 0)
    return undefined;
  return tileY*COLS + tileX;
}

function updateTiles()
{
  // currentRoom = rooms[tileXYToTileGrid(roomX, roomY)];
}

function drawTiles()
{
  var tileIndex = 0;
  var tileLeftEdgeX = 0;
  var tileTopEdgeY = 0;

  for (var row=0; row<ROWS; row++)
  {
    tileLeftEdgeX = 0;

    for (var col=0; col<COLS; col++)
    {
      var tileType = currentRoom.grid[tileIndex];
      var tileImageId = tileToImageIdMap.get(tileType);
      var tileImage = imageMap.get(tileImageId);

      canvasContext.drawImage(tileImage,  tileLeftEdgeX,  tileTopEdgeY);

      tileIndex++;
      tileLeftEdgeX += TILE_SIZE;
    }

    tileTopEdgeY += TILE_SIZE;
  }
}