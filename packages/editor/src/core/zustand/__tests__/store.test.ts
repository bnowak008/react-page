import { createZustandStore, createInitialState } from '../store';
import type { Value } from '../../types/node';
import { PositionEnum } from '../../const';
import type { DisplayModes } from '../../types/display';

describe('Zustand Store', () => {
  // Test store initialization
  describe('Store Initialization', () => {
    it('should initialize with default values', () => {
      const initialValue: Value = {
        id: 'test-id',
        rows: [],
        version: 1,
      };

      const initialState = createInitialState(initialValue, 'en');
      const store = createZustandStore(initialState);
      const state = store.getState();

      expect(state.reactPage.values.present).toEqual(initialValue);
      expect(state.reactPage.values.past).toEqual([]);
      expect(state.reactPage.values.future).toEqual([]);
      expect(state.reactPage.settings.lang).toEqual('en');
      expect(state.reactPage.display.mode).toEqual('edit');
      expect(state.reactPage.display.zoom).toEqual(1);
      expect(state.reactPage.focus).toBeNull();
      expect(state.reactPage.hover).toBeNull();
    });

    it('should initialize with custom values', () => {
      const initialValue: Value = {
        id: 'custom-id',
        rows: [{ id: 'row-1', cells: [{ id: 'cell-1' }] }],
        version: 2,
      };

      const initialState = createInitialState(initialValue, 'de');
      initialState.reactPage.display.mode = 'preview';
      initialState.reactPage.display.zoom = 0.5;

      const store = createZustandStore(initialState);
      const state = store.getState();

      expect(state.reactPage.values.present).toEqual(initialValue);
      expect(state.reactPage.settings.lang).toEqual('de');
      expect(state.reactPage.display.mode).toEqual('preview');
      expect(state.reactPage.display.zoom).toEqual(0.5);
    });
  });

  // Test actions
  describe('Actions', () => {
    let store: ReturnType<typeof createZustandStore>;

    beforeEach(() => {
      const initialValue: Value = {
        id: 'test-id',
        rows: [],
        version: 1,
      };

      const initialState = createInitialState(initialValue, 'en');
      store = createZustandStore(initialState);
    });

    // Test updateValue action
    it('should update value', () => {
      const newValue: Value = {
        id: 'new-id',
        rows: [{ id: 'row-1', cells: [{ id: 'cell-1' }] }],
        version: 1,
      };

      store.getState().updateValue(newValue);

      const state = store.getState();
      expect(state.reactPage.values.present).toEqual(newValue);
      expect(state.reactPage.values.past).toHaveLength(1);
      expect(state.reactPage.values.future).toHaveLength(0);
    });

    // Test undo/redo actions
    it('should undo and redo changes', () => {
      const initialValue = store.getState().reactPage.values.present;

      const newValue1: Value = {
        id: 'new-id-1',
        rows: [{ id: 'row-1', cells: [{ id: 'cell-1' }] }],
        version: 1,
      };

      const newValue2: Value = {
        id: 'new-id-2',
        rows: [{ id: 'row-2', cells: [{ id: 'cell-2' }] }],
        version: 1,
      };

      // Make two changes
      store.getState().updateValue(newValue1);
      store.getState().updateValue(newValue2);

      // Verify current state
      expect(store.getState().reactPage.values.present).toEqual(newValue2);
      expect(store.getState().reactPage.values.past).toHaveLength(2);

      // Undo once
      store.getState().undo();
      expect(store.getState().reactPage.values.present).toEqual(newValue1);
      expect(store.getState().reactPage.values.past).toHaveLength(1);
      expect(store.getState().reactPage.values.future).toHaveLength(1);

      // Undo again
      store.getState().undo();
      expect(store.getState().reactPage.values.present).toEqual(initialValue);
      expect(store.getState().reactPage.values.past).toHaveLength(0);
      expect(store.getState().reactPage.values.future).toHaveLength(2);

      // Redo once
      store.getState().redo();
      expect(store.getState().reactPage.values.present).toEqual(newValue1);
      expect(store.getState().reactPage.values.past).toHaveLength(1);
      expect(store.getState().reactPage.values.future).toHaveLength(1);

      // Redo again
      store.getState().redo();
      expect(store.getState().reactPage.values.present).toEqual(newValue2);
      expect(store.getState().reactPage.values.past).toHaveLength(2);
      expect(store.getState().reactPage.values.future).toHaveLength(0);
    });

    // Test that future history is cleared when a new action is performed after undos
    it('should clear future history when a new action is performed after undos', () => {
      const initialValue = store.getState().reactPage.values.present;

      const newValue1: Value = {
        id: 'new-id-1',
        rows: [{ id: 'row-1', cells: [{ id: 'cell-1' }] }],
        version: 1,
      };

      const newValue2: Value = {
        id: 'new-id-2',
        rows: [{ id: 'row-2', cells: [{ id: 'cell-2' }] }],
        version: 1,
      };

      const newValue3: Value = {
        id: 'new-id-3',
        rows: [{ id: 'row-3', cells: [{ id: 'cell-3' }] }],
        version: 1,
      };

      // Make two changes
      store.getState().updateValue(newValue1);
      store.getState().updateValue(newValue2);

      // Undo once
      store.getState().undo();
      expect(store.getState().reactPage.values.present).toEqual(newValue1);
      expect(store.getState().reactPage.values.future).toHaveLength(1);

      // Make a new change
      store.getState().updateValue(newValue3);

      // Verify that future history is cleared
      expect(store.getState().reactPage.values.present).toEqual(newValue3);
      expect(store.getState().reactPage.values.past).toHaveLength(2);
      expect(store.getState().reactPage.values.future).toHaveLength(0);
    });

    // Test setting actions
    it('should set language', () => {
      store.getState().setLang('fr');
      expect(store.getState().reactPage.settings.lang).toEqual('fr');
    });

    // Test display actions
    it('should set display mode', () => {
      store.getState().setDisplayMode('preview');
      expect(store.getState().reactPage.display.mode).toEqual('preview');
    });

    it('should set display zoom', () => {
      store.getState().setDisplayZoom(0.5);
      expect(store.getState().reactPage.display.zoom).toEqual(0.5);
    });

    it('should set display reference node ID', () => {
      store.getState().setDisplayReferenceNodeId('test-id');
      expect(store.getState().reactPage.display.referenceNodeId).toEqual(
        'test-id'
      );
    });

    // Test focus actions
    it('should set focus', () => {
      const focus = { nodeIds: ['test-id'], scrollToCell: true, mode: null };
      store.getState().setFocus(focus);
      expect(store.getState().reactPage.focus).toEqual(focus);
    });

    // Test hover actions
    it('should set hover', () => {
      const hover = { nodeId: 'test-id', position: PositionEnum.ABOVE };
      store.getState().setHover(hover);
      expect(store.getState().reactPage.hover).toEqual(hover);
    });
  });

  // Test store subscription
  describe('Store Subscription', () => {
    it('should notify subscribers when state changes', () => {
      const initialValue: Value = {
        id: 'test-id',
        rows: [],
        version: 1,
      };

      const initialState = createInitialState(initialValue, 'en');
      const store = createZustandStore(initialState);

      const listener = jest.fn();
      const unsubscribe = store.subscribe(listener);

      // Update state
      store.getState().setLang('fr');

      // Verify that listener was called
      expect(listener).toHaveBeenCalledTimes(1);

      // Unsubscribe and update state again
      unsubscribe();
      store.getState().setLang('de');

      // Verify that listener was not called again
      expect(listener).toHaveBeenCalledTimes(1);
    });
  });
});
