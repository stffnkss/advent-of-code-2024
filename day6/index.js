// @ts-check
import fs from "fs";

const data = fs.readFileSync("data.txt", "utf8");

/**
 * @param {string} data
 */
export const getDistinctPositions = (data) => {
  const map = getMap(data);
  return [...new Set(letTheGuardWalk(map)?.map(({ key }) => key))];
};

/**
 * @param {string} data
 */
const getMap = (data) => {
  /** @type Record<string, string> */
  const map = {};
  const lines = data.split("\n");
  lines.forEach((line, y) => {
    [...line].forEach((char, x) => {
      map[`${x}/${y}`] = char;
    });
  });
  return map;
};

/**
 * @param {Record<string, string>} map
 * @param {[number, number]} coords
 */
export const getMapValueAt = (map, coords) => map[coordsToKey(coords)] || "";

/**
 * @param {[number, number]} coords
 */
const coordsToKey = (coords) => `${coords[0]}/${coords[1]}`;

/**
 * @param {'up' | 'right' | 'down' | 'left'} direction
 */
const turnRight = (direction) => {
  let newDirection = direction;
  if (direction === "up") {
    newDirection = "right";
  } else if (direction === "right") {
    newDirection = "down";
  } else if (direction === "down") {
    newDirection = "left";
  } else if (direction === "left") {
    newDirection = "up";
  }
  return newDirection;
};

/**
 * @param {'up' | 'right' | 'down' | 'left'} direction
 * @param {[number, number]} position
 * @returns {[number, number]}
 */
const getNextPosition = (direction, position) => {
  if (direction === "up") {
    return [position[0], position[1] - 1];
  } else if (direction === "right") {
    return [position[0] + 1, position[1]];
  } else if (direction === "down") {
    return [position[0], position[1] + 1];
  } else {
    return [position[0] - 1, position[1]];
  }
};

/**
 * @param {Record<string, string>} map
 * @returns {{ key: string, value: string, direction: 'up' | 'right' | 'down' | 'left', stuck: boolean }[]}
 */
const letTheGuardWalk = (map) => {
  /** @type boolean */
  let walk = false;
  const obstacle = "#";
  const guardAt = Object.entries(map).find(([_, value]) => value === "^")?.[0];

  if (guardAt) {
    walk = true;
  } else {
    console.log("Oh no guard!");
    return [];
  }

  /** @type {{ key: string, value: string, direction: 'up' | 'right' | 'down' | 'left', stuck: boolean }[]} */
  const visits = [{ key: guardAt, value: "^", direction: "up", stuck: false }];
  const [x, y] = guardAt.split("/").map((coord) => parseInt(coord));

  /** @type [number, number] */
  let position = [x, y];
  /** @type {'up' | 'right' | 'down' | 'left'} direction */
  let direction = "up";
  /** @type [number, number] */
  let nextCoords;

  while (walk === true) {
    nextCoords = getNextPosition(direction, position);
    const nextValue = getMapValueAt(map, nextCoords);

    if (!nextValue) {
      walk = false;
    }

    if (nextValue === obstacle) {
      direction = turnRight(direction);
      continue;
    }

    if (nextValue) {
      const nextKey = coordsToKey(nextCoords);
      const stuck = !!visits.find(
        ({ key, direction: visitedDirection }) =>
          key === nextKey && visitedDirection === direction
      );

      visits.push({
        stuck,
        key: nextKey,
        value: nextValue,
        direction,
      });

      if (stuck) {
        walk = false;
      }
    }

    position = nextCoords;
  }

  return visits || [];
};

/**
 * @param {string} data
 */
export const getStuckPossibilities = (data) => {
  let map = getMap(data);
  let i = 0;
  const obstacle = "#";
  /** @type {{ key: string, value: string, direction: 'up' | 'right' | 'down' | 'left', stuck: boolean }[]} */
  const visited = [];
  const distinctPositions = getDistinctPositions(data);
  const guardAt = Object.entries(map).find(([_, value]) => value === "^")?.[0];

  distinctPositions?.forEach((key, index) => {
    if (key !== guardAt) {
      const currentValue = map[key];
      map[key] = obstacle;
      const visits = letTheGuardWalk(map);
      visited.push(...visits);
      map[key] = currentValue;
    }
    console.log({
      key,
      processed: `${index + 1} / ${distinctPositions.length}`,
    });
  });

  return visited.filter(({ stuck }) => stuck);
};

console.log({
  distinctPositions: getDistinctPositions(data)?.length,
  stucks: getStuckPossibilities(data).length
});
