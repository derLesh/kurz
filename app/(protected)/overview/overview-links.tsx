import LinkCard from "@/components/links/link-card"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import Link from "next/link"
import { links } from "@/db/schema"

interface OverviewLinksProps {
    links: typeof links.$inferSelect[]
}

export default function OverviewLinks({ links }: OverviewLinksProps) {
    return (
        <div className="mx-10">
            <div className="flex flex-row justify-between items-center mb-4">
                <h1 className="text-2xl font-bold">Links</h1>
                {/* TODO: Add search bar */}
                <Button variant="expand" className="font-inter-sans">
                    <Link href="/create?t=link" className="flex flex-row items-center gap-2">
                        <Plus className="w-4 h-4" />
                        <span>Create Link</span>
                    </Link>
                </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {links.map((link) => (
                    <LinkCard key={link.id} link={link} />
                ))}
            </div>
        </div>
    )
}
