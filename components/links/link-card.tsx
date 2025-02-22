"use client"

import { links } from "@/db/schema"
import { Button } from "../ui/button"
import { Copy, InfoIcon, MousePointerClick, Trash } from "lucide-react"
import { Badge } from "../ui/badge"
import { HoverCard, HoverCardContent, HoverCardTrigger } from "../ui/hover-card"
import { useEffect, useState } from "react"
import { TooltipContent, Tooltip, TooltipProvider, TooltipTrigger } from "../ui/tooltip"
import { useToast } from "@/hooks/use-toast"
import DeleteLink from "./delete-link"
// import EditLink from "./edit-link"

export default function LinkCard({ link }: { link: typeof links.$inferSelect }) {
    const { toast } = useToast()
    const [countdown, setCountdown] = useState("0h 0m")
    const [isExpired, setIsExpired] = useState(false)

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
        if (!link.expiresAt) return

        const timer = setInterval(() => {
            setCountdown(expiresCountdown(link.expiresAt!))
        }, 1000)

        return () => clearInterval(timer)
    }, [link.expiresAt])

    return (
        <div className="group relative w-full flex flex-col rounded-md border-[1px] border-neutral-300 px-3 py-2 shadow-sm transition-colors duration-300 hover:border-neutral-400 dark:border-neutral-800 dark:hover:border-neutral-700">
            <div className="relative flex flex-col">
                <div className="flex flex-row justify-between items-center">
                    <div className="flex flex-row items-center gap-2">
                        <a className="text-lg font-medium font-inter-sans text-muted-foreground transition-opacity duration-300 hover:opacity-70" href={`${process.env.NEXT_PUBLIC_APP_URL}/${link.kurz}`} target="_blank" rel="noopener noreferrer">
                            <span className="opacity-50">/</span>
                            <span className="text-black dark:text-white font-bold">{link.kurz}</span>
                        </a>
                        {link.description && (
                            <HoverCard openDelay={0}>
                                <HoverCardTrigger asChild>
                                    <InfoIcon className="w-4 h-4 opacity-50 transition-opacity duration-300 hover:opacity-100" />
                                </HoverCardTrigger>
                                <HoverCardContent className="flex flex-col gap-1">
                                    <p className="text-xs font-mono text-muted-foreground">Description:</p>
                                    <p className="text-sm text-foreground">{link.description}</p>
                                </HoverCardContent>
                            </HoverCard>
                        )}
                    </div>
                    <div className="flex flex-row items-center gap-2">
                        <div className="flex flex-row items-center gap-1">
                            <MousePointerClick className="w-4 h-4" />
                            <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <p className="text-xs font-mono text-foreground">{link.clicks} {link.clicks === 1 ? "click" : "clicks"}</p>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <p className="text-xs font-mono text-muted-foreground">Last click: {link.lastClick?.toLocaleString()}</p>
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                        </div>
                        <span className="text-muted-foreground select-none">|</span>
                        <div className="flex flex-row items-center gap-1">
                            <Button 
                                variant="ghost" 
                                size="icon" 
                                className="h-6 w-6 hover:bg-transparent hover:opacity-70 transition-opacity duration-300"
                                onClick={() => {
                                    navigator.clipboard.writeText(`${window.location.origin}/${link.kurz}`);
                                    toast({
                                        title: "Copied to clipboard",
                                        description: "The link has been copied to your clipboard",
                                    })
                                }}
                            >
                                <Copy className="w-4 h-4" />
                            </Button>
                            {/* <EditLink link={link} trigger={
                                <Button variant="ghost" size="icon" className="h-6 w-6 hover:bg-transparent hover:opacity-70 transition-all duration-300">
                                    <Pencil className="w-4 h-4" />
                                </Button>
                            } /> */}
                            <DeleteLink link={link} trigger={
                                <Button variant="ghost" size="icon" className="h-6 w-6 hover:bg-transparent hover:opacity-70 transition-all duration-300 hover:text-red-400">
                                    <Trash className="w-4 h-4" />
                                </Button>
                            } />
                        </div>
                    </div>
                </div>
                <div className="mb-1">
                    <span className="text-base font-mono select-all text-muted-foreground max-w-full inline-block truncate">{link.url}</span>
                </div>
                <div className="flex flex-row gap-1 justify-between items-center">
                    <div>
                        {link.expiresAt && (
                            <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Badge variant="outline" className={`text-xs font-mono w-fit ${isExpired ? "text-destructive" : "text-muted-foreground"}`}>
                                            {isExpired ? "Expired - This link will be automatically deleted" : `Expires in: ${countdown}`}
                                        </Badge>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <p className="text-xs font-mono text-muted-foreground">{link.expiresAt.toLocaleString()}</p>
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                        )}
                    </div>
                    <p className="text-sm font-mono text-muted-foreground ml-auto">{link.createdAt.toLocaleDateString()}</p>
                </div>
            </div>
        </div>
    )
}