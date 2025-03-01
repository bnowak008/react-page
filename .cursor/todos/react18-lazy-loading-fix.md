# [React 18 Support] Fix lazyLoad Functionality for React 18

## Description
This todo file outlines the steps required to fix the lazyLoad functionality in the React Page editor to ensure compatibility with React 18. The current implementation of lazyLoad is causing build issues when used with newer bundlers like Vite and when upgrading to React 18.

- This task involves identifying all usages of the lazyLoad function in the codebase
- Creating a modern implementation using React.lazy() and Suspense
- Ensuring all current functionality is preserved
- Testing the implementation thoroughly
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
- The current lazyLoad function is used in various plugins to dynamically import components
- When building with Vite and using React 18, the lazyLoad function is not properly exported from the editor package
- This causes build errors in plugins that import lazyLoad from @react-page/editor
- The issue affects multiple plugins including background and divider
- A temporary workaround is to comment out the plugins that use lazyLoad
- A more permanent solution is to replace the custom lazyLoad implementation with React.lazy()
- React.lazy() is the official React way to handle code splitting and lazy loading
- This approach would be more compatible with modern bundlers and React 18
- The implementation would need to ensure backward compatibility with existing plugins
- The migration to React.lazy() would also improve tree-shaking and bundle size optimization
- The original implementation used react-lazy-with-preload which is not needed with React 18
- The new implementation maintains the same API but uses React.lazy() internally
- The preload functionality is maintained through a custom preload function
- The dependency on react-lazy-with-preload has been removed from package.json
- The new implementation should work with both React 16.14+ and React 18
- A test file has been created to verify the implementation works correctly
- Documentation has been added to explain the implementation and usage
- No changes are needed in the plugins that use lazyLoad since the API remains the same
- The implementation is now more maintainable and future-proof

## Active
- [x] Analyze current lazyLoad implementation
  - [x] Identify the current implementation in packages/editor/src/core/helper/lazyLoad
  - [x] Understand how it's currently being used across plugins
  - [x] Document the API and behavior that needs to be preserved
- [x] Create a new implementation using React.lazy()
  - [x] Implement a new version that uses React.lazy() and Suspense
  - [x] Ensure it maintains the same API as the current implementation
  - [x] Add proper error handling and fallbacks
- [x] Update the editor package exports
  - [x] Ensure the new implementation is properly exported from the editor package
  - [x] Update the index.ts file to export the new implementation
  - [x] Verify that the exports work correctly with different bundlers
- [ ] Update plugins to use the new implementation
  - [ ] Update the background plugin
  - [ ] Update the divider plugin
  - [ ] Update any other plugins that use lazyLoad
- [ ] Test the implementation
  - [ ] Test with different bundlers (webpack, Vite)
  - [ ] Test with different React versions (16, 17, 18)
  - [ ] Ensure all functionality works as expected

## Pending
- [ ] Consider adding a compatibility layer
  - [ ] Research if a compatibility layer is needed for older plugins
  - [ ] Implement a compatibility layer if necessary
- [ ] Optimize bundle size
  - [ ] Research if the new implementation can further optimize bundle size
  - [ ] Implement optimizations if possible

## Completed
- [x] Identify the issue with lazyLoad in Vite builds (2023-06-15)
  - [x] Confirm that lazyLoad is not properly exported from the editor package
  - [x] Verify that this causes build errors in plugins that import lazyLoad
- [x] Implement temporary workarounds (2023-06-15)
  - [x] Comment out plugins that use lazyLoad in the Vite example
  - [x] Update the Vite configuration to exclude problematic plugins 
- [x] Remove dependency on react-lazy-with-preload (2023-07-10)
  - [x] Update package.json to remove the dependency
  - [x] Ensure the new implementation doesn't rely on external libraries
- [x] Update documentation (2023-07-10)
  - [x] Create a README file for the lazyLoad implementation
  - [x] Add information about the new implementation and migration
  - [x] Create a test file to verify the implementation works correctly 