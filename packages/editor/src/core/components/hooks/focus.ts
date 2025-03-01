import type { EffectCallback, DependencyList } from 'react';
import { useEffect } from 'react';
import {
  useAllFocusedNodeIds as useZustandAllFocusedNodeIds,
  useFocusedNodeId as useZustandFocusedNodeId,
  useIsFocused as useZustandIsFocused,
  useIsExclusivelyFocused as useZustandIsExclusivelyFocused,
  useFocusState,
} from '../../zustand/hooks';

/**
 * @returns the current focused nodeId if just one or null
 */
export const useFocusedNodeId = () => {
  return useZustandFocusedNodeId();
};

export const useAllFocusedNodeIds = () => {
  return useZustandAllFocusedNodeIds();
};

/**
 *
 * @param id the id of the node (row/cell)
 * @returns true if the given node id is focused
 */
export const useIsFocused = (id: string) => {
  return useZustandIsFocused(id);
};

/**
 *
 * @param id the id of the node (row/cell)
 * @returns true if ONLY the given node id is focused
 */
export const useIsExclusivlyFocused = (id: string) => {
  return useZustandIsExclusivelyFocused(id);
};

/**
 *
 * @param id the id of the node
 * @param effect callback that is run when the given node is focused and the focus action demanded scrollToCell
 * @param deps effect deps array
 */
export const useScrollToViewEffect = (
  id: string,
  effect: EffectCallback,
  deps: DependencyList
) => {
  const focusState = useFocusState();
  const focusedNodeId = useZustandFocusedNodeId();

  const scrollToCell = focusState?.scrollToCell && focusedNodeId === id;

  useEffect(() => {
    if (scrollToCell) {
      return effect();
    }
  }, [scrollToCell, ...deps]);
};
