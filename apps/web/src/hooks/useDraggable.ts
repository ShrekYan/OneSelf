/**
 * Custom hook for draggable component using HammerJS
 * Supports boundary clamping and edge snapping
 */

import { useEffect, useRef, useState } from 'react';
import Hammer from 'hammerjs';

export interface UseDraggableOptions {
  /** Initial X position */
  initialX?: number;
  /** Initial Y position */
  initialY?: number;
  /** Container width (for boundary calculation) */
  containerWidth: number;
  /** Container height (for boundary calculation) */
  containerHeight: number;
  /** Enable snapping to left/right edges */
  enableSnap?: boolean;
  /** Threshold in pixels to trigger snap */
  snapThreshold?: number;
  /** Safe area top margin (avoid status bar) */
  safeTop?: number;
  /** Safe area bottom margin (avoid home indicator) */
  safeBottom?: number;
  /** Safe area left margin */
  safeLeft?: number;
  /** Safe area right margin */
  safeRight?: number;
  /** Callback when position changes */
  onPositionChange?: (x: number, y: number) => void;
}

export interface UseDraggableResult {
  /** Current X position */
  x: number;
  /** Current Y position */
  y: number;
  /** Whether currently dragging */
  isDragging: boolean;
  /** Bind the hammer instance to element */
  bindDrag: (element: HTMLElement | null) => void;
}

/**
 * useDraggable - A custom hook for making elements draggable with HammerJS
 * Handles boundary clamping and automatic edge snapping
 */
export function useDraggable(options: UseDraggableOptions): UseDraggableResult {
  const {
    initialX = 0,
    initialY = 0,
    containerWidth,
    containerHeight,
    enableSnap = true,
    snapThreshold = 80,
    safeTop = 20,
    safeBottom = 20,
    safeLeft = 0,
    safeRight = 0,
    onPositionChange,
  } = options;

  const [x, setX] = useState<number>(initialX);
  const [y, setY] = useState<number>(initialY);
  const [isDragging, setIsDragging] = useState<boolean>(false);

  const hammerRef = useRef<HammerManager | null>(null);
  const elementRef = useRef<HTMLElement | null>(null);
  const currentXRef = useRef<number>(initialX);
  const currentYRef = useRef<number>(initialY);
  const startXRef = useRef<number>(initialX);
  const startYRef = useRef<number>(initialY);

  // Update ref when state changes
  currentXRef.current = x;
  currentYRef.current = y;

  // Update position when initialX/initialY changes (asynchronous calculation)
  useEffect(() => {
    if (initialX !== x) {
      setX(initialX);
    }
    if (initialY !== y) {
      setY(initialY);
    }
  }, [initialX, initialY]);

  // Calculate boundary limits
  const getBounds = () => {
    const screenWidth = window.innerWidth;
    const screenHeight = window.innerHeight;

    return {
      minX: safeLeft,
      maxX: screenWidth - containerWidth - safeRight,
      minY: safeTop,
      maxY: screenHeight - containerHeight - safeBottom,
    };
  };

  // Clamp position within boundaries
  const clampPosition = (
    newX: number,
    newY: number,
  ): { x: number; y: number } => {
    const bounds = getBounds();
    return {
      x: Math.max(bounds.minX, Math.min(bounds.maxX, newX)),
      y: Math.max(bounds.minY, Math.min(bounds.maxY, newY)),
    };
  };

  // Calculate snap position when dragging ends
  const getSnappedPosition = (
    currentX: number,
    currentY: number,
  ): { x: number; y: number } => {
    if (!enableSnap) {
      return { x: currentX, y: currentY };
    }

    const bounds = getBounds();
    const centerX = currentX + containerWidth / 2;
    const screenWidth = window.innerWidth;

    const distanceToLeft = centerX;
    const distanceToRight = screenWidth - centerX;

    let snappedX = currentX;

    if (distanceToLeft <= snapThreshold) {
      snappedX = bounds.minX;
    } else if (distanceToRight <= snapThreshold) {
      snappedX = bounds.maxX;
    }

    return { x: snappedX, y: currentY };
  };

  // Initialize HammerJS
  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    // Create Hammer instance
    const hammer = new Hammer(element);
    hammerRef.current = hammer;

    // Configure pan recognizer
    const pan = new Hammer.Pan({
      direction: Hammer.DIRECTION_ALL,
      threshold: 5, // Minimum movement to trigger drag (avoid accidental clicks)
    });
    hammer.add(pan);

    // Pan start
    hammer.on('panstart', () => {
      setIsDragging(true);
      startXRef.current = currentXRef.current;
      startYRef.current = currentYRef.current;
    });

    // Pan move
    hammer.on('panmove', e => {
      const newX = startXRef.current + e.deltaX;
      const newY = startYRef.current + e.deltaY;
      const clamped = clampPosition(newX, newY);

      setX(clamped.x);
      setY(clamped.y);
      onPositionChange?.(clamped.x, clamped.y);
    });

    // Pan end
    hammer.on('panend', () => {
      setIsDragging(false);
      const clamped = clampPosition(currentXRef.current, currentYRef.current);
      const snapped = getSnappedPosition(clamped.x, clamped.y);

      if (
        snapped.x !== currentXRef.current ||
        snapped.y !== currentYRef.current
      ) {
        setX(snapped.x);
        setY(snapped.y);
        onPositionChange?.(snapped.x, snapped.y);
      }
    });

    // Cleanup
    return () => {
      hammer.destroy();
      hammerRef.current = null;
    };
  }, [
    containerWidth,
    containerHeight,
    enableSnap,
    snapThreshold,
    safeTop,
    safeBottom,
    safeLeft,
    safeRight,
    onPositionChange,
  ]);

  // Handle window resize to re-clamp position
  useEffect(() => {
    const handleResize = () => {
      const clamped = clampPosition(currentXRef.current, currentYRef.current);
      if (
        clamped.x !== currentXRef.current ||
        clamped.y !== currentYRef.current
      ) {
        setX(clamped.x);
        setY(clamped.y);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [containerWidth, containerHeight]);

  const bindDrag = (element: HTMLElement | null) => {
    elementRef.current = element;
  };

  return {
    x,
    y,
    isDragging,
    bindDrag,
  };
}
