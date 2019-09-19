/*
 * 
 * The p5.RoverCam library - First-Person 3D CameraControl for p5.js and WEBGL.
 *
 *   Copyright � 2019 by p5.RoverCam authors
 *
 *   Source: https://github.com/freshfork/p5.RoverCam
 *
 *   MIT License: https://opensource.org/licenses/MIT
 * 
 * 
 * explanatory note:
 * 
 * p5.RoverCam is a derivative of the QueasyCam Library by Josh Castle,
 * ported to JavaScript for p5.js from github.com/jrc03c/queasycam
 * 
 */

// First-person camera control
// Mouse:
//       left/right : pan
//       up/down : tilt
//       click : move forward

// Keys: a/d : left/right
//       w/s : forward/backward
//       e/q : up/down


class RoverCam {
  constructor(){
    registerMethod('post', () => this.draw() );
    this.speed = 3.0;
    this.sensitivity = 2.0;
    this.position = createVector(0, 0, 0);
    this.velocity = createVector(0, 0, 0);
    this.up = createVector(0, 1, 0);
    this.right = createVector(1, 0, 0);
    this.forward = createVector(0, 0, 1);
    this.pan = 0.0;
    this.tilt = 0.0;
    this.friction = 0.75;
    perspective(PI/3, width/height, 0.01, 1000.0);
  }
  draw(){
    this.pan += map(mouseX - pmouseX, 0, width, 0, TWO_PI) * this.sensitivity;
    this.tilt += map(mouseY - pmouseY, 0, height, 0, PI) * this.sensitivity;
    this.tilt = this.clamp(this.tilt, -PI/2.01, PI/2.01);

    if (this.tilt == PI/2.0) this.tilt += 0.001;

    this.forward = createVector(cos(this.pan), tan(this.tilt), sin(this.pan));
    this.forward.normalize();
    this.right = createVector(cos(this.pan - PI/2.0), 0, sin(this.pan - PI/2.0));
    if(keyIsPressed && key == 'a') this.velocity.add(p5.Vector.mult(this.right, this.speed));
    if(keyIsPressed && key == 'd') this.velocity.sub(p5.Vector.mult(this.right, this.speed));
    if(keyIsPressed && key == 'w') this.velocity.add(p5.Vector.mult(this.forward, this.speed));
    if(keyIsPressed && key == 's') this.velocity.sub(p5.Vector.mult(this.forward, this.speed));
    if(keyIsPressed && key == 'q') this.velocity.add(p5.Vector.mult(this.up, this.speed));
    if(keyIsPressed && key == 'e') this.velocity.sub(p5.Vector.mult(this.up, this.speed));
    if(mouseIsPressed) this.velocity.add(p5.Vector.mult(this.forward, this.speed));

    this.velocity.mult(this.friction);
    this.position.add(this.velocity);
    let center = p5.Vector.add(this.position, this.forward);
    camera(this.position.x, this.position.y, this.position.z, center.x, center.y, center.z, this.up.x, this.up.y, this.up.z);
  }

  clamp(aNumber, aMin, aMax) {
    return (aNumber > aMax ? aMax
        : aNumber < aMin ? aMin
            : aNumber);
  }
}