// @ts-check
import test from "node:test";
import { strict as assert } from "node:assert";
import {
  countWords,
  makeMap,
  countOccurences,
  getCharAt,
  getWords,
  countXShapes,
  isXShape,
} from "./index.js";

const data = `MMMSXXMASM
MSAMXMSMSA
AMXSXMAAMM
MSAMASMSMX
XMASAMXAMM
XXAMMXXAMA
SMSMSASXSS
SAXAMASAAA
MAMMMXMMMM
MXMXAXMASX`;

const map = makeMap(data);
const searchText = "XMAS";
const x = 6;
const y = 5;

test("`makeMap` returns a map with coords (x/y) as key", () => {
  assert.equal(map["2/7"], "X");
  assert.equal(map["2/8"], "M");
});

test("`countWords` returns `18` when searching for `XMAS`", () => {
  assert.equal(countWords(map, searchText), 18);
});

test("`getCharAt` returns `X` for coords [6, 5]", () => {
  assert.equal(getCharAt(map, x, y), "X");
});

test("`getWords` returns the character at given x,y (center) and the n surrounding characters", () => {
  const nNeighbors = searchText.length - 1;
  assert.deepEqual(getWords(map, x, y, nNeighbors), {
    center: "X",
    east: "AMA",
    north: "XMA",
    northEast: "AMM",
    northWest: "MAS",
    south: "SSM",
    southEast: "XAM",
    southWest: "AMM",
    west: "XMM",
  });
});

test("`countOccurrences` returns 1 for coords [6, 5] when searching for `XMAS`", () => {
  const nNeighbors = searchText.length - 1;
  const words = getWords(map, x, y, nNeighbors);
  assert.equal(countOccurences(words, searchText), 1);
});

test("`isXShape` returns true when searching for `MAS` and the given pattern", () => {
  const patterns = [
    {
      center: "A",
      east: "",
      north: "",
      northEast: "M",
      northWest: "M",
      south: "",
      southEast: "S",
      southWest: "S",
      west: "",
    },
    {
      center: "A",
      east: "",
      north: "",
      northEast: "S",
      northWest: "M",
      south: "",
      southEast: "S",
      southWest: "M",
      west: "",
    },
  ];
  patterns.forEach((pattern) => {
    assert.equal(isXShape(pattern, "MAS"), true);
  });
});

test("`isXShape` otherwise returns false when searching for `MAS` and an invalid pattern is given", () => {
  const invalidPattern = {
    center: "A",
    east: "",
    north: "",
    northEast: "S",
    northWest: "S",
    south: "",
    southEast: "M",
    southWest: "S",
    west: "",
  };
  assert.equal(isXShape(invalidPattern, "MAS"), false);
});

test("`countXShapes` returns 9 when searching for `MAS`", () => {
  assert.equal(countXShapes(map, "MAS"), 9);
});
