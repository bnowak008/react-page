import type { ReactNode } from 'react';

export type BottomToolbarToolsProps = {
  nodeId: string;
};

export type BottomToolbarProps = {
  open?: boolean;
  style?: React.CSSProperties;
  children?: React.ReactNode;
  className?: string;

  anchor?: 'top' | 'bottom' | 'left' | 'right';
  pluginControls?: ReactNode;
  actionsLeft?: ReactNode;
} & BottomToolbarToolsProps;
