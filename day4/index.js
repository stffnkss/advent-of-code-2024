// @ts-check
import fs from 'fs';
import { reverseWord } from '../util.js';

const data = fs.readFileSync('data.txt', 'utf8');

/**
 * @param {string} data
 * @returns {DataMap}
 */
export const makeMap = (data) => {
  /** @type {DataMap} */
  const map = {};
  const lines = data.split('\n');
  lines.forEach((line, y) => {
    [...line].forEach((char, x) => {
      map[`${x}/${y}`] = char;
    });
  });
  return map;
};

/**
 * @param {DataMap} map
 * @param {number} x
 * @param {number} y
 */
export const getCharAt = (map, x, y) => map[`${x}/${y}`] || '';

/**
 * @param {DataMap} map
 * @param {number} x
 * @param {number} y
 * @param {number} nNeighbors
 */
export const getWords = (map, x, y, nNeighbors = 1) => {
  /** @type {Words} */
  const words = {
    center: getCharAt(map, x, y),
    east: '',
    west: '',
    south: '',
    north: '',
    northWest: '',
    northEast: '',
    southWest: '',
    southEast: '',
  };
  for (let i = 1; i <= nNeighbors; i++) {
    words.east += getCharAt(map, x + i, y);
    words.west += getCharAt(map, x - i, y);
    words.south += getCharAt(map, x, y + i);
    words.north += getCharAt(map, x, y - i);
    words.northWest += getCharAt(map, x - i, y - i);
    words.northEast += getCharAt(map, x + i, y - i);
    words.southWest += getCharAt(map, x - i, y + i);
    words.southEast += getCharAt(map, x + i, y + i);
  }
  return words;
};

/**
 * @param {Words} words
 * @param {string} searchText
 */
export const countOccurences = (words, searchText) => {
  let count = 0;
  const { center, ...neighbors } = words;
  Object.values(neighbors).forEach((word) => {
    if (center + word === searchText) {
      count += 1;
    }
  });
  return count;
};

/**
 * @param {DataMap} map
 * @param {number} nNeighbors
 * @param {(words: Words) => void} cb
 */
const walkMap = (map, nNeighbors, cb) =>
  Object.keys(map).forEach((key) => {
    const [x, y] = key.split('/').map((coord) => parseInt(coord));
    const words = getWords(map, x, y, nNeighbors);
    cb(words);
  });

/**
 * @param {DataMap} map
 * @param {string} word
 */
export const countWords = (map, word) => {
  let count = 0;
  const nNeighbors = word.length - 1;
  walkMap(map, nNeighbors, (words) => {
    count += countOccurences(words, word);
  });
  return count;
};

/**
 * @param {Words} words
 * @param {string} searchText
 */
export const isXShape = (words, searchText) => {
  const down = words.northWest + words.center + words.southEast;
  const up = words.southWest + words.center + words.northEast;
  const reversed = reverseWord(searchText);
  return (
    (up === searchText || up === reversed) &&
    (down === searchText || down === reversed)
  );
};

/**
 * @param {DataMap} map
 * @param {string} searchText
 */
export const countXShapes = (map, searchText) => {
  let count = 0;
  const nNeighbors = Math.floor(searchText.length / 2);
  walkMap(map, nNeighbors, (words) => {
    if (isXShape(words, searchText)) {
      count += 1;
    }
  });
  return count;
};

const map = makeMap(data);

console.log({
  wordCount: countWords(map, 'XMAS'),
  xShapeCount: countXShapes(map, 'MAS'),
});
