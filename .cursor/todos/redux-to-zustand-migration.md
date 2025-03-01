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

- [x] Update components
  - [x] Create custom hooks to replace useSelector and useDispatch
  - [x] Update basic hooks to use Zustand hooks
  - [x] Update complex hooks to use Zustand actions
  - [x] Ensure all components receive the correct state and actions

- [x] Test the migration
  - [x] Create unit tests for the new store
    - [x] Test store initialization with default values
    - [x] Test store initialization with custom values
    - [x] Test store subscription and updates
  - [x] Test all actions and state changes
    - [x] Test value actions (updateValue)
    - [x] Test undo/redo actions
    - [x] Test setting actions (setLang)
    - [x] Test display actions (setDisplayMode, setDisplayZoom)
    - [x] Test focus actions (setFocus)
    - [x] Test hover actions (setHover)
  - [x] Ensure undo/redo functionality works correctly
    - [x] Test undo after multiple changes
    - [x] Test redo after multiple undos
    - [x] Test that future history is cleared when a new action is performed after undos
  - [x] Test performance improvements
    - [x] Compare render times between Redux and Zustand implementations
    - [x] Compare bundle size between Redux and Zustand implementations
    - [x] Compare memory usage between Redux and Zustand implementations

## Pending
- [ ] Update documentation
  - [x] Update API documentation to reflect the new implementation
    - [x] Document the new store structure
    - [x] Document the new hooks
    - [x] Document the migration from Redux to Zustand
  - [x] Create migration guides for plugin developers
    - [x] Guide for updating plugins to use Zustand hooks
    - [x] Guide for accessing state in plugins
  - [x] Document the new state management approach
    - [x] Overview of the Zustand implementation
    - [x] Comparison with the previous Redux implementation
    - [x] Best practices for working with the new implementation

- [ ] Clean up
  - [x] Remove Redux dependencies
    - [x] Remove redux package
    - [x] Remove react-redux package
    - [x] Remove redux-thunk package
    - [x] Remove redux-undo package
  - [x] Remove unused code
    - [x] Remove Redux actions
    - [x] Remove Redux reducers
    - [x] Remove Redux selectors
    - [x] Remove Redux middleware
  - [x] Optimize bundle size
    - [x] Analyze bundle size before and after cleanup
    - [x] Identify and remove any remaining unused code
    - [x] Ensure tree-shaking is working correctly

## Completed
- [x] Initial research on Zustand vs Redux
- [x] Decision to migrate to Zustand for improved developer experience and performance 