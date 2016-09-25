"use strict";

var PI = Math.PI;
var floor = Math.floor;
var random = Math.random;

window.onload = function () {
  var canvas = document.getElementById("canvas");
  var width = canvas.width;
  var height = canvas.height;

  var length = 10;
  var ss = new Array(length);
  for (var index = 0; index < length; index += 1) {
    ss[index] = [
      [floor(random() * width), floor(random() * height)],
      [floor(random() * width), floor(random() * height)]
    ];
  }

  var now = new Date();
  var ps = [];
  sweep.findIntersections(ss, function (p) {
    ps.push(p);
  });
  console.log(new Date() - now);

  var ctx = canvas.getContext("2d");
  ctx.clearRect(0, 0, width, height);
  for (var index = 0; index < ss.length; index += 1) {
    var s = ss[index];
    var org = s[0];
    var dest = s[1];
    ctx.beginPath();
    ctx.moveTo(org[0], org[1]);
    ctx.lineTo(dest[0], dest[1]);
    ctx.stroke();
  }
  for (var index = 0; index < ps.length; index += 1) {
    var p = ps[index];
    ctx.beginPath();
    ctx.arc(p[0], p[1], 4, 0, 2 * PI);
    ctx.fill();
  }
};
