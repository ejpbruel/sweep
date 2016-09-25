"use strict";

var RBTree = require("rbtree").RBTree;

var abs = Math.abs;
var max = Math.max;
var min = Math.min;

var EPSILON = 1E-6;

function orient(p1, p2, p3) {
  var x3 = p3[0];
  var y3 = p3[1];
  return (p1[0] - x3) * (p2[1] - y3) - (p1[1] - y3) * (p2[0] - x3);
}

function intersect(p1, p2, p3, p4) {
  var x1 = p1[0];
  var y1 = p1[1];
  var x2 = p2[0];
  var y2 = p2[1];
  var x3 = p3[0];
  var y3 = p3[1];
  var x4 = p4[0];
  var y4 = p4[1];
  var a11 = x1 - x2;
  var a12 = y1 - y2;
  var a21 = x3 - x4;
  var a22 = y3 - y4;
  var det = a11 * a22 - a12 * a21;
  if (det === 0) {
    return null;
  }
  var b1 = x1 * y2 - y1 * x2;
  var b2 = x3 * y4 - y3 * x4;
  var x = (b1 * a21 - a11 * b2) / det;
  if (x < min(x1, x2) || max(x1, x2) < x ||
      x < min(x3, x4) || max(x3, x4) < x)
  {
    return null;
  }
  var y = (b1 * a22 - a12 * b2) / det;
  return [x, y];
}

function comparePoints(p1, p2) {
  var cmp = p1[0] - p2[0];
  if (cmp !== 0) {
    return cmp;
  }
  return p1[1] - p2[1];
}

function findIntersections(ss, callback) {
  function compareSegments(s1, s2) {
    var org1 = s1.org;
    var dest1 = s1.dest;
    var org2 = s2.org;
    var dest2 = s2.dest;

    if (comparePoints(org1, org2) === 0 && comparePoints(dest1, dest2) === 0 ||
        comparePoints(org1, dest1) === 0 && comparePoints(org2, dest2) === 0)
    {
      return 0;
    }

    var x = sweep[0];
    var y = sweep[1];
    var d1 = x - org1[0];
    var d2 = dest1[0] - x;
    var d = d1 + d2;
    if (d !== 0) {
      var y1 = org1[1];
      var y2 = dest1[1];
      if (d1 < d2) {
        y = y1 + (y2 - y1) * d1 / d;
      }
      else {
        y = y2 + (y1 - y2) * d2 / d;
      }
    }

    var cmp = orient([x, y], org2, dest2);
    if (abs(cmp) < EPSILON) {
      cmp = 0;
    }
    if (cmp !== 0 || comparePoints(org1, dest1) === 0) {
      return cmp;
    }
    cmp = orient(dest1, org2, dest2);
    if (abs(cmp) < EPSILON) {
      cmp = 0;
    }
    if (cmp !== 0) {
      return cmp;
    }
    cmp = comparePoints(org1, org2);
    if (cmp !== 0) {
      return cmp;
    }
    cmp = comparePoints(dest1, dest2);
    if (cmp !== 0) {
      return cmp;
    }
    return s1.index - s2.index;
  }

  function testSegments(s1, s2) {
    var p = intersect(s1.org, s1.dest, s2.org, s2.dest);
    if (p !== null && comparePoints(sweep, p) < 0 && xs.find(p) === null) {
      xs.insert(p, []);
    }
  }

  var xs = new RBTree(comparePoints);
  for (var index = 0; index < ss.length; index += 1) {
    var s = ss[index];
    var org = s[0];
    var dest = s[1];
    var cmp = comparePoints(org, dest);
    if (cmp > 0) {
      var p = org;
      org = dest;
      dest = p;
    }
    var node = xs.find(org);
    if (node === null) {
      node = xs.insert(org, []);
    }
    var ls = node.value;
    ls.push({
      org: org,
      dest: dest,
      s: s,
      index: index,
      node: null,
    });
    if (xs.find(dest) === null) {
      xs.insert(dest, []);
    }
  }

  var ys = new RBTree(compareSegments);

  var sweep = null;
  var min = xs.min;
  while (min !== null) {
    sweep = min.key;
    var ls = min.value;
    xs.remove(min);

    var cs = [];
    var rs = [];
    var node = ys.find({ org: sweep, dest: sweep });
    if (node !== null) {
      var first = node;
      var pred = first.pred;
      while (pred !== null) {
        var s = pred.value;
        if (abs(orient(sweep, s.org, s.dest)) >= EPSILON) {
          break;
        }
        first = pred;
        pred = first.pred;
      }
      var last = node;
      var succ = last.succ;
      while (succ !== null) {
        var s = succ.value;
        if (abs(orient(sweep, s.org, s.dest)) >= EPSILON) {
          break;
        }
        last = succ;
        succ = last.succ;
      }
      last = succ;
      while (first !== last) {
        var s = first.value;
        if (comparePoints(s.dest, sweep) === 0) {
          rs.push(s);
        }
        else {
          cs.push(s);
        }
        first = first.succ;
      }
    }

    if (ls.length + cs.length + rs.length > 0) {
      var lss = [];
      for (var index = 0; index < ls.length; index += 1) {
        var l = ls[index];
        lss.push(l.s);
      }
      var css = [];
      for (var index = 0; index < cs.length; index += 1) {
        var c = cs[index];
        css.push(c.s);
      }
      var rss = [];
      for (var index = 0; index < rs.length; index += 1) {
        var r = rs[index];
        rss.push(r.s);
      }
      callback(sweep, lss, css, rss);
    }

    for (var index = 0; index < cs.length; index += 1) {
      var c = cs[index];
      ys.remove(c.node);
    }
    for (var index = 0; index < rs.length; index += 1) {
      var r = rs[index];
      ys.remove(r.node);
    }

    for (var index = 0; index < ls.length; index += 1) {
      var l = ls[index];
      l.node = ys.insert(l, l);
    }
    for (var index = 0; index < cs.length; index += 1) {
      var c = cs[index];
      c.node = ys.insert(c, c);
    }

    if (ls.length + cs.length === 0) {
      var s = { org: sweep, dest: sweep };
      var lower = ys.lower(s);
      var upper = ys.upper(s);
      if (lower !== null && upper !== null) {
        var spred = lower.value;
        var ssucc = upper.value;
        testSegments(spred, ssucc);
      }
    }
    else {
      ls.sort(compareSegments);
      cs.reverse();

      var sfirst = null;
      if (ls.length === 0) {
        sfirst = cs[0];
      }
      else {
        sfirst = ls[0];
        if (cs.length > 0) {
          var c = cs[0];
          if (compareSegments(c, sfirst) < 0) {
            sfirst = c;
          }
        }
      }

      var slast = null;
      if (ls.length === 0) {
        slast = cs[cs.length - 1];
      }
      else {
        slast = ls[ls.length - 1];
        if (cs.length > 0) {
          var c = cs[cs.length - 1];
          if (compareSegments(slast, c) < 0) {
            slast = c;
          }
        }
      }

      var pred = sfirst.node.pred;
      if (pred !== null) {
        var spred = pred.value;
        testSegments(spred, sfirst);
      }

      var succ = slast.node.succ;
      if (succ !== null) {
        var ssucc = succ.value;
        testSegments(slast, ssucc);
      }
    }

    min = xs.min;
  }
}

exports.findIntersections = findIntersections;
