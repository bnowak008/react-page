// The background plugin
import background, { ModeEnum } from '../../../../packages/plugins/layout/background';
// import css as well. currently, we caannot do this here in the demo project and have moved that to _app.tsx
// see https://github.com/vercel/next.js/issues/19717
// import '@react-page/plugins-background/lib/index.css';

// The divider plugin
import divider from '../../../../packages/plugins/content/divider';

// The html5-video plugin
import html5video from '../../../../packages/plugins/content/html5-video';
// import '@react-page/plugins-html5-video/lib/index.css';

// The image plugin
import type { ImageUploadType } from '../../../../packages/plugins/content/image';
import { imagePlugin } from '../../../../packages/plugins/content/image';
// import '@react-page/plugins-image/lib/index.css';

// The spacer plugin
import spacer from '../../../../packages/plugins/content/spacer';
// import '@react-page/plugins-spacer/lib/index.css';

// The video plugin
import video from '../../../../packages/plugins/content/video';
// import '@react-page/plugins-video/lib/index.css';

const fakeImageUploadService: (url: string) => ImageUploadType =
  (_url) => (file, reportProgress) => {
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

// Define which plugins we want to use.

export const cellPlugins = [
  spacer,
  imagePlugin({ imageUpload: fakeImageUploadService('/images/react.png') }),
  video,
  divider,
  html5video,
  // Comment out the background plugin to avoid the lazyLoad issue
  background({
    imageUpload: fakeImageUploadService('/images/sea-bg.jpg'),
    enabledModes:
      ModeEnum.COLOR_MODE_FLAG |
      ModeEnum.IMAGE_MODE_FLAG |
      ModeEnum.GRADIENT_MODE_FLAG,
  }),
];
