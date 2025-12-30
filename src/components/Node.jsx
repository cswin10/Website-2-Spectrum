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
  const clickTimeRef = useRef(0);
  const clickCountRef = useRef(0);
  const dragStartPosRef = useRef({ x: 0, y: 0 });
  const wasDraggedRef = useRef(false);

  const x = node.displayX ?? node.x;
  const y = node.displayY ?? node.y;

  // Handle mouse down - start potential drag
  const handleMouseDown = useCallback((e) => {
    e.stopPropagation();
    e.preventDefault();

    setIsDragging(true);
    wasDraggedRef.current = false;
    dragStartPosRef.current = { x: e.clientX, y: e.clientY };

    if (onDragStart) {
      onDragStart(node.id);
    }
  }, [node.id, onDragStart]);

  // Handle touch start for mobile
  const handleTouchStart = useCallback((e) => {
    e.stopPropagation();
    if (e.touches.length > 0) {
      const touch = e.touches[0];
      setIsDragging(true);
      wasDraggedRef.current = false;
      dragStartPosRef.current = { x: touch.clientX, y: touch.clientY };

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

      // Consider it a drag if moved more than 5 pixels
      if (Math.abs(dx) > 5 || Math.abs(dy) > 5) {
        wasDraggedRef.current = true;
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
        }

        if (onDrag) {
          onDrag(node.id, touch.clientX, touch.clientY);
        }
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
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

  // Handle click for color picker and double-click for delete
  const handleClick = useCallback((e) => {
    e.stopPropagation();

    // Don't trigger click if we were dragging
    if (wasDraggedRef.current) {
      return;
    }

    const now = Date.now();
    if (now - clickTimeRef.current < 300) {
      // Double click - delete
      clickCountRef.current = 0;
      if (onDelete) {
        onDelete(node.id);
      }
    } else {
      // Single click - open color picker with delay to check for double click
      clickCountRef.current = 1;
      clickTimeRef.current = now;

      setTimeout(() => {
        if (clickCountRef.current === 1) {
          // Trigger the color input
          if (colorInputRef.current) {
            colorInputRef.current.click();
          }
        }
      }, 250);
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
    border: `2px solid rgba(255, 255, 255, ${isHovered || isDragging ? 0.6 : 0.3})`,
    boxShadow: `
      0 0 ${isHovered || isDragging ? 30 : 20}px ${node.color}${isHovered || isDragging ? '99' : '80'},
      0 0 ${isHovered || isDragging ? 60 : 40}px ${node.color}${isHovered || isDragging ? '59' : '40'}
    `,
    cursor: isDragging ? 'grabbing' : 'grab',
    transform: `scale(${isDragging ? 1.3 : isHovered ? 1.2 : 1})`,
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
      onMouseUp={handleClick}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleClick}
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
