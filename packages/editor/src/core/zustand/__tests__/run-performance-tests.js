#!/usr/bin/env node

/**
 * This script runs the performance tests and generates a report
 * comparing Redux and Zustand implementations.
 *
 * Usage: node run-performance-tests.js
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Configuration
const TEST_FILE = path.join(__dirname, 'performance.test.ts');
const REPORT_FILE = path.join(__dirname, 'performance-report.md');
const TEST_RUNS = 5; // Number of times to run the tests for averaging

console.log('Running performance tests...');

// Run the tests multiple times to get an average
const results = {
  reduxInit: [],
  zustandInit: [],
  reduxUpdates: [],
  zustandUpdates: [],
  reduxMemory: [],
  zustandMemory: [],
  reduxSelector: [],
  zustandSelector: [],
};

// Function to extract numbers from console output
function extractNumbers(output) {
  const reduxInit = parseFloat(
    output.match(/Redux store initialization: (\d+\.\d+)ms/)?.[1] || '0'
  );
  const zustandInit = parseFloat(
    output.match(/Zustand store initialization: (\d+\.\d+)ms/)?.[1] || '0'
  );
  const reduxUpdates = parseFloat(
    output.match(/Redux 1000 state updates: (\d+\.\d+)ms/)?.[1] || '0'
  );
  const zustandUpdates = parseFloat(
    output.match(/Zustand 1000 state updates: (\d+\.\d+)ms/)?.[1] || '0'
  );
  const reduxMemory = parseFloat(
    output.match(/Redux memory usage for 100 stores: (\d+\.\d+)MB/)?.[1] || '0'
  );
  const zustandMemory = parseFloat(
    output.match(/Zustand memory usage for 100 stores: (\d+\.\d+)MB/)?.[1] ||
      '0'
  );
  const reduxSelector = parseFloat(
    output.match(/Redux 1000 selector calls: (\d+\.\d+)ms/)?.[1] || '0'
  );
  const zustandSelector = parseFloat(
    output.match(/Zustand 1000 selector calls: (\d+\.\d+)ms/)?.[1] || '0'
  );

  return {
    reduxInit,
    zustandInit,
    reduxUpdates,
    zustandUpdates,
    reduxMemory,
    zustandMemory,
    reduxSelector,
    zustandSelector,
  };
}

// Run the tests multiple times
for (let i = 0; i < TEST_RUNS; i++) {
  console.log(`Run ${i + 1}/${TEST_RUNS}...`);
  try {
    const output = execSync(`npx jest ${TEST_FILE} --no-cache`, {
      encoding: 'utf8',
    });
    const numbers = extractNumbers(output);

    results.reduxInit.push(numbers.reduxInit);
    results.zustandInit.push(numbers.zustandInit);
    results.reduxUpdates.push(numbers.reduxUpdates);
    results.zustandUpdates.push(numbers.zustandUpdates);
    results.reduxMemory.push(numbers.reduxMemory);
    results.zustandMemory.push(numbers.zustandMemory);
    results.reduxSelector.push(numbers.reduxSelector);
    results.zustandSelector.push(numbers.zustandSelector);
  } catch (error) {
    console.error('Error running tests:', error.message);
  }
}

// Calculate averages
function calculateAverage(arr) {
  return arr.reduce((a, b) => a + b, 0) / arr.length;
}

const averages = {
  reduxInit: calculateAverage(results.reduxInit),
  zustandInit: calculateAverage(results.zustandInit),
  reduxUpdates: calculateAverage(results.reduxUpdates),
  zustandUpdates: calculateAverage(results.zustandUpdates),
  reduxMemory: calculateAverage(results.reduxMemory),
  zustandMemory: calculateAverage(results.zustandMemory),
  reduxSelector: calculateAverage(results.reduxSelector),
  zustandSelector: calculateAverage(results.zustandSelector),
};

// Calculate improvements
const improvements = {
  init:
    ((averages.reduxInit - averages.zustandInit) / averages.reduxInit) * 100,
  updates:
    ((averages.reduxUpdates - averages.zustandUpdates) /
      averages.reduxUpdates) *
    100,
  memory:
    ((averages.reduxMemory - averages.zustandMemory) / averages.reduxMemory) *
    100,
  selector:
    ((averages.reduxSelector - averages.zustandSelector) /
      averages.reduxSelector) *
    100,
};

// Generate report
const report = `# Redux to Zustand Migration Performance Report

This report compares the performance of Redux and Zustand implementations based on ${TEST_RUNS} test runs.

## Summary

| Metric | Redux | Zustand | Improvement |
|--------|-------|---------|-------------|
| Store Initialization | ${averages.reduxInit.toFixed(
  2
)}ms | ${averages.zustandInit.toFixed(2)}ms | ${improvements.init.toFixed(2)}% |
| 1000 State Updates | ${averages.reduxUpdates.toFixed(
  2
)}ms | ${averages.zustandUpdates.toFixed(2)}ms | ${improvements.updates.toFixed(
  2
)}% |
| Memory Usage (100 stores) | ${averages.reduxMemory.toFixed(
  2
)}MB | ${averages.zustandMemory.toFixed(2)}MB | ${improvements.memory.toFixed(
  2
)}% |
| 1000 Selector Calls | ${averages.reduxSelector.toFixed(
  2
)}ms | ${averages.zustandSelector.toFixed(
  2
)}ms | ${improvements.selector.toFixed(2)}% |

## Analysis

### Store Initialization
Zustand store initialization is ${
  improvements.init > 0 ? 'faster' : 'slower'
} by ${Math.abs(improvements.init).toFixed(2)}% compared to Redux.

### State Updates
Zustand state updates are ${
  improvements.updates > 0 ? 'faster' : 'slower'
} by ${Math.abs(improvements.updates).toFixed(
  2
)}% compared to Redux for 1000 updates.

### Memory Usage
Zustand uses ${improvements.memory > 0 ? 'less' : 'more'} memory by ${Math.abs(
  improvements.memory
).toFixed(2)}% compared to Redux for 100 stores.

### Selector Performance
Zustand selectors are ${
  improvements.selector > 0 ? 'faster' : 'slower'
} by ${Math.abs(improvements.selector).toFixed(
  2
)}% compared to Redux for 1000 selector calls.

## Conclusion

${
  improvements.init > 0 &&
  improvements.updates > 0 &&
  improvements.memory > 0 &&
  improvements.selector > 0
    ? 'The migration from Redux to Zustand has resulted in performance improvements across all measured metrics. This confirms that the migration was successful in terms of performance optimization.'
    : 'The migration from Redux to Zustand has shown mixed results in terms of performance. Further optimization may be needed in some areas.'
}

*Report generated on ${new Date().toISOString()}*
`;

// Write report to file
fs.writeFileSync(REPORT_FILE, report);

console.log(`Performance tests completed. Report saved to ${REPORT_FILE}`);
