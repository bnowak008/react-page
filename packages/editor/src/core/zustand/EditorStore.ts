import { createContext } from 'react';
import type { StoreApi } from 'zustand';
import { createId } from '../utils/createId';
import { CURRENT_EDITABLE_VERSION } from '../migrations/EDITABLE_MIGRATIONS';
import type { Value } from '../types/node';
import type { RootState, ZustandStore } from './store';
import createZustandStore, { createInitialState } from './store';
import { findNodeInState } from '../selector/editable';

export const EditorContext = createContext<EditorStore | null>(null);

export type Languages = Array<{
  lang: string;
  label: string;
}>;

export interface CoreEditorProps {
  store?: StoreApi<ZustandStore> | null;
  initialState: RootState;
}

class EditorStore {
  store: StoreApi<ZustandStore>;

  constructor({ store, initialState }: CoreEditorProps) {
    this.store = store || createZustandStore(initialState);
  }

  public setLang(lang: string) {
    this.store.getState().setLang(lang);
  }

  public getNodeWithAncestors = (nodeId: string) => {
    // We need to adapt this to work with Zustand
    const state = this.store.getState();
    return findNodeInState(state, nodeId);
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

  public setDisplayMode = (mode: 'edit' | 'preview' | 'layout') => {
    this.store.getState().setDisplayMode(mode);
  };

  public setDisplayZoom = (zoom: number) => {
    this.store.getState().setDisplayZoom(zoom);
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