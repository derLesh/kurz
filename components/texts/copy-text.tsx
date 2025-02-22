"use client"

import { Button } from "../ui/button"
import { CopyIcon, Loader2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { useState } from "react"
import { TooltipContent, TooltipProvider } from "../ui/tooltip"
import { Tooltip } from "../ui/tooltip"
import { TooltipTrigger } from "../ui/tooltip"
export default function CopyText({ text }: { text: string }) {
    const { toast } = useToast();
    const [isLoading, setIsLoading] = useState(false);

    const decompressText = async (compressedText: string): Promise<string> => {
        try {
            setIsLoading(true);
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
            setIsLoading(false);
            return textDecoder.decode(decompressedData);
        } catch (error) {
            console.error('Decompression error:', error);
            // Fallback: Base64-decodierter Text
            return Buffer.from(compressedText, 'base64').toString();
        }
    };

    return (
        <TooltipProvider>
            <Tooltip>
                <TooltipTrigger>
                    <Button variant='ghost' size='icon' className='h-6 w-6 hover:bg-transparent hover:opacity-70 transition-opacity duration-300' onClick={() => {
                        decompressText(text).then(text => {
                            navigator.clipboard.writeText(`${text}`);
                            toast({
                                title: "Copied to clipboard",
                                description: "The text has been copied to your clipboard",
                            })
                        })
                    }}>
                        {isLoading ? <Loader2 className='w-4 h-4 animate-spin' /> : <CopyIcon className='w-4 h-4' />}
                    </Button>
                </TooltipTrigger>
                <TooltipContent>
                    <p className="text-sm font-mono">Copy Text</p>
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    )
}
