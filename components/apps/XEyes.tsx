import React, { useEffect, useRef } from 'react';

export const XEyes: React.FC = () => {
    const leftEyeRef = useRef<HTMLDivElement>(null);
    const rightEyeRef = useRef<HTMLDivElement>(null);
    const leftPupilRef = useRef<HTMLDivElement>(null);
    const rightPupilRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        let animationFrameId: number;
        let mouseX = 0;
        let mouseY = 0;

        const updatePupil = (eye: HTMLDivElement, pupil: HTMLDivElement) => {
            const rect = eye.getBoundingClientRect();
            if (rect.width === 0 || rect.height === 0) return;

            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;
            
            const dx = mouseX - centerX;
            const dy = mouseY - centerY;
            
            // Pupil is approx 20% of eye dimension (defined in CSS)
            // Max travel radius is (EyeRadius - PupilRadius)
            // If pupil is 20% width, radius is 10% width.
            // Max offset = 50% - 10% = 40% of width.
            
            const pupilScale = 0.20; // Matches CSS w-[20%]
            const maxRx = (rect.width / 2) * (1 - pupilScale);
            const maxRy = (rect.height / 2) * (1 - pupilScale);

            // Normalized distance to check if outside ellipse
            const dist = Math.sqrt( Math.pow(dx / maxRx, 2) + Math.pow(dy / maxRy, 2) );
            
            let x = dx;
            let y = dy;

            if (dist > 1) {
                x = dx / dist;
                y = dy / dist;
            }
            
            // Apply transform
            pupil.style.transform = `translate(-50%, -50%) translate(${x}px, ${y}px)`;
        };

        const tick = () => {
            if (leftEyeRef.current && leftPupilRef.current) {
                updatePupil(leftEyeRef.current, leftPupilRef.current);
            }
            if (rightEyeRef.current && rightPupilRef.current) {
                updatePupil(rightEyeRef.current, rightPupilRef.current);
            }
            animationFrameId = requestAnimationFrame(tick);
        };

        const handleMouseMove = (e: MouseEvent) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
        };

        window.addEventListener('mousemove', handleMouseMove);
        animationFrameId = requestAnimationFrame(tick);

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            cancelAnimationFrame(animationFrameId);
        };
    }, []);

    return (
        <div className="w-full h-full bg-gray-300 flex items-center justify-center gap-4 p-4">
            <div ref={leftEyeRef} className="relative flex-1 h-full max-h-[200px] aspect-[3/4] bg-white border-[3px] border-black rounded-[50%] overflow-hidden shadow-sm">
                <div 
                    ref={leftPupilRef}
                    className="absolute bg-black rounded-full w-[20%] h-[20%] top-1/2 left-1/2"
                    style={{ transform: 'translate(-50%, -50%)' }}
                />
            </div>
            <div ref={rightEyeRef} className="relative flex-1 h-full max-h-[200px] aspect-[3/4] bg-white border-[3px] border-black rounded-[50%] overflow-hidden shadow-sm">
                <div 
                    ref={rightPupilRef}
                    className="absolute bg-black rounded-full w-[20%] h-[20%] top-1/2 left-1/2"
                    style={{ transform: 'translate(-50%, -50%)' }}
                />
            </div>
        </div>
    );
};