# Redux to Zustand Migration Summary

## Overview

We are in the process of migrating from Redux to Zustand for state management in the React-Page editor. This document summarizes the current state of the migration, the changes made so far, and the plan for completing the migration.

## Current Status

We have made significant progress in migrating from Redux to Zustand, but the migration is not yet complete. Here's our current status:

### Completed
- Created Zustand store structure in `packages/editor/src/core/zustand/store.ts`
- Implemented EditorStore class in `packages/editor/src/core/zustand/EditorStore.ts` that wraps the Zustand store
- Created EditorStoreProvider component in `packages/editor/src/core/zustand/EditorStoreProvider.tsx`
- Implemented basic hooks in `packages/editor/src/core/zustand/hooks.ts` for accessing the store
- Updated type definitions for core types like `Focus`, `FocusMode`, and `DisplayModes`
- Created selector files for accessing state (though these will be refactored)
- Implemented initial integration with some components
- Fixed type errors related to the Focus type (updated from nodeId to nodeIds)
- Updated store tests to use the correct types

### In Progress
- Refactoring to use Zustand's direct store access capabilities instead of Redux-like selectors
- Updating components to use Zustand hooks
- Testing the migration to ensure all functionality works correctly

### Challenges Identified
- We initially implemented a Redux-like selector pattern with Zustand, which doesn't take full advantage of Zustand's simplicity
- There are still some type errors in the codebase related to updated type definitions
- Some components still expect Redux behavior
- The build process is failing due to type errors and missing implementations

## Migration Plan

To complete the migration, we need to:

### 1. Embrace Zustand's Direct Access Model

Instead of creating separate selector files that mimic Redux patterns, we should leverage Zustand's direct store access capabilities:

```typescript
// INSTEAD OF:
// selector/focus.ts
export const allFocusedNodeIds = (state: RootState) => state.reactPage.focus?.nodeIds ?? [];

// Component usage
const nodeIds = useSelector(allFocusedNodeIds);

// WE SHOULD USE:
// hooks.ts
export const useAllFocusedNodeIds = () => useStore(state => state.reactPage.focus?.nodeIds ?? []);

// Component usage
const nodeIds = useAllFocusedNodeIds();
```

### 2. Simplify State Updates

Instead of action creators and reducers, we should use Zustand's direct state updates:

```typescript
// INSTEAD OF:
// actions/focus.ts
export const focusCell = (nodeId, scrollToCell, mode) => ({ type: 'FOCUS_CELL', payload: { nodeId, scrollToCell, mode } });

// Component usage
const dispatch = useDispatch();
dispatch(focusCell(id, true, 'replace'));

// WE SHOULD USE:
// hooks.ts
export const useFocusCell = () => {
  const setState = useStore(state => state.setState);
  return (nodeId, scrollToCell = false, mode = 'replace') => {
    setState(state => ({
      ...state,
      reactPage: {
        ...state.reactPage,
        focus: {
          ...state.reactPage.focus,
          nodeIds: nodeId ? [nodeId] : [],
          scrollToCell,
          mode,
        }
      }
    }));
  };
};

// Component usage
const focusCell = useFocusCell();
focusCell(id, true, 'replace');
```

### 3. Fix Remaining Type Definitions

We've made progress on fixing type definitions, but there are still some issues to address:

- ✅ Updated `Focus` type to use `nodeIds` instead of `nodeId` in the store
- ✅ Updated components that use the `Focus` type to use the new structure
- ✅ Fixed type errors in the store tests
- Continue to update any other components that rely on the updated types
- Ensure `DisplayModes` type is consistently used with its new structure

### 4. Complete Component Updates

- Update all components to use Zustand hooks
- Remove all Redux dependencies
- Ensure all tests pass with the new implementation
- Update documentation to reflect the new state management approach

## Benefits of Zustand

Zustand offers several benefits over Redux:

- **Simpler API**: Zustand provides a simpler API with less boilerplate
- **Direct Store Access**: Zustand allows direct access to the store state without selectors
- **Better TypeScript Support**: Zustand has excellent TypeScript support out of the box
- **Smaller Bundle Size**: Zustand is much smaller than Redux + React-Redux + Redux-Thunk
- **Middleware Support**: Zustand has built-in support for middleware, including for devtools and persistence
- **Hooks-Based API**: Zustand's API is more aligned with modern React practices

## Next Steps

Our immediate next steps are:

1. **Refactor Hooks**: Continue updating our hooks to use Zustand's direct access model
2. **Fix Remaining Type Errors**: Resolve any remaining type errors in the codebase
3. **Update Components**: Ensure all components use the new Zustand hooks
4. **Test**: Thoroughly test all functionality to ensure it works correctly
5. **Clean Up**: Remove all Redux dependencies and unused code
6. **Document**: Update documentation to reflect the new state management approach

## Conclusion

The migration from Redux to Zustand is well underway and we've made significant progress. We've fixed several type errors and updated key components to use the new Zustand store. By continuing to embrace Zustand's direct access model and simplifying our state management approach, we can create a more maintainable and efficient codebase. The remaining work involves refactoring our approach to fully leverage Zustand's capabilities, fixing any remaining type errors, and ensuring all components work correctly with the new implementation. 