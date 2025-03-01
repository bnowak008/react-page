import { create } from 'zustand';
import { devtools, persist, subscribeWithSelector } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import type { Value, ValueWithHistory } from '../types/node';
import type { Display, DisplayModes } from '../types/display';
import type { NodeWithAncestors } from '../types/node';
import { setAllSizesAndOptimize } from './helpers/setAllSizesAndOptimize';
import type { PositionEnum } from '../const';

// Define Focus and Hover types directly
export interface Focus {
  nodeIds: string[];
  scrollToCell?: boolean;
  source?: any;
  mode?: 'replace' | 'blur' | 'add' | null;
}

export interface Hover {
  nodeId: string | null;
  position?: PositionEnum | null;
  level?: number;
  dragMode?: boolean;
  ancestorIds?: string[];
}

// Define the state structure to match the Redux state
export interface ReactPageState {
  values: ValueWithHistory;
  display: Display;
  focus: Focus | null;
  hover: Hover | null;
  settings: {
    lang?: string;
  };
  __nodeCache?: Record<string, NodeWithAncestors | null>;
}

// Define the root state structure to match the Redux state
export interface RootState {
  reactPage: ReactPageState;
}

// Define the actions that can be performed on the state
export interface ReactPageActions {
  // Value actions
  updateValue: (
    valueOrUpdater: Value | null | ((value: Value | null) => Value | null)
  ) => void;

  // Undo/Redo actions
  undo: () => void;
  redo: () => void;

  // Setting actions
  setLang: (lang: string) => void;

  // Display actions
  setDisplayMode: (mode: DisplayModes) => void;
  setDisplayZoom: (zoom: number) => void;
  setDisplayReferenceNodeId: (
    referenceNodeId: string | null | undefined
  ) => void;

  // Focus actions
  setFocus: (focus: Focus | null) => void;

  // Hover actions
  setHover: (hover: Hover | null) => void;
}

// Create the store with the combined state and actions
export type ZustandStore = RootState & ReactPageActions;

// Helper function to create the initial state
export const createInitialState = (
  value: Value | null,
  lang: string
): RootState => ({
  reactPage: {
    __nodeCache: {},
    hover: null,
    focus: null,
    display: {
      mode: 'edit',
      zoom: 1,
    },
    settings: {
      lang,
    },
    values: {
      past: [],
      present: value,
      future: [],
    },
  },
});

// Helper function to optimize a value
const optimizeValue = (value: Value | null): Value | null => {
  if (!value) return null;

  // Apply optimization in a more efficient way
  // First optimize the structure, then compute sizes
  return {
    ...value,
    rows: setAllSizesAndOptimize(value.rows || []),
  };
};

// Create the Zustand store
export const createZustandStore = (initialState: RootState) =>
  create<ZustandStore>()(
    subscribeWithSelector(
      devtools(
        immer((set) => ({
          ...initialState,

          // Value actions
          updateValue: (valueOrUpdater) =>
            set((state) => {
              // Handle both direct values and updater functions
              const value =
                typeof valueOrUpdater === 'function'
                  ? valueOrUpdater(state.reactPage.values.present)
                  : valueOrUpdater;

              // Optimize the value before storing it
              const optimizedValue = optimizeValue(value);

              // Only update if the value has actually changed
              // This prevents unnecessary re-renders
              if (
                JSON.stringify(state.reactPage.values.present) !==
                JSON.stringify(optimizedValue)
              ) {
                // Add current value to past for undo
                state.reactPage.values.past.push(
                  state.reactPage.values.present!
                );
                // Clear future when a new action is performed
                state.reactPage.values.future = [];
                // Set the new optimized value
                state.reactPage.values.present = optimizedValue;

                // Clear the node cache when the value changes
                // This ensures that any cached nodes are refreshed with the new optimized structure
                state.reactPage.__nodeCache = {};
              }
            }),

          // Undo/Redo actions
          undo: () =>
            set((state) => {
              const { past, present, future } = state.reactPage.values;
              if (past.length === 0) return;

              // Move current state to future
              future.unshift(present!);
              // Set the previous state as current
              state.reactPage.values.present = past[past.length - 1];
              // Remove the last item from past
              state.reactPage.values.past.pop();
            }),

          redo: () =>
            set((state) => {
              const { past, present, future } = state.reactPage.values;
              if (future.length === 0) return;

              // Move current state to past
              past.push(present!);
              // Set the next state as current
              state.reactPage.values.present = future[0];
              // Remove the first item from future
              state.reactPage.values.future.shift();
            }),

          // Setting actions
          setLang: (lang) =>
            set((state) => {
              state.reactPage.settings.lang = lang;
            }),

          // Display actions
          setDisplayMode: (mode) =>
            set((state) => {
              state.reactPage.display.mode = mode;
            }),

          setDisplayZoom: (zoom) =>
            set((state) => {
              state.reactPage.display.zoom = zoom;
            }),

          setDisplayReferenceNodeId: (referenceNodeId) =>
            set((state) => {
              state.reactPage.display.referenceNodeId = referenceNodeId;
            }),

          // Focus actions
          setFocus: (focus) =>
            set((state) => {
              state.reactPage.focus = focus;
            }),

          // Hover actions
          setHover: (hover) =>
            set((state) => {
              state.reactPage.hover = hover;
            }),
        }))
      )
    )
  );

// Export a default function to create the store
export default createZustandStore;
