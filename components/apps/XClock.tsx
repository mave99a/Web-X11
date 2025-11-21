import React, { useEffect, useState } from 'react';

export const XClock: React.FC = () => {
    const [time, setTime] = useState(new Date());

    useEffect(() => {
        const timer = setInterval(() => setTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    const secondsRotation = time.getSeconds() * 6;
    const minutesRotation = time.getMinutes() * 6 + time.getSeconds() * 0.1;
    const hoursRotation = (time.getHours() % 12) * 30 + time.getMinutes() * 0.5;

    return (
        <div className="w-full h-full bg-white flex items-center justify-center border-4 border-white box-border">
            <div className="relative w-[90%] h-[90%] border-2 border-black rounded-full bg-white">
                {/* Hour Markers */}
                {[...Array(12)].map((_, i) => (
                    <div
                        key={i}
                        className="absolute w-1 h-2 bg-black"
                        style={{
                            left: '50%',
                            top: '2%',
                            transformOrigin: '50% 2400%', // Center of clock (approx radius 48%)
                            transform: `translateX(-50%) rotate(${i * 30}deg)`
                        }}
                    />
                ))}

                {/* Hands */}
                {/* Hour */}
                <div
                    className="absolute w-1.5 h-[30%] bg-black left-1/2 top-[20%] origin-bottom"
                    style={{ transform: `translateX(-50%) rotate(${hoursRotation}deg)` }}
                />
                {/* Minute */}
                <div
                    className="absolute w-1 h-[40%] bg-black left-1/2 top-[10%] origin-bottom"
                    style={{ transform: `translateX(-50%) rotate(${minutesRotation}deg)` }}
                />
                {/* Second */}
                <div
                    className="absolute w-0.5 h-[45%] bg-red-600 left-1/2 top-[5%] origin-bottom"
                    style={{ transform: `translateX(-50%) rotate(${secondsRotation}deg)` }}
                />
                
                {/* Center Dot */}
                <div className="absolute w-2 h-2 bg-black rounded-full left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2" />
            </div>
        </div>
    );
};