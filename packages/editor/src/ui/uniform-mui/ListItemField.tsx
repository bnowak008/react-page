import type { ReactNode } from 'react';
import React from 'react';

import { IconButton } from '@mui/material';
import type { ListItemProps } from '@mui/material/ListItem';
import ListItemMaterial from '@mui/material/ListItem';
import Stack from '@mui/material/Stack';
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';

import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { connectField, joinName, useField } from 'uniforms';

import AutoField from './AutoField';
import ListDelField from './ListDelField';
import ListSortField from './ListSortField';

const SORTABLE_TYPE = 'ListItemField';

interface SortableItem {
  id: string;
  index: number;
}

export type ListItemFieldProps = {
  children?: ReactNode;
  dense?: ListItemProps['dense'];
  disableGutters?: ListItemProps['disableGutters'];
  divider?: ListItemProps['divider'];
  removeIcon?: ReactNode;
  dragIcon?: ReactNode;
  moveItemUpIcon?: ReactNode;
  moveItemDownIcon?: ReactNode;
  disableSortable?: boolean;
  value?: unknown;
  name?: string;
};

function ListItem({
  children = <AutoField label={null} name="" />,
  dense = true,
  disableGutters,
  divider,
  removeIcon,
  moveItemUpIcon,
  moveItemDownIcon,
  dragIcon = <DragIndicatorIcon />,
  disableSortable,
  value,
  name,
}: ListItemFieldProps) {
  const nameParts = joinName(null, name);
  const nameIndex = +nameParts[nameParts.length - 1];
  const parentName = joinName(nameParts.slice(0, -1));

  const parent = useField<Record<string, unknown>, unknown[]>(
    parentName,
    {},
    { absoluteName: true }
  )[0];

  const moveItem = (fromIndex: number, toIndex: number) => {
    const value = (parent.value ?? []).slice();
    value.splice(fromIndex, 1);
    value.splice(toIndex, 0, (parent.value ?? [])[fromIndex]);
    parent.onChange(value);
  };

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: name || '',
    data: {
      index: nameIndex,
      type: SORTABLE_TYPE,
    },
    disabled: disableSortable ?? (parent.value ?? []).length < 2,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const disableSort = disableSortable ?? (parent.value ?? []).length < 2;

  return (
    <ListItemMaterial
      dense={dense}
      disableGutters={disableGutters}
      divider={divider}
      ref={setNodeRef}
      style={style}
      sx={{ gap: '0.5rem' }}
    >
      <ListSortField
        name=""
        iconUp={moveItemUpIcon}
        iconDown={moveItemDownIcon}
        handleMove={moveItem}
        dragIcon={dragIcon}
        disabled={disableSort}
        dragHandleProps={{ ...attributes, ...listeners }}
      />

      {children}
      <ListDelField name="" icon={removeIcon} />
    </ListItemMaterial>
  );
}

export default connectField<ListItemFieldProps>(ListItem, {
  initialValue: false,
});
