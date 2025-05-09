/* exported getInspirations, initDesign, renderDesign, mutateDesign */


function getInspirations() {
  return [
    {
      name: "Geisel Library", 
      assetUrl: "https://cdn.glitch.global/88dc04b2-55f7-46b4-ae33-c360503f9a02/geiselLibrary.jpg?v=1745959913201",
      credit: "Thomas De Wever via Istock editorial"
    },
    {
      name: "Osaka Nightlife", 
      assetUrl: "https://cdn.glitch.global/88dc04b2-55f7-46b4-ae33-c360503f9a02/osaka.jpg?v=1745962380827",
      credit: "Osaka River, via 10 Fun Things To Do In Osaka At Night @lindagoeseast.com "
    },
    {
      name: "mountain view", 
      assetUrl: "https://cdn.glitch.global/88dc04b2-55f7-46b4-ae33-c360503f9a02/mountain.jpg?v=1745962799260",
      credit: "stock image via pexels.com/@pixabay"
    },
    {
      name: "Disaster Girl", 
      assetUrl: "https://cdn.glitch.global/3abd0223-86fb-43ce-a00a-fde12615bcd5/girl-with-fire.jpg?v=1714778905663",
      credit: "Four-year-old Zoë Roth, 2005"
    },
  ];
}

var globalW;
var globalH;

var xRes = 100
var yRes;

function initDesign(inspiration) {

  let canvasContainer = $('.image-container'); // Select the container using jQuery
  let canvasWidth = canvasContainer.width(); // Get the width of the container
  let aspectRatio = inspiration.image.height / inspiration.image.width;
  let canvasHeight = canvasWidth * aspectRatio; // Calculate the height based on the aspect ratio
  resizeCanvas(canvasWidth, canvasHeight);
  $(".caption").text(inspiration.credit); // Set the caption text

  // add the original image to #original
  const imgHTML = `<img src="${inspiration.assetUrl}" style="width:${canvasWidth/3}px;">`
  $('#original').empty();
  $('#original').append(imgHTML);


  let img_w = inspiration.image.width
  let img_h = inspiration.image.height
  let aRatio = img_w/img_h
  img_w = windowWidth/3
  img_h = img_w/aRatio
  resizeCanvas(img_w , img_h)
  pixelDensity(1)
  let img = inspiration.image
  img.resize(floor(img_w), floor(img_h));

  img.loadPixels()
  
  globalW = img_w
  globalH = img_h
  
  
  let photo = {
    background : 1,
    pieces: []
  }
  
  
  
  let globalBG = [0, 0, 0, 0]
  let resolution = 0
  yRes = floor(xRes*aRatio)

  for(let i = 0; i < img_h; i = i+floor(img_h/yRes)){
    for(let j = 0; j < img_w; j = j+floor(img_w/xRes)){
      let totalPix = 0
      let avg = [0, 0, 0, 0]
      for(let k = i; k< i+floor(img_h/yRes); k++){
        for(let l = j; l< j+floor(img_w/xRes); l++){
          let pixel_index = 4 * (l + k * img.width);
          avg[0] += img.pixels[pixel_index+0]
          avg[1] += img.pixels[pixel_index+1]
          avg[2] += img.pixels[pixel_index+2]
          avg[3] += img.pixels[pixel_index+3]
          totalPix++
          resolution++
          globalBG[0] += img.pixels[pixel_index+0]
          globalBG[1] += img.pixels[pixel_index+1]
          globalBG[2] += img.pixels[pixel_index+2]
          globalBG[3] += img.pixels[pixel_index+3]
        }
      }
      photo.pieces.push({
        
        
        x: floor(random(20)+j),
        y: floor(random(20)+i),
        w: floor(random(20) + img_w/xRes),
        h: floor(random(20) + img_h/yRes),
        fill: [avg[0]/totalPix, avg[1]/totalPix, avg[2]/totalPix]
      })
    }  
  }
  photo.background = [globalBG[0]/resolution, globalBG[1]/resolution, globalBG[2]/resolution]
  
  return photo;
}

function renderDesign(design, inspiration) {
  noStroke()
  background(design.background)
  for(let shape of design.pieces){
    fill(shape.fill[0], shape.fill[1], shape.fill[2])
    if(floor(random(10)) > 5){
      rect(shape.x-shape.w/2, shape.y-shape.h/2, shape.w, shape.h)
    }else{
      ellipse(shape.x, shape.y, shape.w*1.2, shape.h*1.5)
    }
  }
  
}

function mutateDesign(design, inspiration, rate) {
  let img = inspiration.image
  for(let shape of design.pieces) {
    let avg = [0, 0, 0, 0]
    let totalPix = 0
    
    shape.x = mutHelp(shape.x, 0, globalW*5, rate);
    shape.y = mutHelp(shape.y, 0, globalH*4, rate);
    shape.w = mutHelp(shape.w, 0, globalW/4, rate);
    shape.h = mutHelp(shape.h, 0, globalH/4, rate);
    
    let xStart = floor(constrain(shape.x, 0, img.width - 1));
    let yStart = floor(constrain(shape.y, 0, img.height - 1));
    let xEnd = floor(constrain(xStart + shape.w, 0, img.width));
    let yEnd = floor(constrain(yStart + shape.h, 0, img.height));
    
    for(let k = yStart; k< yEnd; k++){
      for(let l = xStart; l< xEnd; l++){
        let pixel_index = 4 * (l + k * img.width);
        avg[0] += img.pixels[pixel_index+0]
        avg[1] += img.pixels[pixel_index+1]
        avg[2] += img.pixels[pixel_index+2]
        avg[3] += img.pixels[pixel_index+3]
        totalPix++        
      }
    }
    shape.fill = [avg[0]/totalPix, avg[1]/totalPix, avg[2]/totalPix, avg[3]/totalPix]
  }
}

function mutHelp(num, min, max, rate){
   return constrain(randomGaussian(num, (rate * (max - min)) / 10), min, max);
}