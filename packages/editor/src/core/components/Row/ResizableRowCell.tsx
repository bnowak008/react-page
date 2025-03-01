import React from 'react';
import { useMeasure } from 'react-use';
import Cell from '../Cell';
import {
  useIsEditMode,
  useIsPreviewMode,
  useIsResizeMode,
  useResizeCell,
  useCellSpacing,
  useOption,
  useDndKitResize,
} from '../hooks';

type Props = {
  nodeId: string;
  rowWidth: number;
  rowHasInlineChildrenPosition?: string | null;
  isLast: boolean;
  offset: number;
  size: number;
  maxSize: number;
};
const ResizableRowCell: React.FC<Props> = ({
  nodeId,
  rowWidth,
  rowHasInlineChildrenPosition,
  isLast,
  offset,
  size,
  maxSize,
}) => {
  const stepWidth = rowWidth / 12; // we're going to keep it a real number to preserve some precision
  const allowResizeInEditMode = useOption('allowResizeInEditMode');
  const isResizeMode = useIsResizeMode();
  const isEditMode = useIsEditMode();
  const isPreviewMode = useIsPreviewMode();
  const resize = useResizeCell(nodeId);
  const [ref, { height: cellHeight }] = useMeasure();
  const { y: cellSpacingY } = useCellSpacing() ?? { y: 0 };

  const showResizeHandle =
    !isPreviewMode &&
    !isLast &&
    (isResizeMode || (allowResizeInEditMode && isEditMode));

  // Calculate the initial position based on the offset
  const initialPosition = {
    x: rowHasInlineChildrenPosition === 'right'
      ? Math.round(stepWidth * (12 - offset))
      : Math.round(stepWidth * offset),
    y: 0,
  };

  // Use our custom resize hook
  const [position, resizeRef, listeners, attributes, style, isDragging] = useDndKitResize({
    axis: 'x',
    bounds: {
      left: Math.round(stepWidth),
      right: Math.round(rowWidth - stepWidth),
    },
    grid: [Math.round(stepWidth), 0],
    position: initialPosition,
    onDrag: ({ x }: { x: number; y: number }) => {
      // Calculate the size change based on the drag delta
      const diff = Math.round(x / stepWidth);
      const newSize =
        rowHasInlineChildrenPosition === 'right'
          ? size - diff
          : size + diff;
      
      // Only resize if the new size is valid
      if (newSize > 0 && newSize <= maxSize) {
        resize(newSize);
      }
    },
  });

  return (
    <>
      <Cell nodeId={nodeId} measureRef={ref} />

      {showResizeHandle ? (
        <div
          ref={resizeRef}
          {...attributes}
          {...listeners}
          className="resize-handle"
          style={{
            ...style,
            // fix floating style
            height: rowHasInlineChildrenPosition ? cellHeight : 'auto',
            margin: cellSpacingY !== 0 ? `${cellSpacingY / 2}px 0` : undefined,
            cursor: 'col-resize',
          }}
          onClick={(e) => e.stopPropagation()}
        ></div>
      ) : null}
    </>
  );
};

export default React.memo(ResizableRowCell);
