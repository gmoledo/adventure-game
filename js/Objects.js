var objects = [];

function Stick(tileX, tileY)
{
  this.tileX = tileX;
  this.tileY = tileY;

  this.x = this.tileX * TILE_SIZE;
  this.y = this.tileY * TILE_SIZE;

  this.sprite = imageMap.get(images.stick);

  this.tileWidth = this.sprite.width / TILE_SIZE;
  this.tileHeight = this.sprite.height / TILE_SIZE;

  this.tiles = [];

  this.room = currentRoom;


  objects.push(this);

  this.getTiles = function()
  {
    for (var i=0; i<this.tileWidth; i++)
    {
      var tile = tileXYToTileGrid(currentRoom, this.tileX+i, this.tileY);
      this.tiles.push(tile);
      currentRoom.colGrid[tile] = 1;
    }
    for (var j=1; j<this.tileHeight; j++)
    {
      var tile = tileXYToTileGrid(currentRoom, this.tileX, this.tileY+j);
      this.tiles.push(tile);
      currentRoom.colGrid[tile] = 1;
    }
  }
  this.getTiles();

  this.doInspection = function()
  {
    player.inventory.push(this);

    objects.splice(objects.indexOf(this), 1);

    currentRoom.objGrid[tileXYToTileGrid(currentRoom, this.tileX, this.tileY)] = 0;
    this.tiles.forEach(tile => {
      currentRoom.colGrid[tile] = 0;
    });
  }


  this.draw = function()
  {
    canvasContext.drawImage(this.sprite, this.x, this.y);
  }
}

function Boulder(tileX, tileY)
{
  this.tileX = tileX;
  this.tileY = tileY;

  this.x = this.tileX * TILE_SIZE;
  this.y = this.tileY * TILE_SIZE;

  this.sprite = imageMap.get(images.boulder);

  this.tileWidth = this.sprite.width / TILE_SIZE;
  this.tileHeight = this.sprite.height / TILE_SIZE;

  this.tiles = [];

  this.room = currentRoom;

  this.moved = false;
  this.persistent = true;


  objects.push(this);

  this.getTiles = function()
  {
    for (var i=0; i<this.tileWidth; i++)
    {
      var tile = tileXYToTileGrid(currentRoom, this.tileX+i, this.tileY);
      this.tiles.push(tile);
      currentRoom.colGrid[tile] = 1;
    }
    for (var j=1; j<this.tileHeight; j++)
    {
      var tile = tileXYToTileGrid(currentRoom, this.tileX, this.tileY+j);
      this.tiles.push(tile);
      currentRoom.colGrid[tile] = 1;
    }
  }
  this.getTiles();

  this.doInspection = function()
  {
    if (player.inventory.filter(item => item instanceof Stick).length != 0 
        && !this.moved)
    {
      var oldTile = tileXYToTileGrid(currentRoom, this.tileX, this.tileY)
      currentRoom.objGrid[oldTile] = 0;
      currentRoom.colGrid[oldTile] = 0;

      this.tileX += 1;
      this.tileY -= 1;
      this.x = this.tileX * TILE_SIZE;
      this.y = this.tileY * TILE_SIZE;

      var newTile = tileXYToTileGrid(currentRoom, this.tileX, this.tileY);
      currentRoom.colGrid[newTile] = 1;

      this.tiles = [];
      this.getTiles();

      this.moved = true;
    }
    else
    {
      console.log("Need stick");
    }
  }

  this.draw = function()
  {
    canvasContext.drawImage(this.sprite, this.x, this.y);
  }
}
