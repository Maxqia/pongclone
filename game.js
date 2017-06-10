// -- constants --
const UP = 38, DOWN = 40, S = 83, W = 87;
const x_size = 400;
const y_size = 300;
const paddle_length = 50;
const paddle_width = 15;
const paddle_distance_edge = 40;
const ball_size = 4;
// -- end constants --

canvas = document.getElementById('mainCanvas');
canvas.width = x_size;
canvas.height = y_size;

ctx = canvas.getContext("2d");
pad1y = pad2y = (y_size - paddle_length) / 2 // top of the paddle (in center)
pad1grav = pad2grav = ballXgrav = ballYgrav = 0;
ballXPos = (x_size - ball_size) / 2
ballYPos = (y_size - ball_size) / 2

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
  window.requestAnimationFrame(gameTick);
}

function drawBall() {
  ctx.fillRect(ballXPos, ballYPos, ball_size, ball_size);
}

function drawPaddle(right, yPos) {
  var xPos;
  if (right) {
    xPos = x_size - (paddle_distance_edge + paddle_width);
  } else xPos = paddle_distance_edge;
  ctx.fillRect(xPos,yPos,
    paddle_width, paddle_length);
}

document.addEventListener('keydown', function(event) {
  switch (event.keyCode) {
    case W :
        pad1grav = -2;
        break;
    case S :
        pad1grav = 2;
        break;
    case UP :
        pad2grav = -2;
        break;
    case DOWN :
        pad2grav = 2;
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

function onKey(upOrDown, keyCode) {

}
