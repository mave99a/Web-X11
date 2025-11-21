import React, { useState, useEffect, useRef } from 'react';
import { executeTerminalCommand } from '../../services/geminiService';
import { CommandHistory } from '../../types';

export const XTerm: React.FC = () => {
    const [history, setHistory] = useState<CommandHistory[]>([
        { type: 'output', content: 'Welcome to WebX11 Release 6.3' },
        { type: 'output', content: 'Type "help" for information.' }
    ]);
    const [input, setInput] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);
    const bottomRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (bottomRef.current) {
            bottomRef.current.scrollIntoView({ behavior: 'auto' });
        }
    }, [history]);

    const handleKeyDown = async (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !isProcessing) {
            const cmd = input.trim();
            if (!cmd) return;

            const newEntry: CommandHistory = { type: 'input', content: cmd };
            setHistory(prev => [...prev, newEntry]);
            setInput('');
            setIsProcessing(true);

            if (cmd.toLowerCase() === 'clear') {
                setHistory([]);
                setIsProcessing(false);
                return;
            }

            // Context for Gemini to maintain continuity
            const context = history.slice(-5).map(h => h.content).join('\n');
            const output = await executeTerminalCommand(cmd, context);

            setHistory(prev => [...prev, { type: 'output', content: output }]);
            setIsProcessing(false);
        }
    };

    // Auto-focus input when clicking anywhere in terminal
    const focusInput = () => {
        inputRef.current?.focus();
    };

    return (
        <div 
            className="h-full w-full bg-white text-black font-mono p-1 overflow-y-auto text-xs md:text-sm leading-tight"
            onClick={focusInput}
        >
            {history.map((entry, idx) => (
                <div key={idx} className="whitespace-pre-wrap mb-1 break-words">
                    {entry.type === 'input' ? (
                        <span className="font-bold">bash-4.2$ {entry.content}</span>
                    ) : (
                        <span>{entry.content}</span>
                    )}
                </div>
            ))}
            
            <div className="flex items-center">
                <span className="font-bold mr-2">bash-4.2$</span>
                <input
                    ref={inputRef}
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    disabled={isProcessing}
                    className="flex-1 bg-transparent border-none outline-none text-black font-mono caret-black p-0 m-0"
                    autoFocus
                />
            </div>
            {isProcessing && <div className="mt-1 animate-pulse">_</div>}
            <div ref={bottomRef} />
        </div>
    );
};