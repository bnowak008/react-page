// Define DisplayModes as a string union type
export type DisplayModes =
  | 'edit'
  | 'preview'
  | 'layout'
  | 'resizing'
  | 'insert';

// Define display mode constants
export const DISPLAY_MODE_EDIT = 'edit';
export const DISPLAY_MODE_PREVIEW = 'preview';
export const DISPLAY_MODE_LAYOUT = 'layout';
export const DISPLAY_MODE_RESIZING = 'resizing';
export const DISPLAY_MODE_INSERT = 'insert';

export type Display = {
  mode: DisplayModes;
  referenceNodeId?: string | null;
  zoom: number;
};
