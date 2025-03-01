import { useCallback } from 'react';
// Remove Redux imports
// import { redo, undo } from '../../actions/undo';
// import { useDispatch, useSelector } from '../../reduxConnect';

// Import Zustand hooks
import { useUndo as useZustandUndo, useRedo as useZustandRedo, useSelector } from '../../zustand/hooks';

/**
 * @returns function, that undos last change if called
 */
export const useUndo = () => {
  // Use Zustand hook directly
  return useZustandUndo();
};

/**
 * @returns function, that redos last change if called
 */
export const useRedo = () => {
  // Use Zustand hook directly
  return useZustandRedo();
};

/**
 * @returns whether user can undo
 */
export const useCanUndo = () => {
  return useSelector((s) => s.reactPage.values.past.length > 0);
};
/**
 * @returns whether user can undo
 */
export const useCanRedo = () => {
  return useSelector((s) => s.reactPage.values.future.length > 0);
};
