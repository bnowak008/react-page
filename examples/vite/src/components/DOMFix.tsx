import { useEffect } from 'react';

/**
 * Component that fixes nested paragraphs in the DOM after rendering
 */
export function DOMNestedParagraphFix() {
  useEffect(() => {
    // Function to fix nested paragraphs
    const fixNestedParagraphs = () => {
      // Find all paragraphs in the document
      const paragraphs = document.querySelectorAll('p');
      
      // For each paragraph, check if it contains other paragraphs
      paragraphs.forEach(paragraph => {
        // Find nested paragraphs
        const nestedParagraphs = paragraph.querySelectorAll('p');
        
        // Convert each nested paragraph to a span
        nestedParagraphs.forEach(nestedP => {
          // Create a new span element
          const span = document.createElement('span');
          
          // Copy all attributes
          Array.from(nestedP.attributes).forEach(attr => {
            span.setAttribute(attr.name, attr.value);
          });
          
          // Copy the content
          span.innerHTML = nestedP.innerHTML;
          
          // Add a class to identify it as a converted paragraph
          span.classList.add('converted-paragraph');
          
          // Replace the paragraph with the span
          nestedP.parentNode?.replaceChild(span, nestedP);
          
          console.log('Fixed a nested paragraph');
        });
      });
    };
    
    // Create a MutationObserver to watch for DOM changes
    const observer = new MutationObserver(mutations => {
      let shouldFix = false;
      
      // Check if any mutations involve paragraphs
      mutations.forEach(mutation => {
        if (mutation.type === 'childList') {
          // Check added nodes
          mutation.addedNodes.forEach(node => {
            if (node.nodeType === Node.ELEMENT_NODE) {
              const element = node as Element;
              
              // If this is a paragraph or contains paragraphs
              if (element.tagName === 'P' || element.querySelectorAll('p').length > 0) {
                shouldFix = true;
              }
            }
          });
        }
      });
      
      // If we found relevant changes, fix nested paragraphs
      if (shouldFix) {
        fixNestedParagraphs();
      }
    });
    
    // Start observing the document body
    observer.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: false,
      characterData: false
    });
    
    // Run once on mount
    setTimeout(fixNestedParagraphs, 500);
    
    // Clean up the observer when the component unmounts
    return () => {
      observer.disconnect();
    };
  }, []);
  
  return null;
} 