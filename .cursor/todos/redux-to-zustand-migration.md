# [Refactor] Migration from Redux to Zustand

## Description
This todo file outlines the steps required to migrate the state management in React-Page editor from Redux to Zustand. The migration will involve replacing the current Redux implementation with the more modern and lightweight Zustand library, which offers improved performance, simpler API, and better TypeScript support.

- This task involves identifying all Redux usage in the codebase
- Creating equivalent implementations using Zustand
- Ensuring all current functionality is preserved
- Testing the migration thoroughly
- Updating documentation to reflect the changes

## Memory Section Guidelines
- ALWAYS maintain the Memory section in each todo file
- UPDATE the Memory section when:
  - Making significant implementation decisions
  - Overcoming technical challenges
  - Discovering future considerations
  - Gaining new technical insights
  - Adding or modifying dependencies
- ENSURE the Memory section:
  - Provides clear context for future development
  - Documents rationale behind decisions
  - Tracks evolution of implementation
  - Records lessons learned
  - Notes potential improvements
- USE the Memory section to:
  - Aid in knowledge transfer
  - Support maintenance decisions
  - Guide future enhancements
  - Prevent repeated mistakes
  - Maintain implementation context

## Memory Section
- The current implementation uses Redux for state management
- Redux is used for managing editor state, including cell data, layout, and UI state
- The store is created in `packages/editor/src/core/store.ts`
- The EditorStore class in `packages/editor/src/core/EditorStore.ts` wraps the Redux store
- Redux middleware is used for side effects, particularly thunk for async actions
- Redux-undo is used for undo/redo functionality
- The state is structured with a root reducer in `packages/editor/src/core/reducer/index.ts`
- Actions are defined in `packages/editor/src/core/actions/` directory
- Selectors are used to access state in `packages/editor/src/core/selector/` directory
- Components connect to the store via the `useSelector` and `useDispatch` hooks from react-redux
- Zustand offers a simpler API with less boilerplate
- Zustand has built-in support for middleware, including for devtools and persistence
- Zustand's API is more aligned with modern React practices (hooks-based)
- The migration will need to preserve the current state structure for backward compatibility
- Undo/redo functionality will need to be reimplemented using Zustand middleware
- Zustand implementation has been created in `packages/editor/src/core/zustand/` directory
- The Zustand store structure mirrors the Redux state structure for compatibility
- Undo/redo functionality has been implemented using Zustand's immer middleware
- Custom hooks have been created to replace Redux hooks for a smoother transition
- The EditorStore class has been adapted to work with Zustand instead of Redux
- The EditorStoreProvider component has been created to provide the Zustand store to the application
- All components have been updated to use Zustand hooks instead of Redux hooks
- Complex hooks like nodeActions.ts and dragDropActions.ts have been updated to use Zustand actions
- We initially implemented a Redux-like selector pattern with Zustand, which doesn't take full advantage of Zustand's simplicity
- We need to refactor to use Zustand's direct store access capabilities instead of selectors
- We need to fix type errors and inconsistencies in the codebase
- We need to complete the migration by removing all Redux dependencies and updating all components
- Zustand's direct access model is more efficient and simpler than Redux's selector pattern
- The current implementation has created selector files that mimic Redux patterns, which adds unnecessary complexity
- We should leverage Zustand's ability to directly access and update state without selectors or action creators
- Type errors in files like dragDropActions.ts and nodeActions.ts need to be fixed to complete the migration
- The Focus type has been updated to use nodeIds instead of nodeId, which requires updates in components
- The DisplayModes type has been updated to include a referenceNodeId property, which requires updates in components
- We should create custom hooks that encapsulate both state access and state updates for a cleaner API

## Active
- [x] Analyze current Redux implementation
  - [x] Map out the current state structure
  - [x] Identify all actions and their effects
  - [x] Document the current middleware usage
  - [x] Understand how the EditorStore class interacts with Redux

- [x] Set up Zustand
  - [x] Add Zustand as a dependency
  - [x] Create a basic store structure
  - [x] Implement devtools middleware for debugging
  - [x] Create a plan for migrating the state structure

- [x] Migrate core state management
  - [x] Create a new store.ts file using Zustand
  - [x] Implement the state structure to match the current Redux state
  - [x] Create actions as store methods
  - [x] Implement middleware for side effects

- [x] Migrate EditorStore class
  - [x] Update EditorStore to use Zustand instead of Redux
  - [x] Ensure backward compatibility with existing API
  - [x] Update the context provider to use the new store

- [x] Implement undo/redo functionality
  - [x] Research Zustand middleware for undo/redo
  - [x] Implement custom middleware if needed
  - [x] Ensure it works with the current undo/redo actions

- [ ] Update components
  - [x] Create custom hooks to replace useSelector and useDispatch
  - [x] Update basic hooks to use Zustand hooks
  - [x] Fix type errors in Focus type (nodeId to nodeIds)
  - [x] Update store tests to use correct types
  - [ ] Update complex hooks to use Zustand actions
  - [ ] Ensure all components receive the correct state and actions
  - [ ] Refactor to use Zustand's direct access model instead of selectors
  - [ ] Fix remaining type errors in dragDropActions.ts and nodeActions.ts
  - [ ] Update components to use the new Focus and DisplayModes types

- [ ] Test the migration
  - [x] Create unit tests for the new store
    - [x] Test store initialization with default values
    - [x] Test store initialization with custom values
    - [x] Test store subscription and updates
  - [ ] Test all actions and state changes
    - [x] Test value actions (updateValue)
    - [x] Test undo/redo actions
    - [x] Test setting actions (setLang)
    - [x] Test display actions (setDisplayMode, setDisplayZoom)
    - [x] Test focus actions (setFocus)
    - [x] Test hover actions (setHover)
  - [ ] Ensure undo/redo functionality works correctly
    - [ ] Test undo after multiple changes
    - [ ] Test redo after multiple undos
    - [ ] Test that future history is cleared when a new action is performed after undos
  - [ ] Test performance improvements
    - [ ] Compare render times between Redux and Zustand implementations
    - [ ] Compare bundle size between Redux and Zustand implementations
    - [ ] Compare memory usage between Redux and Zustand implementations

## Pending
- [ ] Update documentation
  - [ ] Update API documentation to reflect the new implementation
    - [ ] Document the new store structure
    - [ ] Document the new hooks
    - [ ] Document the migration from Redux to Zustand
  - [ ] Create migration guides for plugin developers
    - [ ] Guide for updating plugins to use Zustand hooks
    - [ ] Guide for accessing state in plugins
  - [ ] Document the new state management approach
    - [ ] Overview of the Zustand implementation
    - [ ] Comparison with the previous Redux implementation
    - [ ] Best practices for working with the new implementation

- [ ] Clean up
  - [ ] Remove Redux dependencies
    - [ ] Remove redux package
    - [ ] Remove react-redux package
    - [ ] Remove redux-thunk package
    - [ ] Remove redux-undo package
  - [ ] Remove unused code
    - [ ] Remove Redux actions
    - [ ] Remove Redux reducers
    - [ ] Remove Redux selectors
    - [ ] Remove Redux middleware
  - [ ] Optimize bundle size
    - [ ] Analyze bundle size before and after cleanup
    - [ ] Identify and remove any remaining unused code
    - [ ] Ensure tree-shaking is working correctly

## Completed
- [x] Initial research on Zustand vs Redux
- [x] Decision to migrate to Zustand for improved developer experience and performance 