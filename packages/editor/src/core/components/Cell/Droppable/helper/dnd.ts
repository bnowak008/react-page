import throttle from 'lodash.throttle';
import { delay } from '../../../../helper/throttle';
import type { HoverTarget } from '../../../../service/hover/computeHover';
import {
  computeAndDispatchHover,
  computeAndDispatchInsert,
} from '../../../../service/hover/input';
import logger from '../../../../service/logger';
import type {
  CellDrag,
  HoverInsertActions,
  CellPluginList,
} from '../../../../types';

// Define DndMonitor type here instead of importing it
export type DndMonitor = {
  getItem: () => any;
  isOver: (options?: { shallow?: boolean }) => boolean;
  didDrop: () => boolean;
};

let last: { hoverId?: string; dragId?: string } = { hoverId: '', dragId: '' };

const shouldClear = (
  hoverId: string | undefined,
  dragId: string | undefined
) => {
  if (hoverId === last.hoverId && dragId === last.dragId) {
    return false;
  }
  last = { hoverId, dragId };
  return true;
};

export const onHover = throttle(
  (
    target: HoverTarget,
    monitor: DndMonitor,
    element: HTMLElement,
    actions: HoverInsertActions,
    cellPlugins: CellPluginList
  ) => {
    const drag: CellDrag = monitor.getItem();
    if (!drag?.cell || !target) {
      // item undefined, happens when throttle triggers after drop
      return;
    }

    if (drag.cell.id === target.id) {
      // If hovering over itself, do nothing
      if (shouldClear(target.id, drag.cell.id)) {
        actions.clear();
      }
      return;
    } else if (!monitor.isOver({ shallow: true })) {
      // If hovering over ancestor cell, do nothing (we are going to propagate later in the tree anyways)
      return;
    } else if (drag.cell.id && target.ancestorIds?.includes(drag.cell.id)) {
      if (shouldClear(target.id, drag.cell.id)) {
        actions.clear();
      }
      return;
    } else if (!target.id) {
      // If hovering over something that isn't a cell or hasn't an id, do nothing. Should be an edge case
      logger.warn('Canceled cell drop, no id given.', target, drag);
      return;
    }

    last = { hoverId: target.id, dragId: drag.cell.id };

    // Create a mock DragOverEvent from the monitor
    const mockEvent = {
      active: {
        id: drag.cell.id,
        rect: {
          current: {
            initial: {
              left: 0,
              top: 0,
            },
            translated: null,
          },
        },
      },
      over: {
        id: target.id,
        rect: {
          left: 0,
          top: 0,
        },
      },
    };

    computeAndDispatchHover(
      target,
      drag.cell,
      mockEvent as any,
      element,
      actions,
      cellPlugins
    );
  },
  delay,
  { leading: false }
);

export const onDrop = (
  target: HoverTarget,
  monitor: DndMonitor,
  element: HTMLElement,
  actions: HoverInsertActions,
  cellPlugins: CellPluginList
) => {
  const drag: CellDrag = monitor.getItem();
  if (!drag?.cell) return;
  if (monitor.didDrop() || !monitor.isOver({ shallow: true }) || !target) {
    // If the item drop occurred deeper down the tree, don't do anything
    return;
  } else if (drag.cell.id === target.id) {
    // If the item being dropped on itself do nothing
    actions.cancelCellDrag();
    return;
  } else if (
    target &&
    drag.cell.id &&
    target.ancestorIds?.includes(drag.cell.id)
  ) {
    // If hovering over a child of itself, don't propagate further
    actions.cancelCellDrag();
    return;
  }

  last = { hoverId: target.id, dragId: drag.cell.id };

  // Create a mock DragOverEvent from the monitor
  const mockEvent = {
    active: {
      id: drag.cell.id,
      rect: {
        current: {
          initial: {
            left: 0,
            top: 0,
          },
          translated: null,
        },
      },
    },
    over: {
      id: target.id,
      rect: {
        left: 0,
        top: 0,
      },
    },
  };

  computeAndDispatchInsert(
    target,
    drag.cell,
    mockEvent as any,
    element,
    actions,
    cellPlugins
  );
};
