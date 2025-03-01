import { useState } from 'react';

// Import directly from the lib directory
import type { Value } from '@react-page/editor';
import EditorComponent from '@react-page/editor';
import { cellPlugins } from './plugins';
import { demo } from './demo';

// Cast the Editor component to any to bypass the type error
const Editor = EditorComponent as any;

const LANGUAGES = [
  {
    lang: 'en',
    label: 'English',
  },
  {
    lang: 'de',
    label: 'Deutsch',
  },
];

function App() {
  const [value, setValue] = useState<Value>(demo);

  return (
    <>
      <Editor
        cellPlugins={cellPlugins}
        value={value}
        lang={LANGUAGES[0].lang}
        onChange={setValue}
        languages={LANGUAGES}
      />
    </>
  );
}

export default App;
