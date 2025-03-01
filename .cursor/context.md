# React-page Project Context

## Project Overview
React-page is a modern WYSIWYG editor for React applications that provides a flexible and extensible content editing experience. It's designed to overcome the limitations of traditional `contenteditable` implementations by using a plugin-based architecture and a structured content model.

## Current Status
The project is currently looking for maintainers as indicated in the README. It's structured as a monorepo using Lerna for package management.

## Technology Stack
- **Core Framework**: React (currently supports React 17, React 18 support is in progress)
- **UI Framework**: Material-UI (MUI) v5
- **State Management**: Redux with redux-thunk and redux-undo
- **Package Management**: Yarn and Lerna (monorepo)
- **Build Tools**: TypeScript, Babel, PostCSS
- **Testing**: Jest
- **Documentation**: Docsify

## Project Structure
The project is organized as a monorepo with the following main directories:
- **packages/editor**: Core editor functionality
- **packages/plugins/content**: Content plugins (slate, image, video, spacer, divider, html5-video)
- **packages/plugins/layout**: Layout plugins (background)
- **packages/react-admin**: Integration with React Admin
- **examples**: Example implementations using Next.js
- **docs**: Documentation files

## Key Packages
1. **@react-page/editor**: The core editor component
2. **@react-page/plugins-slate**: Rich text editing plugin based on Slate
3. **@react-page/plugins-image**: Image handling plugin
4. **@react-page/plugins-video**: Video embedding plugin
5. **@react-page/plugins-spacer**: Spacing control plugin
6. **@react-page/plugins-divider**: Divider element plugin
7. **@react-page/plugins-background**: Background styling plugin

## Architecture
React-page uses a plugin-based architecture where:
- The core editor provides the framework for content management
- Content plugins handle specific content types (text, images, videos, etc.)
- Layout plugins control the presentation and arrangement of content

The editor maintains content as a structured JSON object that can be serialized and stored.

## Development Workflow
1. Use `yarn` to install dependencies
2. Use `yarn bootstrap` to initialize the monorepo
3. Use `yarn dev` to run the development server with examples
4. Use `yarn build` to build all packages
5. Use `yarn test` to run tests
6. Use semantic commit messages for version control

## Performance Considerations
- The editor UI is lazy-loaded to reduce initial bundle size
- A read-only mode is available for viewing content with reduced bundle size
- Code splitting is used to optimize loading times

## Browser Compatibility
- Modern browsers are fully supported
- IE11 support is available with appropriate polyfills

## Integration Options
- Can be used with various backend systems
- Provides React Admin integration
- Supports server-side rendering

## Current Challenges and TODOs
- React 18 support needs to be implemented
- Finding new maintainers for the project
- Improving documentation and examples
- Enhancing performance for large content structures
- Adding more plugins and customization options

## Deployment
The project is published to npm under the @react-page namespace. Documentation and demos are deployed to GitHub Pages.
