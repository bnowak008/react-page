import type { RootState } from '../zustand/store';
import {
  DISPLAY_MODE_EDIT,
  DISPLAY_MODE_INSERT,
  DISPLAY_MODE_LAYOUT,
  DISPLAY_MODE_PREVIEW,
  DISPLAY_MODE_RESIZING,
} from '../types/display';

/**
 * @param state the redux state
 * @returns true if in edit mode
 */
export const isEditMode = (state: RootState) =>
  state.reactPage.display.mode === DISPLAY_MODE_EDIT;

/**
 * @param state the redux state
 * @returns true if in layout mode
 */
export const isLayoutMode = (state: RootState) =>
  state.reactPage.display.mode === DISPLAY_MODE_LAYOUT;

/**
 * @param state the redux state
 * @returns true if in preview mode
 */
export const isPreviewMode = (state: RootState) =>
  state.reactPage.display.mode === DISPLAY_MODE_PREVIEW;

/**
 * @param state the redux state
 * @returns true if in resize mode
 */
export const isResizeMode = (state: RootState) =>
  state.reactPage.display.mode === DISPLAY_MODE_RESIZING;

/**
 * @param state the redux state
 * @returns true if in insert mode
 */
export const isInsertMode = (state: RootState) =>
  state.reactPage.display.mode === DISPLAY_MODE_INSERT;
