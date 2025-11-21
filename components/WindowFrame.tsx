import React, { useState, useEffect, useRef, useCallback } from 'react';
import { WindowState } from '../types';

interface WindowFrameProps {
    windowState: WindowState;
    isActive: boolean;
    onFocus: (id: string) => void;
    onClose: (id: string) => void;
    onMove: (id: string, x: number, y: number) => void;
    onResize?: (id: string, width: number, height: number) => void;
    children: React.ReactNode;
}

export const WindowFrame: React.FC<WindowFrameProps> = ({
    windowState,
    isActive,
    onFocus,
    onClose,
    onMove,
    children
}) => {
    const [isDragging, setIsDragging] = useState(false);
    const dragOffset = useRef({ x: 0, y: 0 });
    const frameRef = useRef<HTMLDivElement>(null);

    const handleMouseDown = (e: React.MouseEvent) => {
        e.stopPropagation();
        onFocus(windowState.id);
        setIsDragging(true);
        dragOffset.current = {
            x: e.clientX - windowState.x,
            y: e.clientY - windowState.y
        };
    };

    const handleGlobalMouseMove = useCallback((e: MouseEvent) => {
        if (isDragging) {
            onMove(windowState.id, e.clientX - dragOffset.current.x, e.clientY - dragOffset.current.y);
        }
    }, [isDragging, onMove, windowState.id]);

    const handleGlobalMouseUp = useCallback(() => {
        setIsDragging(false);
    }, []);

    useEffect(() => {
        if (isDragging) {
            document.addEventListener('mousemove', handleGlobalMouseMove);
            document.addEventListener('mouseup', handleGlobalMouseUp);
        } else {
            document.removeEventListener('mousemove', handleGlobalMouseMove);
            document.removeEventListener('mouseup', handleGlobalMouseUp);
        }
        return () => {
            document.removeEventListener('mousemove', handleGlobalMouseMove);
            document.removeEventListener('mouseup', handleGlobalMouseUp);
        };
    }, [isDragging, handleGlobalMouseMove, handleGlobalMouseUp]);

    // Retro styling logic
    const borderColor = isActive ? 'border-black' : 'border-gray-600';
    const titleBg = isActive ? 'bg-[#4682B4]' : 'bg-white'; // SteelBlue for active, White for inactive (Twms style)
    const titleText = isActive ? 'text-white' : 'text-black';
    
    // Shadow to simulate elevation
    const shadowClass = isActive ? 'shadow-[4px_4px_0px_0px_rgba(0,0,0,0.5)]' : 'shadow-[2px_2px_0px_0px_rgba(0,0,0,0.3)]';

    return (
        <div
            ref={frameRef}
            className={`absolute flex flex-col bg-gray-200 border-2 ${borderColor} ${shadowClass}`}
            style={{
                left: windowState.x,
                top: windowState.y,
                width: windowState.width,
                height: windowState.height,
                zIndex: windowState.zIndex,
            }}
            onMouseDown={() => onFocus(windowState.id)}
        >
            {/* Title Bar */}
            <div
                className={`h-6 flex items-center justify-between px-1 cursor-move select-none border-b-2 border-black ${titleBg} ${titleText}`}
                onMouseDown={handleMouseDown}
            >
                {/* Left Icon/Button (System Menu) */}
                <div className="w-4 h-4 border border-black bg-white flex items-center justify-center">
                    <div className="w-2 h-2 bg-black"></div>
                </div>

                <span className="font-mono text-xs font-bold uppercase tracking-widest truncate px-2">
                    {windowState.title}
                </span>

                {/* Close Button */}
                <button
                    onClick={(e) => { e.stopPropagation(); onClose(windowState.id); }}
                    className="w-4 h-4 border border-black bg-white active:bg-black active:text-white flex items-center justify-center hover:bg-red-100"
                >
                    <span className="leading-none text-[10px] font-bold text-black mb-[2px]">x</span>
                </button>
            </div>

            {/* Content Area */}
            <div className="flex-1 overflow-hidden relative font-mono text-sm">
                {children}
            </div>
            
            {/* Resize Handle (Visual only for now to keep simple) */}
            <div className="absolute bottom-0 right-0 w-3 h-3 bg-gray-400 cursor-se-resize border-t border-l border-gray-500 hidden"></div>
        </div>
    );
};