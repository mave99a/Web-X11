import React, { useState } from 'react';

export const XCalc: React.FC = () => {
    const [display, setDisplay] = useState('0');
    const [prev, setPrev] = useState<number | null>(null);
    const [op, setOp] = useState<string | null>(null);
    const [newNum, setNewNum] = useState(true);

    const handleNum = (n: string) => {
        if (newNum) {
            setDisplay(n);
            setNewNum(false);
        } else {
            setDisplay(display === '0' ? n : display + n);
        }
    };

    const handleOp = (o: string) => {
        const current = parseFloat(display);
        if (prev === null) {
            setPrev(current);
        } else if (op) {
            const res = calculate(prev, current, op);
            setPrev(res);
            setDisplay(String(res));
        }
        setOp(o);
        setNewNum(true);
    };

    const calculate = (a: number, b: number, operation: string) => {
        switch (operation) {
            case '+': return a + b;
            case '-': return a - b;
            case '*': return a * b;
            case '/': return a / b;
            default: return b;
        }
    };

    const handleEqual = () => {
        if (prev !== null && op) {
            const current = parseFloat(display);
            const res = calculate(prev, current, op);
            setDisplay(String(res));
            setPrev(null);
            setOp(null);
            setNewNum(true);
        }
    };

    const handleClear = () => {
        setDisplay('0');
        setPrev(null);
        setOp(null);
        setNewNum(true);
    };

    const btnClass = "bg-white border border-black hover:bg-black hover:text-white text-center py-1 font-bold text-sm active:bg-gray-800";

    return (
        <div className="h-full flex flex-col bg-gray-300 p-2 font-mono">
            <div className="bg-[#8FBC8F] border-2 border-gray-500 inset-shadow p-1 mb-2 text-right font-bold text-black tracking-widest h-8 text-lg">
                {display}
            </div>
            <div className="grid grid-cols-4 gap-1 flex-1">
                <button onClick={handleClear} className={`${btnClass} col-span-4`}>AC</button>
                
                {['7','8','9','/'].map(k => (
                     <button key={k} onClick={() => ['/'].includes(k) ? handleOp(k) : handleNum(k)} className={btnClass}>{k}</button>
                ))}
                {['4','5','6','*'].map(k => (
                     <button key={k} onClick={() => ['*'].includes(k) ? handleOp(k) : handleNum(k)} className={btnClass}>{k}</button>
                ))}
                {['1','2','3','-'].map(k => (
                     <button key={k} onClick={() => ['-'].includes(k) ? handleOp(k) : handleNum(k)} className={btnClass}>{k}</button>
                ))}
                
                <button onClick={() => handleNum('0')} className={`${btnClass} col-span-2`}>0</button>
                <button onClick={() => handleNum('.')} className={btnClass}>.</button>
                <button onClick={() => handleOp('+')} className={btnClass}>+</button>
                <button onClick={handleEqual} className={`${btnClass} col-span-4 border-t-2`}>=</button>
            </div>
        </div>
    );
};