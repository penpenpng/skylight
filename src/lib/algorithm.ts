import { ElementType } from "./well-typed";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const smartMerge = <T extends ArrayLike<any>>(
  before: Readonly<T>,
  after: Readonly<T>,
  equal: (a: ElementType<T>, b: ElementType<T>) => boolean,
  merge: (beforeEl: ElementType<T>, afterEl: ElementType<T>) => ElementType<T>
): Array<ElementType<T>> => {
  if (before.length <= 0) {
    return Array.from(after);
  }
  if (after.length <= 0) {
    return [];
  }

  const table = solveShortestEditScriptProblem(before, after, equal);

  const height = before.length + 1;
  const width = after.length + 1;
  let x = width - 1;
  let y = height - 1;
  const result: Array<ElementType<T>> = [];

  while (!(x === 0 && y === 0)) {
    const hasDiagonal = x > 0 && y > 0 && equal(before[y - 1], after[x - 1]);

    if (hasDiagonal && table[y][x] === table[y - 1][x - 1]) {
      result.unshift(merge(before[y - 1], after[x - 1]));
      x--;
      y--;
    } else if (table[y][x] > table[y][x - 1]) {
      result.unshift(after[x - 1]);
      x--;
    } else {
      y--;
    }
  }

  return result;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const solveShortestEditScriptProblem = <T extends ArrayLike<any>>(
  before: Readonly<T>,
  after: Readonly<T>,
  equal: (a: ElementType<T>, b: ElementType<T>) => boolean
) => {
  const height = before.length + 1;
  const width = after.length + 1;
  const table = initializeDpTable(height, width);

  for (let y = 1; y < height; y++) {
    for (let x = 1; x < width; x++) {
      const viaGrid = Math.min(table[y - 1][x], table[y][x - 1]) + 1;
      const hasDiagonal = equal(before[y - 1], after[x - 1]);

      if (hasDiagonal) {
        const viaDiagonal = table[y - 1][x - 1];
        table[y][x] = Math.min(viaGrid, viaDiagonal);
      } else {
        table[y][x] = viaGrid;
      }
    }
  }

  return table;
};

const initializeDpTable = (height: number, width: number): DpTable => {
  const table = Array.from({ length: height }, () =>
    Array.from({ length: width }, () => 0)
  );
  for (let x = 0; x < width; x++) {
    table[0][x] = x;
  }
  for (let y = 0; y < height; y++) {
    table[y][0] = y;
  }
  return table;
};

type DpTable = number[][];

export const debounce = (callback: () => unknown, interval: number) => {
  let timer = -1;
  return () => {
    clearTimeout(timer);
    timer = setTimeout(callback, interval);
  };
};
