import { useCallback } from 'react';
import type { DisplayModes } from '../../types/display';
import {
  DISPLAY_MODE_EDIT,
  DISPLAY_MODE_INSERT,
  DISPLAY_MODE_LAYOUT,
  DISPLAY_MODE_PREVIEW,
  DISPLAY_MODE_RESIZING,
} from '../../types/display';
import {
  useDisplayMode as useZustandDisplayMode,
  useDisplayReferenceNodeId,
  useIsEditMode as useZustandIsEditMode,
  useIsInsertMode as useZustandIsInsertMode,
  useIsLayoutMode as useZustandIsLayoutMode,
  useIsPreviewMode as useZustandIsPreviewMode,
  useIsResizingMode as useZustandIsResizingMode,
  useSetDisplayMode,
} from '../../zustand/hooks';

/**
 * @returns true whether the editor is in edit mode
 */
export const useIsEditMode = useZustandIsEditMode;

/**
 * @returns true whether the editor is in insert mode
 */
export const useIsInsertMode = useZustandIsInsertMode;

/**
 * @returns true whether the editor is in layout mode
 */
export const useIsLayoutMode = useZustandIsLayoutMode;

/**
 * @returns true whether the editor is in preview mode mode
 */
export const useIsPreviewMode = useZustandIsPreviewMode;

/**
 * @returns true whether the editor is in resize mode mode
 */
export const useIsResizeMode = useZustandIsResizingMode;

/**
 * @returns the current display mode
 */
export const useDisplayMode = useZustandDisplayMode;

/**
 * experimental, used internaly for the add new button.
 * @returns a referenced nodeId for the current display mode.
 */
export const useDisplayModeReferenceNodeId = useDisplayReferenceNodeId;

/**
 * @returns function to set the display mode
 */
export const useSetMode = () => {
  const setDisplayMode = useSetDisplayMode();

  return useCallback(
    (mode: string, referenceNodeId?: string) => {
      setDisplayMode(mode as any);
    },
    [setDisplayMode]
  );
};

/**
 * @returns function to change to resize mode
 */
export const useSetResizeMode = () => {
  const setMode = useSetMode();
  return useCallback(() => setMode(DISPLAY_MODE_RESIZING), [setMode]);
};

/**
 * @returns function to change to edit mode mode
 */
export const useSetEditMode = () => {
  const setMode = useSetMode();
  return useCallback(() => setMode(DISPLAY_MODE_EDIT), [setMode]);
};

/**
 * @returns function to change to layout mode
 */
export const useSetLayoutMode = () => {
  const setMode = useSetMode();
  return useCallback(() => setMode(DISPLAY_MODE_LAYOUT), [setMode]);
};

/**
 * @returns function to change to insert mode
 */
export const useSetInsertMode = () => {
  const setMode = useSetMode();
  return useCallback(() => setMode(DISPLAY_MODE_INSERT), [setMode]);
};

/**
 * @returns function to change to preview mode
 */
export const useSetPreviewMode = () => {
  const setMode = useSetMode();
  return useCallback(() => setMode(DISPLAY_MODE_PREVIEW), [setMode]);
};
