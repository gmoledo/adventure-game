// Images holds image URLs as well as references
// to the image elements through imageMap (see below)
images = 
{
  player: "character_player.png",
  playerWalkSouth: ["character_player_walk_south_0.png",
                    "character_player_walk_south_1.png",
                    "character_player_walk_south_2.png"],
  playerWalkNorth: ["character_player_walk_north_0.png",
                    "character_player_walk_north_1.png",
                    "character_player_walk_north_2.png"],
  playerWalkEast:  ["character_player_walk_east_0.png",
                    "character_player_walk_east_1.png",
                    "character_player_walk_east_2.png"],
  playerWalkWest:  ["character_player_walk_west_0.png",
                    "character_player_walk_west_1.png",
                    "character_player_walk_west_2.png"],
  ground: "tile_ground.png",
  sand:   "tile_sand.png",
  wall:   "tile_wall.png",
  grass:  "tile_grass.png",
  dirt:   "tile_dirt.png"
};

// Reference image elements through imageMap
// E.g. use imageMap.get(images.player) to reference player image
imageMap = new Map();

var picsToLoad = Object.keys(images).length;


function loadImages()
{
  for (var image in images)
  {
    console.log(image);
    if (Array.isArray(images[image]))
    {
      var animation = images[image];
      animation.forEach(function(frame){
        beginLoadingImage(frame);
      });
    }
    else
    {
      beginLoadingImage(images[image]);
    }

  }
}

function beginLoadingImage(imageFile)
{  
  var docImage = document.createElement("img");

  // Maps image URL (accessible through images object) to
  // the newly created image element
  imageMap.set(imageFile, docImage);

  docImage.onload = countLoadedImageAndLaunchIfReady;
  docImage.src = "images/" + imageFile;
}

function countLoadedImageAndLaunchIfReady()
{
  picsToLoad--;
  if (picsToLoad == 0)
  {
    startGame();
  }
}

