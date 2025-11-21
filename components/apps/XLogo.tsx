import React from 'react';

export const XLogo: React.FC = () => {
    return (
        <div className="w-full h-full bg-white flex items-center justify-center p-4">
            <svg viewBox="0 0 100 100" className="w-full h-full fill-black">
                 <path d="M 20 10 L 40 10 L 60 40 L 80 10 L 100 10 L 65 50 L 100 90 L 80 90 L 55 60 L 30 90 L 10 90 L 45 50 Z" />
            </svg>
        </div>
    );
};