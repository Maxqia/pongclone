// -- constants --
const UP = 38, DOWN = 40, S = 83, W = 87, ESC = 27; // keycodes
const x_size = 600; // 800
const y_size = 450; // 600
const paddle_length = y_size / 6; // 100
const paddle_width = x_size * 3 / 160; // 15
const paddle_distance_edge = x_size/4;
const paddle_move_velocity = 0.8; // 10
const ball_size = /*y_size / 100*/ 10; // 6
const ball_y_velocity = y_size * 4/600; // 4
const ball_x_velocity = x_size * 6/800; // 6
const zone_thickness = x_size / 160; // 5
// -- end constants --

canvas = document.getElementById('mainCanvas');
canvas.width = x_size;
canvas.height = y_size;

ctx = canvas.getContext("2d");
pause = true;

ypad = new Array(3);
padgrav = new Array(3);
padvel = new Array(3);
ypad[1] = ypad[2] = (y_size - paddle_length) / 2; // top of the paddle (in center)
padgrav[1] = padgrav[2] = padvel[1] = padvel[2] = 0;

ballXpos = (x_size - ball_size) / 2
ballYpos = (y_size - ball_size) / 2
ballXgrav = Math.random() >= 0.5 ? ball_x_velocity : -ball_x_velocity;
          //(Math.random() * 2) - 1;
ballYgrav = Math.random() >= 0.5 ? ball_y_velocity : -ball_y_velocity;

window.requestAnimationFrame(gameTick);
function gameTick() {
  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, canvas.width, canvas.height); // also clears it!

  ctx.fillStyle = "white";
  drawBall(); // more like update...
  drawPaddles();

  //ctx.fillStyle = "gray";
  drawRules(); // depends on drawBall
  if (!pause) window.requestAnimationFrame(gameTick);
}

//stillCollidePaddle = false;
function drawBall() {
  ballXpos += ballXgrav;
  ballYpos += ballYgrav;

  // switch y direction if it hits the ceiling
  if (ballYpos <= 0 || ballYpos >= (y_size - ball_size)) {
    ballYgrav *= -1;
  }

  if (ifCollidePaddle(false, ypad[1]) || // note, half the ball dissapears
      ifCollidePaddle(true,ypad[2])) {   // when hit by paddle (it used to be a bug, but I liked it)
        /*if (!stillCollidePaddle)*/ ballXgrav *= -1;
        //stillCollidePaddle = true;
  } //else stillCollidePaddle = false;


  ctx.fillRect(ballXpos, ballYpos, ball_size, ball_size);
}

function drawPaddles() {
  for (ball = 1; ball < 3; ball++) {
    console.log(ypad[ball].toString())
    padvel[ball] += padgrav[ball];
    padvel[ball] -= /*pad1dir  paddle_move_velocity/2 */ padvel[ball] / 16;
    if (Math.abs(padvel[ball]) < padvel[ball] / 16) padvel[ball] = 0;
    ypad[ball] += padvel[ball];
    console.log(ypad[ball].toString());

    if (ypad[ball] < 0) {
      ypad[ball] = 0;
      padvel[ball] = 0;
      //padgrav[ball] = 0;
    }
    if (ypad[ball] > (y_size - paddle_length)) {
      ypad[ball] = (y_size - paddle_length);
      padvel[ball] = 0;
      //padgrav[ball] = 0;
    }
    drawPaddle(ball == 2, ypad[ball]);
  }
}

function ifCollidePaddle(right, yPos) {
  xPos1 = xPos2 = getPaddleXPos(right);
  yPos1 = yPos2 = yPos;
  xPos2 += paddle_width;
  yPos2 += paddle_length;

  return (ballXpos >= xPos1 && ballXpos <= xPos2
      && ballYpos >= yPos1 && ballYpos <= yPos2)
      || (ballXpos + ball_size >= xPos1 && ballXpos + ball_size <= xPos2
      && ballYpos + ball_size >= yPos1 && ballYpos + ball_size <= yPos2)
}

function drawPaddle(right, yPos) {
  ctx.fillRect(getPaddleXPos(right),yPos,
    paddle_width, paddle_length);
}

function getPaddleXPos(right) {
  var xPos;
  if (right) {
    xPos = x_size - (paddle_distance_edge + paddle_width);
  } else xPos = paddle_distance_edge;
  return xPos;
}

document.addEventListener('keydown', function(event) {
  switch (event.keyCode) {
    case W :
        padgrav[1] = -paddle_move_velocity;
        break;
    case S :
        padgrav[1] = paddle_move_velocity;
        break;
    case UP :
        padgrav[2] = -paddle_move_velocity;
        break;
    case DOWN :
        padgrav[2] = paddle_move_velocity;
        break;
  }
});

document.addEventListener('keyup', function(event) {
  switch (event.keyCode) {
    case W :
    case S :
        padgrav[1] = 0;
        break;
    case UP :
    case DOWN :
        padgrav[2] = 0;
        break;
    case ESC :
        console.log("tigged");
        pause = !pause;
        window.requestAnimationFrame(gameTick);
        break;
  }
});

var midrules = false ;
scoreElement = document.getElementById("score");
pad1score = 0;
pad2score = 0;
function drawRules() {
  // roll over the sides and switch rules
  if (ballXpos <= 0 - ball_size) {
    if (!midrules) pad2score++;
    midrules = true;
    ballXpos += (x_size + ball_size);
  }
  if (ballXpos >= x_size + ball_size) {
    if (!midrules) pad1score++;
    midrules = true;
    ballXpos -= (x_size + ball_size);
  }
  if (ballXpos >= (x_size)/2 - zone_thickness &&
      ballXpos <= (x_size)/2 + zone_thickness) {
    if (midrules) {
      oldXPos = ballXpos - ballXgrav;
      if (oldXPos > (x_size/2)) {
        pad1score++;
      } else pad2score++;
    }
    midrules = false;
   }
  scoreElement.innerHTML = pad1score.toString() + " " + pad2score.toString();

  ctx.globalAlpha = 0.1
  if (midrules) {
    ctx.fillRect((x_size - (2 * zone_thickness))/2 , 0, 2 * zone_thickness, y_size);
  } else {
    ctx.fillRect(0, 0, zone_thickness, y_size);
    ctx.fillRect(x_size - zone_thickness, 0, zone_thickness, y_size);
  }
  ctx.globalAlpha = 1;

}
