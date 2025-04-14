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


let seed = 0;

const skyColor1 = "#4d9dbb";
const skyColor2 = "#8bc0c8";
const skyColor3 = "#e7d0b5";
const skyColor4 = "#fcf2d1";

const backgroundMountain = "#1c7ac7";
const foregroundMountain = "#1562a1";

const skyParallaxMultX = 0.012
const skyParallaxMultY = 0.01

const backgroundParallaxMultX = 0.05
const backgroundParallaxMultY = 0.03

const foregroundParallaxMultX = 0.1
const foregroundParallaxMultY = 0.08



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

  let canvas = createCanvas(700, 400);
  let button = createButton("reimagine").mousePressed(() => seed++);

  canvas.parent("canvas-container");
  button.parent("canvas-container");
  // resize canvas is the page is resized

  // create an instance of the class
  myInstance = new MyClass("VALUE1", "VALUE2");

  
}

// draw() function is called repeatedly, it's the main animation loop
function draw() {
  randomSeed(seed);
  //background(100);

  noStroke();

  //sky part 1
  fill(skyColor1);
  rect(0, 0, width, height / 2);
  
  //sky part 2
  fill(skyColor2);  
  
  const steps = 40;
  
  beginShape();  
  for (let i = 0; i < steps + 1; i++) {
    let x = (width * i) / steps;
    let y = height/4 + sin((2 * PI * millis()*random()/4000)) / 0.5;

    
    vertex(x - mouseX*skyParallaxMultX, y - mouseY*skyParallaxMultY);
  }
  vertex(width+50, height / 4);
  vertex(width, height);
  vertex(0, height);


  endShape(CLOSE);
  
  //sky part 3
  fill(skyColor3);

  beginShape();
  for (let i = 0; i < steps + 1; i++) {
    let x = (width * i) / steps;
    let y = (sin(0.013*x)*random(4, 12)+random(0.9, 2.5)+ height/2.5) + cos((2 * PI * millis()*random()/2500)) / 0.5;
    //yPosition = const equation + variation equation
    
    vertex(x - mouseX*skyParallaxMultX, y - mouseY*skyParallaxMultY);
  }
  vertex(width+50, height / 2.5);
  vertex(width, height);
  vertex(0, height);


  endShape(CLOSE);
  
  //sky part 4
  fill(skyColor4);
  
  beginShape();
  for (let i = 0; i < steps + 1; i++) {
    let x = (width * i) / steps;
    let y = (sin(0.018*x+random(0.9, 2.5))*18+ height/1.8) + cos((2 * PI * millis()*random()/2500)) / 0.5;
    //yPosition = const equation + variation equation
    
    vertex(x - mouseX*skyParallaxMultX, y - mouseY*skyParallaxMultY);
  }
  vertex(width+50, height / 1.8);
  vertex(width, height);
  vertex(0, height);
  endShape(CLOSE);

  //sun
  fill("#ffffff");
  ellipse(490-mouseX*skyParallaxMultX*0.2, 195-mouseY*skyParallaxMultY*0.5, 70, 70);
  
  
  
  stroke("#3FACDB")
  strokeWeight(7)
  beginShape();
  fill(backgroundMountain);
  for (let i = 0; i < steps + 1; i++) {
    let x = (width * i) / steps;
    let y =  sin((x*0.01)+(3*PI/2))*40+310 + 1.6*random(-60, 20) * abs(x-(width/2))/width;
    //yPosition = const equation + variation equation
    vertex(x - mouseX*backgroundParallaxMultX, y - mouseY*backgroundParallaxMultY);
  }
  vertex(width+250 - mouseX*backgroundParallaxMultX, sin((width+50*0.01)+(3*PI/2))*40+310 - mouseY*backgroundParallaxMultY);

  vertex(width+50- mouseX*backgroundParallaxMultX, height+30- mouseY*backgroundParallaxMultY);
  vertex(0- mouseX*backgroundParallaxMultX, height+30- mouseY*backgroundParallaxMultY)
  
  endShape(CLOSE);
  noStroke()
  //fog
  fill(255,255,255, 70);
  ellipse(350-mouseX*0.01, 330-mouseY*0.035, 1200, 240);
  
  //foreground
  beginShape();
  fill(foregroundMountain);
  vertex(width/8 - mouseX * foregroundParallaxMultX, height+40 - mouseY * foregroundParallaxMultY)
  vertex(width/4 - mouseX * foregroundParallaxMultX, height-35 - mouseY * foregroundParallaxMultY)
  vertex(width/2 - mouseX * foregroundParallaxMultX, height-50 - mouseY * foregroundParallaxMultY)
  vertex(3*width/4 - mouseX * foregroundParallaxMultX, height-35 - mouseY * foregroundParallaxMultY)
  vertex(7*width/8 - mouseX * foregroundParallaxMultX, height+40 - mouseY * foregroundParallaxMultY)

  
  endShape()
}

// mousePressed() function is called once after every time a mouse button is pressed
function mousePressed() {
    // code to run when mouse is pressed
}