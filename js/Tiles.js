
const TILE_SIZE = 32;

const TILE_GROUND = 0;
const TILE_SAND   = 1;
const TILE_GRASS = 2;
const TILE_GRASS_1 = 21;
const TILE_GRASS_2 = 22;
const TILE_GRASS_3 = 23;
const TILE_DIRT = 3;
const TILE_DIRT_1 = 31;
const TILE_DIRT_2 = 32;
const TILE_CAVE_GROUND = 4;

const TILE_WALL = 10;

var tileToImageIdMap = new Map();
tileToImageIdMap.set(TILE_GROUND,       images.ground);
tileToImageIdMap.set(TILE_WALL,         images.wall);
tileToImageIdMap.set(TILE_SAND,         images.sand);
tileToImageIdMap.set(TILE_GRASS,        images.grass);
tileToImageIdMap.set(TILE_GRASS_1,      images.grass1);
tileToImageIdMap.set(TILE_GRASS_2,      images.grass2);
tileToImageIdMap.set(TILE_GRASS_3,      images.grass3);
tileToImageIdMap.set(TILE_DIRT,         images.dirt);
tileToImageIdMap.set(TILE_DIRT_1,       images.dirt1);
tileToImageIdMap.set(TILE_DIRT_2,       images.dirt2);
tileToImageIdMap.set(TILE_CAVE_GROUND,  images.caveGround);

const COL_EXISTS = 1;

function tileXYToTileGrid(room, tileX,  tileY)
{
  if (tileX > room.cols-1 || tileX < 0 || tileY > room.rows-1 || tileY < 0)
    return undefined;
  return tileY*room.cols + tileX;
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

      var tileType = currentRoom.artGrid[tileIndex];
      var tileImageId = tileToImageIdMap.get(tileType);
      var tileImage = imageMap.get(tileImageId);

      canvasContext.drawImage(tileImage,  tileLeftEdgeX,  tileTopEdgeY);

      tileIndex++;
      tileLeftEdgeX += TILE_SIZE;
    }

    tileTopEdgeY += TILE_SIZE;
  }
}
