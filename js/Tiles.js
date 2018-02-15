
const TILE_SIZE = 32;

const TILE_GROUND = 0;
const TILE_SAND   = 1;
const TILE_GRASS = 2;
const TILE_DIRT = 3;
const GROUND_CAP = 9;

const TILE_WALL   = 10;

var tileToImageIdMap = new Map();
tileToImageIdMap.set(TILE_GROUND,  images.ground);
tileToImageIdMap.set(TILE_WALL,    images.wall);
tileToImageIdMap.set(TILE_SAND,    images.sand);
tileToImageIdMap.set(TILE_GRASS,   images.grass);
tileToImageIdMap.set(TILE_DIRT,    images.dirt);

function tileXYToTileGrid(room, tileX,  tileY)
{
  if (tileX > room.cols-1 || tileX < 0 || tileY > room.rows-1 || tileY < 0)
    return undefined;
  return tileY*room.cols + tileX;
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

  for (var row=0; row<currentRoom.rows; row++)
  {
    tileLeftEdgeX = 0;

    for (var col=0; col<currentRoom.cols; col++)
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