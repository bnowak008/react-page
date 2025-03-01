import type { DragOverEvent } from '@dnd-kit/core';
import type { CellPluginList, PartialCell } from '../../types';
import type { HoverInsertActions, Room, Vector } from '../../types/hover';
import type { HoverTarget } from './computeHover';
import { computeHover } from './computeHover';

const computeCurrentDropPosition = (
  actions: HoverInsertActions,
  hover: HoverTarget,
  drag: PartialCell,
  event: DragOverEvent,
  element: HTMLElement,
  cellPlugins: CellPluginList
) => {
  const mousePosition = {
    x: event.active?.rect?.current?.initial?.left ?? 0,
    y: event.active?.rect?.current?.initial?.top ?? 0,
  };

  const componentPosition = element.getBoundingClientRect();
  const room: Room = {
    height: componentPosition.bottom - componentPosition.top,
    width: componentPosition.right - componentPosition.left,
  };

  const mouse: Vector = {
    y: mousePosition.y - componentPosition.top,
    x: mousePosition.x - componentPosition.left,
  };

  computeHover(drag, hover, actions, {
    room,
    mouse,
    cellPlugins,
  });
};

export const computeAndDispatchInsert = (
  hover: HoverTarget,
  drag: PartialCell,
  event: DragOverEvent,
  element: HTMLElement,
  actions: HoverInsertActions,
  cellPlugins: CellPluginList
) => {
  return computeCurrentDropPosition(
    actions,
    hover,
    drag,
    event,
    element,
    cellPlugins
  );
};

export const computeAndDispatchHover = (
  hover: HoverTarget,
  drag: PartialCell,
  event: DragOverEvent,
  element: HTMLElement,
  actions: HoverInsertActions,
  cellPlugins: CellPluginList
) =>
  computeCurrentDropPosition(actions, hover, drag, event, element, cellPlugins);
