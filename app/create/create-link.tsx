"use client"

import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { CreateLinkSchema } from "@/app/server/schemas"
import { Form, FormControl, FormLabel, FormItem, FormField, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Loader2, Rocket, Shuffle } from "lucide-react"
import { useState } from "react"
import { Select, SelectValue, SelectTrigger, SelectContent, SelectItem } from "@/components/ui/select"
import { checkKurzExists, createLink } from "../server/actions/kurz"
import { EXPIRY_TIMES } from "@/lib/config"
import { useToast } from "@/hooks/use-toast"
import { ERROR_TYPES } from "@/lib/errors"

export default function CreateLink() {

    const { toast } = useToast()

    // const [favicon, setFavicon] = useState<string | null>(null)
    const [loading, setLoading] = useState(false)


    const form = useForm<z.infer<typeof CreateLinkSchema>>({
        resolver: zodResolver(CreateLinkSchema),
        defaultValues: {
            url: "",
            kurz: "",
            description: "",
            expires: undefined
        }
    })

    const onSubmit = async (values: z.infer<typeof CreateLinkSchema>) => {
        const { url, kurz, description, expires } = values

        if(url === kurz) {
            form.setError("kurz", { message: "KURZ Link cannot be the same as the source URL" })
            return
        }

        try {
            setLoading(true)

            const kurzExists = await checkKurzExists(kurz)

            if(kurzExists) {
                form.setError("kurz", { message: "KURZ Link already exists" })
                return
            }

            const link = await createLink(url, kurz, description ?? null, expires ?? null)

            if(!link) {
                form.setError("kurz", { message: "Failed to create link" })
                return
            }

            form.reset()

            toast({
                title: "Link created",
                description: `Your link has been created.`,
            });

        } catch (error) {
            console.error('Error creating text:', error);
            const errorMessage = error instanceof Error ? error.message : 'INTERNAL_SERVER_ERROR';
            const errorType = Object.keys(ERROR_TYPES).find(
                key => ERROR_TYPES[key as keyof typeof ERROR_TYPES].message === errorMessage
            ) as keyof typeof ERROR_TYPES || 'INTERNAL_SERVER_ERROR';
            
            toast({
                variant: "destructive",
                title: "Error - " + ERROR_TYPES[errorType].message,
                description: ERROR_TYPES[errorType].extendedMessage,
            });
        } finally {
            setLoading(false)
        }
    }

    // const fetchFavicon = async (url: string) => {
    //     if (!url) return null

    //     try {
    //         if (!url.startsWith('http')) {
    //             url = 'https://' + url
    //         }

    //         const domain = new URL(url).hostname
    //         const faviconUrl = `https://www.google.com/s2/favicons?domain=${domain}&sz=64`
            
    //         const response = await fetch(faviconUrl, {
    //             method: 'HEAD',
    //             mode: 'no-cors',
    //         })
            
    //         if (response.ok) {
    //             return faviconUrl
    //         }
    //         return null
    //     } catch (error) {
    //         console.error("Error fetching favicon:", error)
    //         return null
    //     }
    // }

    const handleRandomize = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault()
        const randomString = Math.random().toString(36).substring(2, 10)
        form.setValue("kurz", randomString)
    }

    const getExpiryDisplayValue = (date: Date | null | undefined) => {
        if (!date) return "Never";
        const now = new Date();
        const diff = date.getTime() - now.getTime();
        
        const matchingTime = EXPIRY_TIMES.find(time => 
            time.ms !== null && Math.abs(diff - time.ms) < 1000
        );
        
        return matchingTime?.label || "Never";
    }

    return (
        <div className="w-2/4">
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                    <div className="space-y-4">
                        <FormField
                            control={form.control}
                            name="url"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="font-bold font-inter-sans">Source URL</FormLabel>
                                    <FormControl>
                                        <div className="flex relative">
                                            <Button variant="outline" className="left-0 rounded-none rounded-bl-md rounded-tl-md" disabled>
                                                <span className="text-xs">https://</span>
                                            </Button>
                                            <Input 
                                                {...field} 
                                                autoComplete="off" 
                                                placeholder="google.com"
                                                className="rounded-md rounded-bl-none rounded-tl-none"
                                                onBlur={() => {
                                                    if (field.value.startsWith('http://') || field.value.startsWith('https://')) {
                                                        field.onChange(field.value.replace('http://', '').replace('https://', ''))
                                                    }
                                                }}
                                            />
                                        {/* {favicon && <Button variant="outline" className="absolute right-0 rounded-none rounded-br-md rounded-tr-md" onClick={() => setFavicon(null)}>
                                            <Image src={favicon} alt="Favicon" width={16} height={16} /> 
                                        </Button>}*/}

                                        </div>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="kurz"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="font-bold font-inter-sans">KURZ Link</FormLabel>
                                    <FormControl>
                                        <div className="flex relative">
                                            <Button variant="outline" className="left-0 rounded-none rounded-bl-md rounded-tl-md" disabled>
                                                <span className="text-xs">{process.env.NEXT_PUBLIC_APP_URL}/</span>
                                            </Button>
                                            <Input {...field} autoComplete="off" placeholder="kurz" className="rounded-md rounded-bl-none rounded-tl-none" />
                                            <Button
                                                onClick={handleRandomize} 
                                                variant="outline" 
                                                className="absolute right-0 rounded-none rounded-br-md rounded-tr-md"
                                            >
                                                <Shuffle className="w-4 h-4" />
                                                <span className="text-xs">Randomize</span>
                                            </Button>
                                        </div>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="description"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="font-bold font-inter-sans">Description (optional)</FormLabel>
                                    <FormControl>
                                        <Textarea {...field} limit={100} autoComplete="off" variant="fixed" placeholder="A description for your link" />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <div className="flex justify-between">
                            <FormField
                                control={form.control}
                                name="expires"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="font-bold font-inter-sans">Expires</FormLabel>
                                        <FormControl>
                                            <Select
                                                onValueChange={(value) => {
                                                    if (value === "never") {
                                                        field.onChange(undefined);
                                                    } else {
                                                        const time = EXPIRY_TIMES.find(t => t.value === value);
                                                        field.onChange(time?.ms ? new Date(Date.now() + time.ms) : undefined);
                                                    }
                                                }}
                                                value={field.value ? EXPIRY_TIMES.find(t => 
                                                    t.ms && Math.abs(field.value!.getTime() - Date.now() - t.ms) < 1000
                                                )?.value || "never" : "never"}
                                            >
                                                <SelectTrigger>
                                                    <SelectValue>
                                                        {getExpiryDisplayValue(field.value)}
                                                    </SelectValue>
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {EXPIRY_TIMES.map(time => (
                                                        <SelectItem key={time.value} value={time.value}>
                                                            {time.label}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                    </div>

                    <Button type="submit" disabled={loading} className="w-full">
                        {loading ? (
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        ) : (
                            <Rocket className="w-4 h-4 mr-2" />
                        )}
                        Create
                    </Button>
                </form>
            </Form>
        </div>
    )
}
