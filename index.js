// Clicking the 'Start' button must get initial elements from the server ?

const cellWidth = 20;
const cellPadding = 4;
const cellWithPadding = cellWidth + cellPadding;

const boardSize = 20;
const canvasSize = cellWithPadding * boardSize;

var AddingCellsEnabled = true;

var canvas = document.getElementById('game-board-canvas');
var ctx = canvas.getContext('2d');

function Cell(x_coord, y_coord, color) {
  this.x_coord = x_coord;
  this.y_coord = y_coord;
  this.color = color;
}

var board = [];
for (i = 0; i < boardSize; i++) {
  board[i] = [];
  for (j = 0; j < boardSize; j++) {
    board[i][j] = false;
  }
}

var updatedElements = [];

var initialElements = [ [3, 3], [4, 3], [5, 3] ];
for (const coordPair of initialElements) {
  var x = coordPair[0];
  var y = coordPair[1];
  board[y][x] = true;
}

console.log(board);

var colorLightGrey = 'rgb(230, 230, 230)'
ctx.fillStyle = colorLightGrey;
for (i = 0; i < canvasSize; i+= cellWithPadding) {
  for (j = 0; j < canvasSize; j+= cellWithPadding) {
    ctx.fillRect(i, j, cellWidth, cellWidth);
  }
}

var colorRed = 'rgb(200, 0, 0)';
ctx.fillStyle = colorRed;
for (const cell of initialElements) {
  ctx.fillRect(cell[0]*cellWithPadding, cell[1]*cellWithPadding, 20, 20);
}

var initButton = document.getElementById('data-game-init');
var joinButton = document.getElementById('data-game-join');
var updateButton = document.getElementById('data-game-update');
var skipButton = document.getElementById('data-game-skip');

updateButton.onclick = function() {
  console.log('updateButton clicked!');
  // there be sending stuff to the server.
  // ( server keeps the whole board in it's memory,
  // so no need in sending the whole board - need only the change)
  // ( the cells that were added by the user)
};

canvas.onclick = function(e) {
  if (!AddingCellsEnabled) return null;

  var element = determineElement(e);
  if (element) {
    if (!board[element[1]][element[0]]) {
      updatedElements.push(element);
      drawEnabledElement(element);
      console.log(updatedElements);

      // TODO: send request to the server
      // on response - empty the 'updatedElements' array
      // apply stuff from the server's response.
    }
  }
}

function determineElement(event) {
  var cellX = Math.floor(event.layerX / cellWithPadding);
  var cellY = Math.floor(event.layerY / cellWithPadding);
  return [ cellX, cellY ];
}

function drawEnabledElement(coordPair) {
  ctx.fillStyle = colorRed;
  ctx.fillRect(coordPair[0]*cellWithPadding, coordPair[1]*cellWithPadding, cellWidth, cellWidth);
}

//
// canvas_element.onmousemove = function(e) {
//   var elementUnder = checkClick(event);
//   if (elementUnder == 1) {
//       changeCursor('pointer');
//   } else {
//       changeCursor('default');
//   }
// }
//
// canvas_element.onmouseout = function(e) {
//   changeCursor('default');
// }
//
//
// //context.fillRect(tile.x, tile.y, tile.width, tile.height);
//
// function checkClick(event) {
//   var clickX = event.layerX;
//   var clickY = event.layerY;
//
//   var element;
//
//   tiles_array.forEach(function(tile, i, arr) {
//     if (
//       clickX > tile.workWidth.start &&
//       clickX < tile.workWidth.end &&
//       clickY > tile.workHeight.start &&
//       clickY < tile.workHeight.end
//     ) {
//       element = tile.id;
//     }
//   });
//   return element;
// }
//
// // Create Tiles
// function createTiles(quantityX, quantityY) {
//   var quantityAll = quantityX * quantityY;
//   var tileWidth = canvas_element.width / quantityX;
//   var tileHeight = canvas_element.height / quantityY;
//
//   var drawPosition = {
//     x: 0,
//     y: 0
//   }
//
//   for (var i = 0; i < quantityAll; i++) {
//     var fillColor = getRandomColor();
//     var tile = new Tile(drawPosition.x, drawPosition.y, tileWidth, tileHeight, i, fillColor);
//     tiles_array.push(tile);
//
//     drawPosition.x = drawPosition.x + tileWidth;
//     if (drawPosition.x >= canvas_element.width) {
//       drawPosition.x = 0;
//       drawPosition.y = drawPosition.y + tileHeight;
//     }
//   }
//
// }
//
// createTiles(6, 6);
//
//
// function drawTiles() {
//   tiles_array.forEach(function(tile, i, arr) {
//     context.beginPath()
//
//     context.fillStyle = tile.fillColor;
//     context.rect(tile.x, tile.y, tile.width, tile.height);
//
//     context.lineWidth="2";
//     context.strokeStyle = tile.strokeStyle;
//     context.stroke()
//
//     context.fill();
//   });
// }
//
// drawTiles();
//
//
// function getRandomColor() {
//     var letters = '0123456789ABCDEF';
//     var color = '#';
//     for (var i = 0; i < 6; i++ ) {
//         color += letters[Math.floor(Math.random() * 16)];
//     }
//     return color;
// }
//
// //
//
// function changeCursor(cursorType){
//   document.body.style.cursor = cursorType;
// }
//
//
