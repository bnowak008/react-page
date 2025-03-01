import type { RootState } from '../zustand/store';
import type { FocusMode } from '../types/focus';

/**
 * Get all focused node ids
 */
export const allFocusedNodeIds = (state: RootState) => {
  return state.reactPage.focus?.nodeIds ?? [];
};

/**
 * Get the single focused node id, or null if multiple or none are focused
 */
export const singleFocusedNode = (state: RootState) => {
  const ids = allFocusedNodeIds(state);
  return ids.length === 1 ? ids[0] : null;
};

/**
 * Get the focus state
 */
export const focus = (state: RootState) => {
  return state.reactPage.focus;
};

/**
 * Focus a node
 */
export const focusCell = (
  state: RootState,
  nodeId: string | null,
  scrollToCell = false,
  mode?: FocusMode
) => {
  if (!state.reactPage.focus) {
    return state;
  }

  return {
    ...state,
    reactPage: {
      ...state.reactPage,
      focus: {
        ...state.reactPage.focus,
        nodeIds: nodeId ? [nodeId] : [],
        scrollToCell,
        mode: mode ?? 'replace',
      },
    },
  };
};

/**
 * Blur all cells
 */
export const blurAllCells = (state: RootState) => {
  if (!state.reactPage.focus) {
    return state;
  }

  return {
    ...state,
    reactPage: {
      ...state.reactPage,
      focus: {
        ...state.reactPage.focus,
        nodeIds: [],
      },
    },
  };
};
