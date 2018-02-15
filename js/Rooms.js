var rooms = [];
var currentRoom = [];

function Room(name, cols, rows, grid, doors)
{
  this.name = name;
  this.cols = cols;
  this.rows = rows;
  this.grid = grid;
  this.doors = doors;

  rooms.push(this);
}

function Door(room, xFlags, yFlags, xWarp, yWarp)
{
  this.room = room;
  this.xFlags = xFlags;
  this.yFlags = yFlags;
  this.xWarp = xWarp;
  this.yWarp = yWarp
}

function changeRoom(tileX, tileY)
{
  var xPass = false;
  var xWarp = 0;
  var yPass = false;
  var yWarp = 0;

  for (var i=0; i < currentRoom.doors.length; i++)
  {
    door = currentRoom.doors[i];

    if (door.xFlags != undefined)
    {
      if (Array.isArray(door.xFlags))
      {
        if (tileX >= door.xFlags[0] && tileX <= door.xFlags[1])
        {
          xPass = true;
        }
      }
      else if (typeof door.xFlags == "number")
      {
        if (door.xFlags == tileX)
        {
          xPass = true;
        }
      }
      else
      {
        console.log("Oops, Door.xFlags should either be number or Array");
      }
    }
    else
    {
      xPass = true;
    }

    if (door.yFlags != undefined)
    {
      if (Array.isArray(door.yFlags))
      {
        if (tileY >= door.yFlags[0] && tileY <= door.yFlags[1])
        {
          yPass = true;
        }
      }
      else if (typeof door.yFlags == "number")
      {
        if (door.yFlags == tileY)
        {
          yPass = true;
        }
      }
      else
      {
        console.log("Oops, Door.yFlags should either be number or Array");
      }
    }
    else
    {
      yPass = true;
    }

    if (xPass && yPass)
    {
      currentRoom = findRoomInRooms(door.room);
      return {xWarp: door.xWarp, yWarp: door.yWarp};
    }
    xPass = false;
    yPass = false;
  }
  console.log("Missing Door or Room!");
  return {xWarp: 0, yWarp: 0}
}

function findRoomInRooms(roomName)
{
  for (var room=0; room<rooms.length; room++)
  {
    if (rooms[room].name == roomName)
    {
      return rooms[room];
    }
  }
}

