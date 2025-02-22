"use server"

import { db } from "@/db"
import { texts } from "@/db/schema"
import { auth } from "@/lib/auth"
import { headers } from "next/headers"
import { and, eq, sql, lt, gt } from "drizzle-orm"
import { cookies } from "next/headers"

const getText = async (text_code: string) => {
    const text = await db.select().from(texts).where(eq(texts.textCode, text_code))
    return { text: text[0] }
}

const getUserTexts = async () => {
    const session = await auth.api.getSession({
        headers: await headers()
    })
    if (!session) throw new Error("Unauthorized")

    const userTexts = await db.select().from(texts).where(eq(texts.userId, session.user.id))
    return userTexts
}

const createText = async (title: string, text: string, syntax: string, expires: Date | null, password: string | null, viewLimit: number | null) => {
    const session = await auth.api.getSession({
        headers: await headers()
    })
    if (!session) throw new Error("Unauthorized")
    
    const now = new Date()
    let textCode = ""
    try {
        textCode = Array.from(crypto.getRandomValues(new Uint8Array(10))).map(n => '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'[n % 62]).join('')
        await db.insert(texts).values({
            id: crypto.randomUUID(),
            textCode: textCode,
            text,
            title,
            syntax,
            expiresAt: expires ? new Date(expires.getTime()) : null,
            password,
            createdAt: now,
            updatedAt: now,
            userId: session.user.id,
            viewLimit: viewLimit
        }).returning();

        const cookieStore = await cookies()
        cookieStore.set(`new-text-${textCode}`, 'true', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 5
        });

        return { success: true, textCode: textCode }
    } catch (error) {
        console.error(error)
        const errorType = error instanceof Error ? error.message : "INTERNAL_SERVER_ERROR"
        return { success: false, error: errorType }
    }
}

const deleteText = async (textId: string) => {
    const session = await auth.api.getSession({
        headers: await headers()
    })
    if (!session) throw new Error("Unauthorized")

    try {
        const result = await db.delete(texts)
            .where(and(eq(texts.id, textId), eq(texts.userId, session.user.id)))
            .returning();
        
        if (result.length === 0) {
            return { success: false, message: "Text not found" }
        }

        return { success: true }
    } catch (error) {
        console.error(error)
        return { success: false, message: "Something went wrong" }
    }
}

const expiredText = async (textId: string) => {
    try {
        await db.delete(texts).where(and(eq(texts.id, textId), lt(texts.expiresAt, new Date())))
        return { success: true, message: "Text expired" }
    } catch (error) {
        console.error(error)
        const errorType = error instanceof Error ? error.message : "INTERNAL_SERVER_ERROR"
        return { success: false, error: errorType }
    }
}

const limitReached = async (textId: string) => {
    try {
        await db.delete(texts).where(and(eq(texts.id, textId), gt(texts.views, texts.viewLimit)))
        return { success: true, message: "View limit reached" }
    } catch (error) {
        console.error(error)
        return { success: false, message: "Something went wrong" }
    }
}

const incrementViews = async (textId: string) => {
    await db.update(texts).set({ views: sql`${texts.views} + 1`, lastView: new Date() }).where(eq(texts.id, textId))
}

export { createText, getText, getUserTexts, expiredText, incrementViews, deleteText, limitReached }