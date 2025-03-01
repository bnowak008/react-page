import React from 'react';
import type {
  DragEndEvent,
  DragStartEvent,
  DragCancelEvent,
} from '@dnd-kit/core';
import {
  useDraggable,
  useDroppable,
  DragOverlay,
  useSensor,
  useSensors,
  PointerSensor,
  type DragOverEvent,
  useDndMonitor,
} from '@dnd-kit/core';
import type { CellDrag } from '../../types';
import { useState, useEffect, useCallback } from 'react';

export type DndMonitor = {
  getItem: () => any;
  isOver: (options?: { shallow?: boolean }) => boolean;
  didDrop: () => boolean;
};

export interface DndDropOptions {
  accept: string | string[];
  collect: (monitor: DndMonitor) => any;
  drop?: (item: any, monitor: DndMonitor) => void;
}

export interface DndDragOptions {
  type: string;
  item: any;
  collect?: (monitor: DndMonitor) => any;
  end?: (item: any, monitor: DndMonitor) => void;
}

/**
 * Custom hook to replace react-dnd's useDrag
 * @param options Options for the draggable element
 * @returns [isDragging, dragRef, previewElement]
 */
export const useDndKitDrag = <T extends CellDrag>(options: {
  type: string;
  item: () => T;
  canDrag?: boolean;
  collect?: (isDragging: boolean) => any;
  end?: (item: T, didDrop: boolean) => void;
}) => {
  const { type, item, canDrag = true, collect, end } = options;
  const id = React.useId();
  const itemRef = React.useRef<T | null>(null);
  const [isDragging, setIsDragging] = React.useState(false);

  // Initialize the item data - only when dependencies change
  const getItem = useCallback(() => {
    const currentItem = item();
    itemRef.current = currentItem;
    return currentItem;
  }, [item]);

  // Configure sensors once
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5, // 5px
      },
    })
  );

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    isDragging: isDraggingFromKit,
  } = useDraggable({
    id,
    data: {
      type,
      item: getItem,
    },
    disabled: !canDrag,
  });

  // Update local isDragging state when dnd-kit's state changes
  React.useEffect(() => {
    if (isDragging !== isDraggingFromKit) {
      setIsDragging(isDraggingFromKit);
    }
  }, [isDraggingFromKit]);

  const handleDragStart = useCallback((event: DragStartEvent) => {
    if (event.active.id === id) {
      const currentItem = getItem();
      
      // Update the active drag item data
      if (event.active.data.current) {
        event.active.data.current.item = currentItem;
      }
    }
  }, [id, getItem]);

  const handleDragEnd = useCallback((event: DragEndEvent) => {
    if (event.active.id === id && end && itemRef.current) {
      const didDrop = !!event.over;
      end(itemRef.current, didDrop);
    }
  }, [id, end]);

  const handleDragCancel = useCallback((event: DragCancelEvent) => {
    if (event.active.id === id && end && itemRef.current) {
      end(itemRef.current, false);
    }
  }, [id, end]);

  const style = transform
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
      }
    : undefined;

  const dragRef = useCallback(
    (node: HTMLElement | null) => {
      if (node) {
        setNodeRef(node);
      }
    },
    [setNodeRef]
  );

  // Create a preview element similar to DragPreviewImage
  const previewElement = null; // We'll use DragOverlay in the DndKitProvider instead

  // Memoize the collected props to prevent unnecessary re-renders
  const collectedProps = React.useMemo(() => {
    return { isDragging, ...(collect ? collect(isDragging) : {}) };
  }, [isDragging, collect]);

  return [
    collectedProps,
    dragRef,
    previewElement,
    {
      attributes,
      listeners,
      style,
      handleDragStart,
      handleDragEnd,
      handleDragCancel,
      sensors,
    },
  ] as const;
};

/**
 * Custom hook to replace react-dnd's useDrop
 * @param options Options for the droppable element
 * @returns [collected, dropRef]
 */
export const useDndKitDrop = <T, R>(options: DndDropOptions) => {
  const dropId = React.useId();
  const optionsRef = React.useRef(options);
  
  // Update the ref when options change
  React.useEffect(() => {
    optionsRef.current = options;
  }, [options]);

  // Use a ref to track state to avoid dependency cycles in callbacks
  const stateRef = React.useRef({
    item: null as T | null,
    isOver: false,
    didDrop: false
  });

  const [state, setState] = React.useState({
    item: null as T | null,
    isOver: false,
    didDrop: false
  });

  // Update the ref when state changes
  React.useEffect(() => {
    stateRef.current = state;
  }, [state]);

  // Create a stable monitor object that always reads from the ref
  const monitor = React.useMemo(() => ({
    getItem: () => stateRef.current.item,
    isOver: () => stateRef.current.isOver,
    didDrop: () => stateRef.current.didDrop,
  }), []); // No dependencies to prevent unnecessary re-renders

  // Memoize the collected props to prevent unnecessary re-renders
  const [collected, setCollected] = useState(() => 
    options.collect({
      getItem: () => null,
      isOver: () => false,
      didDrop: () => false,
    })
  );

  // Update collected props when state changes
  React.useEffect(() => {
    // Only update collected props if the state has actually changed
    const newCollected = optionsRef.current.collect(monitor);
    
    // Use a more reliable way to compare objects than JSON.stringify
    const hasChanged = Object.keys(newCollected).some(key => {
      // @ts-ignore - We don't know the exact shape of collected props
      return newCollected[key] !== collected[key];
    });
    
    if (hasChanged) {
      setCollected(newCollected);
    }
  }, [state, monitor, collected]);

  const { setNodeRef, isOver: isOverFromKit } = useDroppable({
    id: dropId,
  });

  // Handle drag events with useCallback to prevent unnecessary re-renders
  const handleDragStart = useCallback(() => {
    setState({
      item: null,
      isOver: false,
      didDrop: false
    });
  }, []);

  const handleDragOver = useCallback((event: DragOverEvent) => {
    // Check if this is the target being dragged over
    if (event.over?.id !== dropId) {
      if (stateRef.current.isOver) {
        setState({
          ...stateRef.current,
          isOver: false
        });
      }
      return;
    }

    // Check if the dragged item is of the accepted type
    const dragType = event.active.data.current?.type;
    const accept = optionsRef.current.accept;
    
    const isAccepted = Array.isArray(accept)
      ? accept.includes(dragType)
      : dragType === accept;

    if (!isAccepted) {
      return;
    }

    // Get the dragged item
    const draggedItem = event.active.data.current?.item;
    if (typeof draggedItem === 'function') {
      const item = draggedItem();
      if (!stateRef.current.isOver || stateRef.current.item !== item) {
        setState({
          item,
          isOver: true,
          didDrop: false
        });
      }
    } else if (!stateRef.current.isOver || stateRef.current.item !== draggedItem) {
      setState({
        item: draggedItem,
        isOver: true,
        didDrop: false
      });
    }
  }, [dropId]);

  const handleDragEnd = useCallback((event: DragEndEvent) => {
    const currentState = stateRef.current;
    if (!currentState.isOver || !currentState.item) {
      return;
    }

    // Check if the drop happened on this droppable
    const wasDroppedOnThis = event.over?.id === dropId;

    if (wasDroppedOnThis && optionsRef.current.drop) {
      // Call the drop handler with the current state
      optionsRef.current.drop(currentState.item, {
        getItem: () => currentState.item,
        isOver: () => false,
        didDrop: () => true,
      });
      
      // Set didDrop to true before resetting
      setState((prev: typeof state) => ({
        ...prev,
        didDrop: true
      }));
      
      // Reset state after a short delay to allow the drop handler to complete
      setTimeout(() => {
        setState({
          item: null,
          isOver: false,
          didDrop: false
        });
      }, 0);
    } else {
      // Reset state immediately if no drop occurred
      setState({
        item: null,
        isOver: false,
        didDrop: false
      });
    }
  }, [dropId]);

  const handleDragCancel = useCallback(() => {
    // Reset state
    setState({
      item: null,
      isOver: false,
      didDrop: false
    });
  }, []);

  // Register event handlers
  useDndMonitor({
    onDragStart: handleDragStart,
    onDragOver: handleDragOver,
    onDragEnd: handleDragEnd,
    onDragCancel: handleDragCancel,
  });

  const dropRefCallback = useCallback(
    (node: HTMLElement | null) => {
      if (node) {
        setNodeRef(node);
      }
    },
    [setNodeRef]
  );

  return [collected, dropRefCallback] as const;
};

/**
 * Custom hook to replace react-draggable for resizing functionality
 * @param options Options for the resizable element
 * @returns [position, setNodeRef, listeners, attributes, style]
 */
export const useDndKitResize = (options: {
  id?: string;
  axis?: 'x' | 'y' | 'both';
  bounds?: {
    left?: number;
    right?: number;
    top?: number;
    bottom?: number;
  };
  grid?: [number, number];
  position: { x: number; y: number };
  onDrag?: (delta: { x: number; y: number }) => void;
  disabled?: boolean;
}) => {
  const {
    id: providedId,
    axis = 'both',
    bounds,
    grid,
    position,
    onDrag,
    disabled = false,
  } = options;
  
  // Generate a unique ID if not provided
  const generatedId = React.useId();
  const id = providedId || `resize-${generatedId}`;
  
  // Track the current position
  const [currentPosition, setCurrentPosition] = React.useState(position);
  
  // Update position when props change
  React.useEffect(() => {
    setCurrentPosition(position);
  }, [position.x, position.y]);
  
  // Track the start position for calculating deltas
  const startPositionRef = React.useRef({ x: 0, y: 0 });
  
  // Configure sensors with appropriate constraints
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 0, // Start dragging immediately
      },
    })
  );
  
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    isDragging,
  } = useDraggable({
    id,
    data: {
      type: 'resize',
      position: currentPosition,
    },
    disabled,
  });
  
  // Handle drag movement with constraints
  const handleDragMove = useCallback((event: DragOverEvent) => {
    if (event.active.id !== id) return;
    
    // Calculate the new position based on the transform
    let deltaX = transform?.x || 0;
    let deltaY = transform?.y || 0;
    
    // Apply axis constraints
    if (axis === 'x') deltaY = 0;
    if (axis === 'y') deltaX = 0;
    
    // Apply grid constraints if specified
    if (grid) {
      deltaX = Math.round(deltaX / grid[0]) * grid[0];
      deltaY = Math.round(deltaY / grid[1]) * grid[1];
    }
    
    // Apply boundary constraints if specified
    if (bounds) {
      const newX = position.x + deltaX;
      const newY = position.y + deltaY;
      
      if (bounds.left !== undefined && newX < bounds.left) {
        deltaX = bounds.left - position.x;
      }
      if (bounds.right !== undefined && newX > bounds.right) {
        deltaX = bounds.right - position.x;
      }
      if (bounds.top !== undefined && newY < bounds.top) {
        deltaY = bounds.top - position.y;
      }
      if (bounds.bottom !== undefined && newY > bounds.bottom) {
        deltaY = bounds.bottom - position.y;
      }
    }
    
    // Call the onDrag callback with the delta
    if (onDrag) {
      onDrag({ x: deltaX, y: deltaY });
    }
    
    // Update the current position
    setCurrentPosition({
      x: position.x + deltaX,
      y: position.y + deltaY,
    });
  }, [id, transform, axis, grid, bounds, position, onDrag]);
  
  // Register the drag move handler
  useDndMonitor({
    onDragMove: handleDragMove,
  });
  
  // Create a style object for positioning
  const style = {
    position: 'absolute' as const,
    left: `${currentPosition.x}px`,
    top: `${currentPosition.y}px`,
    touchAction: 'none',
  };
  
  return [currentPosition, setNodeRef, listeners, attributes, style, isDragging] as const;
};
