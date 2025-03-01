import type { ComponentProps, ComponentType, ReactElement } from 'react';
import React, { useEffect, useState, lazy, Suspense } from 'react';

function useIsServer() {
  const [isServer, setIsServer] = useState(true);
  useEffect(() => {
    setIsServer(false);
  }, []);
  return isServer;
}

/**
 * A modern implementation of lazy loading using React.lazy() and Suspense
 * @param factory function that returns a promise of a component
 * @returns a lazy loaded component. you can pass a fallback to the component that renders on server or when the component is not loaded
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const loadable = <T extends ComponentType<any>>(
  factory: () => Promise<{ default: T }>
) => {
  // Use React.lazy for component loading
  const Component = lazy(factory);
  
  // Preload function to allow manual preloading
  const preload = () => {
    return factory();
  };

  const LoadableComponent = React.forwardRef(
    (
      {
        fallback = null,
        ...props
      }: ComponentProps<T> & {
        /**
         * render a fallback on server or if the component is not loaded
         */
        fallback?: ReactElement;
      },
      ref
    ) => {
      const isServer = useIsServer();
      
      // Return fallback on server-side rendering
      if (isServer) {
        return fallback ?? null;
      }

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const Inner = Component as any;

      return (
        <Suspense fallback={fallback}>
          <Inner ref={ref} {...props} />
        </Suspense>
      );
    }
  );

  // Add load method for backward compatibility
  const LoadableComponentWithPreload: typeof LoadableComponent & {
    load: () => Promise<unknown>;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } = LoadableComponent as any;
  
  LoadableComponentWithPreload.load = preload;

  return LoadableComponentWithPreload;
};

export default loadable;
