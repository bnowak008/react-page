# [React 18 Support] Migration from react-dnd to @dnd-kit

## Description
This todo file outlines the steps required to migrate from react-dnd to @dnd-kit to achieve React 18 compatibility. The migration will involve replacing the current drag and drop implementation with the more modern @dnd-kit library, which is fully compatible with React 18 and offers improved performance and features.

Additionally, we need to migrate from react-draggable to @dnd-kit for resizable components to ensure full React 18 compatibility and a consistent drag and drop implementation across the codebase.

- This task involves identifying all react-dnd usage in the codebase
- Creating equivalent implementations using @dnd-kit
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
- react-dnd is currently used for drag and drop functionality in the editor
- @dnd-kit is a modern alternative that is fully compatible with React 18
- The migration will require changes to the DndProvider, draggable components, and droppable areas
- react-dnd uses a different API than @dnd-kit, so careful mapping of concepts is required
- The current implementation uses HTML5Backend for drag and drop, which will be replaced with @dnd-kit/core
- Custom hooks (useDndKitDrag and useDndKitDrop) were created to provide a similar API to react-dnd
- DragPreviewImage from react-dnd was replaced with DragOverlay from @dnd-kit
- The hover service was updated to work with @dnd-kit events instead of react-dnd's DropTargetMonitor
- List reordering functionality was updated to use @dnd-kit/sortable's SortableContext and useSortable
- The migration improves React 18 compatibility, performance, developer experience, and adds enhanced features
- Testing is required to ensure all functionality works as expected after the migration
- react-draggable was being used in ResizableRowCell.tsx for resizing functionality
- We created a useDndKitResize hook that mimics the react-draggable API but uses @dnd-kit under the hood
- The useDndKitResize hook handles position tracking, constraints, and grid snapping similar to react-draggable
- The ResizableRowCell component was updated to use the new useDndKitResize hook
- The react-draggable dependency was removed from package.json
- Fixed React 18 infinite loop warning by properly memoizing the result of useAllFocusedNodeIds
- Fixed incorrect hook usage in GlobalHotKeys component to be compatible with React 18's concurrent rendering

## Active
- [ ] Migrate from react-draggable to @dnd-kit
  - [x] Create a custom hook for resizable components (useDndKitResize) (2023-07-15)
  - [x] Update ResizableRowCell.tsx to use the new hook (2023-07-15)
  - [ ] Ensure resize functionality works the same as before
  - [ ] Test the implementation thoroughly
  - [x] Remove react-draggable dependency once migration is complete (2023-07-15)
- [ ] Fix React 18 compatibility issues
  - [x] Fix infinite loop warning in useAllFocusedNodeIds hook (2023-07-15)
  - [x] Fix incorrect hook usage in GlobalHotKeys component (2023-07-15)
  - [ ] Test with React 18's concurrent mode enabled
- [ ] Update tests to work with @dnd-kit
  - [ ] Update any tests that mock react-dnd functionality
  - [ ] Ensure all tests pass with the new implementation
- [ ] Update documentation
  - [ ] Update any documentation that references react-dnd
  - [ ] Add information about the new @dnd-kit implementation

## Pending
- [ ] Investigate performance improvements possible with @dnd-kit
  - [ ] Research @dnd-kit's performance characteristics
  - [ ] Identify areas where performance can be improved
  - [ ] Implement performance optimizations
- [ ] Explore additional features offered by @dnd-kit
  - [ ] Research @dnd-kit's additional features
  - [ ] Identify features that could enhance the editor
  - [ ] Plan implementation of new features
- [ ] Consider accessibility improvements
  - [ ] Research @dnd-kit's accessibility features
  - [ ] Identify areas where accessibility can be improved
  - [ ] Implement accessibility improvements

## Completed
- [x] Analyze current react-dnd usage in the codebase (2023-02-28)
- [x] Research @dnd-kit as a replacement for react-dnd (2023-02-28)
- [x] Create a detailed migration plan (2023-02-28)
- [x] Add @dnd-kit dependencies to the project (2023-06-10)
  - [x] Install @dnd-kit/core for basic drag and drop functionality
  - [x] Install @dnd-kit/sortable for sortable lists
  - [x] Install @dnd-kit/modifiers for additional modifiers
  - [x] Install @dnd-kit/utilities for helper functions
- [x] Create a new DndProvider implementation using @dnd-kit (2023-06-10)
  - [x] Create a new file at packages/editor/src/core/Provider/DndKitProvider.tsx
  - [x] Implement the DndContext from @dnd-kit/core
  - [x] Ensure it accepts the same props as the current DndProvider
  - [x] Update the defaultOptions.ts to use the new provider
- [x] Migrate the core drag and drop functionality (2023-06-10)
  - [x] Create custom hooks to replace useDrag and useDrop
  - [x] Implement a useDraggable hook that mimics the current useDrag API
  - [x] Implement a useDroppable hook that mimics the current useDrop API
  - [x] Create utility functions to convert between react-dnd and @dnd-kit concepts
- [x] Update the Draggable components (2023-06-10)
  - [x] Update packages/editor/src/ui/PluginDrawer/Draggable/index.tsx
  - [x] Update packages/editor/src/core/components/Cell/Draggable/useDragHandle.tsx
  - [x] Replace DragPreviewImage with @dnd-kit's DragOverlay
  - [x] Ensure drag preview images still work correctly
- [x] Update the Droppable components (2023-06-10)
  - [x] Update packages/editor/src/core/components/Cell/Droppable/index.tsx
  - [x] Update packages/editor/src/core/components/Cell/InsertNew.tsx
  - [x] Update packages/editor/src/core/components/Editable/FallbackDropArea.tsx
  - [x] Ensure drop zones work correctly with the new implementation
- [x] Update the hover service (2023-06-10)
  - [x] Modify packages/editor/src/core/service/hover/input.ts to work with @dnd-kit
  - [x] Update the computeCurrentDropPosition function to use @dnd-kit's positioning data
  - [x] Ensure hover detection works correctly with the new implementation
- [x] Update the list reordering functionality (2023-06-10)
  - [x] Update packages/editor/src/ui/uniform-mui/ListItemField.tsx
  - [x] Update packages/editor/src/ui/uniform-mui/ListField.tsx
  - [x] Implement sortable functionality using @dnd-kit/sortable
  - [x] Ensure list reordering works correctly with the new implementation
- [x] Remove react-dnd dependencies (2023-06-10)
  - [x] Remove react-dnd from package.json
  - [x] Remove react-dnd-html5-backend from package.json 