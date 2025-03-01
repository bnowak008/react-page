// Export the store
export { default as createZustandStore, createInitialState } from './store';
export type { ReactPageState, RootState, ReactPageActions, ZustandStore, Focus, Hover } from './store';

// Export the EditorStore
export { default as EditorStore, EditorContext, createEmptyState } from './EditorStore';
export type { Languages, CoreEditorProps } from './EditorStore';

// Export the EditorStoreProvider
export { default as EditorStoreProvider } from './EditorStoreProvider';

// Export the hooks
export {
  useEditorStore,
  useSelector,
  useActions,
  useUndo,
  useRedo,
  useUpdateValue,
  useSetLang,
  useSetDisplayMode,
  useSetDisplayZoom,
  useSetFocus,
  useSetHover,
  useValueOptimizer,
} from './hooks';

// Export the helper functions
export { setAllSizesAndOptimize } from './helpers/setAllSizesAndOptimize';
export { optimizeCell, optimizeRow, optimizeCells, optimizeRows } from './helpers/optimize';
export { computeSizes, computeInlines } from './helpers/sizing';

// Export the selector functions
export { findNodeInState, currentValue, selectNode } from '../selector/editable';
export type { NodeProps } from '../selector/editable'; 