'use client';
import { Textarea } from "@/components/ui/textarea";
import { useState, useEffect, useRef } from "react";

export default function TextContent({ text }: { text: string }) {
    const [decompressedText, setDecompressedText] = useState(text);
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    
    useEffect(() => {
        decompressText(text).then(setDecompressedText);
    }, [text]);

    const decompressText = async (compressedText: string): Promise<string> => {
        try {
            // Base64 zu ArrayBuffer konvertieren
            const compressedData = Buffer.from(compressedText, 'base64');
            
            // Dekomprimieren
            const decompressedStream = new DecompressionStream('gzip');
            const writer = decompressedStream.writable.getWriter();
            writer.write(compressedData);
            writer.close();
            
            // Dekomprimierte Daten lesen
            const decompressedResponse = new Response(decompressedStream.readable);
            const decompressedData = await decompressedResponse.arrayBuffer();
            
            // Zurück zu Text konvertieren
            const textDecoder = new TextDecoder();
            return textDecoder.decode(decompressedData);
        } catch (error) {
            console.error('Decompression error:', error);
            // Fallback: Base64-decodierter Text
            return Buffer.from(compressedText, 'base64').toString();
        }
    };

    useEffect(() => {
        const updateHeight = () => {
            const textarea = textareaRef.current;
            if (textarea) {
                const topOffset = textarea.getBoundingClientRect().top;
                const footerHeight = 64; // Höhe des Footers + etwas Abstand
                const buttonHeight = 40; // Höhe des Buttons
                const padding = 32; // Zusätzlicher Abstand
                const maxHeight = Math.min(
                    window.innerHeight - topOffset - footerHeight - buttonHeight - padding,
                    900 // Maximale Höhe der Textarea
                );
                textarea.style.height = `${maxHeight}px`;
            }
        };

        updateHeight();
        window.addEventListener('resize', updateHeight);
        return () => window.removeEventListener('resize', updateHeight);
    }, []);
    
    return (
        <Textarea 
            value={decompressedText}
            className="font-mono resize-none overflow-auto whitespace-pre min-h-[200px] [tab-size:4]"
            readOnly
            ref={textareaRef}
        />
    )
}
