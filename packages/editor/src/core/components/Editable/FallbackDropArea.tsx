import React, { useRef, useEffect } from 'react';
import type { BaseSyntheticEvent, FC, PropsWithChildren } from 'react';
import { useCallback } from 'react';
import { useDndKitDrop } from '../hooks/useDndKit';
import type { CellDrag } from '../../types/node';

import {
  useCellIsAllowedHere,
  useInsertNew,
  useSetDisplayReferenceNodeId,
} from '../hooks';

const FallbackDropArea: FC<PropsWithChildren> = ({ children }) => {
  const insertNew = useInsertNew();
  const isAllowed = useCellIsAllowedHere();
  const divRef = useRef<HTMLDivElement>(null);

  const [collected, dropRef] = useDndKitDrop<CellDrag, {}>({
    accept: 'cell',
    collect: () => ({}),
    drop: (item, monitor) => {
      // fallback drop
      if (!monitor.didDrop() && item?.cell) {
        insertNew(item.cell);
      }
    },
  });

  // Connect the drop ref to our div ref
  useEffect(() => {
    if (divRef.current) {
      dropRef(divRef.current);
    }
  }, [dropRef]);

  const setReference = useSetDisplayReferenceNodeId();
  const clearReference = useCallback(
    (e: BaseSyntheticEvent) => {
      // if click was on the root, clear reference
      if (e.target.classList?.contains('react-page-editable'))
        setReference(null);
    },
    [setReference]
  );

  return (
    <div ref={divRef} onClick={clearReference}>
      {children}
    </div>
  );
};

export default FallbackDropArea;
