import Fab from '@mui/material/Fab';
import Delete from '@mui/icons-material/Delete';
import classNames from 'classnames';
import React from 'react';
import { useIsLayoutMode, useTrashDrop } from '../../core/components/hooks';

interface CollectedProps {
  isHovering: boolean;
}

export const Trash: React.FC = React.memo(() => {
  const isLayoutMode = useIsLayoutMode();
  const [collected, ref] = useTrashDrop();
  const isHovering = (collected as CollectedProps)?.isHovering || false;
  
  return (
    <div
      ref={ref}
      className={classNames('react-page-controls-trash', {
        'react-page-controls-trash-active': isLayoutMode,
      })}
    >
      <Fab color="secondary" disabled={!isHovering}>
        <Delete />
      </Fab>
    </div>
  );
});
