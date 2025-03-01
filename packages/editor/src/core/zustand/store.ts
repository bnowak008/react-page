import { create } from 'zustand';
import { devtools, persist, subscribeWithSelector } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import type { Value, ValueWithHistory } from '../types/node';
import type { Display } from '../types/display';
import type { Focus } from '../reducer/focus';
import type { Hover } from '../reducer/hover';
import type { NodeWithAncestors } from '../types/node';

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
  updateValue: (value: Value | null) => void;
  
  // Undo/Redo actions
  undo: () => void;
  redo: () => void;
  
  // Setting actions
  setLang: (lang: string) => void;
  
  // Display actions
  setDisplayMode: (mode: Display['mode']) => void;
  setDisplayZoom: (zoom: number) => void;
  
  // Focus actions
  setFocus: (focus: Focus | null) => void;
  
  // Hover actions
  setHover: (hover: Hover | null) => void;
}

// Create the store with the combined state and actions
export type ZustandStore = RootState & ReactPageActions;

// Helper function to create the initial state
export const createInitialState = (value: Value | null, lang: string): RootState => ({
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

// Create the Zustand store
export const createZustandStore = (initialState: RootState) => 
  create<ZustandStore>()(
    subscribeWithSelector(
      devtools(
        immer((set) => ({
          ...initialState,
          
          // Value actions
          updateValue: (value) => 
            set((state) => {
              if (state.reactPage.values.present !== value) {
                // Add current value to past for undo
                state.reactPage.values.past.push(state.reactPage.values.present!);
                // Clear future when a new action is performed
                state.reactPage.values.future = [];
                // Set the new value
                state.reactPage.values.present = value;
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