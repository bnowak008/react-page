import type { RootState } from '../zustand/store';

/**
 * Get the current language
 */
export const getLang = (state: RootState) => {
  return state.reactPage.settings.lang;
};
