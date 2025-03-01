import React from 'react';
import { 
  useDraggable, 
  useDroppable, 
  DragOverlay,
  useSensor,
  useSensors,
  PointerSensor,
  type DragEndEvent,
  type DragStartEvent,
  type DragOverEvent,
  type DragCancelEvent,
  useDndMonitor
} from '@dnd-kit/core';
import type { CellDrag } from '../../types';
import { useState, useEffect } from 'react';

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
  
  // Debug logging on initialization
  React.useEffect(() => {
    console.log(`[useDndKitDrag:${id}] Initialized with type:`, type);
    console.log(`[useDndKitDrag:${id}] canDrag:`, canDrag);
    
    return () => {
      console.log(`[useDndKitDrag:${id}] Unmounted`);
    };
  }, [id, type, canDrag]);
  
  // Initialize the item data
  React.useEffect(() => {
    const currentItem = item();
    itemRef.current = currentItem;
    console.log(`[useDndKitDrag:${id}] Item updated:`, currentItem);
  }, [id, item]);
  
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5, // 5px
      },
    })
  );
  
  React.useEffect(() => {
    console.log(`[useDndKitDrag:${id}] Sensors configured`);
  }, [id, sensors]);
  
  const { attributes, listeners, setNodeRef, transform, isDragging: isDraggingFromKit } = useDraggable({
    id,
    data: {
      type,
      item: itemRef.current,
    },
    disabled: !canDrag,
  });
  
  // Log when draggable state changes
  React.useEffect(() => {
    console.log(`[useDndKitDrag:${id}] isDraggingFromKit:`, isDraggingFromKit);
    console.log(`[useDndKitDrag:${id}] transform:`, transform);
  }, [id, isDraggingFromKit, transform]);
  
  const handleDragStart = (event: DragStartEvent) => {
    console.log(`[useDndKitDrag:${id}] handleDragStart called:`, event.active.id);
    
    if (event.active.id === id) {
      const currentItem = item();
      itemRef.current = currentItem;
      
      console.log(`[useDndKitDrag:${id}] Drag started with item:`, currentItem);
      
      // Update the active drag item data
      if (event.active.data.current) {
        event.active.data.current.item = currentItem;
        console.log(`[useDndKitDrag:${id}] Updated active.data.current:`, event.active.data.current);
      } else {
        console.warn(`[useDndKitDrag:${id}] event.active.data.current is undefined`);
      }
      
      setIsDragging(true);
    }
  };
  
  const handleDragEnd = (event: DragEndEvent) => {
    console.log(`[useDndKitDrag:${id}] handleDragEnd called:`, {
      activeId: event.active.id,
      overId: event.over?.id,
      isDragging
    });
    
    if (event.active.id === id) {
      console.log(`[useDndKitDrag:${id}] Drag ended for this item`);
      setIsDragging(false);
      
      if (end && itemRef.current) {
        const didDrop = !!event.over;
        console.log(`[useDndKitDrag:${id}] Calling end handler with didDrop:`, didDrop);
        end(itemRef.current, didDrop);
      }
    }
  };
  
  const handleDragCancel = (event: DragCancelEvent) => {
    console.log(`[useDndKitDrag:${id}] handleDragCancel called:`, {
      activeId: event.active.id,
      isDragging
    });
    
    if (event.active.id === id) {
      console.log(`[useDndKitDrag:${id}] Drag cancelled for this item`);
      setIsDragging(false);
      
      if (end && itemRef.current) {
        console.log(`[useDndKitDrag:${id}] Calling end handler with didDrop: false`);
        end(itemRef.current, false);
      }
    }
  };
  
  const style = transform ? {
    transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
  } : undefined;
  
  const dragRef = React.useCallback((node: HTMLElement | null) => {
    if (node) {
      setNodeRef(node);
    }
  }, [setNodeRef]);
  
  // Create a preview element similar to DragPreviewImage
  const previewElement = null; // We'll use DragOverlay in the DndKitProvider instead
  
  return [
    { isDragging, ...(collect ? collect(isDragging) : {}) },
    dragRef,
    previewElement,
    { attributes, listeners, style, handleDragStart, handleDragEnd, handleDragCancel, sensors }
  ] as const;
};

/**
 * Custom hook to replace react-dnd's useDrop
 * @param options Options for the droppable element
 * @returns [collected, dropRef]
 */
export const useDndKitDrop = <T, R>(options: DndDropOptions) => {
  const [collected, setCollected] = useState<R>(() => 
    options.collect({ 
      getItem: () => null, 
      isOver: () => false,
      didDrop: () => false
    })
  );
  
  const [item, setItem] = useState<T | null>(null);
  const [isOver, setIsOver] = useState(false);
  const [didDrop, setDidDrop] = useState(false);
  
  const dropId = React.useId();
  
  // Debug logging on initialization
  React.useEffect(() => {
    console.log(`[useDndKitDrop:${dropId}] Initialized with accept:`, options.accept);
    
    return () => {
      console.log(`[useDndKitDrop:${dropId}] Unmounted`);
    };
  }, [dropId, options.accept]);
  
  const { setNodeRef, isOver: isOverFromKit } = useDroppable({
    id: dropId,
  });
  
  // Log when droppable state changes
  React.useEffect(() => {
    console.log(`[useDndKitDrop:${dropId}] isOverFromKit:`, isOverFromKit);
  }, [dropId, isOverFromKit]);
  
  // Log state changes
  React.useEffect(() => {
    console.log(`[useDndKitDrop:${dropId}] State updated:`, { isOver, item, didDrop });
  }, [dropId, isOver, item, didDrop]);
  
  useDndMonitor({
    onDragStart(event) {
      console.log(`[useDndKitDrop:${dropId}] onDragStart:`, {
        activeId: event.active.id,
        activeData: event.active.data.current
      });
      
      // Reset state on drag start
      setIsOver(false);
      setItem(null);
      setDidDrop(false);
    },
    onDragOver(event) {
      console.log(`[useDndKitDrop:${dropId}] onDragOver:`, {
        activeId: event.active.id,
        overId: event.over?.id,
        isThisTarget: event.over?.id === dropId
      });
      
      // Check if this is the target being dragged over
      if (event.over?.id !== dropId) {
        if (isOver) {
          console.log(`[useDndKitDrop:${dropId}] No longer over this target`);
          setIsOver(false);
          
          // Update collected props
          const monitor: DndMonitor = {
            getItem: () => item,
            isOver: () => false,
            didDrop: () => didDrop
          };
          
          setCollected(options.collect(monitor));
        }
        return;
      }
      
      // Check if the dragged item is of the accepted type
      const dragType = event.active.data.current?.type;
      console.log(`[useDndKitDrop:${dropId}] Drag type:`, dragType);
      
      const isAccepted = Array.isArray(options.accept)
        ? options.accept.includes(dragType)
        : dragType === options.accept;
      
      console.log(`[useDndKitDrop:${dropId}] Is accepted:`, isAccepted);
        
      if (!isAccepted) {
        console.log(`[useDndKitDrop:${dropId}] Item type not accepted`);
        return;
      }
      
      // Get the dragged item
      const draggedItem = event.active.data.current?.item;
      console.log(`[useDndKitDrop:${dropId}] Dragged item:`, draggedItem);
      
      setItem(draggedItem);
      setIsOver(true);
      
      // Update collected props
      const monitor: DndMonitor = {
        getItem: () => draggedItem,
        isOver: (opts) => true,
        didDrop: () => false
      };
      
      const newCollected = options.collect(monitor);
      console.log(`[useDndKitDrop:${dropId}] New collected props:`, newCollected);
      setCollected(newCollected);
    },
    onDragEnd(event) {
      console.log(`[useDndKitDrop:${dropId}] onDragEnd:`, {
        activeId: event.active.id,
        overId: event.over?.id,
        isOver,
        item
      });
      
      if (!isOver || !item) {
        console.log(`[useDndKitDrop:${dropId}] Not over this target or no item, skipping drop`);
        return;
      }
      
      // Check if the drop happened on this droppable
      const wasDroppedOnThis = event.over?.id === dropId;
      console.log(`[useDndKitDrop:${dropId}] Was dropped on this:`, wasDroppedOnThis);
      
      if (wasDroppedOnThis && options.drop) {
        console.log(`[useDndKitDrop:${dropId}] Calling drop handler with item:`, item);
        setDidDrop(true);
        
        const monitor: DndMonitor = {
          getItem: () => item,
          isOver: () => false,
          didDrop: () => true
        };
        
        // Call the drop handler
        options.drop(item, monitor);
      }
      
      // Reset state
      setIsOver(false);
      setItem(null);
      setDidDrop(false);
      
      // Update collected props
      const monitor: DndMonitor = {
        getItem: () => null,
        isOver: () => false,
        didDrop: () => wasDroppedOnThis
      };
      
      const newCollected = options.collect(monitor);
      console.log(`[useDndKitDrop:${dropId}] Final collected props:`, newCollected);
      setCollected(newCollected);
    },
    onDragCancel() {
      console.log(`[useDndKitDrop:${dropId}] onDragCancel`);
      
      // Reset state
      setIsOver(false);
      setItem(null);
      setDidDrop(false);
      
      // Update collected props
      const monitor: DndMonitor = {
        getItem: () => null,
        isOver: () => false,
        didDrop: () => false
      };
      
      const newCollected = options.collect(monitor);
      console.log(`[useDndKitDrop:${dropId}] Cancelled collected props:`, newCollected);
      setCollected(newCollected);
    }
  });
  
  const dropRefCallback = React.useCallback((node: HTMLElement | null) => {
    if (node) {
      setNodeRef(node);
    }
  }, [setNodeRef]);
  
  return [collected, dropRefCallback] as const;
}; 