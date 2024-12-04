// @ts-check
/**
 * @template T
 * @param {() => T} fn 
 * @param {string} name
 * @returns {T}
 */
export const logPerformance = (fn, name) => {
  const start = performance.now();
  const result = fn();
  const end = performance.now();
  console.log(`${name} time`, end - start);
  return result;
};

/**
 * @param {string} word 
 */
export const reverseWord = (word) => [...word].reverse().join("");