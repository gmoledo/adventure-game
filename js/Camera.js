var camera = new Camera();

function Camera()
{
    this.target = player;
    this.tileX = this.target.tileX;
    this.tileY = this.target.tileY;
    this.translation = {x:0, y:0};

    this.init = function()
    {
        this.tileWidth = canvas.width/TILE_SIZE;
        this.tileHeight = canvas.height/TILE_SIZE;      
    }


    this.translateCanvas = function(dx, dy)
    {
        
        var canvasTileWidth = canvas.width/TILE_SIZE;
        var canvasTileHeight = canvas.height/TILE_SIZE;
        var rightEdgeDistance = currentRoom.cols-1-this.target.tileX;
        var leftEdgeDistance = this.target.tileX;
        var bottomEdgeDistance = currentRoom.rows-1-this.target.tileY;
        var topEdgeDistance = this.target.tileY;
        if (rightEdgeDistance >= Math.floor(canvasTileWidth/2) && 
            leftEdgeDistance >= Math.floor(canvasTileWidth/2))
        {

            if (Math.round(this.translation.x + canvas.width+dx) > currentRoom.cols * TILE_SIZE)
            {
                this.translation.x = currentRoom.cols * TILE_SIZE - canvas.width;
                canvasContext.setTransform(1,0,0,1,0,0);
                canvasContext.translate(-this.translation.x, -this.translation.y);
            }
            else if (Math.round(this.translation.x + dx) < 0)
            {
                this.translation.x = 0;
                canvasContext.setTransform(1,0,0,1,0,0);
                canvasContext.translate(-this.translation.x, -this.translation.y);
            }
            else{
                canvasContext.translate(-dx, 0);
                this.translation.x += dx
            }

        }

        if (bottomEdgeDistance >= Math.floor(canvasTileHeight/2) &&
            topEdgeDistance >= Math.floor(canvasTileHeight/2))
        {            //console.log("D");
            if (Math.round(this.translation.y + canvas.height+dy) > currentRoom.rows * TILE_SIZE)
            {
                this.translation.y = currentRoom.rows * TILE_SIZE - canvas.height;
                canvasContext.setTransform(1,0,0,1,0,0);
                canvasContext.translate(-this.translation.x, -this.translation.y);
            }
            else if (Math.round(this.translation.y + dy) < 0)
            {
                this.translation.y = 0;
                canvasContext.setTransform(1,0,0,1,0,0);
                canvasContext.translate(-this.translation.x, -this.translation.y);
            }
            else{
                canvasContext.translate(0, -dy);
                this.translation.y += dy
            }
        }
    }

    this.setTilePosition = function()
    {

    }

    this.setCanvasPosition = function()
    {
        canvasContext.setTransform(1,0,0,1,0,0);
        var canvasTileWidth = canvas.width/TILE_SIZE;
        var canvasTileHeight = canvas.height/TILE_SIZE;

        this.tileX = this.target.tileX;
        this.tileY = this.target.tileY;

        if (this.tileX + Math.ceil(this.tileWidth/2) > currentRoom.cols)
        {
            this.tileX = currentRoom.cols - Math.ceil(this.tileWidth/2);
        }
        else if (this.tileX - Math.floor(this.tileWidth/2) < 0)
        {
            this.tileX = Math.floor(this.tileWidth/2);
        }

        if (this.tileY + Math.ceil(this.tileHeight/2) > currentRoom.rows)
        {
            this.tileY = currentRoom.rows - Math.ceil(this.tileHeight/2);
        }
        else if (this.tileY - Math.floor(this.tileHeight/2) < 0)
        {
            this.tileY = Math.floor(this.tileHeight/2);
        }
        var canvasPosX = -(this.tileX - Math.floor(this.tileWidth/2)) * TILE_SIZE;
        console.log(this.tileY - Math.ceil(this.tileHeight/2));
        var canvasPosY = -(this.tileY - Math.floor(this.tileHeight/2)) * TILE_SIZE;

        canvasContext.translate(Math.round(canvasPosX), Math.round(canvasPosY));
        this.translation.x = -Math.round(canvasPosX);
        this.translation.y = -Math.round(canvasPosY);
        console.log(this.translation.y)

    }
}


