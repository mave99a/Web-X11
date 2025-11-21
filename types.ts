export enum AppType {
    XTERM = 'XTERM',
    XCLOCK = 'XCLOCK',
    XLOGO = 'XLOGO',
    XMAN = 'XMAN',
    XCALC = 'XCALC',
    XEYES = 'XEYES'
}

export interface WindowState {
    id: string;
    type: AppType;
    title: string;
    x: number;
    y: number;
    width: number;
    height: number;
    zIndex: number;
    isMinimized: boolean;
}

export interface CommandHistory {
    type: 'input' | 'output' | 'error';
    content: string;
}