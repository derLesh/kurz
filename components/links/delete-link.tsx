import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Trash } from "lucide-react";
import { Loader2 } from "lucide-react";
import { links } from "@/db/schema"
import { ReactNode, useState } from "react";
import { deleteLink } from "@/app/server/actions/kurz";
import { useToast } from "@/hooks/use-toast";

export default function DeleteLink({link, trigger}: {link: typeof links.$inferSelect, trigger: ReactNode}) {
    const { toast } = useToast()
    const [isLoading, setIsLoading] = useState(false)
    const [open, setOpen] = useState(false)

    const handleDeleteLink = async () => {
        try {
            setIsLoading(true)
            // await new Promise(resolve => setTimeout(resolve, 2000)) // Add 2 second delay for testing
            const result = await deleteLink(link.id)
            if (result.success) {
                toast({
                    title: "Link deleted",
                    description: "The link has been deleted",
                })
            } else {
                throw new Error(result.message)
            }
        } catch (error) {
            if (error instanceof Error) {
                toast({
                    title: "Error deleting link",
                    description: error.message,
                })
            } else {
                toast({
                    title: "Error deleting link",
                    description: "An unknown error occurred",
                })
            }
        } finally {
            setIsLoading(false)
            setOpen(false)
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                {trigger}
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle className="text-foreground/70">Delete <span className="font-bold text-foreground">/{link.kurz}</span></DialogTitle>
                    {/* <div className="w-full overflow-hidden">
                        <DialogDescription className="text-muted-foreground block text-ellipsis overflow-hidden whitespace-nowrap">
                            {link.url}
                        </DialogDescription>
                    </div> */}
                </DialogHeader>
                <DialogDescription className="text-red-400">
                    <div className="flex flex-row items-center gap-1">
                        Are you sure you want to delete this link? This action <span className="font-bold">cannot be undone</span>.
                    </div>
                </DialogDescription>
                <DialogFooter>
                    <DialogClose asChild>
                        <Button variant="ghost">Cancel</Button>
                    </DialogClose>
                    <Button variant="destructive" onClick={handleDeleteLink} disabled={isLoading}>
                        {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash className="w-4 h-4" />}
                        Delete
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
