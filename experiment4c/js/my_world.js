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

function p3_worldKeyChanged(key) {
  worldSeed = XXH.h32(key, 0);
  noiseSeed(worldSeed);
  randomSeed(worldSeed);
}

function p3_tileWidth() {
  return 32;
}
function p3_tileHeight() {
  return 16;
}

let [tw, th] = [p3_tileWidth(), p3_tileHeight()];

let clicks = {};

function p3_tileClicked(i, j) {
  let key = [i, j];
  clicks[key] = 1 + (clicks[key] | 0);
}

function p3_drawBefore() {}

function erosionAlg(i, j, threshold){
  let initVal = noise(i, j);
  let neighborCount = 0;
  
  if(initVal < threshold){
    for(let x = -1; x<=1; x++){
      for(let y = -1; y<=1; y++){
        let noiseVal = noise(i+x, j+y);
        if(noiseVal <= threshold){
          noiseVal = 1
        }else{
          noiseVal = 0
        }
        neighborCount += noiseVal;
      }
    }
    if(neighborCount>3){
      return 0;
    }
    return 1;
  }else{
    for(let x = -1; x<=1; x++){
      for(let y = -1; y<=1; y++){
        let noiseVal = noise(i+x, j+y);
        if(noiseVal >= threshold){
          noiseVal = 1
        }else{
          noiseVal = 0
        }
        neighborCount += noiseVal;
      }
    }
    if(neighborCount>3){
      return 1;
    }
    return 0;
  }  
  
}

function p3_drawTile(i, j) {
  noStroke();
  //initial tunnel creation
  let tileVal = XXH.h32("tile:" + [i, j], worldSeed);
  let elevation = 0;
  let nVal = erosionAlg(i, j, 0.5) + erosionAlg(tileVal, tileVal, 0.8);
  
  //MINE TIME
  let n = clicks[[i, j]];
  if (n % 2 == 1) {
    nVal = 0;
  }
  //Coloring the Stone
  let currentCol = [36, 36, 36]
  if(nVal){
    fill(color(currentCol))
    elevation = -10
  }else{
    currentCol = [82, 82, 82]
    fill(color(currentCol))
  }
  
  if(tileVal % 2 == 0){
    let fact = 1.1
    fill(color(currentCol[0]*fact, currentCol[1]*fact, currentCol[2]*fact))
  }
  
  if(!nVal){
    if(!erosionAlg(i, j, 0.28)){
      fill(color(146,108,77))
    }
    
    
  }

  push();

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

  

  pop();
}

function p3_drawSelectedTile(i, j) {
  noFill();
  stroke(0, 255, 0, 128);

  beginShape();
  vertex(-tw, 0);
  vertex(0, th);
  vertex(tw, 0);
  vertex(0, -th);
  endShape(CLOSE);

  noStroke();
  fill(0);
  
  text("tile " + [i, j], 0, 0);
}

function p3_drawAfter() {}
