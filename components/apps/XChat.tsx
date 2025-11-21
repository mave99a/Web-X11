import React, { useState, useEffect, useRef } from 'react';
import { GoogleGenAI, Chat, GenerateContentResponse } from "@google/genai";

interface Message {
    sender: 'User' | 'Gemini';
    text: string;
}

export const XChat: React.FC = () => {
    const [messages, setMessages] = useState<Message[]>([
        { sender: 'Gemini', text: 'X11 AI Assistant online.\nHow may I help you?' }
    ]);
    const [input, setInput] = useState('');
    const [isThinking, setIsThinking] = useState(false);
    const chatSessionRef = useRef<Chat | null>(null);
    const bottomRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        // Initialize chat session
        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
            chatSessionRef.current = ai.chats.create({
                model: 'gemini-2.5-flash',
                config: {
                    systemInstruction: "You are a helpful AI assistant running inside a retro X Window System (X11) simulation. Your persona should be slightly technical but helpful. Keep responses concise. Avoid complex markdown, prefer plain text or simple lists."
                }
            });
        } catch (e) {
            setMessages(prev => [...prev, { sender: 'Gemini', text: 'System Error: API Key initialization failed.' }]);
        }
    }, []);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'auto' });
    }, [messages]);

    const sendMessage = async () => {
        if (!input.trim() || isThinking || !chatSessionRef.current) return;

        const userMsg = input;
        setInput('');
        setMessages(prev => [...prev, { sender: 'User', text: userMsg }]);
        setIsThinking(true);

        try {
            // Add placeholder for streaming response
            setMessages(prev => [...prev, { sender: 'Gemini', text: '' }]);
            
            const result = await chatSessionRef.current.sendMessageStream({ message: userMsg });
            
            let fullText = '';
            
            for await (const chunk of result) {
                const responseChunk = chunk as GenerateContentResponse;
                if (responseChunk.text) {
                    fullText += responseChunk.text;
                    setMessages(prev => {
                        const newHistory = [...prev];
                        // Update the last message (Gemini's placeholder)
                        newHistory[newHistory.length - 1] = { sender: 'Gemini', text: fullText };
                        return newHistory;
                    });
                }
            }
        } catch (error) {
            setMessages(prev => [...prev, { sender: 'Gemini', text: `Runtime Error: ${error instanceof Error ? error.message : 'Unknown'}` }]);
        } finally {
            setIsThinking(false);
        }
    };

    return (
        <div className="flex flex-col h-full bg-[#d3d3d3] font-mono text-sm border border-gray-400">
            {/* Chat History Display */}
            <div className="flex-1 overflow-y-auto p-3 space-y-3 bg-white border-b-2 border-gray-500 inset-shadow">
                {messages.map((msg, idx) => (
                    <div key={idx} className={`flex flex-col ${msg.sender === 'User' ? 'items-end' : 'items-start'}`}>
                        <span className="text-[10px] font-bold text-gray-600 mb-0.5 tracking-wider">
                            {msg.sender === 'User' ? 'YOU' : 'GEMINI'}
                        </span>
                        <div 
                            className={`max-w-[90%] p-2 border-2 ${
                                msg.sender === 'User' 
                                    ? 'bg-[#e0e0e0] border-black text-black' 
                                    : 'bg-[#f0f8ff] border-blue-800 text-black'
                            } shadow-[2px_2px_0_0_rgba(0,0,0,0.3)] whitespace-pre-wrap leading-tight`}
                        >
                            {msg.text}
                        </div>
                    </div>
                ))}
                {isThinking && messages[messages.length - 1]?.text === '' && (
                     <div className="text-xs text-gray-500 animate-pulse ml-2">Computing...</div>
                )}
                <div ref={bottomRef} />
            </div>

            {/* Input Area */}
            <div className="p-2 bg-[#d3d3d3] flex gap-2 border-t border-white">
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                    placeholder="Enter message..."
                    className="flex-1 border-2 border-gray-500 p-1 px-2 focus:outline-none focus:border-black font-mono text-sm shadow-[inset_2px_2px_0px_rgba(0,0,0,0.2)]"
                    disabled={isThinking}
                    autoFocus
                />
                <button
                    onClick={sendMessage}
                    disabled={isThinking}
                    className="px-4 border-2 border-black bg-gray-300 hover:bg-white active:bg-black active:text-white shadow-[2px_2px_0_0_rgba(0,0,0,0.5)] active:shadow-none active:translate-x-[2px] active:translate-y-[2px] font-bold text-xs uppercase disabled:opacity-50 disabled:active:translate-x-0 disabled:active:translate-y-0 disabled:shadow-[2px_2px_0_0_rgba(0,0,0,0.5)]"
                >
                    Send
                </button>
            </div>
        </div>
    );
};