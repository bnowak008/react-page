// Export the store
export { default as createZustandStore, createInitialState } from './store';
export type {
  ReactPageState,
  RootState,
  ReactPageActions,
  ZustandStore,
  Focus,
  Hover,
} from './store';

// Export the EditorStore
export {
  default as EditorStore,
  EditorContext,
  createEmptyState,
} from './EditorStore';
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
  useSetDisplayReferenceNodeId,
  useSetFocus,
  useSetHover,
  useValueOptimizer,
  // Direct access hooks
  useNodeWithAncestors,
  useNode,
  useNodeAncestors,
  useCurrentValue,
  useLanguage,
  // Display hooks
  useDisplayMode,
  useDisplayZoom,
  useDisplayReferenceNodeId,
  useIsEditMode,
  useIsPreviewMode,
  useIsLayoutMode,
  useIsResizingMode,
  useIsInsertMode,
  // Focus hooks
  useAllFocusedNodeIds,
  useFocusedNodeId,
  useIsFocused,
  useIsExclusivelyFocused,
  useFocusState,
  useFocusCell,
  useBlurAllCells,
} from './hooks';

// Export the helper functions
export { setAllSizesAndOptimize } from './helpers/setAllSizesAndOptimize';
export {
  optimizeCell,
  optimizeRow,
  optimizeCells,
  optimizeRows,
} from './helpers/optimize';
export { computeSizes, computeInlines } from './helpers/sizing';

// Export node types
export type { NodeWithAncestors } from '../types/node';
