// @ts-check
import test from "node:test";
import { strict as assert } from "node:assert";
import { calculate } from "./index.js";

const data = `47|53
97|13
97|61
97|47
75|29
61|13
75|53
29|13
97|29
53|29
61|53
97|53
61|29
47|13
75|47
97|75
47|61
75|61
47|29
75|13
53|13

75,47,61,53,29
97,61,53,29,13
75,29,13
75,97,47,61,53
61,13,29
97,13,75,29,47`;

test("returns 143 for valid updates", () => {
  assert.equal(calculate(data).validCount, 143);
});

test("returns 123 for newly sorted invalid updates", () => {
  assert.equal(calculate(data).sortedPagesCount, 123);
});
