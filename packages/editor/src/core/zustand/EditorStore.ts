import { createContext } from 'react';
import type { StoreApi } from 'zustand';
import { createId } from '../utils/createId';
import { CURRENT_EDITABLE_VERSION } from '../migrations/EDITABLE_MIGRATIONS';
import type { Value, Node, NodeWithAncestors } from '../types/node';
import { isRow } from '../types/node';
import type { RootState, ZustandStore } from './store';
import createZustandStore, { createInitialState } from './store';
import type { DisplayModes } from '../types';

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

export const EditorContext = createContext<EditorStore | null>(null);

export type Languages = Array<{
  lang: string;
  label: string;
}>;

export interface CoreEditorProps {
  store?: StoreApi<ZustandStore> | any | null;
  initialState: RootState;
}

class EditorStore {
  store: StoreApi<ZustandStore>;

  constructor({ store, initialState }: CoreEditorProps) {
    // Check if the store is a Zustand store by looking for setState method
    const isZustandStore = store && typeof store.setState === 'function';
    this.store = isZustandStore ? store : createZustandStore(initialState);
  }

  public setLang(lang: string) {
    this.store.getState().setLang(lang);
  }

  public getNodeWithAncestors = (nodeId: string) => {
    // Get the current state
    const state = this.store.getState();

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
  };

  public getNode = (nodeId: string) => {
    return this.getNodeWithAncestors(nodeId)?.node;
  };

  // Add methods to access the Zustand actions
  public updateValue = (value: Value | null) => {
    this.store.getState().updateValue(value);
  };

  public undo = () => {
    this.store.getState().undo();
  };

  public redo = () => {
    this.store.getState().redo();
  };

  public setDisplayMode = (mode: DisplayModes) => {
    this.store.getState().setDisplayMode(mode);
  };

  public setDisplayZoom = (zoom: number) => {
    this.store.getState().setDisplayZoom(zoom);
  };

  public setDisplayReferenceNodeId = (
    referenceNodeId: string | null | undefined
  ) => {
    this.store.getState().setDisplayReferenceNodeId(referenceNodeId);
  };

  public setFocus = (focus: any) => {
    this.store.getState().setFocus(focus);
  };

  public setHover = (hover: any) => {
    this.store.getState().setHover(hover);
  };

  // Subscribe to store changes
  public subscribe = (callback: () => void) => {
    return this.store.subscribe(callback);
  };

  // Get the current state
  public getState = () => {
    return this.store.getState();
  };
}

export const createEmptyState: () => Value = () =>
  ({ id: createId(), rows: [], version: CURRENT_EDITABLE_VERSION } as Value);

export default EditorStore;
