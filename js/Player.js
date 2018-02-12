var player = new Player();

const WALK_TIME_MULTIPLIER = 1/9;

function Player()
{
  // General variables (defaults are just to show type)
  this.name = "";
  this.tileX = 0;
  this.tileY = 0;
  this.x = 0;
  this.y = 0;
  this.sprite = null;
  this.dir = {x:1, y:0};
  this.speed = 0;
  this.walkTime = 0;
  this.walkFrame = 0;

  // State variables
  const states = Object.freeze({
    STAND: Symbol("stand"),
    WALK: Symbol("walk")
  });
  this.state = states.STAND;
  
  // Various control schemes
  const controlSchemes = Object.freeze({
    ARROWS: Symbol("arrows"),
    WASD: Symbol("wasd")
  });
  this.controlScheme = controlSchemes.ARROWS;

  // Holds key code for input
  this.northKey;
  this.eastKey;
  this.southKey;
  this.westKey;
  this.toggleKey;

  // Whether or not key is held
  this.northKeyHeld = false;
  this.eastKeyHeld = false;
  this.southKeyHeld = false;
  this.westKeyHeld = false;
  this.directionKeyHeld = this.northKeyHeld || this.eastKeyHeld ||
                          this.southKeyHeld || this.westKeyHeld;


  this.walkCycleFramePattern = [1, 0, 2];


  this.init = function(name)
  {
    this.name = name; 
    this.tileX = 6;
    this.tileY = 7;
    this.x = this.tileX * TILE_SIZE;   // TILE_SIZE -> Tiles.js
    this.y = this.tileY * TILE_SIZE;
    this.walkTime = fps * WALK_TIME_MULTIPLIER;  // fps -> Main.js
    this.speed = TILE_SIZE / this.walkTime;
    this.sprite = imageMap.get(images.player);
    this.setupControls(this.controlScheme);
  }

  this.switchControlSchemes = function()
  {
    this.controlScheme = this.controlScheme == controlSchemes.ARROWS ?
                                                controlSchemes.WASD : 
                                                controlSchemes.ARROWS;
    this.setupControls(this.controlScheme);
  }

  this.setupControls = function(controlScheme)
  {
    if (controlScheme == controlSchemes.ARROWS)
    {
      this.northKey = KEY_UP_ARROW;
      this.eastKey = KEY_RIGHT_ARROW;
      this.southKey = KEY_DOWN_ARROW;
      this.westKey = KEY_LEFT_ARROW;
    }

    if (controlScheme == controlSchemes.WASD)
    {
      this.northKey = KEY_LETTER_W;
      this.eastKey = KEY_LETTER_D;
      this.southKey = KEY_LETTER_S;
      this.westKey = KEY_LETTER_A;
    }

    this.toggleKey = KEY_LETTER_T;
  }

  this.update = function()
  {
    if (this.state == states.STAND)
    {
      this.standStateLogic();
    }

    if (this.state == states.WALK)
    {
      this.walkStateLogic();
    }
  }

  this.standStateLogic = function()
  {
    this.directionKeyHeld = this.northKeyHeld || this.eastKeyHeld ||
                            this.southKeyHeld || this.westKeyHeld;
    
    if (this.northKeyHeld)  this.setDirection(0, -1);
    if (this.eastKeyHeld)   this.setDirection(1, 0);
    if (this.southKeyHeld)  this.setDirection(0, 1);
    if (this.westKeyHeld)   this.setDirection(-1, 0);
    
    var collision = this.checkCollision();
    if (!collision && this.directionKeyHeld)
    {
      this.state = states.WALK;
    }

  }

  this.walkStateLogic = function()
  {
    this.x += this.dir.x * this.speed;
    this.y += this.dir.y * this.speed;
    this.walkFrame++;

    if (this.walkFrame >= this.walkTime)
    {
      var frameVsTimeDiff = this.walkFrame-this.walkTime;
      this.x -= this.dir.x * this.speed * frameVsTimeDiff;
      this.y -= this.dir.y * this.speed * frameVsTimeDiff;
      this.x = Math.round(this.x);
      this.y = Math.round(this.y);
      this.walkFrame = 0;

      if (this.x < 0 || this.x >= canvas.width)
      {
        this.x = (this.x < 0) ? canvas.width : 0-TILE_SIZE;
        this.tileX = this.x == -TILE_SIZE ? -1 : currentRoom.cols;
        changeRoom(this.tileX, this.tileY);
      }
      else if (this.y < 0 || this.y >= canvas.height)
      {
        this.y = (this.y < 0) ? canvas.height : 0-TILE_SIZE;
        this.tileY = this.y == 0-TILE_SIZE ? -1 : currentRoom.rows;
        changeRoom(this.tileX, this.tileY);
      }
      else
      {
        this.state = states.STAND;

        this.tileX += this.dir.x;
        this.tileY += this.dir.y;
      }

    }
  }

  this.checkCollision = function()
  {
    var nextTileX = this.tileX + this.dir.x;
    var nextTileY = this.tileY + this.dir.y;
    
    var nextTileInGrid = tileXYToTileGrid(currentRoom, nextTileX, nextTileY);  // tileXYToTileGrid() -> tiles.js

    if (nextTileInGrid == undefined)
    {
      return false;
    }
    return currentRoom.grid[nextTileInGrid] > GROUND_CAP // currentRoom, TILE_GROUND -> tiles.js

  }

  this.clearMovementKeys = function()
  {
    this.northKeyHeld = false;
    this.eastKeyHeld = false;
    this.southKeyHeld = false;
    this.westKeyHeld = false;
    this.directionKeyHeld = false;
  }

  this.draw = function()
  {
    if (this.state == states.WALK)
    {
      var frames;
      if (this.dir.x == 0 && this.dir.y == 1)  frames = images.playerWalkSouth;
      if (this.dir.x == 0 && this.dir.y == -1) frames = images.playerWalkNorth;
      if (this.dir.x == 1 && this.dir.y == 0)  frames = images.playerWalkEast;
      if (this.dir.x == -1 && this.dir.y == 0) frames = images.playerWalkWest;

      var animLength = this.walkCycleFramePattern.length
      var animFrameIndex = Math.floor(this.walkFrame/this.walkTime * animLength); 
      var animFrame = this.walkCycleFramePattern[animFrameIndex];
      this.sprite = imageMap.get(frames[animFrame]);
    }

    if (this.state == states.STAND)
    {
      var firstFrame;
      if (this.dir.x == 0 && this.dir.y == 1)   firstFrame = images.playerWalkSouth[0];
      if (this.dir.x == 0 && this.dir.y == -1)  firstFrame = images.playerWalkNorth[0];
      if (this.dir.x == 1 && this.dir.y == 0)   firstFrame = images.playerWalkEast[0];
      if (this.dir.x == -1 && this.dir.y == 0)  firstFrame = images.playerWalkWest[0];

      this.sprite = imageMap.get(firstFrame);

    }

    canvasContext.drawImage(this.sprite, this.x, this.y);
  }

  this.setDirection = function (x, y)
  {
    this.dir.x = x;
    this.dir.y = y;
  }
}