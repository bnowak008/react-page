import { afterEach, beforeEach, expect, jest, test } from 'bun:test';
import { cleanup } from '@testing-library/react';
import * as matchers from '@testing-library/jest-dom/matchers';
import { Window } from 'happy-dom';

// Setup happy-dom
const window = new Window();
const document = window.document;

// Add to global
(global as any).window = window;
(global as any).document = document;
(global as any).navigator = window.navigator;
(global as any).Element = window.Element;
(global as any).HTMLElement = window.HTMLElement;
(global as any).HTMLDivElement = window.HTMLDivElement;
(global as any).HTMLSpanElement = window.HTMLSpanElement;
(global as any).HTMLButtonElement = window.HTMLButtonElement;
(global as any).HTMLImageElement = window.HTMLImageElement;
(global as any).HTMLVideoElement = window.HTMLVideoElement;
(global as any).HTMLIFrameElement = window.HTMLIFrameElement;
(global as any).HTMLAnchorElement = window.HTMLAnchorElement;
(global as any).SVGElement = window.SVGElement;
(global as any).customElements = window.customElements;
(global as any).Event = window.Event;
(global as any).CustomEvent = window.CustomEvent;
(global as any).getComputedStyle = window.getComputedStyle;

// Setup Jest compatibility
const mockRegistry = new Map<string, any>();

(global as any).jest = {
  ...jest,
  mock: (moduleName: string, factory?: () => any) => {
    const mock = factory?.() || {};
    mockRegistry.set(moduleName, mock);
    return mock;
  },
  requireActual: (moduleName: string) => {
    try {
      return require(moduleName);
    } catch (e) {
      return {};
    }
  },
  fn: jest.fn,
  clearAllMocks: jest.clearAllMocks,
  restoreAllMocks: jest.restoreAllMocks,
  setTimeout: jest.setTimeout,
  getMockFromRegistry: (moduleName: string) => mockRegistry.get(moduleName),
};

// Extend expect with jest-dom matchers
expect.extend(matchers);

// Setup and teardown
beforeEach(() => {
  mockRegistry.clear();
});

afterEach(() => {
  cleanup();
  mockRegistry.clear();
});
