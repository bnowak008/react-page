import React from 'react';
import Editor from '../../../packages/editor';
import '../../../packages/editor/lib/index.css';
import slate from '../../../packages/plugins/content/slate';
import image from '../../../packages/plugins/content/image';
import spacer from '../../../packages/plugins/content/spacer';
import background from '../../../packages/plugins/layout/background';
import '../../../packages/plugins/content/slate/lib/index.css';
import '../../../packages/plugins/content/image/lib/index.css';
import '../../../packages/plugins/content/spacer/lib/index.css';
import '../../../packages/plugins/layout/background/lib/index.css';
import { DOMNestedParagraphFix } from './components/DOMFix';

// The content is stored as a JSON object
const CONTENT = {
  id: '2',
  version: 1,
  rows: [
    {
      id: '5b282d4f-7a25-4f9c-a7cd-e5c2e6c3f11d',
      cells: [
        {
          id: '9e00b641-6b06-4b0f-a1a8-1a7c2f1cb429',
          size: 12,
          plugin: { id: 'ory/editor/core/content/slate', version: 1 },
          dataI18n: {
            default: {
              slate: [
                {
                  type: 'PARAGRAPH/PARAGRAPH',
                  children: [
                    {
                      text: 'This is a simple example of a React-Page editor with Slate.js plugin.',
                    },
                  ],
                },
                {
                  type: 'PARAGRAPH/PARAGRAPH',
                  children: [
                    {
                      text: 'You can click and edit this text, or add new components with the + button in the toolbar.',
                    },
                  ],
                },
              ],
            },
          },
          rows: [],
          inline: null,
        },
      ],
    },
  ],
};

// Define plugins - cast to any to bypass type errors
const cellPlugins = [slate(), image, spacer, background] as any;

// Cast the Editor component to any to bypass type errors
const EditorComponent = Editor as any;

function App() {
  return (
    <div>
      <DOMNestedParagraphFix />
      <EditorComponent cellPlugins={cellPlugins} defaultPlugin={slate()} value={CONTENT} />
    </div>
  );
}

export default App;
