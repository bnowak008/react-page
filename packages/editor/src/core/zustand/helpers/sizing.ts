import type { Cell } from '../../types/node';

export const computeInlines = (cells: Array<Cell> = []): Array<Cell> => {
  if (cells.length === 0) {
    return cells;
  }

  // check if we have inlines
  const numberOfInlines = cells.filter((c) => c.inline).length;
  if (numberOfInlines === 0) {
    return cells;
  }

  // there are inlines, make sure the first one is not inline
  const firstCell = cells[0];
  if (firstCell.inline) {
    firstCell.inline = undefined;
  }

  // make sure the last one is not inline
  const lastCell = cells[cells.length - 1];
  if (lastCell.inline) {
    lastCell.inline = undefined;
  }

  // we need to make sure that no two inlines are next to each other
  for (let i = 0; i < cells.length; i++) {
    const cell = cells[i];
    if (cell.inline) {
      // check if the next cell is also inline
      const nextCell = cells[i + 1];
      if (nextCell && nextCell.inline) {
        nextCell.inline = undefined;
      }
    }
  }

  return cells;
};

export const computeSizes = (cells: Array<Cell> = []): Array<Cell> => {
  if (cells.length === 0) {
    return cells;
  }

  // check if we have sizes
  const numberOfSizes = cells.filter((c) => c.size).length;
  if (numberOfSizes === 0) {
    // set default sizes
    return cells.map((c) => ({
      ...c,
      size: 12 / cells.length,
    }));
  }

  // compute missing sizes
  const numberOfMissingSizes = cells.filter((c) => !c.size).length;
  if (numberOfMissingSizes > 0) {
    // compute the remaining size
    const remainingSize =
      12 - cells.filter((c) => c.size).reduce((acc, c) => acc + c.size!, 0);

    // check if remainingSize is > 0 and if we have cells with missing sizes
    if (remainingSize > 0 && numberOfMissingSizes > 0) {
      // set the remaining size to the cells with missing sizes
      return cells.map((c) => {
        if (!c.size) {
          return {
            ...c,
            size: remainingSize / numberOfMissingSizes,
          };
        }
        return c;
      });
    }
  }

  // check if the sum of sizes is 12
  const sumOfSizes = cells.reduce((acc, c) => acc + (c.size || 0), 0);
  if (sumOfSizes !== 12) {
    // scale the sizes to 12
    return cells.map((c) => ({
      ...c,
      size: ((c.size || 0) * 12) / sumOfSizes,
    }));
  }

  return cells;
}; 