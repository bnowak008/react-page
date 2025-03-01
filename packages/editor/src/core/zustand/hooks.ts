import { useContext, useMemo } from 'react';
import { useStore } from 'zustand';
import { EditorContext } from './EditorStore';
import type { RootState, ZustandStore, Focus } from './store';
import { setAllSizesAndOptimize } from './helpers/setAllSizesAndOptimize';
import { optimizeCell, optimizeRow } from './helpers/optimize';
import type { FocusMode } from '../types/focus';
import type { DisplayModes } from '../types/display';
import type { Node, NodeWithAncestors, Value } from '../types/node';
import { isRow } from '../types/node';

// Hook to access the EditorStore
export const useEditorStore = () => {
  const editorStore = useContext(EditorContext);
  if (!editorStore) {
    throw new Error(
      'useEditorStore must be used within an EditorStoreProvider'
    );
  }
  return editorStore;
};

// Hook to select data from the store (replacement for useSelector)
export function useSelector<T>(selector: (state: RootState) => T): T {
  const editorStore = useEditorStore();
  return useStore(editorStore.store, (state) => selector(state));
}

// Hook to access actions (replacement for useDispatch)
export const useActions = () => {
  const editorStore = useEditorStore();

  return useMemo(() => {
    const {
      updateValue,
      undo,
      redo,
      setLang,
      setDisplayMode,
      setDisplayZoom,
      setDisplayReferenceNodeId,
      setFocus,
      setHover,
    } = editorStore.store.getState();

    return {
      updateValue,
      undo,
      redo,
      setLang,
      setDisplayMode,
      setDisplayZoom,
      setDisplayReferenceNodeId,
      setFocus,
      setHover,
    };
  }, [editorStore]);
};

// Shorthand hooks for specific actions
export const useUndo = () => {
  const { undo } = useActions();
  return undo;
};

export const useRedo = () => {
  const { redo } = useActions();
  return redo;
};

export const useUpdateValue = () => {
  const { updateValue } = useActions();
  return updateValue;
};

export const useSetLang = () => {
  const { setLang } = useActions();
  return setLang;
};

export const useSetDisplayMode = () => {
  const { setDisplayMode } = useActions();
  return setDisplayMode;
};

export const useSetDisplayZoom = () => {
  const { setDisplayZoom } = useActions();
  return setDisplayZoom;
};

export const useSetFocus = () => {
  const { setFocus } = useActions();
  return setFocus;
};

export const useSetHover = () => {
  const { setHover } = useActions();
  return setHover;
};

export const useSetDisplayReferenceNodeId = () => {
  const { setDisplayReferenceNodeId } = useActions();
  return setDisplayReferenceNodeId;
};

// Hook to optimize value
export const useValueOptimizer = () => {
  return useMemo(() => {
    return {
      optimizeValue: (value: any) => {
        if (!value) return null;

        // Apply optimizations in a more efficient sequence
        // This ensures we're not doing unnecessary work
        return {
          ...value,
          rows: setAllSizesAndOptimize(value.rows || []),
        };
      },
      // Expose individual optimization functions for more granular control
      optimizeCell,
      optimizeRow,
      setAllSizesAndOptimize,

      // Add a new function to optimize a value without triggering a full update
      // This is useful for optimizing values before they're passed to updateValue
      optimizeValueInPlace: (value: any) => {
        if (!value) return null;

        // Only optimize the rows without creating a new value object
        // This is more efficient for in-place optimizations
        if (value.rows) {
          value.rows = setAllSizesAndOptimize(value.rows);
        }

        return value;
      },
    };
  }, []);
};

// Direct access focus hooks
export const useAllFocusedNodeIds = () => {
  const editorStore = useEditorStore();
  
  // Get the raw nodeIds from the store
  const nodeIds = useStore(
    editorStore.store,
    (state) => state.reactPage.focus?.nodeIds
  );
  
  // Memoize the result to ensure stable reference
  return useMemo(() => {
    return nodeIds || [];
  }, [nodeIds]);
};

export const useFocusedNodeId = () => {
  const nodeIds = useAllFocusedNodeIds();
  return nodeIds.length === 1 ? nodeIds[0] : null;
};

export const useIsFocused = (id: string) => {
  const editorStore = useEditorStore();
  return useStore(
    editorStore.store,
    (state) => state.reactPage.focus?.nodeIds?.includes(id) ?? false
  );
};

export const useIsExclusivelyFocused = (id: string) => {
  const editorStore = useEditorStore();
  return useStore(editorStore.store, (state) => {
    const nodeIds = state.reactPage.focus?.nodeIds ?? [];
    return nodeIds.length === 1 && nodeIds[0] === id;
  });
};

export const useFocusState = () => {
  const editorStore = useEditorStore();
  return useStore(editorStore.store, (state) => state.reactPage.focus);
};

export const useFocusCell = () => {
  const setFocus = useSetFocus();

  return useMemo(() => {
    return (
      nodeId: string | null,
      scrollToCell = false,
      mode: FocusMode = null
    ) => {
      setFocus({
        nodeIds: nodeId ? [nodeId] : [],
        scrollToCell,
        mode,
      });
    };
  }, [setFocus]);
};

export const useBlurAllCells = () => {
  const setFocus = useSetFocus();

  return useMemo(() => {
    return () => {
      setFocus(null);
    };
  }, [setFocus]);
};

// Direct access display hooks
export const useDisplayMode = () => {
  const editorStore = useEditorStore();
  return useStore(
    editorStore.store,
    (state) => state.reactPage.display.mode
  ) as DisplayModes;
};

export const useDisplayZoom = () => {
  const editorStore = useEditorStore();
  return useStore(editorStore.store, (state) => state.reactPage.display.zoom);
};

export const useIsEditMode = () => {
  const displayMode = useDisplayMode();
  return displayMode === 'edit';
};

export const useIsPreviewMode = () => {
  const displayMode = useDisplayMode();
  return displayMode === 'preview';
};

export const useIsLayoutMode = () => {
  const displayMode = useDisplayMode();
  return displayMode === 'layout';
};

export const useIsResizingMode = () => {
  const displayMode = useDisplayMode();
  return displayMode === 'resizing';
};

export const useIsInsertMode = () => {
  const displayMode = useDisplayMode();
  return displayMode === 'insert';
};

export const useDisplayReferenceNodeId = () => {
  const editorStore = useEditorStore();
  return useStore(
    editorStore.store,
    (state) => state.reactPage.display.referenceNodeId
  );
};

// Direct access settings hooks
export const useLanguage = () => {
  const editorStore = useEditorStore();
  return useStore(editorStore.store, (state) => state.reactPage.settings.lang);
};

// Helper function to find a node by ID in a tree of nodes
const findNode = (
  nodes: Node[],
  nodeId: string,
  ancestors: Node[] = []
): NodeWithAncestors | null => {
  for (const node of nodes) {
    if (node.id === nodeId) {
      return {
        node,
        ancestors,
      };
    }
    // else search children
    if (isRow(node) && node.cells) {
      const found = findNode(node.cells, nodeId, [node, ...ancestors]);
      if (found) {
        return found;
      }
    } else if (!isRow(node) && node.rows) {
      const found = findNode(node.rows, nodeId, [node, ...ancestors]);
      if (found) {
        return found;
      }
    }
  }
  return null;
};

// Direct access node hooks
export const useNodeWithAncestors = (nodeId: string) => {
  const editorStore = useEditorStore();
  return useStore(editorStore.store, (state) => {
    // Use node cache for performance
    if (!state.reactPage.__nodeCache) {
      state.reactPage.__nodeCache = {};
    }

    // Return from cache if available
    if (state.reactPage.__nodeCache[nodeId]) {
      return state.reactPage.__nodeCache[nodeId];
    }

    // Return null if no value is present
    if (!state.reactPage.values?.present) {
      return null;
    }

    // Find the node in the tree
    const result = findNode(
      [
        {
          ...state.reactPage.values?.present,
          isRoot: true,
        },
      ],
      nodeId
    );

    // Cache the result
    state.reactPage.__nodeCache[nodeId] = result;

    return result;
  });
};

export const useNode = (nodeId: string) => {
  const nodeWithAncestors = useNodeWithAncestors(nodeId);
  return nodeWithAncestors?.node || null;
};

export const useNodeAncestors = (nodeId: string) => {
  const nodeWithAncestors = useNodeWithAncestors(nodeId);
  return nodeWithAncestors?.ancestors || [];
};

export const useCurrentValue = () => {
  const editorStore = useEditorStore();
  return useStore(editorStore.store, (state) => state.reactPage.values.present);
};
