"use strict";

var assert = require("assert");
var sweep = require("../index");

describe("findIntersections", function () {
  it("two segments starting at the same point", function () {
    var ss = [
      [[0, 1], [2, 0]],
      [[0, 1], [2, 2]]
    ];
    var actual = [];
    sweep.findIntersections(ss, function (p, ls, cs, rs) {
      actual.push([p, ls, cs, rs]);
    });
    assert.deepStrictEqual(actual, [
      [[0, 1], [ss[0], ss[1]], [], []],
      [[2, 0], [], [], [ss[0]]],
      [[2, 2], [], [], [ss[1]]]
    ]);
  });
  it("three segments intersecting at the same point", function () {
    var ss = [
      [[0, 0], [2, 2]],
      [[0, 1], [2, 1]],
      [[0, 2], [2, 0]]
    ];
    var actual = [];
    sweep.findIntersections(ss, function (p, ls, cs, rs) {
      actual.push([p, ls, cs, rs]);
    });
    assert.deepStrictEqual(actual, [
      [[0, 0], [ss[0]], [], []],
      [[0, 1], [ss[1]], [], []],
      [[0, 2], [ss[2]], [], []],
      [[1, 1], [], [ss[0], ss[1], ss[2]], []],
      [[2, 0], [], [], [ss[2]]],
      [[2, 1], [], [], [ss[1]]],
      [[2, 2], [], [], [ss[0]]]
    ]);
  });
  it("two segments ending at the same point", function () {
    var ss = [
      [[0, 0], [2, 1]],
      [[0, 2], [2, 1]]
    ];
    var actual = [];
    sweep.findIntersections(ss, function (p, ls, cs, rs) {
      actual.push([p, ls, cs, rs]);
    });
    assert.deepStrictEqual(actual, [
      [[0, 0], [ss[0]], [], []],
      [[0, 2], [ss[1]], [], []],
      [[2, 1], [], [], [ss[0], ss[1]]]
    ]);
  });
  it("two segments overlapping horizontally", function () {
    var ss = [
      [[0, 0], [2, 0]],
      [[1, 0], [3, 0]],
    ];
    var actual = [];
    sweep.findIntersections(ss, function (p, ls, cs, rs) {
      actual.push([p, ls, cs, rs]);
    });
    assert.deepStrictEqual(actual, [
      [[0, 0], [ss[0]], [], []],
      [[1, 0], [ss[1]], [ss[0]], []],
      [[2, 0], [], [ss[1]], [ss[0]]],
      [[3, 0], [], [], [ss[1]]],
    ]);
  });
  it("two segments overlapping vertically", function () {
    var ss = [
      [[0, 0], [0, 2]],
      [[0, 1], [0, 3]],
    ];
    var actual = [];
    sweep.findIntersections(ss, function (p, ls, cs, rs) {
      actual.push([p, ls, cs, rs]);
    });
    assert.deepStrictEqual(actual, [
      [[0, 0], [ss[0]], [], []],
      [[0, 1], [ss[1]], [ss[0]], []],
      [[0, 2], [], [ss[1]], [ss[0]]],
      [[0, 3], [], [], [ss[1]]],
    ]);
  });
  it("two segments overlapping diagonally", function () {
    var ss = [
      [[0, 0], [2, 2]],
      [[1, 1], [3, 3]],
    ];
    var actual = [];
    sweep.findIntersections(ss, function (p, ls, cs, rs) {
      actual.push([p, ls, cs, rs]);
    });
    assert.deepStrictEqual(actual, [
      [[0, 0], [ss[0]], [], []],
      [[1, 1], [ss[1]], [ss[0]], []],
      [[2, 2], [], [ss[1]], [ss[0]]],
      [[3, 3], [], [], [ss[1]]],
    ]);
  });
  it("two intersecting pairs of overlapping segments", function () {
    var ss = [
      [[0, 0], [4, 4]],
      [[2, 2], [6, 6]],
      [[0, 6], [4, 2]],
      [[2, 4], [6, 0]]
    ];
    var actual = [];
    sweep.findIntersections(ss, function (p, ls, cs, rs) {
      actual.push([p, ls, cs, rs]);
    });
    assert.deepStrictEqual(actual, [
      [[0, 0], [ss[0]], [], []],
      [[0, 6], [ss[2]], [], []],
      [[2, 2], [ss[1]], [ss[0]], []],
      [[2, 4], [ss[3]], [ss[2]], []],
      [[3, 3], [], [ss[0], ss[1], ss[2], ss[3]], []],
      [[4, 2], [], [ss[3]], [ss[2]]],
      [[4, 4], [], [ss[1]], [ss[0]]],
      [[6, 0], [], [], [ss[3]]],
      [[6, 6], [], [], [ss[1]]]
    ]);
  });
});
