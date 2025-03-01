import type { Row, Cell } from '../../types/node';

export const isEmpty = (item: Cell | Row): boolean => {
  if (!item) {
    return true;
  }

  if ((item as Cell).plugin) {
    return false;
  }

  if ((item as Row).cells) {
    return (item as Row).cells?.length === 0;
  }

  if ((item as Cell).rows) {
    return (item as Cell).rows?.length === 0;
  }

  return true;
}; 