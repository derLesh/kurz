"use client"

import { Textarea } from "@/components/ui/textarea"
import { RefObject, useEffect } from "react"

interface TextContentProps {
    value: string
    onChange: (value: string) => void
    textareaRef: RefObject<HTMLTextAreaElement | null>
}

export function TextContent({ value, onChange, textareaRef }: TextContentProps) {

    // Handler für Tab-Taste
    const handleTabKey = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === 'Tab') {
            e.preventDefault();
            const start = e.currentTarget.selectionStart;
            const end = e.currentTarget.selectionEnd;
            const value = e.currentTarget.value;
            
            e.currentTarget.value = value.substring(0, start) + '\t' + value.substring(end);
            e.currentTarget.selectionStart = e.currentTarget.selectionEnd = start + 1;
            
            // Manuell das Formfeld aktualisieren
        }
    };

    // Textarea Höhe anpassen
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
                    600 // Maximale Höhe der Textarea
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
            value={value}
            onChange={(e) => onChange(e.target.value)}
            ref={textareaRef}
            onKeyDown={handleTabKey}
            spellCheck={false}
            wrap="off"
            className="font-mono resize-none overflow-auto whitespace-pre min-h-[200px] [tab-size:4]"
            autoComplete="off"
            limit={10000}
        />
    )
}
