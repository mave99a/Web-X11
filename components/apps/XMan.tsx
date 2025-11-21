import React, { useState } from 'react';
import { getManPage } from '../../services/geminiService';

export const XMan: React.FC = () => {
    const [topic, setTopic] = useState('Xset');
    const [content, setContent] = useState<string>('Loading manual...');
    const [isLoading, setIsLoading] = useState(false);

    const fetchManual = async (query: string) => {
        setIsLoading(true);
        const text = await getManPage(query);
        setContent(text);
        setIsLoading(false);
    };

    React.useEffect(() => {
        fetchManual(topic);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <div className="flex flex-col h-full bg-white font-mono text-xs">
            {/* Menu Bar */}
            <div className="flex border-b border-black bg-gray-100 p-1 space-x-2">
                <button className="border border-black px-2 hover:bg-black hover:text-white shadow-[2px_2px_0_0_rgba(0,0,0,1)] active:shadow-none active:translate-x-[2px] active:translate-y-[2px]">Options</button>
                <button className="border border-black px-2 hover:bg-black hover:text-white shadow-[2px_2px_0_0_rgba(0,0,0,1)] active:shadow-none active:translate-x-[2px] active:translate-y-[2px]">Sections</button>
            </div>
            
            {/* Search Bar */}
            <div className="flex items-center p-1 border-b border-black bg-gray-200">
                 <span className="mr-2">Manual Page:</span>
                 <input 
                    className="border border-gray-500 px-1 flex-1 bg-white"
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    onKeyDown={(e) => {
                        if(e.key === 'Enter') fetchManual(topic);
                    }}
                 />
                 <button 
                    onClick={() => fetchManual(topic)}
                    className="ml-2 border border-black px-2 bg-gray-300 hover:bg-white"
                >
                    Go
                 </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-auto p-4 whitespace-pre-wrap leading-relaxed">
                {isLoading ? (
                    <div className="animate-pulse">Searching database...</div>
                ) : (
                    content
                )}
            </div>
        </div>
    );
};