import fs from "fs";

const data = fs.readFileSync("data.txt", "utf8");
const lines = data.split("\n");
const text = lines.join();

export const getMultiplePairs = (text) => {
  const regex = /mul\((\d{1,3},\d{1,3})\)/g;
  const matches = text.match(regex);
  return matches.map((match) =>
    match
      .replace("mul(", "")
      .replace(")", "")
      .split(",")
      .map((value) => parseInt(value))
  );
};

export const getSumOfMultiples = (text) => {
  const pairs = getMultiplePairs(text);
  return pairs.reduce((acc, [a, b]) => acc + a * b, 0);
};

export const getValidMultiples = (text) => {
  const regex = /don't\(\).*?do\(\)/g
  const validText = text.replaceAll(regex, '')
  return getSumOfMultiples(validText)
}

console.log({ getSumOfMultiples: getSumOfMultiples(text) });
console.log({ getValidMultiples: getValidMultiples(text) });
