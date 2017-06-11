// -- constants --
const UP = 38, DOWN = 40, S = 83, W = 87;
const x_size = 400;
const y_size = 300;
const paddle_length = 50;
const paddle_width = 15;
const paddle_distance_edge = 40;
const paddle_move_velocity = 4;
const ball_size = 4;
const ball_y_velocity = 2;
const ball_x_velocity = 4;
// -- end constants --

canvas = document.getElementById('mainCanvas');
canvas.width = x_size;
canvas.height = y_size;

ctx = canvas.getContext("2d");
pause = false;
pad1y = pad2y = (y_size - paddle_length) / 2 // top of the paddle (in center)
pad1grav = pad2grav = 0;
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
  drawPaddles();
  drawBall(); // more like update...
  if (!pause) window.requestAnimationFrame(gameTick);
}

stillCollidePaddle = false;
function drawBall() {
  ballXpos += ballXgrav;
  ballYpos += ballYgrav;

  // roll over the sides
  if (ballXpos <= 0 - ball_size) ballXpos += (x_size + ball_size);
  if (ballXpos >= x_size + ball_size) ballXpos -= (x_size + ball_size);
  // switch y direction if it hits the ceiling
  if (ballYpos <= 0 || ballYpos >= (y_size - ball_size)) {
    ballYgrav *= -1;
  }

  if (ifCollidePaddle(false, pad1y) || // note, half the ball dissapears
      ifCollidePaddle(true,pad2y)) {   // when hit by paddle (it used to be a bug, but I liked it)
        if (!stillCollidePaddle) ballXgrav *= -1;
        stillCollidePaddle = true;
  } else stillCollidePaddle = false;


  ctx.fillRect(ballXpos, ballYpos, ball_size, ball_size);
}

function drawPaddles() {
  pad1y += pad1grav;
  pad2y += pad2grav;

  // we want it to go off the screen so it meshes with the window
  if (pad1y <= -paddle_move_velocity || pad1y >= (y_size - paddle_length) + paddle_move_velocity) {
    pad1y -= pad1grav;
    pad1grav = 0;
    //console.log(pad1y);
  }

  if (pad2y <= -paddle_move_velocity || pad2y >= (y_size - paddle_length) + paddle_move_velocity) {
    pad2y -= pad2grav;
    pad2grav = 0;
  }
  drawPaddle(false, pad1y);
  drawPaddle(true, pad2y);
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
        pad1grav = -paddle_move_velocity;
        break;
    case S :
        pad1grav = paddle_move_velocity;
        break;
    case UP :
        pad2grav = -paddle_move_velocity;
        break;
    case DOWN :
        pad2grav = paddle_move_velocity;
        break;
  }
});

document.addEventListener('keyup', function(event) {
  switch (event.keyCode) {
    case W :
    case S :
        pad1grav = 0;
        break;
    case UP :
    case DOWN :
        pad2grav = 0;
        break;
  }
});
