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
/* exported generateGrid2, drawGrid2 */

/* global placeTile */

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
  //console.log("cener: " + room_centers);
  
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


function generateGrid2(numCols, numRows) {
  let grid = [];

  for (let i = 0; i < numRows; i++) {
    let row = [];
    for (let j = 0; j < numCols; j++) {
      row.push("_");
    }
    grid.push(row);
  }
  //mountain function
  let inc = 0.01
  let scale = 30
  let yOff = 0;
  for(let y = 0; y < numRows; y++){
    let xOff = 0;
    for(let x = 0; x < numCols; x++){
      //let index = (x+y*numCols)*4;
      let r = noise(xOff, yOff)*4;
      
      switch(floor(r)) {
      case 2:
        grid[x][y] = '+'
        break;
      case 1:
        grid[x][y] = '-'
        break;
      default:
        grid[x][y] = '_'
      }
      xOff += inc*scale
    }
    yOff += inc*scale
  }
  
  for (let i = 0; i < numRows; i++) {
    for (let j = 0; j < numCols; j++) {
      if(gridCheck(grid, i, j, '+')){
        if(floor(random(100)) > 98){
          grid[i][j] = 'c';
        }
        
        if(floor(random(100)) >= 99){
          grid[i][j] = 'h';
        }
      }
    }
  }
  
  
  return grid;
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

function drawGrid2(grid){
  background(128);

  //base desert pass
  for(let i = 0; i < grid.length; i++) {
    for(let j = 0; j < grid[i].length; j++) {
      placeTile(i, j, 1+((j)%3), 18+(floor(random(2))))
    }
  }
  
  //dark sand rendering pass
  for(let i = 0; i < grid.length; i++) {
    for(let j = 0; j < grid[i].length; j++) {
      if(gridCheck(grid, i, j, '_')){
        drawContext(grid, i, j, '_', 0, 0, darkSandTable)
      }
    }
  }
  //mountain rendering pass
  for(let i = 0; i < grid.length; i++) {
    for(let j = 0; j < grid[i].length; j++) {
      if(gridCheck(grid, i, j, '-')){
        drawContext(grid, i, j, '-', 0, 0, darkSandTable)
        drawContext(grid, i, j, '-', 0, 0, rockTable)
      }
    }
  }
  
  for(let i = 0; i < grid.length; i++) {
    for(let j = 0; j < grid[i].length; j++) {
      if(gridCheck(grid, i, j, 'c')){
        placeTile(i, j, 2, 28)
      }
    }
  }
  
  for(let i = 0; i < grid.length; i++) {
    for(let j = 0; j < grid[i].length; j++) {
      if(gridCheck(grid, i, j, 'h')){
        placeTile(i, j, 26, 0)
      }
    }
  }

  drawDustFilter();

}

function drawFog(){
  noStroke()
  fill('rgba(250, 250, 250, 0.6)')
  let fogDetail = 30
  for(let i = 0; i<fogDetail; i++){
    let noiseLevel = noise(millis()*0.0001+i*random())*100;
    //console.log(noiseLevel)
    ellipse(0+noiseLevel-45+i*i*0.06,height*i/fogDetail, 110, 120)
  }
  
  for(let i = 0; i<fogDetail; i++){
    let noiseLevel = noise(millis()*0.0001+i*random())*100;
    //console.log(noiseLevel)
    ellipse(700-noiseLevel-i*i*0.06,height*i/fogDetail, 110, 120)
  }
}

function drawDustFilter(){
  noStroke();
  fill('rgba(255,119,18, 0.5)')
  rect(0, 0, width, height)
  
  let detail = 40
  let factor = 5
  let offset = 100
  
  for(let i = 0; i<detail; i++){
    for(let j = 0; j<detail; j++){
      fill('rgba(161,68,1, 0.5)')
      let val = noise(i/factor+offset, j/factor+offset)
      if(val > 0.75){
        let x_coord = (val+i)*width/40 + millis()*.03;
        let y_coord = (j+val)*height/40
        if(x_coord>750){
          x_coord -= 750
        }else if(x_coord<0){
          x_coord += 750
        }
        
        if(y_coord>700){
          y_coord -= 700
        }else if(y_coord<0){
          y_coord += 750
        }
        ellipse(x_coord, y_coord, 70, 40)
      }
    }
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

const rockTable = [
  //comments tell what parts relative of local location are the same
  [14,3], // nothing
  [14,3], // N
  [14,3], //  S
  [14,3],//  NS
  [14,3], //  E
  [15,5], //  NE
  [15,3], //  SE
  [15,4], //  NSE
  [14,3], //  W
  [17,5], //  NW
  [17,3], // SW
  [17,4], //NSW
  [14,3], //EW
  [16,5], // NEW
  [16,3], // SEW
  [16,4], // everything
]




const darkSandTable = [
  [9,18], // nothing
  [5,18], // N
  [5,20], //  S
  [5, 18],//  NS
  [6,16], //  E
  [4,20], //  NE
  [4,18], //  SE
  [6,19], //  NSE
  [6,18], //  W
  [6,20], //  NW
  [4,18], // SW
  [4,19], //NSW
  [9,18], //EW
  [5,20], // NEW
  [5,18], // SEW
  [9,18], // everything
]






