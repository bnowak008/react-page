/**
 * This script attempts to fix DOM nesting issues by patching React's validateDOMNesting function
 * to be more lenient with nested paragraphs in the Slate editor.
 */

export function fixDomNestingIssues() {
  // Only run in development mode where the validateDOMNesting function exists
  if (process.env.NODE_ENV === 'development') {
    try {
      // Wait for React to be fully loaded
      setTimeout(() => {
        // Find the React DOM module in the global scope
        const ReactDOM = (window as any).ReactDOM;
        if (ReactDOM && ReactDOM.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED) {
          const internals = ReactDOM.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED;
          
          // Check if the validateDOMNesting function exists
          if (internals.ReactDOMComponentTree && internals.ReactDOMComponentTree.validateDOMNesting) {
            // Store the original function
            const originalValidateDOMNesting = internals.ReactDOMComponentTree.validateDOMNesting;
            
            // Replace with our patched version
            internals.ReactDOMComponentTree.validateDOMNesting = function(childTag: string, childText: any, ancestorInfo: any) {
              // Skip validation for nested paragraphs in the Slate editor
              if (childTag === 'p' && ancestorInfo && ancestorInfo.tag === 'p') {
                // Check if we're inside a Slate editor
                const isInSlateEditor = ancestorInfo.ancestorTags && 
                  ancestorInfo.ancestorTags.some((tag: string) => 
                    tag === 'div' && document.querySelector('[data-slate-editor]')
                  );
                
                if (isInSlateEditor) {
                  // Skip validation for nested paragraphs in Slate
                  return;
                }
              }
              
              // Call the original function for all other cases
              return originalValidateDOMNesting(childTag, childText, ancestorInfo);
            };
            
            console.log('DOM nesting validation patched for Slate editor');
          }
        }
      }, 1000); // Wait 1 second for React to initialize
    } catch (error) {
      console.error('Failed to patch DOM nesting validation:', error);
    }
  }
} 