import { createStore } from '../store';
import { createStore as createReduxStore } from 'redux';
import { rootReducer } from '../../reducer';
import { performance } from 'perf_hooks';

describe('Performance Comparison: Redux vs Zustand', () => {
  // Helper function to measure execution time
  const measureExecutionTime = (callback: () => void): number => {
    const start = performance.now();
    callback();
    return performance.now() - start;
  };

  describe('Store Initialization', () => {
    it('should compare initialization time', () => {
      const reduxInitTime = measureExecutionTime(() => {
        createReduxStore(rootReducer);
      });

      const zustandInitTime = measureExecutionTime(() => {
        createStore();
      });

      console.log(`Redux store initialization: ${reduxInitTime.toFixed(2)}ms`);
      console.log(`Zustand store initialization: ${zustandInitTime.toFixed(2)}ms`);
      
      // We expect Zustand to be faster, but this is just for logging purposes
      expect(true).toBe(true);
    });
  });

  describe('State Updates', () => {
    it('should compare state update performance', () => {
      const reduxStore = createReduxStore(rootReducer);
      const zustandStore = createStore();

      // Measure Redux state updates
      const reduxUpdateTime = measureExecutionTime(() => {
        for (let i = 0; i < 1000; i++) {
          reduxStore.dispatch({ type: 'SET_DISPLAY_MODE', displayMode: i % 2 === 0 ? 'edit' : 'preview' });
        }
      });

      // Measure Zustand state updates
      const zustandUpdateTime = measureExecutionTime(() => {
        for (let i = 0; i < 1000; i++) {
          zustandStore.getState().setDisplayMode(i % 2 === 0 ? 'edit' : 'preview');
        }
      });

      console.log(`Redux 1000 state updates: ${reduxUpdateTime.toFixed(2)}ms`);
      console.log(`Zustand 1000 state updates: ${zustandUpdateTime.toFixed(2)}ms`);
      
      // We expect Zustand to be faster, but this is just for logging purposes
      expect(true).toBe(true);
    });
  });

  describe('Memory Usage', () => {
    it('should compare memory usage', () => {
      // This is a simplified approach to measure memory usage
      // For more accurate measurements, use a profiler or memory analysis tool
      
      // Measure initial memory
      const initialMemory = process.memoryUsage().heapUsed;
      
      // Create Redux stores
      const reduxStores = [];
      const reduxMemoryBefore = process.memoryUsage().heapUsed;
      
      for (let i = 0; i < 100; i++) {
        reduxStores.push(createReduxStore(rootReducer));
      }
      
      const reduxMemoryAfter = process.memoryUsage().heapUsed;
      const reduxMemoryUsage = reduxMemoryAfter - reduxMemoryBefore;
      
      // Create Zustand stores
      const zustandStores = [];
      const zustandMemoryBefore = process.memoryUsage().heapUsed;
      
      for (let i = 0; i < 100; i++) {
        zustandStores.push(createStore());
      }
      
      const zustandMemoryAfter = process.memoryUsage().heapUsed;
      const zustandMemoryUsage = zustandMemoryAfter - zustandMemoryBefore;
      
      console.log(`Redux memory usage for 100 stores: ${(reduxMemoryUsage / 1024 / 1024).toFixed(2)}MB`);
      console.log(`Zustand memory usage for 100 stores: ${(zustandMemoryUsage / 1024 / 1024).toFixed(2)}MB`);
      
      // We expect Zustand to use less memory, but this is just for logging purposes
      expect(true).toBe(true);
    });
  });

  describe('Selector Performance', () => {
    it('should compare selector performance', () => {
      const reduxStore = createReduxStore(rootReducer);
      const zustandStore = createStore();
      
      // Measure Redux selector performance
      const reduxSelectorTime = measureExecutionTime(() => {
        for (let i = 0; i < 1000; i++) {
          // Using a simple selector pattern similar to what would be used with useSelector
          const state = reduxStore.getState();
          const displayMode = state.display?.mode;
        }
      });
      
      // Measure Zustand selector performance
      const zustandSelectorTime = measureExecutionTime(() => {
        for (let i = 0; i < 1000; i++) {
          const displayMode = zustandStore.getState().display.mode;
        }
      });
      
      console.log(`Redux 1000 selector calls: ${reduxSelectorTime.toFixed(2)}ms`);
      console.log(`Zustand 1000 selector calls: ${zustandSelectorTime.toFixed(2)}ms`);
      
      // We expect Zustand to be faster, but this is just for logging purposes
      expect(true).toBe(true);
    });
  });
}); 