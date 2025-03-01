import React, { useState, useEffect } from 'react';
import {
  DndContext,
  DragStartEvent,
  DragEndEvent,
  DragCancelEvent,
  DragMoveEvent,
  DragOverEvent,
  UniqueIdentifier,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import { useOption } from '../components/hooks';
import type { PropsWithChildren } from 'react';

const DndKitProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const dndBackend = useOption('dndBackend');
  const [activeId, setActiveId] = useState<string | null>(null);
  
  // Debug logging
  useEffect(() => {
    console.log('[DndKitProvider] Initialized');
    console.log('[DndKitProvider] dndBackend:', dndBackend);
    
    return () => {
      console.log('[DndKitProvider] Unmounted');
    };
  }, [dndBackend]);
  
  // Set up default sensors with debug
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5, // 5px
      },
    })
  );
  
  useEffect(() => {
    console.log('[DndKitProvider] Sensors configured');
  }, [sensors]);
  
  // Handle drag start event
  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    console.log('[DndKitProvider] Drag started:', {
      id: active.id,
      data: active.data.current,
    });
    
    // Convert UniqueIdentifier to string if it's not already
    setActiveId(String(active.id));
  };

  // Handle drag move event
  const handleDragMove = (event: DragMoveEvent) => {
    console.log('[DndKitProvider] Drag move:', {
      activeId: event.active.id,
      overItem: event.over?.id,
    });
  };
  
  // Handle drag over event
  const handleDragOver = (event: DragOverEvent) => {
    console.log('[DndKitProvider] Drag over:', {
      activeId: event.active.id,
      overItem: event.over?.id,
    });
  };

  // Handle drag end event
  const handleDragEnd = (event: DragEndEvent) => {
    console.log('[DndKitProvider] Drag ended:', {
      activeId: event.active.id,
      overItem: event.over?.id,
      delta: event.delta,
    });
    setActiveId(null);
  };

  // Handle drag cancel event
  const handleDragCancel = (event: DragCancelEvent) => {
    console.log('[DndKitProvider] Drag cancelled:', {
      activeId: event.active.id,
    });
    setActiveId(null);
  };

  // Always use DndContext with sensors, regardless of dndBackend
  return (
    <DndContext
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragMove={handleDragMove}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
      onDragCancel={handleDragCancel}
    >
      {children}
    </DndContext>
  );
};

export default DndKitProvider; 