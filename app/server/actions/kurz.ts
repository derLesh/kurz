"use server"

import { db } from "@/db"
import { links } from "@/db/schema"
import { and, eq, lt, sql } from "drizzle-orm"
import { auth } from "@/lib/auth"
import { headers } from "next/headers"

const checkKurzExists = async (kurz: string) => {
    const kurzExists = await db.select().from(links).where(eq(links.kurz, kurz)).limit(1)
    return kurzExists.length > 0
}

const getLink = async (kurz: string) => {
    const link = await db.select().from(links).where(eq(links.kurz, kurz)).limit(1)
    return link[0]
}

const getUserLinks = async () => {
    const session = await auth.api.getSession({
        headers: await headers()
    })
    if (!session) throw new Error("Unauthorized")
 
    const userLinks = await db.select().from(links).where(eq(links.userId, session.user.id))
    return userLinks
}

const createLink = async (url: string, kurz: string, description: string | null, expiresAt: Date | null) => {
    const session = await auth.api.getSession({
        headers: await headers()
    })
    if (!session) throw new Error("Unauthorized")

    const now = new Date()
    await db.insert(links).values({ 
        id: crypto.randomUUID(),
        url, 
        kurz, 
        description,
        expiresAt,
        createdAt: now,
        updatedAt: now,
        userId: session.user.id
    })

    return { success: true }
}

const deleteLink = async (kurz_id: string) => {
    const session = await auth.api.getSession({
        headers: await headers()
    })
    if (!session) throw new Error("Unauthorized")

    try {
        const result = await db.delete(links)
            .where(and(eq(links.id, kurz_id), eq(links.userId, session.user.id)))
            .returning();
        
        if (result.length === 0) {
            return { 
                success: false, 
                message: "Link not found!" 
            }
        }
        
        return { success: true }
    } catch (error) {
        console.error(error)
        return { success: false, message: "Something went wrong" }
    }
}

const expiredLink = async (kurz_id: string) => {
    try {
        await db.delete(links).where(and(eq(links.id, kurz_id), lt(links.expiresAt, new Date())))
        return {
            success: true,
            message: "Link expired"
        }
    } catch (error) {
        console.error(error)
        return { success: false, message: "Something went wrong" }
    }
}

const incrementClicks = async (kurz_id: string) => {
    await db.update(links).set({
        clicks: sql`${links.clicks} + 1`,
        lastClick: new Date()
    }).where(eq(links.id, kurz_id))
}

export {
    checkKurzExists,
    createLink,
    getLink,
    deleteLink,
    incrementClicks,
    expiredLink,
    getUserLinks
}
