var context;
var x = 100;
var y = 200;
var x1 = 300;
var y1 = 400;
var x2 = 1200;
var y2 = 400;
var x3 = 800;
var y3 = 100;
var x4 = 900;
var y4 = 600;
var dx = 5;
var dy = 5;
var dx1 = 1.4;
var dy1 = 1.4;
var dx2 = 1.4;
var dy2 = 1.4;
var dx3 = 1.4;
var dy3 = 1.4;
var dx4 = 1.4;
var dy4 = 1.4;
var context;

function init() {
  context = myCanvas.getContext("2d");
  context.canvas.width = window.innerWidth;
  context.canvas.height = window.innerHeight;
  img = document.getElementById("img");
  // img1 = document.getElementById("tom");
  // img2 = document.getElementById("ben");
  // img3 = document.getElementById("genie");
  // img4 = document.getElementById("brandon");
  setInterval(draw, 10);
}

function draw() {
  canvas = document.getElementById("myCanvas");
  context.clearRect(0, 0, canvas.width, canvas.height);
  context.beginPath();
  context.fillStyle = "#032dff";
  // Draws a circle of radius 20 at the coordinates 100,100 on the canvas
  context.drawImage(img, x, y, 100, 100);
  // context.drawImage(img1, x1, y1, 100, 100);
  // context.drawImage(img2, x2, y2, 100, 100);
  // context.drawImage(img3, x3, y3, 100, 100);
  // context.drawImage(img4, x4, y4, 100, 100);
  context.closePath();
  context.fill();
  // Boundary Logic
  if (x < 0 || x > window.innerWidth - 100) dx = -dx;
  if (y < 0 || y > window.innerHeight - 100) dy = -dy;
  // if (x1 < 0 || x1 > window.innerWidth - 100) dx1 = -dx1;
  // if (y1 < 0 || y1 > window.innerHeight - 100) dy1 = -dy1;
  // if (x2 < 0 || x2 > window.innerWidth - 100) dx2 = -dx2;
  // if (y2 < 0 || y2 > window.innerHeight - 100) dy2 = -dy2;
  // if (x3 < 0 || x3 > window.innerWidth - 100) dx3 = -dx3;
  // if (y3 < 0 || y3 > window.innerHeight - 100) dy3 = -dy3;
  // if (x4 < 0 || x4 > window.innerWidth - 100) dx4 = -dx4;
  // if (y4 < 0 || y4 > window.innerHeight - 100) dy4 = -dy4;
  x += dx;
  y += dy;
  // x1 += dx1;
  // y1 += dy1;
  // x2 += dx2;
  // y2 += dy2;
  // x3 += dx3;
  // y3 += dy3;
  // x4 += dx4;
  // y4 += dy4;
}
init();
window.addEventListener("resize", function () {
  context.canvas.width = window.innerWidth;
  context.canvas.height = window.innerHeight;
});
