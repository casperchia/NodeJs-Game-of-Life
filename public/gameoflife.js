var DEAD = 0;
var ALIVE = 1;
var CELL_SIZE = 8;
var CELL_DRAW_SIZE = CELL_SIZE - 1;
var GRID_SIZE = 100;
var CANVAS_SIZE = GRID_SIZE * CELL_SIZE;

var timer = false;
var myBoard;
var canvas;
var myCanvas;
var speed = 20;

function startGame(){
   console.log("Game started!");
   var myButton = document.getElementById('startStopButton');
   myButton.value="Stop";
   myButton.removeEventListener('click', startGame);
   myButton.addEventListener('click', stopGame);
   timer = setInterval(nextBoard, speed);
}

function stopGame(){
   console.log("Game stopped!");
   var myButton = document.getElementById('startStopButton');
   myButton.value="Start";
   myButton.removeEventListener('click', stopGame);
   myButton.addEventListener('click', startGame);
   clearInterval(timer);
   timer = false;
}

function randomiseGame(){
   console.log("Randomising board...");
   for(var x = 0; x < GRID_SIZE; x++){
      for(var y = 0; y < GRID_SIZE; y++){
         if(Math.random() > 0.8){
            myBoard.grid[y][x] = ALIVE;
         }
      }
   }
   myCanvas.updateCanvas();
}

function clearGame(){
   console.log("Clearing board...");
   myBoard = new board();
   myBoard.init();
   myCanvas.updateCanvas();
}

function changeSpeed(val){
   console.log(val);
   speed = val;
   if(timer){
      clearInterval(timer);
      timer = setInterval(nextBoard, speed);
   }
}

function nextBoard(){
   var newBoard = new board();
   newBoard.init();
   var doa;
   for(var x = 0; x < GRID_SIZE; x++){
      for(var y = 0; y < GRID_SIZE; y++){
         doa = myBoard.deadOrAlive(x,y);
         if(doa >= ALIVE){
            newBoard.setCellWith(x, y, myBoard.grid[x][y]);
         }
      }
   }
   console.log(newBoard);
   myBoard = newBoard;
   var line = "";
   for(var x = 0; x < GRID_SIZE; x++){
      for(var y = 0; y < GRID_SIZE; y++){
         line = line + myBoard.grid[y][x];
      }
      console.log(line);
      line = "";
   }
   myCanvas.updateCanvas();
}

function board(){
   this.grid = undefined;

   this.init = function(){
      this.grid = [];
      for(var x = 0; x < GRID_SIZE; x++){
         this.grid[x] = [];
      }

      for(var i = 0; i < GRID_SIZE; i++){
         for(var j = 0; j < GRID_SIZE; j++){
            this.grid[i][j] = DEAD;
         }
      }

   }

   this.setCell = function(x, y){
      this.grid[x][y] = ALIVE;
   }

   this.setCellWith = function(x, y, val){
      if(val < 0) val = 0;
      this.grid[x][y] = val + 1;
   }

   this.clearCell = function(x, y){
      this.grid[x][y] = DEAD;
   }

   this.printGrid = function(){
      for(var x = 0; x < GRID_SIZE; x++){
         for(var y = 0; y < GRID_SIZE; y++){
            console.log(this.grid[x][y]);
         }
         console.log('\n');
      }
   }

   this.getNeighbourCount = function(x, y){
      var count = 0;
      var x2, y2;
      for(var i = -1; i <= 1; i++){
         for(var j = -1; j <= 1; j++){
            x2 = x + i;
            y2 = y + j;
            // console.log(x2 + ":" + y2);
            if(x2 >= 0 && x2 < GRID_SIZE && y2 >= 0 && y2 < GRID_SIZE && !(x2 == x && y2 == y)){
               if(this.grid[x + i][y + j] >= ALIVE){
                  count++;
               }
            }
         }
      }
      return count;
   }

   this.deadOrAlive = function(x, y){
      var neighbours = this.getNeighbourCount(x, y);
      if(this.grid[x][y] >= ALIVE){
         if(neighbours == 2 || neighbours == 3) return ALIVE;
         return DEAD;
      }else{
         if(neighbours == 3) return ALIVE;
         return DEAD;
      }
   }

}

function drawingCanvas(canvas){
   this.canvas = canvas;
   var c = this.canvas.getContext("2d");

   this.drawBox = function(){
      for (var x = 0; x < CANVAS_SIZE + 1; x += CELL_SIZE) {
        c.moveTo(x, 0);
        c.lineTo(x, CANVAS_SIZE);
      }

      for (var y = 0; y < CANVAS_SIZE + 1; y += CELL_SIZE) {
        c.moveTo(0, y);
        c.lineTo(CANVAS_SIZE, y);
      }

      c.strokeStyle = "#ddd";
      c.stroke();
   }

   this.handleClick = function(e) {
      var x = (Math.floor(e.offsetX/CELL_SIZE));
      var y = (Math.floor(e.offsetY/CELL_SIZE));
      // console.log(e.offsetX + ":" + e.offsetY);
      // console.log(x + ":" + y + " = " + myBoard.grid[x][y]);
      if(myBoard.grid[x][y] >= ALIVE){
         c.fillStyle = "white";
         myBoard.clearCell(x, y);
      }else{
         c.fillStyle = "black";
         myBoard.setCell(x, y);
      }
      // console.log(myBoard.grid[x][y]);

      var xc = x * CELL_SIZE;
      var yc = y * CELL_SIZE;
      // +1 for leave 1px space for the grid
      c.fillRect(xc + 1, yc + 1, CELL_DRAW_SIZE, CELL_DRAW_SIZE);
      // console.log("neighbours: " + myBoard.getNeighbourCount(x, y));
   }

   this.updateCanvas = function(){
      var xc, yc;
      for(var x = 0; x < GRID_SIZE; x++){
         for(var y = 0; y < GRID_SIZE; y++){
            if(myBoard.grid[x][y] >= ALIVE){
               c.fillStyle = getColour(myBoard.grid[x][y], 100);
            }else{
               c.fillStyle = "white";
            }
            xc = x * CELL_SIZE;
            yc = y * CELL_SIZE;
            // +1 for leave 1px space for the grid
            c.fillRect(xc + 1, yc + 1, CELL_DRAW_SIZE, CELL_DRAW_SIZE);
         }
      }
   }
}

function getColour(timeAlive, phase){
   if (phase == undefined) phase = 0;
   center = 255 * 0.5;
   width = 255 * 0.5;
   frequency = Math.PI*.2/10;
   var i = timeAlive;
   red   = Math.sin(frequency*i+2+phase) * width + center;
   green = Math.sin(frequency*i+0+phase) * width + center;
   blue  = Math.sin(frequency*i+4+phase) * width + center;

   return RGB2Color(red, green, blue);
}

function RGB2Color(r,g,b){
   return '#' + byte2Hex(r) + byte2Hex(g) + byte2Hex(b);
}

function byte2Hex(n){
    var nybHexString = "0123456789ABCDEF";
    return String(nybHexString.substr((n >> 4) & 0x0F,1)) + nybHexString.substr(n & 0x0F,1);
  }

window.onload = function(){
   document.getElementById('startStopButton').addEventListener('click', startGame);
   document.getElementById('randomiseButton').addEventListener('click', randomiseGame);
   document.getElementById('clearButton').addEventListener('click', clearGame);

   myBoard = new board();
   myBoard.init();
 
   canvas = document.getElementById("canvas")
   canvas.setAttribute('width', CANVAS_SIZE);
   canvas.setAttribute('height', CANVAS_SIZE);
   myCanvas = new drawingCanvas(canvas);
   myCanvas.drawBox();
   myCanvas.canvas.addEventListener("click", myCanvas.handleClick);
}

console.log = function(){}
