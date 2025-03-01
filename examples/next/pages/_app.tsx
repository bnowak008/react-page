import React from 'react';
import '../styles/styles.css';
import type { EmotionCache } from '@emotion/react';
import { CacheProvider } from '@emotion/react';
import 'katex/dist/katex.min.css';
import type { AppProps } from 'next/app';

import createEmotionCache from '../utils/createEmotionCache';
import { CssBaseline } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';

const clientSideEmotionCache = createEmotionCache();
const theme = createTheme();
function MyApp({
  Component,
  pageProps,
  emotionCache = clientSideEmotionCache,
}: AppProps & { emotionCache: EmotionCache }) {
  return (
    <CacheProvider value={emotionCache}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Component {...pageProps} />
      </ThemeProvider>
    </CacheProvider>
  );
}

export default MyApp;
