export type Focus = {
  nodeId: string;
  scrollToCell?: boolean;
  source?: FocusMode;
};

export type FocusMode = 'replace' | 'blur' | null;