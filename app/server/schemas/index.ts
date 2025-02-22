import z from "zod";
import { SYNTAX_LANGUAGES } from "@/lib/config";

export const LinkSchema = z.object({
    id: z.string(),
    url: z.string(),
    kurz: z.string(),
    description: z.string().optional()
})

export const TextSchema = z.object({
    id: z.string(),
    text: z.string(),
    format: z.string().optional(),
})

export const CreateLinkSchema = z.object({
    url: z.string().min(1, { message: "URL is required" }).regex(/^[^.\s]+\.[^.\s]+.*$/, { message: "Invalid URL. Must contain a domain with TLD" }).regex(/^\S+$/, { message: "URL cannot contain spaces" }),
    kurz: z.string().min(4, { message: "Kurz links must be at least 4 characters long" }).regex(/^[a-zA-Z0-9_-]*$/, { message: "Kurz links can only contain letters, numbers, underscores and hyphens" }).regex(/^(?!.*&c$)/, { message: "Kurz links cannot end with &c" }),
    description: z.string().max(100, { message: "Description cannot be longer than 100 characters" }).optional(),
    expires: z.date().optional().nullable()
})

export const EditLinkSchema = z.object({
    url: z.string().min(1, { message: "URL is required" }).regex(/^[^.\s]+\.[^.\s]+.*$/, { message: "Invalid URL. Must contain a domain with TLD" }).regex(/^\S+$/, { message: "URL cannot contain spaces" }),
    kurz: z.string().min(4, { message: "Kurz links must be at least 4 characters long" }).regex(/^[a-zA-Z0-9_-]*$/, { message: "Kurz links can only contain letters, numbers, underscores and hyphens" }).regex(/^(?!.*&c$)/, { message: "Kurz links cannot end with &c" }),
    description: z.string().max(100, { message: "Description cannot be longer than 100 characters" }).optional(),
})

export const CreateTextSchema = z.object({
    title: z.string()
        .min(1, { message: "Title is required" })
        .max(100, { message: "Title cannot be longer than 100 characters" })
        .regex(/^[\w\s\-_.]+$/, { 
            message: "Title can only contain letters, numbers, spaces and -_." 
        }),
    text: z.string()
        .min(1, { message: "Text is required" })
        .max(10000, { message: "Text cannot be longer than 10000 characters" })
        .transform((str) => {
            return str.replace(/\0/g, '');
        }),
    syntax: z.enum(
        SYNTAX_LANGUAGES.map(lang => lang.value) as [string, ...string[]],
        {
            errorMap: () => ({ message: "Invalid syntax selected" })
        }
    ),
    expires: z.date().optional().nullable(),
    password: z.string()
        .max(72, { message: "Password too long" })
        .regex(/^[\x20-\x7E]*$/, { 
            message: "Password contains invalid characters" 
        })
        .optional(),
    viewLimit: z.number().optional()
})


