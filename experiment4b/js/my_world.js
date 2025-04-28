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
var treeSprite = 0;
var cabinSprite;
function p3_preload() {
  console.log('preloading');
  treeSprite = loadImage('https://cdn.glitch.global/732fabad-456a-45d2-9d25-6acc91326292/tree_sprite.png?v=1745618917679');
  cabinSprite = loadImage('https://cdn.glitch.global/732fabad-456a-45d2-9d25-6acc91326292/cabin_sprite.png?v=1745626790858');
  if(treeSprite != 0){
    console.log('imge loaded');
  }
  imageMode(CENTER);
}

function p3_setup() {
}

let worldSeed;
let clickedTiles = {}

function p3_worldKeyChanged(key) {
  worldSeed = XXH.h32(key, 0);
  noiseSeed(worldSeed);
  randomSeed(worldSeed);
}

function p3_tileWidth() {
  return 20;
}
function p3_tileHeight() {
  return 10;
}

let [tw, th] = [p3_tileWidth(), p3_tileHeight()];

let clicks = {};

function p3_tileClicked(i, j) {
  let key = [i, j];
  clicks[key] = 1;
}



function p3_drawBefore() {}

//x and y are coord vals, gridpoint count
function finiteDistance(x,y, detail, scale){
  let init = scale*noise(x,y);
  let xVal = scale*noise(x+detail,y)
  let yVal = scale*noise(x,y+detail)
  let xSlope = (init-xVal)/detail*2;
  let ySlope = (init-yVal)/detail*2;
  return [xSlope, ySlope];
}

let elevation;


function p3_drawTile(i, j) {
  noStroke();

  let tileVal = XXH.h32("tile:" + [i, j], worldSeed);
  //by adding second() to the coordinates, I can create a scrolling effect
  

  push();
  //
  
  //let noiseVal = p3_voronoi(i,j, 2, 10);
  let scalar = 1
  
  let fD = finiteDistance(i,j, 0.5, scalar);
  let fD2 = finiteDistance(tileVal, tileVal, 0.4, scalar);
  let fD3 = finiteDistance(j, i, 0.3, scalar);

  let m = sqrt(pow(fD[0], 2) + pow(fD[1], 2))
  let m2 = sqrt(pow(fD2[0], 2) + pow(fD2[1], 2))
  let m3 = sqrt(pow(fD3[0], 2) + pow(fD3[1], 2))
  
  let denmark = scalar*noise(i,j)*(1/(1+m));
  let sweden = scalar*noise(i,j)*(1/(1+m2));
  let england = scalar*noise(i,j)*(1/(1+m3));
  
  let rounded=0;
  /*
  if(denmark > 0.52){
    rounded = 1;
  }
  */
  elevation = 1*(denmark+sweden+england);
  //elevation = noise(i,j)
  //elevation = denmark*(1/(1+(sqrt(pow(fD[0], 2) + pow(fD[1], 2)))));
  /*
  if(elevation<-5){
    fill("white")
  }else if(elevation<-4){
    fill("grey")
  }else if(elevation<-2){
    fill("black")
  }
  */
  fill(color(255*elevation/scalar, 255*elevation/scalar, 255*elevation/scalar))
  beginShape();
  let hScale = -18*elevation;
  let n = clicks[[i, j]] | 0;
  if (n % 2 == 1) {
    hScale += 20
  }
  let color_pal;
  if(hScale<-21){
    color_pal = [255, 255, 255]
  }else if(hScale<-19){
    color_pal = [211, 253, 244]
  }else if(hScale<-14){
    color_pal = [235, 254, 250]
  }else if(hScale<-6){
    color_pal = [107, 228, 252]
  }else{
    color_pal = [3, 137, 226]
  }
  
  fill(color(color_pal[0]*0.8, color_pal[1]*0.8, color_pal[2]*0.8));

  
  vertex(-tw, 0);
  vertex(-tw, 0+hScale);
  vertex(0, th+hScale);
  vertex(tw, 0+hScale);
  vertex(tw, 0);
  vertex(0, th);
  endShape(CLOSE);
  
  fill(color(color_pal[0]*0.8, color_pal[1]*0.8, color_pal[2]*0.8));

  beginShape();
  vertex(-tw, 0);
  vertex(-tw, 0+hScale);
  vertex(0, -th+hScale);
  vertex(tw, 0+hScale);
  vertex(tw, 0);
  vertex(0, -th);
  endShape(CLOSE);
  
  fill(color(color_pal[0], color_pal[1], color_pal[2]));

  beginShape();
  vertex(-tw, 0+hScale);
  vertex(0, th+hScale);
  vertex(tw, 0+hScale);
  vertex(0, -th+hScale);
  endShape(CLOSE);
  
  
  /*
  n = clicks[[i, j]] | 0;
  if (n % 2 == 1) {
    //fill(255, 255, 255, 255);
    
    translate(0, -3+hScale);
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
  */
  
  if(hScale<-23){
    if(tileVal % 9 == 0 && tileVal%2 == 0){
      image(cabinSprite, -15, -20+hScale, 30, 30)
    }
  }else if(hScale<-18){
    if(tileVal % 3 == 0){
      //fill("green")
      //ellipse(0, 0+hScale, 10, 10);
      image(treeSprite, -20, -35+hScale, 40, 40);
    }
  }
  pop();
}

function p3_drawSelectedTile(i, j) {
  noFill();
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

  //let distance = p3_voronoi(i,j, 2, 10);
  let scalar = 1
  
  
  let fD = finiteDistance(i,j, 0.5, scalar);
  let fD2 = finiteDistance(tileVal, tileVal, 0.4, scalar);
  let fD3 = finiteDistance(j, i, 0.3, scalar);

  let m = sqrt(pow(fD[0], 2) + pow(fD[1], 2))
  let m2 = sqrt(pow(fD2[0], 2) + pow(fD2[1], 2))
  let m3 = sqrt(pow(fD3[0], 2) + pow(fD3[1], 2))
  
  let denmark = scalar*noise(i,j)*(1/(1+m));
  let sweden = scalar*noise(i,j)*(1/(1+m2));
  let england = scalar*noise(i,j)*(1/(1+m3));
  
  let rounded=0;
  elevation = -18*(denmark+sweden+england);

  
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
  
  /*
  if(denmark > 0.52){
    rounded = 1;
  }
  */
  fill('pink');

  text("tile " + [i, j, elevation], 0, 0);
}

function p3_drawAfter() {}
