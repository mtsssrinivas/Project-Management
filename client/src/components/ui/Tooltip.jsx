import React, { useState } from 'react';
import { cn } from '@/utils/cn';

export function Tooltip({
  children,
  content,
  position = 'top',
  delay = 200,
  className,
}) {
  const [isVisible, setIsVisible] = useState(false);
  const [timer, setTimer] = useState(null);

  const handleMouseEnter = () => {
    const timeout = setTimeout(() => setIsVisible(true), delay);
    setTimer(timeout);
  };

  const handleMouseLeave = () => {
    clearTimeout(timer);
    setIsVisible(false);
  };

  const positions = {
    top: 'bottom-full left-1/2 -translate-x-1/2 mb-1.5',
    bottom: 'top-full left-1/2 -translate-x-1/2 mt-1.5',
    left: 'right-full top-1/2 -translate-y-1/2 mr-1.5',
    right: 'left-full top-1/2 -translate-y-1/2 ml-1.5',
  };

  return (
    <div
      className="relative inline-flex"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {children}
      {isVisible && content && (
        <div
          role="tooltip"
          className={cn(
            'absolute z-50 whitespace-nowrap rounded bg-charcoal-900 px-2 py-1 text-2xs font-medium text-white shadow-md pointer-events-none',
            'animate-in fade-in zoom-in-95 duration-100',
            positions[position],
            className
          )}
        >
          {content}
        </div>
      )}
    </div>
  );
}
