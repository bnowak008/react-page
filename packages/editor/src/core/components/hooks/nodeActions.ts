import { useCallback } from 'react';
import { getCommonAncestorTree } from '../../utils/ancestorTree';

import type { FocusMode } from '../../types/focus';

import type { CellDrag, PartialCell, Node, Value, Row, Cell, I18nField } from '../../types/node';
import { isRow } from '../../types/node';
import { useAllCellPluginsForNode } from './node';
import { useEditorStore, useLang } from './options';
import { cloneWithNewIds } from '../../../core/utils/cloneWithNewIds';
import { useDisplayModeReferenceNodeId } from './displayMode';
import type { CellPluginOnChangeOptions } from '../../types';
import type { CellDrag as CustomCellDrag } from '../../types';
import { useDndKitDrop } from './useDndKit';

import { 
  useSelector,
  useActions,
  useSetLang as useZustandSetLang,
  useSetFocus,
  useSetHover,
  useUpdateValue
} from '../../zustand/hooks';

import { useValueOptimizer } from '../../zustand';

/**
 * @param id id of a node
 * @returns function, that sets a cell in draft mode (will be invisible in readonly / preview)
 */
export const useSetDraft = (id: string) => {
  const updateValue = useUpdateValue();
  const currentLang = useLang() as string;
  
  return useCallback(
    (isDraft: boolean, lang: string = currentLang) => {
      updateValue((value: Value | null) => {
        if (!value) return value;
        const cell = value.rows.find((row: Row) => 
          row.cells.some((cell: Cell) => cell.id === id)
        )?.cells.find((cell: Cell) => cell.id === id);
        
        if (cell) {
          cell.isDraft = isDraft;
        }
        return value;
      });
    },
    [updateValue, id, currentLang]
  );
};

/**
 * @returns function to resize a cell
 */
export const useResizeCellById = () => {
  const updateValue = useUpdateValue();
  
  return useCallback(
    (nodeId: string, size: number) => {
      updateValue((value: Value | null) => {
        if (!value) return value;
        const cell = value.rows.find((row: Row) => 
          row.cells.some((cell: Cell) => cell.id === nodeId)
        )?.cells.find((cell: Cell) => cell.id === nodeId);
        
        if (cell) {
          cell.size = size;
        }
        return value;
      });
    },
    [updateValue]
  );
};

/**
 *
 * @param id a cell id
 * @returns a function to resize the given cell
 */
export const useResizeCell = (id: string) => {
  const resizeById = useResizeCellById();
  return useCallback((size: number) => resizeById(id, size), [resizeById, id]);
};

/**
 *
 * @returns a function to change the current language
 */
export const useSetLang = () => {
  return useZustandSetLang();
};

/**
 * @param id cell id
 * @returns function to update the data of the cell with the given id
 */
export const useUpdateCellData = (id: string) => {
  const updateValue = useUpdateValue();
  const currentLang = useLang() as string;
  
  return useCallback(
    (data: { [key: string]: unknown }, options: CellPluginOnChangeOptions = {}) => {
      const lang = options.lang || currentLang;
      
      updateValue((value: Value | null) => {
        if (!value) return value;
        
        // Create a copy of the value to work with
        const newValue = { ...value };
        
        // Find the cell with the given id
        for (const row of newValue.rows || []) {
          for (const cell of row.cells || []) {
            if (cell.id === id) {
              // Update the cell data
              if (!cell.dataI18n) {
                cell.dataI18n = {};
              }
              
              // Ensure the language key exists
              const langKey = lang as string;
              if (!cell.dataI18n[langKey]) {
                cell.dataI18n[langKey] = {};
              }
              
              // Update the data for the specified language
              cell.dataI18n[langKey] = {
                ...cell.dataI18n[langKey],
                ...data,
              };
              
              // Return the updated value
              return newValue;
            }
            
            // Check nested rows
            if (cell.rows) {
              for (const nestedRow of cell.rows) {
                for (const nestedCell of nestedRow.cells || []) {
                  if (nestedCell.id === id) {
                    // Update the cell data
                    if (!nestedCell.dataI18n) {
                      nestedCell.dataI18n = {};
                    }
                    
                    // Ensure the language key exists
                    const langKey = lang as string;
                    if (!nestedCell.dataI18n[langKey]) {
                      nestedCell.dataI18n[langKey] = {};
                    }
                    
                    // Update the data for the specified language
                    nestedCell.dataI18n[langKey] = {
                      ...nestedCell.dataI18n[langKey],
                      ...data,
                    };
                    
                    // Return the updated value
                    return newValue;
                  }
                }
              }
            }
          }
        }
        
        // Cell not found, return the original value
        return value;
      });
    },
    [id, updateValue, currentLang]
  );
};

// Helper function to find a cell by id
const findCellById = (value: Value, id: string): Cell | null => {
  if (!value || !value.rows) return null;
  
  for (const row of value.rows) {
    for (const cell of row.cells) {
      if (cell.id === id) {
        return cell;
      }
      
      // Check nested rows
      if (cell.rows) {
        for (const nestedRow of cell.rows) {
          for (const nestedCell of nestedRow.cells) {
            if (nestedCell.id === id) {
              return nestedCell;
            }
          }
        }
      }
    }
  }
  
  return null;
};

/**
 * @returns a function to remove a cell by id
 */
export const useRemoveCellById = () => {
  const updateValue = useUpdateValue();
  
  return useCallback(
    (id?: string) => {
      if (!id) return;
      
      updateValue((value: Value | null) => {
        if (!value) return value;
        
        // Find and remove the cell
        value.rows.forEach((row: Row) => {
          const cellIndex = row.cells.findIndex((cell: Cell) => cell.id === id);
          if (cellIndex >= 0) {
            row.cells.splice(cellIndex, 1);
          }
        });
        
        // Remove empty rows
        const rowsToKeep = value.rows.filter((row: Row) => row.cells.length > 0);
        value.rows = rowsToKeep;
        
        return value;
      });
    },
    [updateValue]
  );
};

/**
 * @param id a cell id
 * @returns a function to remove the given cell
 */
export const useRemoveCell = (id: string) => {
  const removeById = useRemoveCellById();
  return useCallback(() => removeById(id), [removeById, id]);
};

/**
 *
 * @returns a function to remove muliple nodeids
 */
export const useRemoveMultipleNodeIds = () => {
  const updateValue = useUpdateValue();
  
  return useCallback(
    (nodeIds: string[]) => {
      if (!nodeIds.length) return;
      
      updateValue((value: Value | null) => {
        if (!value) return value;
        
        // Find and remove the cells
        value.rows.forEach((row: Row) => {
          row.cells = row.cells.filter((cell: Cell) => !nodeIds.includes(cell.id));
        });
        
        // Remove empty rows
        const rowsToKeep = value.rows.filter((row: Row) => row.cells.length > 0);
        value.rows = rowsToKeep;
        
        return value;
      });
    },
    [updateValue]
  );
};

/**
 * @returns a function that duplicates a cell
 */
export const useDuplicateCellById = () => {
  const updateValue = useUpdateValue();
  const editor = useEditorStore();

  return useCallback(
    (id: string) => {
      const node = editor && editor.getNode(id);
      if (!node) return;
      
      updateValue((value: Value | null) => {
        if (!value) return value;
        
        // Find the row containing the cell
        const rowIndex = value.rows.findIndex((row: Row) => 
          row.cells.some((cell: Cell) => cell.id === id)
        );
        
        if (rowIndex >= 0) {
          const cellIndex = value.rows[rowIndex].cells.findIndex((cell: Cell) => cell.id === id);
          if (cellIndex >= 0) {
            // Clone the cell with new IDs
            const clonedCell = cloneWithNewIds(value.rows[rowIndex].cells[cellIndex]);
            // Insert after the original cell
            value.rows[rowIndex].cells.splice(cellIndex + 1, 0, clonedCell);
          }
        }
        
        return value;
      });
    },
    [editor, updateValue]
  );
};

export const useInsertAfter = () => {
  const updateValue = useUpdateValue();
  const insertNew = useInsertNew();

  return useCallback(
    (node: Node, insertAfterNodeId?: string | null) => {
      if (insertAfterNodeId) {
        updateValue((value: Value | null) => {
          if (!value) return value;
          
          // Find the row containing the cell
          const rowIndex = value.rows.findIndex((row: Row) => 
            row.cells.some((cell: Cell) => cell.id === insertAfterNodeId)
          );
          
          if (rowIndex >= 0) {
            const cellIndex = value.rows[rowIndex].cells.findIndex((cell: Cell) => cell.id === insertAfterNodeId);
            if (cellIndex >= 0) {
              // Clone the node with new IDs
              const clonedNode = cloneWithNewIds(node);
              // Insert after the specified cell
              value.rows[rowIndex].cells.splice(cellIndex + 1, 0, clonedNode);
            }
          }
          
          return value;
        });
      } else {
        // insert at the end
        insertNew(cloneWithNewIds(node));
      }
    },
    [updateValue, insertNew]
  );
};

/**
 * @returns a function that duplicates multiple cell
 */
export const useDuplicateMultipleCells = () => {
  const editor = useEditorStore();
  const insertAfter = useInsertAfter();

  return useCallback(
    (cellIds: string[]) => {
      const node = editor && getCommonAncestorTree(editor, cellIds);
      if (!node) {
        return;
      }
      const insertAfterNodeId = isRow(node)
        ? node.id
        : node?.rows?.[node?.rows?.length ?? 0 - 1]?.id;

      insertAfter(node, insertAfterNodeId);
    },
    [editor, insertAfter]
  );
};

/**
 * @param a cell id
 * @returns a function that duplicates the given cell
 */
export const useDuplicateCell = (id: string) => {
  const duplicate = useDuplicateCellById();

  return useCallback(() => duplicate(id), [duplicate, id]);
};

/**
 * experimental
 * @returns function to set the reference node id. used internally
 */
export const useSetDisplayReferenceNodeId = () => {
  const { setDisplayMode } = useActions();
  const referenceId = useDisplayModeReferenceNodeId();

  return useCallback(
    (nodeId?: string | null) => {
      if (nodeId !== referenceId) {
        setDisplayMode({
          mode: 'edit',
          referenceNodeId: nodeId
        });
      }
    },
    [setDisplayMode, referenceId]
  );
};

/**
 * @returns a function to focus a cell by id
 */
export const useFocusCellById = () => {
  const setFocus = useSetFocus();
  const setDisplayRef = useSetDisplayReferenceNodeId();
  const editor = useEditorStore();

  return useCallback(
    (id: string, scrollToCell?: boolean, mode?: FocusMode) => {
      if (!editor) {
        return;
      }
      const parentCellId = editor
        .getNodeWithAncestors(id)
        ?.ancestors?.find((node: Node) => !isRow(node))?.id;

      setDisplayRef(parentCellId);
      setFocus({
        nodeId: id,
        scrollToCell: scrollToCell || false,
        source: mode || null
      });
    },
    [setFocus, setDisplayRef, editor]
  );
};

/**
 * @returns a function to focus a cell by id
 */
export const useFocusCell = (id?: string | null) => {
  const focusCellById = useFocusCellById();

  return useCallback(
    (scrollToCell?: boolean, mode?: FocusMode) => {
      if (id) {
        focusCellById(id, scrollToCell, mode);
      }
    },
    [focusCellById, id]
  );
};

/**
 * @returns function to blur a cell by id
 */
export const useBlurCell = () => {
  const setFocus = useSetFocus();

  return useCallback(
    (id: string) => {
      setFocus(null);
    },
    [setFocus]
  );
};

/**
 * @returns function to blur all cells
 */
export const useBlurAllCells = () => {
  const setFocus = useSetFocus();

  return useCallback(() => {
    setFocus(null);
  }, [setFocus]);
};

/**
 * @returns function to insert a cell at the end of the document or the end of the parent cell
 *
 * if the id already exists, it will move that cell
 */
export const useInsertNew = (parentCellId?: string) => {
  const updateValue = useUpdateValue();
  const cellPlugins = useAllCellPluginsForNode(parentCellId);
  const editor = useEditorStore();
  const lang = useLang() as string;
  const setFocus = useSetFocus();
  
  return useCallback(
    (partialCell: PartialCell) => {
      updateValue((value: Value | null) => {
        if (!value) return value;
        
        // Create a new cell from the partial cell
        const newCell: Cell = {
          id: partialCell.id || Math.random().toString(36).substring(2, 15),
          ...partialCell,
        } as Cell; // Cast to Cell type
        
        if (parentCellId) {
          // Insert as a new row in the parent cell
          const parentRow = value.rows.find((row: Row) => 
            row.cells.some((cell: Cell) => cell.id === parentCellId)
          );
          
          if (parentRow) {
            const parentCellIndex = parentRow.cells.findIndex((cell: Cell) => cell.id === parentCellId);
            if (parentCellIndex >= 0) {
              // Create a new row with the new cell
              const newRow: Row = {
                id: Math.random().toString(36).substring(2, 15),
                cells: [newCell]
              };
              
              // Add the new row to the parent cell's rows
              if (!parentRow.cells[parentCellIndex].rows) {
                parentRow.cells[parentCellIndex].rows = [];
              }
              parentRow.cells[parentCellIndex].rows.push(newRow);
            }
          }
        } else {
          // Insert at the end of the document
          if (!value.rows) {
            value.rows = [];
          }
          
          // Create a new row with the new cell
          const newRow: Row = {
            id: Math.random().toString(36).substring(2, 15),
            cells: [newCell]
          };
          
          value.rows.push(newRow);
        }
        
        return value;
      });
      
      // Focus the new cell
      setTimeout(() => {
        setFocus({
          nodeId: partialCell.id || '',
          scrollToCell: true,
          source: null
        });
      }, 0);
    },
    [updateValue, editor, cellPlugins, parentCellId, lang, setFocus]
  );
};

/**
 * used for the trash target
 */
export const useTrashDrop = () => {
  const removeCell = useRemoveCellById();

  return useDndKitDrop({
    accept: 'cell',
    collect: (monitor) => ({
      isHovering: monitor.isOver({ shallow: true }),
    }),
    drop: (item, monitor) => {
      if (item?.cell) {
        removeCell(item.cell.id);
      }
    },
  });
};
