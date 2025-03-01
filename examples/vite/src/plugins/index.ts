// The background plugin
import backgroundFactory, { ModeEnum } from '../../../../packages/plugins/layout/background';
// import css as well. currently, we caannot do this here in the demo project and have moved that to _app.tsx
// see https://github.com/vercel/next.js/issues/19717

// The divider plugin
import divider from '../../../../packages/plugins/content/divider';

// The html5-video plugin
import html5video from '../../../../packages/plugins/content/video';

// The image plugin
import { imagePlugin as imagePluginFactory, type ImageUploadType } from '../../../../packages/plugins/content/image';
// import '@react-page/plugins-image/lib/index.css';

// The spacer plugin
import spacerFactory from '../../../../packages/plugins/content/spacer/src';
// import '@react-page/plugins-spacer/lib/index.css';

// The video plugin
import videoFactory from '../../../../packages/plugins/content/video/src';
// import '@react-page/plugins-video/lib/index.css';

// Import the slate plugin - use the source version with the correct export
import slatePluginFactory, { DEFAULT_SLATE_PLUGIN_ID } from '../../../../packages/plugins/content/slate/src';
// Create the slate plugin with the correct ID
const slatePlugin = slatePluginFactory();
// Import the CSS
import '../../../../packages/plugins/content/slate/lib/index.css';

// Import custom plugins
import { codeSnippetPlugin } from './code-snippet';
import { twitterTimelinePlugin } from './twitter-timeline';

const fakeImageUploadService: (url: string) => ImageUploadType =
  (_url) => (file: File, reportProgress: (progress: number) => void) => {
    return new Promise((resolve) => {
      let counter = 0;
      const interval = setInterval(() => {
        counter++;
        reportProgress(counter * 10);
        if (counter > 9) {
          clearInterval(interval);
          alert(
            'Image has not actually been uploaded to a server. Check documentation for information on how to provide your own upload function.'
          );
          resolve({ url: URL.createObjectURL(file) });
        }
      }, 100);
    });
  };

// Create the image plugin with the correct ID
const imagePlugin = {
  ...imagePluginFactory({ imageUpload: fakeImageUploadService('/images/react.png') }),
  id: 'ory/editor/core/content/image'
};

// Create the spacer plugin with the correct ID
const spacer = {
  ...spacerFactory,
  id: 'ory/editor/core/content/spacer'
};

// Create the video plugin with the correct ID
const video = {
  ...videoFactory,
  id: 'ory/editor/core/content/video'
};

// Create a background plugin factory with the correct ID
const background = (options: any) => ({
  ...backgroundFactory(options),
  id: 'ory/editor/core/layout/background'
});

// Define which plugins we want to use.

export const cellPlugins = [
  slatePlugin,
  spacer,
  imagePlugin,
  video,
  codeSnippetPlugin,
  twitterTimelinePlugin,
  divider,
  html5video,
  background({
    imageUpload: fakeImageUploadService('/images/sea-bg.jpg'),
    enabledModes:
      ModeEnum.COLOR_MODE_FLAG |
      ModeEnum.IMAGE_MODE_FLAG |
      ModeEnum.GRADIENT_MODE_FLAG,
  }),
];
