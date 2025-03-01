# lazyLoad Helper

The `lazyLoad` helper is a utility function for lazy loading React components. It provides a simple API for dynamically importing components and rendering them with a fallback while they're loading.

## Features

- Uses React's built-in `React.lazy()` and `Suspense` for code splitting
- Works with React 16.14+ and React 18
- Server-side rendering support with fallback
- Preloading capability via `.load()` method
- Compatible with modern bundlers like Webpack and Vite

## Usage

```tsx
import { lazyLoad } from '@react-page/editor';

// Create a lazy loaded component
const LazyComponent = lazyLoad(() => import('./MyComponent'));

// Use the lazy loaded component in your app
const MyApp = () => (
  <LazyComponent 
    fallback={<div>Loading...</div>} 
    prop1="value1" 
    prop2="value2" 
  />
);

// Preload the component (optional)
LazyComponent.load();
```

## API

### lazyLoad

```tsx
const lazyLoad = <T extends ComponentType<any>>(
  factory: () => Promise<{ default: T }>
) => LoadableComponent;
```

#### Parameters

- `factory`: A function that returns a promise that resolves to a module with a default export containing the component.

#### Returns

- `LoadableComponent`: A React component that will render the lazy-loaded component when it's ready.

### LoadableComponent

```tsx
const LoadableComponent = (props: ComponentProps<T> & {
  fallback?: ReactElement;
}) => ReactElement;
```

#### Props

- `fallback`: An optional React element to render while the component is loading or on the server.
- `...props`: All other props are passed to the loaded component.

#### Methods

- `load()`: A method to manually preload the component. Returns a promise that resolves when the component is loaded.

## Implementation Details

The `lazyLoad` helper uses React's `lazy()` function internally to handle the dynamic import of components. It also uses the `Suspense` component to provide a fallback while the component is loading.

For server-side rendering, it uses a custom hook to detect if the code is running on the server and renders the fallback in that case.

The `.load()` method allows for manually preloading components before they're needed, which can improve the user experience by reducing the time it takes to render the component when it's actually needed.

## Migration from Previous Versions

If you're migrating from a previous version of `lazyLoad` that used `react-lazy-with-preload`, the API remains the same, so no changes to your code should be necessary. The implementation has been updated to use React's built-in lazy loading capabilities, which improves compatibility with React 18 and modern bundlers like Vite. 