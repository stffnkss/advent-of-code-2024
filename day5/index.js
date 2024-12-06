// @ts-check
import fs from "fs";

const data = fs.readFileSync("data.txt", "utf8");

/**
 * @param {string} data
 */
export const calculate = (data) => {
  const { rules, updates } = readData(data);
  const pageMap = makePageMap(rules);
  const checkedUpdates = checkUpdates(pageMap, updates);
  return {
    validCount: getValidCount(checkedUpdates),
    sortedPagesCount: getSortedPagesCount(pageMap, checkedUpdates),
  };
};

/**
 * @param {string} data
 */
const readData = (data) => {
  const lines = data.split("\n");
  const updatesBeginning = lines.findIndex((line) => line === "");
  const rules = lines.slice(0, updatesBeginning);
  const updates = lines.slice(updatesBeginning + 1, lines.length);
  return {
    rules,
    updates,
  };
};

/**
 * @param {string[]} rules
 */
const makePageMap = (rules) => {
  /** @type Record<string, string[]> */
  const pageMap = {};
  rules.forEach((rule) => {
    const [first, after] = rule.split("|");
    if (!pageMap[first]) {
      pageMap[first] = [];
    }
    if (!pageMap[after]) {
      pageMap[after] = [];
    }
    pageMap[first].push(after);
  });
  return pageMap;
};

/**
 * @param {Record<string, string[]>} pageMap
 * @param {string[]} updates
 */
const checkUpdates = (pageMap, updates) =>
  updates.map((pageNumbers) => {
    const pages = pageNumbers.split(",");
    return {
      valid: checkIsValidUpdate(pageMap, pages),
      pages,
    };
  });

/**
 * @param {Record<string, string[]>} pageMap
 * @param {string[]} pages
 * @returns
 */
const checkIsValidUpdate = (pageMap, pages) => {
  let valid = true;
  for (let i = 0; i < pages.length - 1; i++) {
    const currentPage = pages[i];
    const nextPage = pages[i + 1];
    if (!pageMap[currentPage].includes(nextPage)) {
      valid = false;
      break;
    }
  }
  return valid;
};

/**
 * @param {Record<string, string[]>} pageMap
 * @param {{ valid: boolean; pages: string[]; }} update
 * @returns
 */
const correctlySort = (pageMap, { pages }) => {
  const newSorted = pages;
  let i = 0;
  while (i < pages.length - 1) {
    const currentPage = pages[i];
    const nextPage = pages[i + 1];
    if (pageMap[currentPage].includes(nextPage)) {
      i++;
    } else {
      newSorted.splice(i, 1, nextPage);
      newSorted.splice(i + 1, 1, currentPage);
      i = 0;
    }
  }
  return newSorted;
};

/**
 * @param {string[]} pages
 * @returns
 */
const getMiddlePage = (pages) => {
  const middleIndex = Math.floor(pages.length / 2);
  return pages[middleIndex];
};

/**
 * 
 * @param {{ valid: boolean; pages: string[]; }[]} checkedUpdates 
 * @returns 
 */
const getValidCount = (checkedUpdates) =>
  checkedUpdates
    .filter((update) => update.valid)
    .map(({ pages }) => getMiddlePage(pages))
    .reduce((acc, cur) => acc + parseInt(cur), 0);

/**
 * @param {Record<string, string[]>} pageMap
 * @param {{ valid: boolean; pages: string[]; }[]} checkedUpdates 
 * @returns 
 */
const getSortedPagesCount = (pageMap, checkedUpdates) =>
  checkedUpdates
      .filter((update) => !update.valid)
      .map((update) => correctlySort(pageMap, update))
      .map((pages) => getMiddlePage(pages))
      .reduce((acc, cur) => acc + parseInt(cur), 0)

const start = performance.now();
console.log({ calculate: calculate(data) });
console.log({ time: performance.now() - start });
