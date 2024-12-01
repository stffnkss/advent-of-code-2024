import fs from "fs";

const data = fs.readFileSync("distance-data.txt", "utf8");
const lines = data.split("\n");

const left = [];
const right = [];

lines.map((line) => {
  const values = line.split("  ");
  left.push(parseInt(values[0]));
  right.push(parseInt(values[1]));
});

const leftSorted = left.sort();
const rightSorted = right.sort();

const getDistance = (a, b) => {
  const valueA = parseInt(a);
  const valueB = parseInt(b);
  if (valueA === valueB) {
    return 0;
  }
  return valueA > valueB ? valueA - valueB : valueB - valueA;
};

const totalDistance = leftSorted
  .map((left, index) => getDistance(left, rightSorted[index]))
  .reduce((acc, curr) => acc + curr, 0);

const getSimilarityScore = (arr, value) => {
  let count = 0;
  arr.forEach((arrValue) => (arrValue === value ? (count += 1) : 0));
  return count * value;
};

const getTotalSimilarityScore = (arr1, arr2) =>
  arr1
    .map((value) => getSimilarityScore(arr2, value))
    .reduce((acc, curr) => acc + curr, 0);

console.log("totalDistance", totalDistance);
console.log(
  "similarityScore",
  getTotalSimilarityScore(leftSorted, rightSorted)
);
