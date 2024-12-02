import fs from "fs";

const data = fs.readFileSync("data.txt", "utf8");
const lines = data.split("\n");
const reports = lines.map((line) =>
  line.split(" ").map((level) => parseInt(level))
);

const getSafeReportsCount = (reports) =>
  reports
    .map((report) => {
      const isIncreasing = report[0] - report[report.length - 1] < 0;

      for (let i = 0; i < report.length; i++) {
        if (report.length > i + 1) {
          const currentLevel = report[i];
          const nextLevel = report[i + 1];
          const difference = isIncreasing
            ? nextLevel - currentLevel
            : currentLevel - nextLevel;
          if (difference <= 0 || difference > 3) {
            return false;
          }
        }
      }
      return true;
    })
    .filter(Boolean).length;

const safeReportsWithDamperCount = reports
  .map((report, index) => {
    const arr = [...report];
    let safeCount = 0;
    for (let i = 0; i < arr.length; i++) {
      const newArr = arr.toSpliced(i, 1);
      const isSafe = getSafeReportsCount([newArr]) > 0;
      if (isSafe) {
        safeCount += 1;
      }
    }
    return safeCount > 0;
  })
  .filter(Boolean).length;

console.log({ safeReportsWithDamperCount });
console.log({ safeReportsCount: getSafeReportsCount(reports) });
