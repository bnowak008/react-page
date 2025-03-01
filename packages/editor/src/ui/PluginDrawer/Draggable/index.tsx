import classNames from 'classnames';
import type { FC, PropsWithChildren } from 'react';
import React from 'react';
import { useDndKitDrag } from '../../../core/components/hooks/useDndKit';

import { dragIcon } from '../../../core/components/Cell/Draggable/useDragHandle';
import { useSetLayoutMode } from '../../../core/components/hooks/displayMode';

import type { CellDrag, InsertNewCell } from '../../../core/types';

const Draggable: FC<
  PropsWithChildren<{
    insert: InsertNewCell;
  }>
> = ({ insert, children }) => {
  const setLayoutMode = useSetLayoutMode();
  const [{ isDragging }, dragRef, _, { attributes, listeners, style }] =
    useDndKitDrag<CellDrag>({
      type: 'cell',
      item: () => {
        setLayoutMode();
        return {
          cell: insert,
        };
      },
      collect: (isDragging) => ({
        isDragging,
      }),
    });
  const classes = classNames(
    { 'react-page-toolbar-draggable-is-dragged': isDragging },
    'react-page-toolbar-draggable'
  );

  return (
    <div
      className={classes}
      ref={dragRef}
      style={style}
      {...attributes}
      {...listeners}
    >
      {children}
    </div>
  );
};

export default Draggable;
