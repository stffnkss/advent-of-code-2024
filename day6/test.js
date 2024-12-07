// @ts-check
import test from "node:test";
import { strict as assert } from "node:assert";
import { getDistinctPositions, getStuckPossibilities } from "./index.js";

const data = `....#.....
.........#
..........
..#.......
.......#..
..........
.#..^.....
........#.
#.........
......#...`

test("returns 41 distinct positions", () => {
  assert.equal(getDistinctPositions(data)?.length, 41);
});

test("returns 6 possibilites for adding obstructions to get the guard stuck in a loop", () => {
  assert.equal(getStuckPossibilities(data).length, 6);
});
