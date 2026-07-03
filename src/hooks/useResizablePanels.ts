import { useCallback, useEffect, useRef, useState } from 'react';

export function useResizablePanels(initial = 50, min = 25, max = 75) {
  const [leftWidth, setLeftWidth] = useState(initial);
  const [dragging, setDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const onMouseDown = useCallback(() => setDragging(true), []);

  useEffect(() => {
    if (!dragging) return;

    function onMouseMove(e: MouseEvent) {
      const container = containerRef.current;
      if (!container) return;
      const rect = container.getBoundingClientRect();
      const pct = ((e.clientX - rect.left) / rect.width) * 100;
      setLeftWidth(Math.min(max, Math.max(min, pct)));
    }

    function onMouseUp() {
      setDragging(false);
    }

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
    document.body.style.cursor = 'col-resize';
    document.body.style.userSelect = 'none';

    return () => {
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    };
  }, [dragging, min, max]);

  return { containerRef, leftWidth, dragging, onMouseDown };
}
