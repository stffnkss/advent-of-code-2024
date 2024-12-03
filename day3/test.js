import test from "node:test";
import { strict as assert } from "node:assert";
import { getMultiplePairs, getSumOfMultiples, getValidMultiples } from "./index.js";

const data =
  "xmul(2,4)%&mul[3,7]!@^do_not_mul(5,5)+mul(32,64]then(mul(11,8)mul(8,5))";

const dataDont =
  "xmul(2,4)&mul[3,7]!^don't()_mul(5,5)+mul(32,64](mul(11,8)undo()?mul(8,5))";

test("returns the expected multiple pairs", () => {
  assert.deepEqual(getMultiplePairs(data), [
    [2, 4],
    [5, 5],
    [11, 8],
    [8, 5],
  ]);
});

test("returns 161 for the given multiple pairs", () => {
  assert.equal(getSumOfMultiples(data), 161);
});

test("returns 48 for don't and do instructions", () => {
  assert.equal(getValidMultiples(dataDont), 48);
});
