import { Button } from "../ui/button"
import { auth } from "@/lib/auth"
import { Plus } from "lucide-react"
import { headers } from "next/headers"
import Link from "next/link"

export default async function CreateTextButton() {

    const session = await auth.api.getSession({
        headers: await headers()
    })

    return (
        <div className="flex flex-col items-center gap-2">
            <Link href={session ? "/create?t=text" : "/auth"} className="flex flex-row items-center gap-2">
                <Button variant="expand" className="font-inter-sans">
                    <Plus className="w-4 h-4" />
                    <span>Create Text</span>
                    {!session && (
                        <p className="text-xs text-muted-foreground">
                            (Login required)
                        </p>
                    )}
                </Button>
            </Link>
        </div>
    )
}
