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
ballYgrav = ball_y_velocity;

window.requestAnimationFrame(gameTick);
function gameTick() {
  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, canvas.width, canvas.height); // also clears it!

  pad1y += pad1grav;
  pad2y += pad2grav;
  ctx.fillStyle = "white";
  drawPaddle(false, pad1y);
  drawPaddle(true, pad2y);
  drawBall();
  if (!pause) window.requestAnimationFrame(gameTick);
}

function drawBall() {
  ballXpos += ballXgrav;
  ballYpos += ballYgrav;

  // roll over the sides
  if (ballXpos <= 0 - ball_size) ballXpos += (x_size + ball_size);
  if (ballXpos >= x_size + ball_size) ballXpos -= (x_size + ball_size);
  // switch y direction if it hits the ceiling
  if (ballYpos <= 0 || ballYpos >= (y_size - ball_size)) {
    ballYgrav *= -1;
    /*ballXpos += ballXgrav;
    ballYpos += ballYgrav;*/
    //pause = true;
  }

  if (ifCollidePaddle(false, pad1y) ||
      ifCollidePaddle(true,pad2y)) ballXgrav *= -1;


  ctx.fillRect(ballXpos, ballYpos, ball_size, ball_size);
}

function drawPaddle(right, yPos) {
  ctx.fillRect(getPaddleXPos(right),yPos,
    paddle_width, paddle_length);
}

function ifCollidePaddle(right, yPos) {
  xPos1 = xPos2 = getPaddleXPos(right);
  yPos1 = yPos2 = yPos;
  xPos2 += paddle_width;
  yPos2 += paddle_length;

  return (ballXpos >= xPos1 && ballXpos <= xPos2
      && ballYpos >= yPos1 && ballYpos <= yPos2)
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
