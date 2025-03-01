export type Focus = {
  nodeIds: string[];
  scrollToCell?: boolean;
  mode?: FocusMode;
};

/**
 * Focus mode for cells
 */
export type FocusMode = 'replace' | 'blur' | 'add' | null;
