import { useMemo } from 'react';
import type { HoverInsertActions } from '../../types/hover';
import { useAllCellPluginsForNode } from './node';
import { useLang } from './options';
import { useUpdateValue, useSetHover } from '../../zustand/hooks';
import type { Cell, CellDrag, Node, Value, Row } from '../../types/node';
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
          dragMode: true
        });
      },
      clear: () => setHover(null),
      cancelCellDrag: () => setHover(null),

      above: (drag, hover, options) => {
        setHover({
          nodeId: hover.id,
          position: 'above',
          level: options?.level,
          dragMode: false,
          ancestorIds: hover.ancestorIds
        });
      },
      below: (drag, hover, options) => {
        setHover({
          nodeId: hover.id,
          position: 'below',
          level: options?.level,
          dragMode: false,
          ancestorIds: hover.ancestorIds
        });
      },
      leftOf: (drag, hover, options) => {
        setHover({
          nodeId: hover.id,
          position: 'left-of',
          level: options?.level,
          dragMode: false,
          ancestorIds: hover.ancestorIds
        });
      },
      rightOf: (drag, hover, options) => {
        setHover({
          nodeId: hover.id,
          position: 'right-of',
          level: options?.level,
          dragMode: false,
          ancestorIds: hover.ancestorIds
        });
      },
      inlineLeft: (drag, hover) => {
        setHover({
          nodeId: hover.id,
          position: 'inline-left',
          dragMode: false,
          ancestorIds: hover.ancestorIds
        });
      },
      inlineRight: (drag, hover) => {
        setHover({
          nodeId: hover.id,
          position: 'inline-right',
          dragMode: false,
          ancestorIds: hover.ancestorIds
        });
      },
    }),
    [setHover]
  );
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
          if (!value || !drag.cell) return value;
          
          // Find the row containing the target cell
          const targetRow = findRowContainingCell(value, hover.id);
          if (!targetRow) return value;
          
          // Clone the dragged cell with new IDs
          const newCell = cloneWithNewIds(drag.cell as Cell);
          
          // Insert the new cell above the target cell
          const cellIndex = targetRow.cells.findIndex(cell => cell.id === hover.id);
          if (cellIndex >= 0) {
            targetRow.cells.splice(cellIndex, 0, newCell);
          }
          
          return value;
        });
        setHover(null);
      },
      below: (drag, hover, level) => {
        updateValue((value: Value | null) => {
          if (!value || !drag.cell) return value;
          
          // Find the row containing the target cell
          const targetRow = findRowContainingCell(value, hover.id);
          if (!targetRow) return value;
          
          // Clone the dragged cell with new IDs
          const newCell = cloneWithNewIds(drag.cell as Cell);
          
          // Insert the new cell below the target cell
          const cellIndex = targetRow.cells.findIndex(cell => cell.id === hover.id);
          if (cellIndex >= 0) {
            targetRow.cells.splice(cellIndex + 1, 0, newCell);
          }
          
          return value;
        });
        setHover(null);
      },
      leftOf: (drag, hover, level) => {
        updateValue((value: Value | null) => {
          if (!value || !drag.cell) return value;
          
          // Find the row containing the target cell
          const targetRow = findRowContainingCell(value, hover.id);
          if (!targetRow) return value;
          
          // Clone the dragged cell with new IDs
          const newCell = cloneWithNewIds(drag.cell as Cell);
          
          // Insert the new cell to the left of the target cell
          const cellIndex = targetRow.cells.findIndex(cell => cell.id === hover.id);
          if (cellIndex >= 0) {
            targetRow.cells.splice(cellIndex, 0, newCell);
          }
          
          return value;
        });
        setHover(null);
      },
      rightOf: (drag, hover, level) => {
        updateValue((value: Value | null) => {
          if (!value || !drag.cell) return value;
          
          // Find the row containing the target cell
          const targetRow = findRowContainingCell(value, hover.id);
          if (!targetRow) return value;
          
          // Clone the dragged cell with new IDs
          const newCell = cloneWithNewIds(drag.cell as Cell);
          
          // Insert the new cell to the right of the target cell
          const cellIndex = targetRow.cells.findIndex(cell => cell.id === hover.id);
          if (cellIndex >= 0) {
            targetRow.cells.splice(cellIndex + 1, 0, newCell);
          }
          
          return value;
        });
        setHover(null);
      },
      inlineLeft: (drag, hover) => {
        updateValue((value: Value | null) => {
          if (!value || !drag.cell) return value;
          
          // Find the row containing the target cell
          const targetRow = findRowContainingCell(value, hover.id);
          if (!targetRow) return value;
          
          // Clone the dragged cell with new IDs
          const newCell = cloneWithNewIds(drag.cell as Cell);
          newCell.inline = 'left';
          
          // Insert the new cell to the left of the target cell
          const cellIndex = targetRow.cells.findIndex(cell => cell.id === hover.id);
          if (cellIndex >= 0) {
            targetRow.cells.splice(cellIndex, 0, newCell);
          }
          
          return value;
        });
        setHover(null);
      },
      inlineRight: (drag, hover) => {
        updateValue((value: Value | null) => {
          if (!value || !drag.cell) return value;
          
          // Find the row containing the target cell
          const targetRow = findRowContainingCell(value, hover.id);
          if (!targetRow) return value;
          
          // Clone the dragged cell with new IDs
          const newCell = cloneWithNewIds(drag.cell as Cell);
          newCell.inline = 'right';
          
          // Insert the new cell to the right of the target cell
          const cellIndex = targetRow.cells.findIndex(cell => cell.id === hover.id);
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
          dragMode: true
        });
      },
      clear: () => setHover(null),
      cancelCellDrag: () => setHover(null),
    }),
    [updateValue, setHover, lang, cellPlugins]
  );
};

// Helper function to find a row containing a specific cell
const findRowContainingCell = (value: Value, cellId: string): Row | undefined => {
  for (const row of value.rows) {
    if (row.cells.some(cell => cell.id === cellId)) {
      return row;
    }
    
    // Check nested rows
    for (const cell of row.cells) {
      if (cell.rows) {
        for (const nestedRow of cell.rows) {
          if (nestedRow.cells.some(nestedCell => nestedCell.id === cellId)) {
            return nestedRow;
          }
        }
      }
    }
  }
  
  return undefined;
};
