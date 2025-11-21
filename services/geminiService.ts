import { GoogleGenAI } from "@google/genai";

const getClient = () => {
    const apiKey = process.env.API_KEY;
    if (!apiKey) {
        throw new Error("API_KEY not found");
    }
    return new GoogleGenAI({ apiKey });
};

export const executeTerminalCommand = async (command: string, historyContext: string): Promise<string> => {
    try {
        const ai = getClient();
        const prompt = `
        You are simulating a UNIX/Linux terminal (specifically inside an X11 environment).
        The user just typed: "${command}".
        
        Context of recent commands:
        ${historyContext}

        Rules:
        1. Respond ONLY with the output of the command. 
        2. Do not explain what you are doing.
        3. If the command is 'ls', list fake files relevant to an early 90s Unix system (e.g., .Xdefaults, mbox, src/, bin/, README).
        4. If the command is 'date', return the current date.
        5. If the command is invalid, return "command not found: ${command.split(' ')[0]}".
        6. Keep responses concise and plain text.
        7. Do not use markdown formatting (no backticks).
        `;

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
        });
        
        return response.text || "";
    } catch (error) {
        console.error("Gemini Error:", error);
        return "Segmentation fault (core dumped) - Check API Key";
    }
};

export const getManPage = async (topic: string): Promise<string> => {
    try {
        const ai = getClient();
        const prompt = `
        Generate a fake, humorous, or historically accurate UNIX manual page for the command or topic: "${topic}".
        Format it exactly like a traditional man page (NAME, SYNOPSIS, DESCRIPTION, OPTIONS, BUGS).
        The style should be technical but slightly dry/retro.
        Return PLAIN TEXT only, no markdown.
        `;

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
        });

        return response.text || "No manual entry for " + topic;
    } catch (error) {
        return "Error retrieving manual page.";
    }
};