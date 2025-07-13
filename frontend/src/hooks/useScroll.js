// hooks/useScroll.js
import { useState, useEffect } from 'react';

const useScroll = (containerRef, direction = "vertical") => {
  const [isSwiping, setIsSwiping] = useState(false);
  const [startPos, setStartPos] = useState(0);
  const [scrollPos, setScrollPos] = useState(0);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const isVertical = direction === "vertical";

    const handleStart = (pos) => {
      setIsSwiping(true);
      setStartPos(pos);
      setScrollPos(isVertical ? container.scrollTop : container.scrollLeft);
    };

    const handleMove = (pos) => {
      if (!isSwiping) return;
      const diff = startPos - pos;
      if (isVertical) {
        container.scrollTop = scrollPos + diff;
      } else {
        container.scrollLeft = scrollPos + diff;
      }
    };

    const handleEnd = () => setIsSwiping(false);

    // 터치 이벤트
    const handleTouchStart = (e) => handleStart(isVertical ? e.touches[0].pageY : e.touches[0].pageX);
    const handleTouchMove = (e) => handleMove(isVertical ? e.touches[0].pageY : e.touches[0].pageX);
    const handleTouchEnd = handleEnd;

    // 마우스 이벤트
    const handleMouseDown = (e) => handleStart(isVertical ? e.pageY : e.pageX);
    const handleMouseMove = (e) => handleMove(isVertical ? e.pageY : e.pageX);
    const handleMouseUp = handleEnd;

    // 이벤트 리스너 등록
    container.addEventListener('touchstart', handleTouchStart);
    container.addEventListener('touchmove', handleTouchMove);
    container.addEventListener('touchend', handleTouchEnd);
    container.addEventListener('mousedown', handleMouseDown);
    container.addEventListener('mousemove', handleMouseMove);
    container.addEventListener('mouseup', handleMouseUp);

    // 클린업 함수
    return () => {
      container.removeEventListener('touchstart', handleTouchStart);
      container.removeEventListener('touchmove', handleTouchMove);
      container.removeEventListener('touchend', handleTouchEnd);
      container.removeEventListener('mousedown', handleMouseDown);
      container.removeEventListener('mousemove', handleMouseMove);
      container.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isSwiping, startPos, scrollPos, direction]);

  return { isSwiping };
};

export default useScroll;
