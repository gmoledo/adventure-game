// Key codes for various keys
const KEY_LEFT_ARROW = 37;
const KEY_UP_ARROW = 38;
const KEY_RIGHT_ARROW = 39;
const KEY_DOWN_ARROW = 40;
const KEY_LETTER_W = 87;
const KEY_LETTER_A = 65;
const KEY_LETTER_S = 83;
const KEY_LETTER_D = 68;
const KEY_LETTER_Z = 90;
const KEY_LETTER_T = 84;

// Array containing objects that respond to input
var controllables = [player, menu];

// Not quite a queue, but an array that contains
// all held keys, pushing newly pressed keys index 0
var inputQueue = [];

function initInput()
{
  document.addEventListener("keydown", keyPressed);
  document.addEventListener("keyup", keyReleased);
}

function keyPressed(evt)
{
  // Prevents duplicate inputs in inputQueue
  if (!inputQueue.includes(evt.keyCode))
  {
    inputQueue.unshift(evt.keyCode);
  }

  for (var i=0; i<controllables.length; i++)
  {
    refreshKeyInput(evt, controllables[i]);
  }
}

function keyReleased(evt)
{
  if (inputQueue.includes(evt.keyCode))
  {
    var keyIndex = inputQueue.indexOf(evt.keyCode);
    inputQueue.splice(keyIndex, 1);
  }

  for (var i=0; i<controllables.length; i++)
  {
    refreshKeyInput(evt, controllables[i]);
  }
}

function refreshKeyInput(evt, controllable)
{
  // Disable default arrow key functions
  if (evt.keyCode >= 37 && evt.keyCode <= 40)
  {
    evt.preventDefault();
  }

  // Handle input for player during GAME state
  if (controllable instanceof Player && gameState == gameStates.GAME)
  {
    var cPlayer = controllable;

    // Filter inputQueue for only movement-related inputs
    var movementQueue = inputQueue.filter(input =>  input == cPlayer.northKey ||
                                                    input == cPlayer.eastKey  ||
                                                    input == cPlayer.southKey ||
                                                    input == cPlayer.westKey);
    // Sets all "-keyHeld" variables in player false
    cPlayer.clearMovementKeys();

    if (movementQueue.length != 0)
    {
      switch (movementQueue[0])
      {
        case cPlayer.northKey:  cPlayer.northKeyHeld = true; break;
        case cPlayer.eastKey:   cPlayer.eastKeyHeld = true;  break;
        case cPlayer.southKey:  cPlayer.southKeyHeld = true; break;
        case cPlayer.westKey:   cPlayer.westKeyHeld = true;  break;
        default:                console.log("Shouldn't show this! movementQueue not filtered properly.");
      }
    }

    if (inputQueue[0] == cPlayer.toggleKey)
    {
      cPlayer.switchControlSchemes();
      // inputQueue.push(inputQueue.shift());
    }
  }

  // Handle input for menu during MENU state
  // TODO - complete menu functionality
  if (controllable instanceof Menu && gameState == gameStates.MENU)
  {
    var cMenu = controllable;
    var menuQueue = inputQueue.filter(input =>  input == cMenu.selectKey ||
                                                input == cMenu.upKey     ||
                                                input == cMenu.downKey   ||
                                                input == cMenu.rightKey  ||
                                                input == cMenu.leftKey);

    if (evt.type == "keyup")
    {
      cMenu.fired = false;
    }

    if (evt.type == "keydown" && !cMenu.fired)
    {
      cMenu.fired = true;

      switch(menuQueue[0])
      {
        case cMenu.selectKey:   cMenu.selectKeyPressed = true;  break;
        case cMenu.upKey:       cMenu.upKeyPressed = true;      break;
        case cMenu.downKey:     cMenu.downKeyPressed = true;    break;
        case cMenu.rightKey:    cMenu.rightKeyPressed = true;   break;
        case cMenu.leftKey:     cMenu.leftKeyPressed = true;    break;
        default:                console.log("Oops");
      } 
    }
  }
}





