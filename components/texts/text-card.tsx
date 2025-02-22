"use client"

import { texts } from "@/db/schema"
import { useToast } from "@/hooks/use-toast"
import { Copy, Eye, Lock, Trash } from "lucide-react"
import { useEffect, useState } from "react"
import { Button } from "../ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../ui/tooltip"
import { Skeleton } from "../ui/skeleton"
import { Badge } from "../ui/badge"
import DeleteText from "./delete-text"

export default function TextCard({ text }: { text: typeof texts.$inferSelect }) {
    const { toast } = useToast()

    const [countdown, setCountdown] = useState("0h 0m")
    const [isExpired, setIsExpired] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [decompressedText, setDecompressedText] = useState<string>("")
    
    const expiresCountdown = (date: Date) => {
        const now = new Date()
        const diff = date.getTime() - now.getTime()
        
        if (diff <= 0) {
            setIsExpired(true)
            return "Expired"
        }
        
        const hours = Math.floor(diff / (1000 * 60 * 60))
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
        
        return `${hours}h ${minutes}m`
    }

    useEffect(() => {
        if (!text.expiresAt) return

        const timer = setInterval(() => {
            setCountdown(expiresCountdown(text.expiresAt!))
        }, 1000)

        return () => clearInterval(timer)
    }, [text.expiresAt])

    useEffect(() => {
        const loadText = async () => {
            setIsLoading(true)
            try {
                const result = await decompressText(text.text)
                setDecompressedText(result)
            } catch (error) {
                console.error('Error decompressing text:', error)
                setDecompressedText(Buffer.from(text.text, 'base64').toString())
            }
            setIsLoading(false)
        }

        loadText()
    }, [text.text])

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
        <div className="group relative w-full flex flex-col rounded-md border-[1px] border-neutral-300 px-3 py-2 shadow-sm transition-colors duration-300 hover:border-neutral-400 dark:border-neutral-800 dark:hover:border-neutral-700">
            <div className="relative flex flex-col">
                <div className="flex flex-row justify-between items-center">
                    <div className="flex flex-row items-center gap-2 min-w-0 flex-1">
                        {text.password && (
                            <Lock className="w-4 h-4 flex-shrink-0" />
                        )}
                        <a className="text-lg font-medium font-inter-sans text-muted-foreground transition-opacity duration-300 hover:opacity-70 min-w-0" href={`${process.env.NEXT_PUBLIC_APP_URL}/t/${text.textCode}`} target="_blank" rel="noopener noreferrer">
                            <span className="text-black dark:text-white font-bold truncate block">{text.title}</span>
                        </a>
                    </div>
                    <div className="flex flex-row items-center gap-2 flex-shrink-0">
                        <div className="flex flex-row items-center gap-1">
                            <Eye className="w-4 h-4" />
                            <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <p className="text-xs font-mono text-foreground">{text.views} {text.views === 1 ? "view" : "views"}</p>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <p className="text-xs font-mono text-muted-foreground">Last view: {text.lastView?.toLocaleString()}</p>
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                        </div>
                        <span className="text-muted-foreground select-none">|</span>
                        <div className="flex flex-row items-center gap-1">
                            <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Button 
                                            variant="ghost" 
                                            size="icon" 
                                            className="h-6 w-6 hover:bg-transparent hover:opacity-70 transition-opacity duration-300"
                                            onClick={() => {
                                                navigator.clipboard.writeText(`${window.location.origin}/t/${text.textCode}`);
                                                toast({
                                                    title: "Copied to clipboard",
                                                    description: "The text URL has been copied to your clipboard",
                                                })
                                            }}
                                        >
                                            <Copy className="w-4 h-4" />
                                        </Button>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <p className="text-xs font-mono text-muted-foreground">Copy Text URL</p>
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                            {/* <EditText text={text} trigger={
                                <Button variant="ghost" size="icon" className="h-6 w-6 hover:bg-transparent hover:opacity-70 transition-all duration-300">
                                    <Pencil className="w-4 h-4" />
                                </Button>
                            } /> */}
                            <DeleteText text={text} trigger={
                                <Button variant="ghost" size="icon" className="h-6 w-6 hover:bg-transparent hover:opacity-70 transition-all duration-300 hover:text-red-400">
                                    <Trash className="w-4 h-4" />
                                </Button>
                            } />
                        </div>
                    </div>
                </div>
                <div className="mb-1">
                    <span className="text-base font-mono select-all text-muted-foreground max-w-full inline-block truncate">
                        {isLoading ? (
                            <Skeleton className="w-full h-4" />
                        ) : (
                            decompressedText
                        )}
                    </span>
                </div>
                <div className="flex flex-row gap-1 justify-between items-center">
                    <div>
                        {text.expiresAt && (
                            <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Badge variant="outline" className={`text-xs font-mono w-fit ${isExpired ? "text-destructive" : "text-muted-foreground"}`}>
                                            {isExpired ? "Expired - This text will be automatically deleted" : `Expires in: ${countdown}`}
                                        </Badge>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <p className="text-xs font-mono text-muted-foreground">{text.expiresAt.toLocaleString()}</p>
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                        )}
                    </div>
                    <p className="text-sm font-mono text-muted-foreground ml-auto">{text.createdAt.toLocaleDateString()}</p>
                </div>
            </div>
        </div>
    )
}
