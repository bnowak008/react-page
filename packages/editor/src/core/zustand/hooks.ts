import { useContext, useMemo } from 'react';
import { useStore } from 'zustand';
import { EditorContext } from './EditorStore';
import type { RootState, ZustandStore } from './store';
import { setAllSizesAndOptimize } from './helpers/setAllSizesAndOptimize';
import { optimizeCell, optimizeRow } from './helpers/optimize';

// Hook to access the EditorStore
export const useEditorStore = () => {
  const editorStore = useContext(EditorContext);
  if (!editorStore) {
    throw new Error('useEditorStore must be used within an EditorStoreProvider');
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
      setFocus, 
      setHover 
    } = editorStore.store.getState();
    
    return {
      updateValue,
      undo,
      redo,
      setLang,
      setDisplayMode,
      setDisplayZoom,
      setFocus,
      setHover
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
      }
    };
  }, []);
}; 