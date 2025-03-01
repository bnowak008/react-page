import React from 'react';
import { render } from '@testing-library/react';
import lazyLoad from './index';

// Mock component to be lazy loaded
const TestComponent = ({ text = 'Loaded Component' }: { text?: string }) => (
  <div data-testid="test-component">{text}</div>
);

// Create a lazy loaded version of the component
const LazyTestComponent = lazyLoad(() =>
  Promise.resolve({ default: TestComponent })
);

describe('lazyLoad', () => {
  it('should have the correct structure', () => {
    // Check that the component has the expected structure
    expect(typeof LazyTestComponent).toBe('function');
    expect(typeof LazyTestComponent.load).toBe('function');
  });

  it('should have a load method for preloading', async () => {
    // Call the load method to preload the component
    const loadPromise = LazyTestComponent.load();
    expect(loadPromise instanceof Promise).toBe(true);

    // The promise should resolve to an object
    const module = await loadPromise;
    expect(typeof module).toBe('object');
    expect(module).not.toBeNull();
  });
});
