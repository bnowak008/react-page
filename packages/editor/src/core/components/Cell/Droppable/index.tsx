import classNames from 'classnames';
import type { FC, PropsWithChildren } from 'react';
import React, { useCallback, useEffect } from 'react';
import { useDndKitDrop } from '../../hooks/useDndKit';
import { useSelector } from '../../../reduxConnect';
import type { RootState } from '../../../types';
import type { CellDrag } from '../../../types/node';
import {
  useNodeAsHoverTarget,
  useCellHasPlugin,
  useCellIsAllowedHere,
  useCellSpacing,
  useDropActions,
  useHoverActions,
  useIsInsertMode,
  useIsLayoutMode,
  useNodeHoverPosition,
  usePluginOfCell,
  useOption,
  useAllCellPluginsForNode,
} from '../../hooks';
import { onDrop, onHover } from './helper/dnd';

export const useCellDrop = (nodeId: string) => {
  const ref = React.useRef<HTMLDivElement>();

  const hoverTarget = useNodeAsHoverTarget(nodeId);

  const targetParentNodeId = hoverTarget?.ancestorIds?.[0];

  const checkIfAllowed = useCellIsAllowedHere(targetParentNodeId);
  const plugin = usePluginOfCell(nodeId);

  const cellPlugins = useAllCellPluginsForNode(targetParentNodeId);
  const hoverActions = useHoverActions();
  const dropActions = useDropActions(targetParentNodeId);
  const isHoveringOverThis = useSelector(
    (state: RootState) => state.reactPage.hover?.nodeId === nodeId
  );

  type CollectedProps = {
    isOver: boolean;
    isAllowed: boolean;
  };

  const [collected, dropRef] = useDndKitDrop<CellDrag, CollectedProps>({
    accept: 'cell',
    collect: (monitor) => ({
      isOver: monitor.isOver(),
      isAllowed: checkIfAllowed(monitor.getItem() || { cell: null }),
    }),
    drop: (item, monitor) => {
      if (!hoverTarget || !ref.current) {
        return;
      }
      if (item?.cell) {
        onDrop(hoverTarget, monitor, ref.current, dropActions, cellPlugins);
      }
    },
  });

  const { isOver, isAllowed } = collected;

  useEffect(() => {
    if (!isOver && isHoveringOverThis) {
      hoverActions.clear();
    }
  }, [isOver, isHoveringOverThis, hoverActions]);

  // see https://github.com/react-dnd/react-dnd/issues/1955
  const attach = useCallback(
    (domElement: HTMLDivElement) => {
      if (domElement) {
        dropRef(domElement);
        ref.current = domElement;
      }
      // use dom element here for measuring
    },
    [dropRef]
  );
  return [attach, isAllowed] as const;
};
const Droppable: FC<PropsWithChildren<{ nodeId: string; isLeaf?: boolean }>> = (
  props
) => {
  const isLayoutMode = useIsLayoutMode();
  const isInsertMode = useIsInsertMode();
  const [attach, isAllowed] = useCellDrop(props.nodeId);
  const hoverPosition = useNodeHoverPosition(props.nodeId);
  const allowMoveInEditMode = useOption('allowMoveInEditMode');
  const hasPlugin = useCellHasPlugin(props.nodeId);
  const { y: cellSpacingY } = useCellSpacing() ?? { y: 0 };
  const needVerticalMargin = !props.isLeaf && !hasPlugin;

  if (!(isLayoutMode || isInsertMode) && !allowMoveInEditMode) {
    return (
      <div className={'react-page-cell-droppable-container'}>
        {props.children}
      </div>
    );
  }

  return (
    <div
      ref={attach}
      style={{
        height: '100%',
      }}
      className="react-page-cell-droppable"
    >
      <div
        style={{
          position: 'absolute',
          pointerEvents: 'none',
          top: needVerticalMargin ? `${cellSpacingY / 2}px` : 0,
          left: 0,
          bottom: needVerticalMargin ? `${cellSpacingY / 2}px` : 0,
          right: 0,
        }}
        className={classNames({
          'react-page-cell-droppable-not-allowed': !isAllowed,
          'react-page-cell-droppable-is-over-current':
            isAllowed && hoverPosition,
          [`react-page-cell-droppable-is-over-${hoverPosition}`]:
            isAllowed && hoverPosition,
          'react-page-cell-droppable-leaf': props.isLeaf,
        })}
      />
      {props.children}
    </div>
  );
};

export default Droppable;
