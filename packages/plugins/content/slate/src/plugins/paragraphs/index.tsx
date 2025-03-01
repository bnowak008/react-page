import createComponentPlugin from '../../pluginFactories/createComponentPlugin';
import React, { useRef, useEffect, useState } from 'react';

type Align = 'left' | 'right' | 'center' | 'justify';

// Export this function so it can be used by other modules
export const getAlignmentFromElement = (el: HTMLElement) => {
  const align = el.style.textAlign as Align | undefined;
  return align ? { align } : {};
};

// Improved paragraph component that prevents nested paragraphs
const ParagraphComponent = (props: any) => {
  const paragraphRef = useRef<HTMLElement>(null);
  const [isNested, setIsNested] = useState(false);
  
  // Check if this paragraph is nested inside another paragraph after mounting
  useEffect(() => {
    if (paragraphRef.current) {
      // Walk up the DOM tree to find if we're inside another paragraph
      let parent = paragraphRef.current.parentElement;
      while (parent) {
        if (parent.tagName === 'P') {
          setIsNested(true);
          break;
        }
        parent = parent.parentElement;
      }
      
      // Also check if we contain paragraphs (to prevent future nesting)
      const containsP = paragraphRef.current.querySelectorAll('p').length > 0;
      if (containsP) {
        setIsNested(true);
      }
    }
  }, []);
  
  // Use a span for nested paragraphs to avoid DOM nesting warnings
  const Component = isNested ? 'span' : 'p';
  
  return (
    <Component 
      {...props.attributes} 
      style={props.style}
      ref={paragraphRef}
    >
      {props.children}
    </Component>
  );
};

export default {
  paragraph: createComponentPlugin<{
    align?: Align;
  }>({
    type: 'PARAGRAPH/PARAGRAPH',
    label: 'Paragraph',
    object: 'block',
    addToolbarButton: false,
    addHoverButton: false,
    deserialize: {
      tagName: 'p',
      getData: getAlignmentFromElement,
    },
    getStyle: ({ align }) => ({ textAlign: align }),

    // Use the improved custom component
    Component: ParagraphComponent,
  }),
  // currently only for deserialize
  pre: createComponentPlugin<{
    align?: Align;
  }>({
    type: 'PARAGRAPH/PRE',
    label: 'Pre',
    object: 'block',
    addToolbarButton: false,
    addHoverButton: false,
    deserialize: {
      tagName: 'pre',
      getData: getAlignmentFromElement,
    },
    getStyle: ({ align }) => ({ textAlign: align }),

    Component: 'pre',
  }),
};
