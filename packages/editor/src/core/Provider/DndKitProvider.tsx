import React, { useState, useCallback, useMemo } from 'react';
import type {
  DragStartEvent,
  DragEndEvent,
  DragCancelEvent,
  DragMoveEvent,
  DragOverEvent,
} from '@dnd-kit/core';
import {
  DndContext,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import { useOption } from '../components/hooks';
import type { PropsWithChildren } from 'react';

const DndKitProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const dndBackend = useOption('dndBackend');
  const [activeId, setActiveId] = useState<string | null>(null);
  
  // Use a ref to track active drag state to avoid unnecessary re-renders
  const activeIdRef = React.useRef<string | null>(null);

  // Set up default sensors with debug - memoize to prevent recreation on each render
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5, // 5px
      },
    })
  );

  // Handle drag start event
  const handleDragStart = useCallback((event: DragStartEvent) => {
    const { active } = event;
    // Convert UniqueIdentifier to string if it's not already
    const id = String(active.id);
    activeIdRef.current = id;
    setActiveId(id);
  }, []);

  // Handle drag move event - keep minimal to avoid performance issues
  const handleDragMove = useCallback((event: DragMoveEvent) => {
    // Intentionally left minimal
  }, []);

  // Handle drag over event - keep minimal to avoid performance issues
  const handleDragOver = useCallback((event: DragOverEvent) => {
    // Intentionally left minimal
  }, []);

  // Handle drag end event
  const handleDragEnd = useCallback((event: DragEndEvent) => {
    activeIdRef.current = null;
    setActiveId(null);
  }, []);

  // Handle drag cancel event
  const handleDragCancel = useCallback((event: DragCancelEvent) => {
    activeIdRef.current = null;
    setActiveId(null);
  }, []);

  // Memoize the event handlers to prevent unnecessary re-renders
  const eventHandlers = useMemo(() => ({
    onDragStart: handleDragStart,
    onDragMove: handleDragMove,
    onDragOver: handleDragOver,
    onDragEnd: handleDragEnd,
    onDragCancel: handleDragCancel,
  }), [
    handleDragStart,
    handleDragMove,
    handleDragOver,
    handleDragEnd,
    handleDragCancel
  ]);

  // Always use DndContext with sensors, regardless of dndBackend
  return (
    <DndContext
      sensors={sensors}
      {...eventHandlers}
    >
      {children}
    </DndContext>
  );
};

export default React.memo(DndKitProvider);
