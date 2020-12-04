var context;
var img;
var img1;
var img2;
var img3;
var img4;
var x = 100;
var y = 200;
var x1 = 200;
var y1 = 400;
var x2 = 300;
var y2 = 200;
var x3 = 200;
var y3 = 0;
var x4 = 0;
var y4 = 500;
var dx = -3;
var dy = 3;
var dx1 = 1.75;
var dy1 = 1.75;
var dx2 = 1.75;
var dy2 = -1.75;
var dx3 = -1.75;
var dy3 = 1.75;
var dx4 = -1.75;
var dy4 = -1.75;

function init() {
  context = myCanvas.getContext("2d");
  context.canvas.width = window.innerWidth;
  context.canvas.height = window.innerHeight;
  img = document.getElementById("img");
  if (context.canvas.width > 380) {
    img1 = document.getElementById("tom");
    img2 = document.getElementById("ben");
    img3 = document.getElementById("genie");
    img4 = document.getElementById("brandon");
    dx1 = 1.3;
    dy1 = 1.3;
    dx2 = -1.3;
    dy2 = -1.3;
    dx3 = 1.3;
    dy3 = 1.3;
    dx4 = -1.3;
    dy4 = -1.3;
  }
  dx = -2;
  dy = 2;

  setInterval(draw, 10);
}

function draw() {
  context.canvas.width = window.innerWidth;
  context.canvas.height = window.innerHeight;
  canvas = document.getElementById("myCanvas");
  context.clearRect(0, 0, canvas.width, canvas.height);
  var imageSize = 75;

  if (context.canvas.width > 380) {
    imageSize = 100;
    context.drawImage(img1, x1, y1, imageSize, imageSize);
    context.drawImage(img2, x2, y2, imageSize, imageSize);
    context.drawImage(img3, x3, y3, imageSize, imageSize);
    context.drawImage(img4, x4, y4, imageSize, imageSize);
    if (x1 < 0 || x1 > window.innerWidth - imageSize) dx1 = -dx1;
    if (y1 < 0 || y1 > window.innerHeight - imageSize) dy1 = -dy1;
    if (x2 < 0 || x2 > window.innerWidth - imageSize) dx2 = -dx2;
    if (y2 < 0 || y2 > window.innerHeight - imageSize) dy2 = -dy2;
    if (x3 < 0 || x3 > window.innerWidth - imageSize) dx3 = -dx3;
    if (y3 < 0 || y3 > window.innerHeight - imageSize) dy3 = -dy3;
    if (x4 < 0 || x4 > window.innerWidth - imageSize) dx4 = -dx4;
    if (y4 < 0 || y4 > window.innerHeight - imageSize) dy4 = -dy4;
    x1 += dx1;
    y1 += dy1;
    x2 += dx2;
    y2 += dy2;
    x3 += dx3;
    y3 += dy3;
    x4 += dx4;
    y4 += dy4;
  }
  // Draws a circle of radius 20 at the coordinates 100,100 on the canvas
  context.drawImage(img, x, y, imageSize, imageSize);
  // Boundary Logic
  if (x < 0 || x > window.innerWidth - imageSize) dx = -dx;
  if (y < 0 || y > window.innerHeight - imageSize) dy = -dy;

  x += dx;
  y += dy;
}
init();
window.addEventListener("resize", function () {
  context.canvas.width = window.innerWidth;
  context.canvas.height = window.innerHeight;
});
