// sketch.js - purpose and description here
// Author: Your Name
// Date:

// Here is how you might set up an OOP p5.js project
// Note that p5.js looks for a file called sketch.js

// Constants - User-servicable parts
// In a longer project I like to put these in a separate file
const VALUE1 = 1;
const VALUE2 = 2;

// Globals
let myInstance;
let canvasContainer;
var centerHorz, centerVert;

class MyClass {
    constructor(param1, param2) {
        this.property1 = param1;
        this.property2 = param2;
    }

    myMethod() {
        // code to run when method is called
    }
}

function resizeScreen() {
  centerHorz = canvasContainer.width() / 2; // Adjusted for drawing logic
  centerVert = canvasContainer.height() / 2; // Adjusted for drawing logic
  console.log("Resizing...");
  resizeCanvas(canvasContainer.width(), canvasContainer.height());
  // redrawCanvas(); // Redraw everything based on new size
}

// setup() function is called once when the program starts
function setup() {
  // place our canvas, making it fit our container
  canvasContainer = $("#canvas-container");
  let canvas = createCanvas(canvasContainer.width(), canvasContainer.height());
  canvas.parent("canvas-container");
  // resize canvas is the page is resized

  // create an instance of the class
  myInstance = new MyClass("VALUE1", "VALUE2");

  $(window).resize(function() {
    resizeScreen();
  });
  resizeScreen();
}

/* exported generateGrid, drawGrid */
/* global placeTile */

function generateGrid(numCols, numRows) {
  let grid = [];

  for (let i = 0; i < numRows; i++) {
    let row = [];
    for (let j = 0; j < numCols; j++) {
      row.push("_");
    }
    grid.push(row);
  }
  
  let room_count = floor(random(8) + 5)
  let room_centers = [];
  
  for(let i = 0; i < room_count; i++){
    
    let room_x = floor(random(2/3*numCols)+1)
    let room_y = floor(random(3/5*numRows)+1)
    let room_len = floor(random(1/4*numRows)+4)
    let room_height = floor(random(1/3.5*numCols)+4)
    room_centers.push([floor(room_x+room_len/2), floor(room_y+room_height/2)])
    for(let j = 0; j < room_len; j++){
      for(let k = 0; k < room_height; k++){
        grid[j+room_x][k+room_y] = '.'
      }
    }
  }
  console.log("cener: " + room_centers);
  
  for(let i = 0; i<room_count-1; i++){
    let room = room_centers[i]
    let roomN = room_centers[i+1]
    
    //[0] is y. [1] is x
    let x_dist = roomN[1]-room[1]
    let y_dist = roomN[0]-room[0]
    
    if(x_dist>0){
      for(let j = 0; j<x_dist; j++){
        grid[room[0]-1][room[1]+j] = '.'
        grid[room[0]][room[1]+j] = '.'
        grid[room[0]+1][room[1]+j] = '.'
      }
    }else if(x_dist<0){
      for(let j = 0; j<Math.abs(x_dist); j++){
        grid[room[0]-1][room[1]-j] = '.'
        grid[room[0]][room[1]-j] = '.'
        grid[room[0]+1][room[1]-j] = '.'
      }
    }
    
    if(y_dist>0){
      for(let j = 0; j<y_dist; j++){
        grid[room[0]+j][room[1]+1] = '.'
        grid[room[0]+j][room[1]] = '.'
        grid[room[0]+j][room[1]-1] = '.'
      }
    }else if(y_dist<0){
      for(let j = 0; j<Math.abs(y_dist); j++){
        grid[room[0]-j][room[1]-1] = '.'
        grid[room[0]-j][room[1]+1] = '.'
        grid[room[0]-j][room[1]] = '.'
      }
    }
  }
  
  for(let i = 0; i<floor(room_count%3); i++){
    let random_index = floor(random(room_centers.length))
    grid[room_centers[random_index][0]][room_centers[random_index][1]] = "d"
    room_centers.splice(random_index, 1)
  }

  for(let i = 0; i<room_centers.length-1; i++){
    if(i%2==0 || i%3==0){
      grid[room_centers[i][0]][room_centers[i][1]] = "c"
    }
    room_centers.splice(i,1)
  }
  
  for(let i=0; i<floor(room_centers.length/2); i++){
    grid[room_centers[i][0]][room_centers[i][1]] = 'C'
  }
  
  
  
  return grid;
}

function gridCheck(grid, i, j, target){
  if(i < grid.length && j < grid[0].length && j>= 0 && i >= 0){
    if(grid[i][j] == target){
      return 1;
    }
  }
  return 0;
}

function gridCode(grid, i, j, target){
  let NB = gridCheck(grid, i-1, j, target);
  let SB = gridCheck(grid, i+1, j, target);
  let WB = gridCheck(grid, i, j-1, target);
  let EB = gridCheck(grid, i, j+1, target);

  let code = (NB<<0) + (SB << 1) + (EB << 2) + (WB << 3);
  
  return code;
}

function drawContext(grid, i, j, target, ti, tj, table){
  const code = gridCode(grid, i, j, target)
  const offset = table[code]
  
  if(offset){
    placeTile(i, j, offset[0] + ti, offset[1] + tj);
  }
}

function drawGrid(grid) {
  background(128);


  for(let i = 0; i < grid.length; i++) {
    for(let j = 0; j < grid[i].length; j++) {
      if(gridCheck(grid, i, j, '_')){
        placeTile(i, j, 20, 23)
      }else if(gridCheck(grid, i, j, '.')){
        placeTile(i, j, floor(random(4)+5), 24);
        drawContext(grid, i, j, '.', 0, 0, wallTable)
      }else if(gridCheck(grid, i, j, 'd')){
        placeTile(i, j, 25, 26)
      }else if(gridCheck(grid, i, j, 'c')){
        placeTile(i+1, j, 31, 31)
        placeTile(i, j+1, 31, 31)
        placeTile(i-1, j, 30, 0)
        placeTile(i, j, 30, 1)
        

      }else if(gridCheck(grid, i, j, 'C')){
        
        
        placeTile(i, j, 4, floor(random(2)+28))
        

      }
    }
  }
  
  drawFog()
}

function drawFog(){
  noStroke()
  fill('rgba(250, 250, 250, 0.6)')
  let fogDetail = 30
  for(let i = 0; i<fogDetail; i++){
    let noiseLevel = noise(millis()*0.0001+i*random())*100;
    console.log(noiseLevel)
    ellipse(0+noiseLevel-45+i*i*0.06,height*i/fogDetail, 110, 120)
  }
  
  for(let i = 0; i<fogDetail; i++){
    let noiseLevel = noise(millis()*0.0001+i*random())*100;
    console.log(noiseLevel)
    ellipse(700-noiseLevel-i*i*0.06,height*i/fogDetail, 110, 120)
  }
}

const wallTable = [
  [31,31], // everything is different
  [31,31], // SEW are different
  [31,31], // NEW are different
  [31,31], // EW are different
  [31,31], //NSW are different
  [25,23], //S and West are different
  [25, 21], //S and West are different
  [25,22], // Only E is different
  [31,31], // NES are different
  [27,23], //S and E is different
  [27, 21], //N and E is different
  [27,22], //Only W is different
  [31,31],   //Only N and S are different
  [26,23], //Only S is different
  [26,21], //Only N is different
  [31,31] // everything is the same
]





