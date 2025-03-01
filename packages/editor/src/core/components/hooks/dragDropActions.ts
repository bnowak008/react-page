import { useMemo } from 'react';
import type { HoverInsertActions } from '../../types/hover';
import { PositionEnum } from '../../const';
import { useAllCellPluginsForNode } from './node';
import { useLang } from './options';
import { useUpdateValue, useSetHover } from '../../zustand/hooks';
import type { Cell, CellDrag, Node, Value, Row, PartialCell } from '../../types/node';
import { cloneWithNewIds } from '../../utils/cloneWithNewIds';

/**
 * @returns object of actions for hovering
 */
export const useHoverActions = () => {
  const setHover = useSetHover();

  return useMemo(
    (): HoverInsertActions => ({
      dragCell: (id: string) => {
        setHover({
          nodeId: id,
          position: null,
          dragMode: true,
        });
      },
      clear: () => setHover(null),
      cancelCellDrag: () => setHover(null),

      above: (drag, hover, options) => {
        setHover({
          nodeId: hover.id ?? null,
          position: PositionEnum.ABOVE,
          level: options?.level,
          dragMode: false,
          ancestorIds: hover.ancestorIds,
        });
      },
      below: (drag, hover, options) => {
        setHover({
          nodeId: hover.id ?? null,
          position: PositionEnum.BELOW,
          level: options?.level,
          dragMode: false,
          ancestorIds: hover.ancestorIds,
        });
      },
      leftOf: (drag, hover, options) => {
        setHover({
          nodeId: hover.id ?? null,
          position: PositionEnum.LEFT_OF,
          level: options?.level,
          dragMode: false,
          ancestorIds: hover.ancestorIds,
        });
      },
      rightOf: (drag, hover, options) => {
        setHover({
          nodeId: hover.id ?? null,
          position: PositionEnum.RIGHT_OF,
          level: options?.level,
          dragMode: false,
          ancestorIds: hover.ancestorIds,
        });
      },
      inlineLeft: (drag, hover) => {
        setHover({
          nodeId: hover.id ?? null,
          position: PositionEnum.INLINE_LEFT,
          dragMode: false,
          ancestorIds: hover.ancestorIds,
        });
      },
      inlineRight: (drag, hover) => {
        setHover({
          nodeId: hover.id ?? null,
          position: PositionEnum.INLINE_RIGHT,
          dragMode: false,
          ancestorIds: hover.ancestorIds,
        });
      },
    }),
    [setHover]
  );
};

// Helper function to find a row containing a specific cell
const findRowContainingCell = (value: Value, cellId?: string): Row | null => {
  if (!cellId) return null;
  
  // Search through all rows in the value
  for (const row of value.rows) {
    // Check if the cell is in this row
    if (row.cells.some((cell) => cell.id === cellId)) {
      return row;
    }
    
    // Recursively search through nested rows
    for (const cell of row.cells) {
      if (cell.rows) {
        for (const nestedRow of cell.rows) {
          const result = findRowContainingCell(
            { ...value, rows: [nestedRow] },
            cellId
          );
          if (result) return result;
        }
      }
    }
  }
  
  return null;
};

/**
 * @param nodeId the parent reference node id
 * @returns object of actions for dropping a cell
 */
export const useDropActions = (parentNodeId?: string | null) => {
  const updateValue = useUpdateValue();
  const setHover = useSetHover();

  const lang = useLang();
  const cellPlugins = useAllCellPluginsForNode(parentNodeId);

  return useMemo(
    (): HoverInsertActions => ({
      above: (drag, hover, level) => {
        updateValue((value: Value | null) => {
          if (!value || !drag) return value;

          // Find the row containing the target cell
          const targetRow = findRowContainingCell(value, hover.id);
          if (!targetRow) return value;

          // Clone the dragged cell with new IDs
          const newCell = cloneWithNewIds(drag as unknown as Cell);

          // Insert the new cell above the target cell
          const cellIndex = targetRow.cells.findIndex(
            (cell) => cell.id === hover.id
          );
          if (cellIndex >= 0) {
            targetRow.cells.splice(cellIndex, 0, newCell);
          }

          return value;
        });
        setHover(null);
      },
      below: (drag, hover, level) => {
        updateValue((value: Value | null) => {
          if (!value || !drag) return value;

          // Find the row containing the target cell
          const targetRow = findRowContainingCell(value, hover.id);
          if (!targetRow) return value;

          // Clone the dragged cell with new IDs
          const newCell = cloneWithNewIds(drag as unknown as Cell);

          // Insert the new cell below the target cell
          const cellIndex = targetRow.cells.findIndex(
            (cell) => cell.id === hover.id
          );
          if (cellIndex >= 0) {
            targetRow.cells.splice(cellIndex + 1, 0, newCell);
          }

          return value;
        });
        setHover(null);
      },
      leftOf: (drag, hover, level) => {
        updateValue((value: Value | null) => {
          if (!value || !drag) return value;

          // Find the row containing the target cell
          const targetRow = findRowContainingCell(value, hover.id);
          if (!targetRow) return value;

          // Clone the dragged cell with new IDs
          const newCell = cloneWithNewIds(drag as unknown as Cell);

          // Insert the new cell to the left of the target cell
          const cellIndex = targetRow.cells.findIndex(
            (cell) => cell.id === hover.id
          );
          if (cellIndex >= 0) {
            targetRow.cells.splice(cellIndex, 0, newCell);
          }

          return value;
        });
        setHover(null);
      },
      rightOf: (drag, hover, level) => {
        updateValue((value: Value | null) => {
          if (!value || !drag) return value;

          // Find the row containing the target cell
          const targetRow = findRowContainingCell(value, hover.id);
          if (!targetRow) return value;

          // Clone the dragged cell with new IDs
          const newCell = cloneWithNewIds(drag as unknown as Cell);

          // Insert the new cell to the right of the target cell
          const cellIndex = targetRow.cells.findIndex(
            (cell) => cell.id === hover.id
          );
          if (cellIndex >= 0) {
            targetRow.cells.splice(cellIndex + 1, 0, newCell);
          }

          return value;
        });
        setHover(null);
      },
      inlineLeft: (drag, hover) => {
        updateValue((value: Value | null) => {
          if (!value || !drag) return value;

          // Find the row containing the target cell
          const targetRow = findRowContainingCell(value, hover.id);
          if (!targetRow) return value;

          // Clone the dragged cell with new IDs
          const newCell = cloneWithNewIds(drag as unknown as Cell);
          if ('inline' in newCell) {
            newCell.inline = 'left';
          }

          // Insert the new cell to the left of the target cell
          const cellIndex = targetRow.cells.findIndex(
            (cell) => cell.id === hover.id
          );
          if (cellIndex >= 0) {
            targetRow.cells.splice(cellIndex, 0, newCell);
          }

          return value;
        });
        setHover(null);
      },
      inlineRight: (drag, hover) => {
        updateValue((value: Value | null) => {
          if (!value || !drag) return value;

          // Find the row containing the target cell
          const targetRow = findRowContainingCell(value, hover.id);
          if (!targetRow) return value;

          // Clone the dragged cell with new IDs
          const newCell = cloneWithNewIds(drag as unknown as Cell);
          if ('inline' in newCell) {
            newCell.inline = 'right';
          }

          // Insert the new cell to the right of the target cell
          const cellIndex = targetRow.cells.findIndex(
            (cell) => cell.id === hover.id
          );
          if (cellIndex >= 0) {
            targetRow.cells.splice(cellIndex + 1, 0, newCell);
          }

          return value;
        });
        setHover(null);
      },
      dragCell: (id: string) => {
        setHover({
          nodeId: id,
          position: null,
          dragMode: true,
        });
      },
      clear: () => setHover(null),
      cancelCellDrag: () => setHover(null),
    }),
    [updateValue, setHover, lang, cellPlugins]
  );
};
