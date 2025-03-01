import type { Value, Node, NodeWithAncestors } from '../types/node';
import { isRow } from '../types/node';
import type { RootState } from '../zustand/store';

/**
 * Recursively finds a node by its ID in a tree of nodes
 */
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

/**
 * Finds a node in the state by its ID
 * Uses a cache to improve performance
 */
export const findNodeInState = (
  state: RootState,
  nodeId: string
): NodeWithAncestors | null => {
  // POOR mans node cache
  // it gets removed every time the state changes in the updateValue action
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
};

/**
 * Returns the current value from the state
 */
export const currentValue = (state: RootState): Value | null =>
  state?.reactPage?.values?.present;

export type NodeProps = { id: string; editable: string };

/**
 * Selects a node by its ID
 */
export const selectNode = (
  state: RootState,
  nodeId: string
): NodeWithAncestors | null => {
  return findNodeInState(state, nodeId);
};
