import React from 'react';
import { SlateReactPresentation } from 'slate-react-presentation';

/**
 * Custom wrapper for SlateReactPresentation that prevents paragraph nesting
 * by intercepting the renderElement function and ensuring paragraphs are never nested.
 */
export const CustomSlatePresentation = (props: any) => {
  // Create a wrapper for the renderElement function
  const originalRenderElement = props.renderElement;
  
  // Track paragraph nesting depth
  const paragraphDepthRef = React.useRef(0);
  
  const wrappedRenderElement = (elementProps: any) => {
    const { element } = elementProps;
    
    // Check if this is a paragraph element
    const isParagraph = element.type === 'PARAGRAPH/PARAGRAPH';
    
    // If it's a paragraph, increment the depth before rendering
    if (isParagraph) {
      paragraphDepthRef.current += 1;
    }
    
    try {
      // If this is a nested paragraph (depth > 1), modify the element props
      if (isParagraph && paragraphDepthRef.current > 1) {
        // Override the element type to force rendering as a span
        const modifiedElement = {
          ...element,
          // Change the type to a custom type that will render as a span
          type: 'CUSTOM/INLINE_PARAGRAPH'
        };
        
        // Render with the modified element
        return originalRenderElement({
          ...elementProps,
          element: modifiedElement
        });
      }
      
      // Normal rendering for non-nested elements
      return originalRenderElement(elementProps);
    } finally {
      // Decrement the depth after rendering
      if (isParagraph) {
        paragraphDepthRef.current -= 1;
      }
    }
  };
  
  // Cast SlateReactPresentation to any to bypass the type error
  const SlateComponent = SlateReactPresentation as any;
  
  return (
    <SlateComponent
      {...props}
      renderElement={wrappedRenderElement}
    />
  );
}; 