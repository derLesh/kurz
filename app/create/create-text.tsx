"use client"

import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";

import { CreateTextSchema } from "../server/schemas";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Check, EyeIcon, EyeOffIcon, Loader2, Rocket } from "lucide-react";
import { useState, useRef } from "react";

import { EXPIRY_TIMES, SYNTAX_LANGUAGES, VIEW_LIMITS } from "@/lib/config";
import { cn } from "@/lib/utils";
import { TextContent } from "@/components/texts/text-content";
import { createText } from "../server/actions/text";

import { useToast } from "@/hooks/use-toast";
import { ERROR_TYPES } from "@/lib/errors";
import { useRouter } from "next/navigation";

export default function CreateText() {

    const [showPassword, setShowPassword] = useState(false);
    const [open, setOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [enableViewLimit, setEnableViewLimit] = useState(false);
    const { toast } = useToast();
    const router = useRouter();

    const form = useForm<z.infer<typeof CreateTextSchema>>({
        resolver: zodResolver(CreateTextSchema),
        defaultValues: {
            title: "",
            text: "",
            syntax: "text",
            expires: null,
            password: "",
            viewLimit: undefined
        },
    });

    const textareaRef = useRef<HTMLTextAreaElement>(null);

    const getExpiryDisplayValue = (date: Date | null | undefined) => {
        if (!date) return "Never";
        const now = new Date();
        const diff = date.getTime() - now.getTime();
        
        const matchingTime = EXPIRY_TIMES.find(time => 
            time.ms !== null && Math.abs(diff - time.ms) < 1000
        );
        
        return matchingTime?.label || "Never";
    }

    const compressText = async (text: string): Promise<string> => {
        try {
            // Text in Uint8Array konvertieren
            const textEncoder = new TextEncoder();
            const textBytes = textEncoder.encode(text);
            
            // Komprimieren mit GZIP
            const compressedStream = new CompressionStream('gzip');
            const writer = compressedStream.writable.getWriter();
            writer.write(textBytes);
            writer.close();
            
            // Komprimierte Daten lesen
            const compressedResponse = new Response(compressedStream.readable);
            const compressedData = await compressedResponse.arrayBuffer();
            
            // Als Base64 zurückgeben
            return Buffer.from(compressedData).toString('base64');
        } catch (error) {
            console.error('Compression error:', error);
            // Fallback: Unkomprimierter Text in Base64
            return Buffer.from(text).toString('base64');
        }
    };

    const onSubmit = async (values: z.infer<typeof CreateTextSchema>) => {
        setIsLoading(true);
        try {
            const compressedText = await compressText(values.text);
            
            const textData = {
                ...values,
                text: compressedText,
                viewLimit: values.viewLimit || null
            };

            const result = await createText(
                textData.title, 
                textData.text, 
                textData.syntax, 
                textData.expires ? new Date(textData.expires) : null, 
                textData.password || null,
                textData.viewLimit
            );
            
            if (!result.success) {
                const errorType = result.error as keyof typeof ERROR_TYPES;
                throw new Error(ERROR_TYPES[errorType]?.message || "Failed to create text");
            }

            toast({
                title: "Text created",
                description: `Your text has been created with code: ${result.textCode}`,
            });

            form.reset();
            setIsLoading(false);
            
            router.push(`/t/${result.textCode}`);

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
            setIsLoading(false);
        }
    }





    return (
        <div className="w-full">
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4">
                    <div className="flex flex-row gap-4 mb-4 items-center">
                        <FormField
                            control={form.control}
                            name="syntax"
                            render={({ field }) => (
                                <FormItem className="flex flex-row items-center w-[200px] gap-2">
                                    <FormLabel className="w-16 font-bold font-inter-sans">Syntax:</FormLabel>
                                    <FormControl className="flex-1">
                                        <Popover open={open} onOpenChange={setOpen}>
                                            <PopoverTrigger asChild>
                                                {(() => {
                                                    const selectedLanguage = SYNTAX_LANGUAGES.find(l => l.value === field.value);
                                                    return (
                                                        <Button variant="outline" className="flex gap-2 w-full">
                                                            {selectedLanguage?.icon && (
                                                                <div className="w-4 h-4 relative flex-shrink-0">
                                                                        <selectedLanguage.icon className="w-4 h-4" />
                                                                </div>
                                                            )}
                                                            <span className="truncate">
                                                                {selectedLanguage?.label || field.value}
                                                            </span>
                                                        </Button>
                                                    );
                                                })()}
                                            </PopoverTrigger>
                                            <PopoverContent className="w-[320px] p-0" align="start">
                                                <Command>
                                                    <CommandInput placeholder="Select syntax..." />
                                                    <CommandList>
                                                        <CommandEmpty>No results found.</CommandEmpty>
                                                        <CommandGroup>
                                                            {SYNTAX_LANGUAGES.map((option) => (
                                                                <CommandItem key={option.value}
                                                                    value={option.value} 
                                                                    onSelect={(currentValue) => {
                                                                        form.setValue("syntax", currentValue === field.value ? "text" : currentValue);
                                                                        setOpen(false);
                                                                    }}>
                                                                    <div className="w-4 h-4 mr-2 relative">
                                                                        {option.icon && (
                                                                            <option.icon className={cn(
                                                                                "absolute inset-0",
                                                                                field.value === option.value ? "opacity-0" : "opacity-100"
                                                                            )} />
                                                                        )}
                                                                        <Check className={cn(
                                                                            "absolute inset-0",
                                                                            field.value === option.value ? "opacity-100" : "opacity-0"
                                                                        )} />
                                                                    </div>
                                                                    {option.label}
                                                                </CommandItem>
                                                            ))}
                                                        </CommandGroup>
                                                    </CommandList>
                                                </Command>
                                            </PopoverContent>
                                        </Popover>
                                    </FormControl>
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="expires"
                            render={({ field }) => (
                                <FormItem className="flex flex-row items-center w-[200px] gap-2">
                                    <FormLabel className="w-16 font-bold font-inter-sans">Expires:</FormLabel>
                                    <FormControl className="flex-1">
                                        <Select
                                            onValueChange={(value) => {
                                                if (value === "never") {
                                                    field.onChange(null);
                                                } else {
                                                    const time = EXPIRY_TIMES.find(t => t.value === value);
                                                    field.onChange(time?.ms ? new Date(Date.now() + time.ms) : null);
                                                }
                                            }}
                                            value={field.value ? EXPIRY_TIMES.find(t => 
                                                t.ms && Math.abs(field.value!.getTime() - Date.now() - t.ms) < 1000
                                            )?.value || "never" : "never"}
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select a date">
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
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="password"
                            render={({ field }) => (
                                <FormItem className="flex flex-row items-center w-[300px] gap-4">
                                    <FormLabel className="w-16 font-bold font-inter-sans">Password:</FormLabel>
                                    <FormControl className="flex-1">
                                        <div className="flex relative">
                                            <Input {...field} 
                                                type={showPassword ? "text" : "password"} 
                                                className="rounded-md"
                                                autoComplete="off"
                                                maxLength={10}
                                            />
                                            <Button 
                                                onClick={() => setShowPassword(!showPassword)}
                                                variant="outline"
                                                className="absolute right-0 rounded-none rounded-br-md rounded-tr-md"
                                                type="button"
                                            >
                                                {showPassword ? <EyeIcon className="w-4 h-4" /> : <EyeOffIcon className="w-4 h-4" />}
                                            </Button>
                                        </div>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="viewLimit"
                            render={({ field }) => (
                                <FormItem className="flex flex-row items-center w-[350px]">
                                    <FormLabel className="w-24 font-bold font-inter-sans whitespace-nowrap">View Limit:</FormLabel>
                                    <FormControl>
                                        <div className="flex items-center gap-2 flex-1">
                                            <Checkbox 
                                                checked={enableViewLimit}
                                                onCheckedChange={(checked) => {
                                                    setEnableViewLimit(checked as boolean);
                                                    if (!checked) {
                                                        field.onChange(undefined);
                                                    }
                                                }}
                                            />
                                            {enableViewLimit && (
                                                <Select
                                                    value={field.value?.toString()}
                                                    onValueChange={(value) => {
                                                        field.onChange(parseInt(value));
                                                    }}
                                                >
                                                    <SelectTrigger className="w-[150px]">
                                                        <SelectValue placeholder="Select limit" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {VIEW_LIMITS.map((limit) => (
                                                            <SelectItem key={limit.value} value={limit.value.toString()}>
                                                                {limit.label}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                            )}
                                        </div>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                    </div>
                    <FormField
                        control={form.control}
                        name="title"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="font-bold font-inter-sans">Title</FormLabel>
                                <FormControl>
                                    <Input {...field} maxLength={100} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="text"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="font-bold font-inter-sans">Text</FormLabel>
                                <FormControl>
                                    <TextContent 
                                        value={field.value}
                                        onChange={field.onChange}
                                        textareaRef={textareaRef}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <Button type="submit" className="w-full mt-2" disabled={isLoading}>
                        {isLoading ? (
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
