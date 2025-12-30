import { useState, useRef, useCallback, useEffect } from 'react';

function Node({
  node,
  onDragStart,
  onDrag,
  onDragEnd,
  onColorChange,
  onDelete
}) {
  const [isHovered, setIsHovered] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const nodeRef = useRef(null);
  const colorInputRef = useRef(null);
  const dragStartPosRef = useRef({ x: 0, y: 0 });
  const wasDraggedRef = useRef(false);
  const longPressTimerRef = useRef(null);

  const x = node.displayX ?? node.x;
  const y = node.displayY ?? node.y;

  // Handle right-click to open color picker
  const handleContextMenu = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    if (colorInputRef.current) {
      colorInputRef.current.click();
    }
  }, []);

  // Handle mouse down - start potential drag
  const handleMouseDown = useCallback((e) => {
    if (e.button !== 0) return; // Only left click
    e.stopPropagation();
    e.preventDefault();

    setIsDragging(true);
    wasDraggedRef.current = false;
    dragStartPosRef.current = { x: e.clientX, y: e.clientY };

    if (onDragStart) {
      onDragStart(node.id);
    }
  }, [node.id, onDragStart]);

  // Handle touch start for mobile (with long press for color picker)
  const handleTouchStart = useCallback((e) => {
    e.stopPropagation();
    if (e.touches.length > 0) {
      const touch = e.touches[0];
      setIsDragging(true);
      wasDraggedRef.current = false;
      dragStartPosRef.current = { x: touch.clientX, y: touch.clientY };

      // Long press to open color picker
      longPressTimerRef.current = setTimeout(() => {
        if (!wasDraggedRef.current && colorInputRef.current) {
          colorInputRef.current.click();
        }
      }, 500);

      if (onDragStart) {
        onDragStart(node.id);
      }
    }
  }, [node.id, onDragStart]);

  // Handle mouse move
  useEffect(() => {
    if (!isDragging) return;

    const handleMouseMove = (e) => {
      const dx = e.clientX - dragStartPosRef.current.x;
      const dy = e.clientY - dragStartPosRef.current.y;

      if (Math.abs(dx) > 5 || Math.abs(dy) > 5) {
        wasDraggedRef.current = true;
        // Cancel long press if user starts dragging
        if (longPressTimerRef.current) {
          clearTimeout(longPressTimerRef.current);
          longPressTimerRef.current = null;
        }
      }

      if (onDrag) {
        onDrag(node.id, e.clientX, e.clientY);
      }
    };

    const handleTouchMove = (e) => {
      if (e.touches.length > 0) {
        const touch = e.touches[0];
        const dx = touch.clientX - dragStartPosRef.current.x;
        const dy = touch.clientY - dragStartPosRef.current.y;

        if (Math.abs(dx) > 5 || Math.abs(dy) > 5) {
          wasDraggedRef.current = true;
          if (longPressTimerRef.current) {
            clearTimeout(longPressTimerRef.current);
            longPressTimerRef.current = null;
          }
        }

        if (onDrag) {
          onDrag(node.id, touch.clientX, touch.clientY);
        }
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      if (longPressTimerRef.current) {
        clearTimeout(longPressTimerRef.current);
        longPressTimerRef.current = null;
      }
      if (onDragEnd) {
        onDragEnd(node.id);
      }
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('touchmove', handleTouchMove, { passive: false });
    document.addEventListener('touchend', handleMouseUp);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleMouseUp);
    };
  }, [isDragging, node.id, onDrag, onDragEnd]);

  // Handle double-click to delete
  const handleDoubleClick = useCallback((e) => {
    e.stopPropagation();
    e.preventDefault();
    if (onDelete) {
      onDelete(node.id);
    }
  }, [node.id, onDelete]);

  // Handle color change
  const handleColorChange = useCallback((e) => {
    const newColor = e.target.value;
    if (onColorChange) {
      onColorChange(node.id, newColor);
    }
  }, [node.id, onColorChange]);

  const nodeStyle = {
    position: 'fixed',
    left: x - 10,
    top: y - 10,
    width: 20,
    height: 20,
    borderRadius: '50%',
    background: node.color,
    border: `2px solid rgba(255, 255, 255, ${isHovered || isDragging ? 0.5 : 0.2})`,
    boxShadow: `
      0 0 ${isHovered || isDragging ? 25 : 15}px ${node.color}80,
      0 0 ${isHovered || isDragging ? 50 : 30}px ${node.color}40
    `,
    cursor: isDragging ? 'grabbing' : 'grab',
    transform: `scale(${isDragging ? 1.3 : isHovered ? 1.15 : 1})`,
    transition: isDragging ? 'none' : 'transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease',
    zIndex: isDragging ? 1000 : 100,
    touchAction: 'none',
    userSelect: 'none',
    WebkitUserSelect: 'none'
  };

  return (
    <div
      ref={nodeRef}
      style={nodeStyle}
      onMouseDown={handleMouseDown}
      onDoubleClick={handleDoubleClick}
      onContextMenu={handleContextMenu}
      onTouchStart={handleTouchStart}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <input
        ref={colorInputRef}
        type="color"
        value={node.color}
        onChange={handleColorChange}
        style={{
          position: 'absolute',
          opacity: 0,
          width: 0,
          height: 0,
          pointerEvents: 'none'
        }}
      />
    </div>
  );
}

export default Node;
