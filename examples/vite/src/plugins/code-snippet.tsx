import React from 'react';
import type { CellPlugin } from '@react-page/editor';

interface CodeSnippetState {
  language: string;
  code: string;
  [key: string]: unknown;
}

const CodeSnippet: React.FC<{ data: CodeSnippetState }> = ({ data }) => {
  return (
    <pre style={{ textAlign: 'left', overflow: 'auto' }}>
      <code className={`language-${data.language || 'typescript'}`}>
        {data.code}
      </code>
    </pre>
  );
};

export const codeSnippetPlugin: CellPlugin<CodeSnippetState> = {
  id: 'code-snippet',
  title: 'Code Snippet',
  description: 'Display code with syntax highlighting',
  version: 1,
  Renderer: CodeSnippet,
  createInitialData: () => ({
    language: 'typescript',
    code: '',
  }),
}; 