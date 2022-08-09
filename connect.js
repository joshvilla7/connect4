/** Connect Four
 *
 * Player 1 and 2 alternate turns. On each turn, a piece is dropped down a
 * column until a player gets four-in-a-row (horiz, vert, or diag) or until
 * board fills (tie)
 */

 let width = 7;
 let height = 6;
 
 let currPlayer = 1; // active player: 1 or 2
 let board = []; // array of rows, each row is array of cells  (board[y][x])
 let isHovering = []; // array to see if the mouse is hovering over a particular top td cell
 
 
 /** makeBoard: create in-JS board structure:
  *    board = array of rows, each row is array of cells  (board[y][x])
  */
 
 function makeBoard() {
   // sets board to empty height and width matrix array
   for (let y = 0; y < height; y++) {
     board[y] = [];
     for (let x = 0; x < width; x++)
       board[y][x] = null;
   }
 }
 
 /** makeHtmlBoard: make HTML table and row of column tops. */
 
 function makeHtmlBoard() {
   const htmlBoard = document.getElementById('board');
   //creates Top row of board with classes for top row styles:
   const top = document.createElement("tr");
   top.setAttribute("id", "column-top");
   //adds event listener to top row, for when you click
   top.addEventListener("click", handleClick);
   //creates individual cells for top row:
   for (let x = 0; x < width; x++) {
     const headCell = document.createElement("td");
     headCell.setAttribute("id", x);
     //adds event listeners to show piece on hover:
     headCell.addEventListener("mouseover", showHoverPiece);
     headCell.addEventListener("mouseleave", removeHoverPiece);
     top.append(headCell);
   }
   htmlBoard.append(top);
 
   // creates rows and cells for main board and naming cells with id of "y-x":
   // empty divs are created to contain the game boarder div
   // Pieces will be placed directly in the td cells. Will need to use z-index in CSS to put 'pieces' behind gameboarder div.
   for (let y = 0; y < height; y++) {
     const row = document.createElement("tr");
     for (let x = 0; x < width; x++) {
    // need to create a game boarder div to replicate real connect4 game
       const gameBoarder = document.createElement("div");
       gameBoarder.classList.add("game-board-div");
       const emptyDiv = document.createElement("div");
       emptyDiv.classList.add("empty-div");
       emptyDiv.append(gameBoarder);
       const cell = document.createElement("td");
       cell.setAttribute("id", `${y}-${x}`);
       cell.append(emptyDiv);
       row.append(cell);
     }
     htmlBoard.append(row);
   }
 }
 
 
 // sets inital isHovering values for all top td cells to false. So hovered piece doesnt show when mouse isn't hovered on it.
 function hoveringFunc() {
   for (let x = 0; x < width; x++) {
     isHovering[x] = false;
   }
 }
 
 /** findSpotForCol: given column x, return top empty y (null if filled) */
 
 function findSpotForCol(x) {
   let yLoc;
   for (let y = 5; y >= 0; y--) {
     if (!board[y][x]) {
       yLoc = y;
       break;
     }
     if (y === 0) {
       yLoc = null;
     }
   }
   return yLoc;
 }
 
 /** placeInTable: update DOM to place piece into HTML table of board */
 
 function placeInTable(y, x) {
   const newPiece = document.createElement('div');
   newPiece.classList.add('piece', `p${currPlayer}`);
   document.getElementById(`${y}-${x}`).append(newPiece);
   
 }
 
 /** endGame: announce game end */
 
 function endGame(msg) {
   // remove event listeners and reset isHovering
   document.getElementById('column-top').removeEventListener("click", handleClick,);
   for (let x = 0; x < width; x++) {
     document.getElementById(x).removeEventListener("mouseover", showHoverPiece);
     document.getElementById(x).removeEventListener("mouseleave", removeHoverPiece);
     isHovering[x] = false;
   }
 
   // pop up alert message after animation completes
   setTimeout(() => alert(msg + " Refresh to play again!"), 700);
 }
 
 // adds the hover piece on top 
 function showHoverPiece(evt) {
   isHovering[evt.target.id] = false; 
   const hoverPiece = document.createElement('div');
   hoverPiece.classList.add('piece', `p${currPlayer}`);
   evt.target.append(hoverPiece);
 }
 
 // removes the hover piece after mouse leaves cell
 function removeHoverPiece(evt) {
   isHovering[evt.target.id] = false;
   if (evt.target.firstChild) {
     evt.target.firstChild.remove();
   }
 }
 
 /** handleClick: handle click of column top to play piece */
 
 function handleClick(evt) {
   // get x from ID of clicked cell
   const x = +evt.target.id;
 
   // get next spot in column (if none, ignore click)
   const y = findSpotForCol(x);
   if (y === null) {
     return;
   }
 
   // remove event listener to avoid double clicks
   document.getElementById("column-top").removeEventListener("click", handleClick)
 
   // place piece in board and add to HTML table
   placeInTable(y, x);
 
   // remove hover piece
   if (evt.target.firstChild) {
     evt.target.firstChild.remove();
   }
 
   // sets  isHovering to true for clicked cell
   isHovering[evt.target.id] = true;
 
   // updates in-memory board
   board[y][x] = currPlayer;
 
   // check for win
   if (checkForWin()) {
     return endGame(`Player ${currPlayer} won!`);
   }
 
   // check for tie
   // check if all top cells in board are filled; if so call endGame func
   if (board[0].every(value => value)) {
     endGame('TIE!');
   }
 
   // switches players, ternary operator
   currPlayer === 1 ? currPlayer = 2 : currPlayer = 1;
 
   // re add event listener after brief timeout
   setTimeout(() => {
     document.getElementById("column-top").addEventListener("click", handleClick);}, 
     300);
 
   // if mouse is hovering over the same cell, replace hover piece after timeout
   setTimeout(() => {if (isHovering[evt.target.id]) {showHoverPiece(evt)}}, 700);
 }
 
 /** checkForWin: check board cell-by-cell for "does a win start here?" */
 
 function checkForWin() {
   function _win(cells) {
     // Check four cells to see if they're all color of current player
     //  - cells: list of four (y, x) cells
     //  - returns true if all are legal coordinates & all match currPlayer
 
     return cells.every(
       ([y, x]) =>
         y >= 0 &&
         y < height &&
         x >= 0 &&
         x < width &&
         board[y][x] === currPlayer
     );
   }
 
   for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      //checks for horizontal win
      const horiz = [[y, x], [y, x + 1], [y, x + 2], [y, x + 3]];
      //checks for vertical win
      const vert = [[y, x], [y + 1, x], [y + 2, x], [y + 3, x]];
      //checks for right diagonal win
      const diagDR = [[y, x], [y + 1, x + 1], [y + 2, x + 2], [y + 3, x + 3]];
      //checks for left diagonal win
      const diagDL = [[y, x], [y + 1, x - 1], [y + 2, x - 2], [y + 3, x - 3]];
      //if any of the win conditions return, return true
      if (_win(horiz) || _win(vert) || _win(diagDR) || _win(diagDL)) {
        return true;
      }
    }
  }
}
 
 makeBoard();
 makeHtmlBoard();
 hoveringFunc();