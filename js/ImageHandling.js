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
  ground:     "tile_ground.png",
  sand:       "tile_sand.png",
  wall:       "tile_wall.png",
  grass:      "tile_grass.png",
  grass1:     "tile_grass_1.png",
  grass2:     "tile_grass_2.png",
  grass3:     "tile_grass_3.png",
  dirt:       "tile_dirt.png",
  dirt1:      "tile_dirt_1.png",
  dirt2:      "tile_dirt_2.png",
  caveGround: "tile_cave_ground.png"
};

// Reference image elements through imageMap
// E.g. use imageMap.get(images.player) to reference player image
imageMap = new Map(); 

var picsToLoad = Object.keys(images).length;


function loadImages()
{
  for (var image in images)
  {
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

