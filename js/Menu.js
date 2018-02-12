var menu = new Menu();

function Menu()
{

  // Holds key code for input
  this.selectKey;
  this.upKey;
  this.downKey;
  this.rightKey;
  this.leftKey;

  // Whether or not key is pressed
  this.selectKeyPressed;
  this.upKeyPressed;
  this.downKeyPressed;
  this.rightKeyPressed;
  this.leftKeyPressed;
  this.fired = false;

  this.selection;
  this.b = 0;

  this.init = function()
  {
    this.setupControls( KEY_LETTER_Z,
                        KEY_UP_ARROW,
                        KEY_DOWN_ARROW,
                        KEY_RIGHT_ARROW,
                        KEY_LEFT_ARROW);
  }

  this.setupControls = function(selectKey, upKey, downKey, rightKey, leftKey)
  {
    this.selectKey = selectKey;
    this.upKey = upKey;
    this.downKey = downKey;
    this.rightKey = rightKey;
    this.leftKey = leftKey;
  }

  this.update = function()
  {
    if (this.selectKeyPressed)
    {
       // Do selection
       this.b += 10;
       console.log(this.b);
    }

    if (this.upKeyPressed)
    {
      // Change selection
    }

    this.clearMenuKeys();
  }

  this.clearMenuKeys = function()
  {
    this.selectKeyPressed = false;
    this.upKeyPressed = false;
    this.downKeyPressed = false;
    this.rightKeyPressed = false;
    this.leftKeyPressed = false;
  }

  this.drawMenu = function()
  {
    colorRect(0, 0, canvas.width, canvas.height, "rgb(200, 100, "+this.b+")");
  }
}