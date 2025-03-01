# Redux to Zustand Migration Guide

This document provides an overview of the migration from Redux to Zustand for state management in the React-Page editor.

## Table of Contents

1. [Introduction](#introduction)
2. [Store Structure](#store-structure)
3. [Hooks](#hooks)
4. [Migration Guide for Plugin Developers](#migration-guide-for-plugin-developers)
5. [Performance Improvements](#performance-improvements)
6. [Best Practices](#best-practices)

## Introduction

We have migrated our state management from Redux to Zustand to improve performance, simplify our codebase, and provide a better developer experience. This document outlines the changes made and provides guidance for working with the new implementation.

### Why Zustand?

- **Simpler API**: Zustand provides a simpler API compared to Redux, reducing boilerplate code.
- **Better TypeScript support**: Zustand has excellent TypeScript support out of the box.
- **Performance improvements**: Zustand is more performant than Redux, especially for frequent state updates.
- **Smaller bundle size**: Zustand is much smaller than Redux, reducing the overall bundle size.
- **No need for middleware**: Zustand doesn't require middleware for async actions, simplifying the codebase.

## Store Structure

The new Zustand store is structured as follows:

```typescript
interface EditorState {
  // Core state
  value: Value;
  lang: string;
  
  // Display state
  display: {
    mode: DisplayMode;
    zoom: number;
  };
  
  // Focus state
  focus: {
    nodeId: string | null;
    scrollToCell: boolean;
  };
  
  // Hover state
  hover: {
    nodeId: string | null;
  };
  
  // History state
  history: {
    past: EditorState[];
    future: EditorState[];
  };
  
  // Actions
  updateValue: (value: Value) => void;
  setLang: (lang: string) => void;
  setDisplayMode: (mode: DisplayMode) => void;
  setDisplayZoom: (zoom: number) => void;
  setFocus: (nodeId: string | null, scrollToCell?: boolean) => void;
  setHover: (nodeId: string | null) => void;
  undo: () => void;
  redo: () => void;
}
```

The store combines state and actions in a single object, making it easier to access and update state.

## Hooks

We have created custom hooks to replace the Redux hooks (`useSelector` and `useDispatch`). These hooks provide a simpler API and better TypeScript support.

### Basic Hooks

- `useStore`: Access the entire store
- `useValue`: Access the current value
- `useLang`: Access the current language
- `useDisplayMode`: Access the current display mode
- `useDisplayZoom`: Access the current zoom level
- `useFocus`: Access the current focus state
- `useHover`: Access the current hover state

### Action Hooks

- `useUpdateValue`: Update the current value
- `useSetLang`: Set the current language
- `useSetDisplayMode`: Set the current display mode
- `useSetDisplayZoom`: Set the current zoom level
- `useSetFocus`: Set the current focus
- `useSetHover`: Set the current hover
- `useUndo`: Undo the last action
- `useRedo`: Redo the last undone action

### Complex Hooks

- `useNodeActions`: Provides actions for manipulating nodes
- `useDragDropActions`: Provides actions for drag and drop operations
- `useValueNode`: Access a specific node in the value tree

## Migration Guide for Plugin Developers

If you're a plugin developer, you'll need to update your code to use the new Zustand hooks instead of Redux hooks.

### Replacing `useSelector`

Replace `useSelector` with the appropriate Zustand hook:

```typescript
// Before
import { useSelector } from 'react-redux';
const value = useSelector((state) => state.value);

// After
import { useValue } from '@react-page/editor';
const value = useValue();
```

### Replacing `useDispatch`

Replace `useDispatch` with the appropriate Zustand action hook:

```typescript
// Before
import { useDispatch } from 'react-redux';
import { updateValue } from '@react-page/editor';
const dispatch = useDispatch();
const handleUpdate = (value) => dispatch(updateValue(value));

// After
import { useUpdateValue } from '@react-page/editor';
const updateValue = useUpdateValue();
const handleUpdate = (value) => updateValue(value);
```

### Accessing State in Plugins

To access state in plugins, use the appropriate Zustand hook:

```typescript
import { useValue, useLang, useDisplayMode } from '@react-page/editor';

const MyPlugin = () => {
  const value = useValue();
  const lang = useLang();
  const displayMode = useDisplayMode();
  
  // Use the state
  return (
    <div>
      <p>Current language: {lang}</p>
      <p>Display mode: {displayMode}</p>
    </div>
  );
};
```

## Performance Improvements

The migration from Redux to Zustand has resulted in significant performance improvements:

- **Faster store initialization**: Zustand store initialization is faster than Redux.
- **Faster state updates**: Zustand state updates are faster than Redux.
- **Lower memory usage**: Zustand uses less memory than Redux.
- **Faster selector calls**: Zustand selector calls are faster than Redux.

For detailed performance metrics, see the [performance report](../src/core/zustand/__tests__/performance-report.md).

## Best Practices

When working with the new Zustand implementation, follow these best practices:

- **Use the provided hooks**: Use the provided hooks instead of accessing the store directly.
- **Keep state updates simple**: Zustand makes it easy to update state, but keep your updates simple and focused.
- **Leverage TypeScript**: Use TypeScript to ensure type safety when working with the store.
- **Test your changes**: Write tests for your changes to ensure they work as expected.
- **Avoid direct store manipulation**: Use the provided actions to update state instead of manipulating the store directly.

## Conclusion

The migration from Redux to Zustand has simplified our codebase, improved performance, and provided a better developer experience. By following the guidelines in this document, you can ensure a smooth transition to the new state management approach. 