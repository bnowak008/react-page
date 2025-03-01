import type { ListProps } from '@mui/material/List';
import ListMaterial from '@mui/material/List';
import ListSubheader from '@mui/material/ListSubheader';
import type { ReactNode } from 'react';
import React, { Children, cloneElement, isValidElement, useState } from 'react';
import type { DragEndEvent } from '@dnd-kit/core';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import type { FieldProps } from 'uniforms';
import { connectField, filterDOMProps } from 'uniforms';

import ListAddField from './ListAddField';
import ListItemField from './ListItemField';

const SORTABLE_TYPE = 'ListItemField';

export type ListFieldProps = FieldProps<
  unknown[],
  ListProps,
  {
    addIcon?: ReactNode;
    initialCount?: number;
    itemProps?: Record<string, unknown>;
  }
>;

function List({
  addIcon,
  children = <ListItemField name="$" />,
  initialCount,
  itemProps,
  label,
  value,
  onChange,
  ...props
}: ListFieldProps) {
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = active.data.current?.index;
      const newIndex = over.data.current?.index;

      if (
        typeof oldIndex === 'number' &&
        typeof newIndex === 'number' &&
        onChange &&
        value
      ) {
        const newValue = [...value];
        const [removed] = newValue.splice(oldIndex, 1);
        newValue.splice(newIndex, 0, removed);
        onChange(newValue);
      }
    }
  };

  const items = value?.map((_, index) => `${index}`) || [];

  return (
    <>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext items={items} strategy={verticalListSortingStrategy}>
          <ListMaterial
            dense
            subheader={
              label ? (
                <ListSubheader disableSticky>{label}</ListSubheader>
              ) : undefined
            }
            {...filterDOMProps(props)}
          >
            {value?.map((item, itemIndex) =>
              Children.map(children, (child, childIndex) =>
                isValidElement(child)
                  ? cloneElement(child, {
                      key: `${itemIndex}-${childIndex}`,
                      name: child.props.name?.replace('$', '' + itemIndex),
                      ...itemProps,
                      // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    } as any)
                  : child
              )
            )}
          </ListMaterial>
        </SortableContext>
      </DndContext>
      <ListAddField icon={addIcon} initialCount={initialCount} name="$" />
    </>
  );
}

export default connectField<ListFieldProps>(List);
