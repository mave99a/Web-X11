import React, { useState, useCallback } from 'react';
import { WindowFrame } from './components/WindowFrame';
import { XTerm } from './components/apps/XTerm';
import { XClock } from './components/apps/XClock';
import { XLogo } from './components/apps/XLogo';
import { XMan } from './components/apps/XMan';
import { XCalc } from './components/apps/XCalc';
import { XEyes } from './components/apps/XEyes';
import { AppType, WindowState } from './types';
import { GoogleGenAI } from '@google/genai';

// Initial State
const INITIAL_WINDOWS: WindowState[] = [
    {
        id: 'win-1',
        type: AppType.XCLOCK,
        title: 'oclock',
        x: 50,
        y: 50,
        width: 150,
        height: 150,
        zIndex: 1,
        isMinimized: false
    },
    {
        id: 'win-2',
        type: AppType.XTERM,
        title: 'xterm',
        x: 20,
        y: 220,
        width: 500,
        height: 350,
        zIndex: 2,
        isMinimized: false
    },
    {
        id: 'win-3',
        type: AppType.XLOGO,
        title: 'xlogo',
        x: 600,
        y: 50,
        width: 200,
        height: 200,
        zIndex: 3,
        isMinimized: false
    },
    {
        id: 'win-4',
        type: AppType.XMAN,
        title: 'xman',
        x: 300,
        y: 100,
        width: 400,
        height: 500,
        zIndex: 4,
        isMinimized: false
    },
    {
        id: 'win-5',
        type: AppType.XEYES,
        title: 'xeyes',
        x: 650,
        y: 300,
        width: 300,
        height: 200,
        zIndex: 5,
        isMinimized: false
    }
];

const App: React.FC = () => {
    const [windows, setWindows] = useState<WindowState[]>(INITIAL_WINDOWS);
    const [activeWindowId, setActiveWindowId] = useState<string>('win-2');
    const [nextZIndex, setNextZIndex] = useState(10);
    const [contextMenu, setContextMenu] = useState<{x: number, y: number} | null>(null);
    const [apiKeySet, setApiKeySet] = useState(false);

    // Handle Key Selection (Simulation for Gemni API requirement)
    // Since we can't modify global process in browser easily without build tools, 
    // we check if process.env.API_KEY is set (from the build environment).
    // If not, we just proceed (assuming the developer set it up), or show a warning.
    
    const bringToFront = useCallback((id: string) => {
        setActiveWindowId(id);
        setWindows(prev => prev.map(w => {
            if (w.id === id) {
                return { ...w, zIndex: nextZIndex };
            }
            return w;
        }));
        setNextZIndex(prev => prev + 1);
    }, [nextZIndex]);

    const handleMove = useCallback((id: string, x: number, y: number) => {
        setWindows(prev => prev.map(w => w.id === id ? { ...w, x, y } : w));
    }, []);

    const handleClose = useCallback((id: string) => {
        setWindows(prev => prev.filter(w => w.id !== id));
    }, []);

    const spawnApp = (type: AppType) => {
        const id = `win-${Date.now()}`;
        let width = 300;
        let height = 300;

        switch (type) {
            case AppType.XTERM: width = 500; height = 350; break;
            case AppType.XCALC: width = 250; height = 350; break;
            case AppType.XCLOCK: width = 150; height = 150; break;
            case AppType.XEYES: width = 300; height = 175; break;
            case AppType.XLOGO: width = 200; height = 200; break;
            case AppType.XMAN: width = 400; height = 500; break;
        }

        const newWindow: WindowState = {
            id,
            type,
            title: type.toLowerCase(),
            x: 100 + (windows.length * 20),
            y: 100 + (windows.length * 20),
            width,
            height,
            zIndex: nextZIndex,
            isMinimized: false
        };
        setWindows(prev => [...prev, newWindow]);
        setNextZIndex(prev => prev + 1);
        setActiveWindowId(id);
        setContextMenu(null);
    };

    const handleContextMenu = (e: React.MouseEvent) => {
        e.preventDefault();
        setContextMenu({ x: e.clientX, y: e.clientY });
    };

    const handleClickOutside = () => {
        setContextMenu(null);
    };

    const renderAppContent = (type: AppType) => {
        switch (type) {
            case AppType.XTERM: return <XTerm />;
            case AppType.XCLOCK: return <XClock />;
            case AppType.XLOGO: return <XLogo />;
            case AppType.XMAN: return <XMan />;
            case AppType.XCALC: return <XCalc />;
            case AppType.XEYES: return <XEyes />;
            default: return <div className="p-4">Not implemented</div>;
        }
    };

    return (
        <div 
            className="relative w-full h-full bg-[#008080] overflow-hidden"
            onContextMenu={handleContextMenu}
            onClick={handleClickOutside}
        >
            {/* Desktop Pattern / Background overlay to make it look dithered if we wanted, but solid teal is accurate too */}
            
            {/* Instructions Overlay (Top Left) */}
            <div className="absolute top-2 left-2 p-2 bg-white border-2 border-black shadow-md z-0 opacity-80 pointer-events-none">
                <p className="font-mono text-xs font-bold">WebX11 Simulator</p>
                <p className="font-mono text-[10px]">Right-click to spawn new apps.</p>
                <p className="font-mono text-[10px]">Drag title bars to move.</p>
            </div>

            {windows.map(win => (
                <WindowFrame
                    key={win.id}
                    windowState={win}
                    isActive={win.id === activeWindowId}
                    onFocus={bringToFront}
                    onClose={handleClose}
                    onMove={handleMove}
                >
                    {renderAppContent(win.type)}
                </WindowFrame>
            ))}

            {/* Custom Right Click Menu */}
            {contextMenu && (
                <div 
                    className="absolute bg-white border-2 border-black shadow-[4px_4px_0_0_rgba(0,0,0,0.5)] flex flex-col z-[9999]"
                    style={{ left: contextMenu.x, top: contextMenu.y }}
                >
                    <div className="bg-black text-white px-2 py-1 font-mono text-xs font-bold text-center">Root Menu</div>
                    {(Object.keys(AppType) as Array<keyof typeof AppType>).map(key => (
                         <button
                            key={key}
                            className="px-4 py-1 text-left font-mono text-xs hover:bg-black hover:text-white border-b border-gray-200 last:border-none active:bg-gray-800"
                            onClick={(e) => { e.stopPropagation(); spawnApp(AppType[key]); }}
                        >
                            {AppType[key]}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
};

export default App;