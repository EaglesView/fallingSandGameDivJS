
export class FallingSand {
    constructor(Game) {
        this.x = parseInt(Game.resolution.x);
        this.y = parseInt(Game.resolution.y);
        this.pixelGrid = this.initPixelGrid();
        this.tick = this.tick.bind(this);
        this.sandAmount = 0;
    }

    initPixelGrid = () => {
        let Grid = [];
        for (let pixelX = 0; pixelX < this.x; pixelX++) {
            Grid[pixelX] = [];
            for (let pixelY = 0; pixelY < this.y; pixelY++) {
                Grid[pixelX][pixelY] = 0;  // Initializing an empty pixel space
            }
        }
        return Grid;
    }

    addToGrid = (SAND, x, y) => {
        this.pixelGrid[x][y] = SAND;
        this.sandAmount += 1;
        console.log("Inside addToGrid, pixel is ", this.pixelGrid[x][y]);
        console.log("the whole pixelGrid: ", this.pixelGrid);
    }

    tick(now) {
        let newGrid = this.initPixelGrid();
        for (let row = 0; row < this.pixelGrid.length; row++) {
            for (let col = 0; col < this.pixelGrid[row].length; col++) {
                let pixel = this.pixelGrid[row][col];
                if (pixel !== 0) {
                    console.log(`Processing grain at [${row}, ${col}]`);
                    pixel.updateSand(now, newGrid, this);
                }
            }
        }
        this.pixelGrid = newGrid;
    }




    startMove = (GAME) => {
        GAME.node.addEventListener("mousemove", (evt) => {
            console.log("Inside event:", evt);
            fallingSandGame.createSand(evt, this);
        });
        GAME.node.addEventListener("mousedown", (evt) => {
            console.log("Inside event:", evt);
            fallingSandGame.createSand(evt, this);
        });
    }
    startGame = async (game) => {
        const SANDGAME = new FallingSand(game);
        //await SANDGAME.startMove(game);
    }
}

export class Sand {
    constructor(element, SANDGAME) {
        this.node = element;
        this.x = parseInt(element.style.left);
        this.y = parseInt(element.style.top);
        this.id = element.id;
        this.lastUpdateTime = 0;  // Track when the last update occurred
        this.updateInterval = 0.1; // 50 ms delay between moves
        this.updateSand = this.updateSand.bind(this, SANDGAME);
    }

    updateSand(SANDGAME, now, newGrid) {
        if (!Array.isArray(newGrid) || !Array.isArray(newGrid[this.x])) {
            console.error("pixelGrid is not a 2D array at updateSand");
            return;
        }
        // Only update if enough time has passed
        if (now - this.lastUpdateTime < this.updateInterval) {
            return;  // Not time to update yet
        }
        this.lastUpdateTime = now;

        // Clear the old position in newGrid before moving
        newGrid[this.x][this.y] = 0;

        // Check if the particle is at the bottom of the grid
        if (this.y >= SANDGAME.y - 1) {
            newGrid[this.x][this.y] = this;  // Stay in the same position
            return;
        }

        // Check if there's a sand particle directly below in pixelGrid
        if (!SANDGAME.pixelGrid[this.x][this.y + 1]) {
            // Move down by one step
            this.y += 1;
            newGrid[this.x][this.y] = this;  // Update new position in the new grid

            // Assuming gridCellSize is defined
            console.log(`Older top Value: ${this.node.style.top}`);
            let gridCellSize = 1;  // Set gridCellSize if your grid cells are larger than 1px
            this.node.style.top = (this.y * gridCellSize) + "px";
            console.log(`Updated top to: ${this.node.style.top}`);
        }

        // If blocked below, try moving left or right
        else if (SANDGAME.pixelGrid[this.x][this.y + 1]) {
            // Check if we can move down-right
            if (this.x + 1 < SANDGAME.x && !SANDGAME.pixelGrid[this.x + 1][this.y + 1]) {
                this.x += 1;
                this.y += 1;
                newGrid[this.x][this.y] = this;  // Update new position in the new grid
                this.node.style.left = this.x + "px";
                this.node.style.top = this.y + "px";
            }
            // Check if we can move down-left
            else if (this.x - 1 >= 0 && !SANDGAME.pixelGrid[this.x - 1][this.y + 1]) {
                this.x -= 1;
                this.y += 1;
                newGrid[this.x][this.y] = this;  // Update new position in the new grid
                this.node.style.left = this.x + "px";
                this.node.style.top = this.y + "px";
            }
        }

        // After movement, if the particle hasn't moved, put it back
        if (!newGrid[this.x][this.y]) {
            newGrid[this.x][this.y] = this;  // Retain the particle's position
        }
    }

}


export const fallingSandGame = {
    sandParticles: [],
    createSand: (evt, SANDGAME) => {
        const sand = document.createElement("div");
        sand.id = "sand" + SANDGAME.sandAmount;
        sand.style.position = "absolute";
        sand.style.width = 1 + "px";
        sand.style.height = 1 + "px";
        sand.style.top = evt.clientY + "px";
        sand.style.left = evt.clientX + "px";
        sand.style.backgroundColor = "orange";
        const SAND = new Sand(sand, SANDGAME);
        SANDGAME.addToGrid(SAND, SAND.x, SAND.y);
        document.querySelector("#game").append(sand);
        fallingSandGame.sandParticles.push(SAND);
        return SAND;
    },
    startGame: async (game) => {
        const SANDGAME = new FallingSand(game);
        //await SANDGAME.startMove(game);
    }
}
