"use strict";

/* global XXH */
/* exported --
    p3_preload
    p3_setup
    p3_worldKeyChanged
    p3_tileWidth
    p3_tileHeight
    p3_tileClicked
    p3_drawBefore
    p3_drawTile
    p3_drawSelectedTile
    p3_drawAfter
*/
function p3_preload() {}

function p3_setup() {}

let worldSeed;
let clickedTiles = {}

function p3_worldKeyChanged(key) {
  worldSeed = XXH.h32(key, 0);
  noiseSeed(worldSeed);
  randomSeed(worldSeed);
}

function p3_tileWidth() {
  return 16;
}
function p3_tileHeight() {
  return 8;
}

let [tw, th] = [p3_tileWidth(), p3_tileHeight()];

let clicks = {};

function p3_tileClicked(i, j) {
  let key = [i, j];
  clicks[key] = 1 + (clicks[key] | 0);
}



function p3_drawBefore() {}

//x and y are coord vals, gridpoint count
function finiteDistance(x,y, detail){
  let init = noise(x,y);
  let xVal = noise(x+detail,y)
  let yVal = noise(x,y+detail)
  let xSlope = (init-xVal)/detail*2;
  let ySlope = (init-yVal)/detail*2;
  return [xSlope, ySlope];
}


function p3_drawTile(i, j) {
  noStroke();

  let elevation = 0;
  let tileVal = XXH.h32("tile:" + [i, j], worldSeed);
  //by adding second() to the coordinates, I can create a scrolling effect
  

  push();
  //
  
  //let noiseVal = p3_voronoi(i,j, 2, 10);
  noiseDetail(7,0.3)
  
  let fD = finiteDistance(i,j, 0.5);
  let denmark = noise(i,j);
  let nTile = noise(tileVal);
  
  let rounded=0;
  if(denmark > 0.52){
    rounded = 1;
  }

  let noiseVal = denmark*(2.5)-1.3*(1/(1+(sqrt(pow(fD[0], 2) + pow(fD[1], 2)))));
  if(noiseVal>0.35 && sin(i/4)*denmark > 0 && sin(j/4.5)*denmark>0 && (rounded || nTile>0.1)){
    elevation = -3-nTile*9;
    fill("#ffe694");
    if(noiseVal>0.65){
      fill("green");
    }
  }else{
    noiseDetail(4, 0.7)
    denmark = noise(i,j);
    let delta = 20;
    let direction = [1, 0.3];
    let amplitude = 4.3*denmark*sin(direction[1])*5;

  
    let k = 2*PI/delta
    let w = k*5
    let dot = direction[0]*i + direction[1]*j
    let product = (k*dot)- (w*5)
    elevation = amplitude*sin(product+(millis()*0.0005))

    if(elevation>0){
      let x = floor(denmark)*3
      switch(x){
      case 0:
        fill('#0c5896')
        break;
      case 1:
        fill('#0f4d80')
        break;
      case 2:
        fill('#034e8c')
        break;
      default:
        fill('#094170')
        break;
        
      }
    }else if(elevation>-3){
      fill("#0081c7")
    }else if(elevation>-3.2 && elevation<-3.1){
      fill("#7fcdff");
    }else if(elevation>-3.9 && elevation<-3.2){
      fill("#1da2d8")
    }else{
      fill('#def3f6')
    }  
  }
  
  beginShape();
  vertex(-tw, 0);
  vertex(-tw, 0+elevation);
  vertex(0, th+elevation);
  vertex(tw, 0+elevation);
  vertex(tw, 0);
  vertex(0, th);
  endShape(CLOSE);
  
  beginShape();
  vertex(-tw, 0);
  vertex(-tw, 0+elevation);
  vertex(0, -th+elevation);
  vertex(tw, 0+elevation);
  vertex(tw, 0);
  vertex(0, -th);
  endShape(CLOSE);
  
  beginShape();
  vertex(-tw, 0+elevation);
  vertex(0, th+elevation);
  vertex(tw, 0+elevation);
  vertex(0, -th+elevation);
  endShape(CLOSE);
  
  

  let n = clicks[[i, j]] | 0;
  if (n % 2 == 1) {
    //fill(255, 255, 255, 255);
    
    translate(0, -3+elevation);
    rotate(sin(elevation/-PI)/6)
    //fill('blue')
    fill('rgba(0,0,0,0.3)')
    ellipse(0, 1, 14, 5);

    fill('rgb(204, 49, 2)');
    ellipse(0, 0, 10, 5);
    rect(-5,-3,10,3)
    ellipse(0, -3, 10, 5);
    fill("rgb(214, 80, 39)")
    ellipse(0, -3, 5, 3);
    rect(-2.5, -8, 5, 6)
    fill('rgb(232, 76, 28)')
    ellipse(0, -8, 5, 3);

    
  }

  pop();
}

function p3_drawSelectedTile(i, j) {
  noFill();
  let elevation = 0;
  let tileVal = XXH.h32("tile:" + [i, j], worldSeed);
  //by adding second() to the coordinates, I can create a scrolling effect
  

  push();
  //draw buoy at clicked
  /*
  if((tileVal - floor(sin(noise(i,j)))*80)%30 == 0){
    elevation = -3-noise(i,j)*8;
  }else{
    let amplitude = 6*noise(i,j);
    let delta = 20;
    let direction = [1, 0.3];
  
    let k = 2*PI/delta
    let w = k*5
    let dot = direction[0]*i + direction[1]*j
    let product = (k*dot)- (w*5)
    elevation = amplitude*sin(product+(millis()*0.001))
  }


  stroke(0, 255, 0, 128);

  beginShape();
  vertex(-tw, 0);
  vertex(-tw, 0+elevation);
  vertex(0, th+elevation);
  vertex(tw, 0+elevation);
  vertex(tw, 0);
  vertex(0, th);
  endShape(CLOSE);
  
  stroke(255, 0, 255, 128);
  beginShape();

  vertex(-tw, 0+elevation);
  vertex(0, -th+elevation);
  vertex(tw, 0+elevation);
  vertex(0, th+elevation);
  endShape(CLOSE);

  

  noStroke();
  */

  fill('white');
  //let distance = p3_voronoi(i,j, 2, 10);
  text("tile " + [i, j], 0, 0);
}

function p3_drawAfter() {}
