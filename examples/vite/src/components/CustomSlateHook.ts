/**
 * This file provides a direct DOM fix for paragraph nesting issues in the Slate editor.
 * Since we can't easily patch the SlateReactPresentation component in an ES module environment,
 * we'll use a MutationObserver to fix the DOM after it's rendered.
 */

import { useEffect } from 'react';

// Create a function to fix nested paragraphs in the DOM
export function useFixNestedParagraphs() {
  useEffect(() => {
    // Function to convert nested paragraphs to spans
    const fixNestedParagraphs = () => {
      // Find all paragraphs in the document
      const paragraphs = document.querySelectorAll('p');
      
      // Check each paragraph for nested paragraphs
      paragraphs.forEach(paragraph => {
        // Find any nested paragraphs
        const nestedParagraphs = paragraph.querySelectorAll('p');
        
        // Convert each nested paragraph to a span
        nestedParagraphs.forEach(nestedP => {
          // Create a new span element
          const span = document.createElement('span');
          
          // Copy attributes
          Array.from(nestedP.attributes).forEach(attr => {
            span.setAttribute(attr.name, attr.value);
          });
          
          // Copy content
          span.innerHTML = nestedP.innerHTML;
          
          // Replace the paragraph with the span
          nestedP.parentNode?.replaceChild(span, nestedP);
        });
      });
    };
    
    // Create a MutationObserver to watch for DOM changes
    const observer = new MutationObserver((mutations) => {
      // Check if any mutations involve paragraphs
      const hasParagraphChanges = mutations.some(mutation => {
        // Check added nodes
        if (mutation.addedNodes.length > 0) {
          return Array.from(mutation.addedNodes).some(node => {
            // Check if the node is a paragraph or contains paragraphs
            if (node.nodeType === Node.ELEMENT_NODE) {
              const element = node as Element;
              return element.tagName === 'P' || element.querySelectorAll('p').length > 0;
            }
            return false;
          });
        }
        return false;
      });
      
      // If there are paragraph changes, fix nested paragraphs
      if (hasParagraphChanges) {
        fixNestedParagraphs();
      }
    });
    
    // Start observing the document body
    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
    
    // Run once on mount to fix any existing nested paragraphs
    fixNestedParagraphs();
    
    // Clean up the observer when the component unmounts
    return () => {
      observer.disconnect();
    };
  }, []);
}

// Export a component that can be used to fix nested paragraphs
export function FixNestedParagraphs() {
  useFixNestedParagraphs();
  return null;
}

// Also add a custom plugin for inline paragraphs
import { cellPlugins } from '../plugins';
import createComponentPlugin from '../../../../packages/plugins/content/slate/src/pluginFactories/createComponentPlugin';

// Add a custom plugin for inline paragraphs
try {
  // Create a plugin for our custom inline paragraph type
  const inlineParagraphPlugin = createComponentPlugin({
    type: 'CUSTOM/INLINE_PARAGRAPH',
    object: 'block',
    addHoverButton: false,
    addToolbarButton: false,
    Component: 'span', // Render as a span instead of a p
  });
  
  // Add the plugin to the cellPlugins array
  const slatePlugin = cellPlugins.find(plugin => 
    plugin.id === 'slate' || plugin.id === '@react-page/plugins-slate'
  );
  
  if (slatePlugin) {
    // Access the plugins array safely using type assertion
    const slatePluginAny = slatePlugin as any;
    if (slatePluginAny.plugins && Array.isArray(slatePluginAny.plugins)) {
      slatePluginAny.plugins.push(inlineParagraphPlugin);
      console.log('Added inline paragraph plugin to prevent DOM nesting warnings');
    }
  }
} catch (error) {
  console.error('Failed to add inline paragraph plugin:', error);
} 