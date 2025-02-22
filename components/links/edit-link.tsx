import { links } from "@/db/schema";
import { ReactNode, useState } from "react";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog";
import { Button } from "../ui/button";
import { Loader2, Pencil } from "lucide-react";
import { Form, FormControl, FormLabel, FormItem, FormField } from "../ui/form";
import { Input } from "../ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { EditLinkSchema } from "@/app/server/schemas";
import { z } from "zod";
import { Textarea } from "../ui/textarea";
export default function EditLink({ link, trigger }: { link: typeof links.$inferSelect, trigger: ReactNode }) {
    const [open, setOpen] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    
    const form = useForm<z.infer<typeof EditLinkSchema>>({
        resolver: zodResolver(EditLinkSchema),
        defaultValues: {
            url: link.url,
            kurz: link.kurz,
            description: link.description || undefined,
        },
    })

    const handleEditLink = async () => {
        setIsLoading(true)
        await new Promise(resolve => setTimeout(resolve, 2000))
        setIsLoading(false)
        setOpen(false)
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                {trigger}
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle className="text-foreground/70">Edit your <span className="font-bold text-foreground">KURZ</span></DialogTitle>
                    <DialogDescription className="text-foreground/70">
                        <span className="font-bold text-foreground">/{link.kurz}</span>
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(handleEditLink)}>
                        <FormField
                            control={form.control}
                            name="url"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>URL</FormLabel>
                                    <FormControl>
                                        <Input {...field} />
                                    </FormControl>
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="kurz"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Kurz</FormLabel>
                                    <FormControl>
                                        <Input {...field} />
                                    </FormControl>
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="description"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Description</FormLabel>
                                    <FormControl>
                                        <Textarea {...field} />
                                    </FormControl>
                                </FormItem>
                            )}
                        />
                    </form>
                </Form>
                <DialogFooter>
                    <DialogClose asChild>
                        <Button variant="ghost">Cancel</Button>
                    </DialogClose>
                    <Button variant="light" onClick={handleEditLink} disabled={isLoading}>
                        {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Pencil className="w-4 h-4" />}
                        Edit
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
