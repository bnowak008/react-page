import { useContext, useMemo } from 'react';
import { useStore } from 'zustand';
import { EditorContext } from './EditorStore';
import type { RootState, ZustandStore } from './store';

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