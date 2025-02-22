import TextCard from "@/components/texts/text-card"
import { Button } from "@/components/ui/button"
import { texts } from "@/db/schema"
import { Plus } from "lucide-react"
import Link from "next/link"

interface OverviewTextsProps {
    texts: typeof texts.$inferSelect[]
}

export default function OverviewTexts({ texts }: OverviewTextsProps) {

    return (
        <div className="mx-10">
            <div className="flex flex-row justify-between items-center mb-4">
                <h1 className="text-2xl font-bold">Texts</h1>
                {/* TODO: Add search bar */}
                <Button variant="expand" className="font-inter-sans">
                    <Link href="/create?t=text" className="flex flex-row items-center gap-2">
                        <Plus className="w-4 h-4" />
                        <span>Create Text</span>
                    </Link>
                </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {texts.map((text) => (
                    <TextCard key={text.id} text={text} />
                ))}
            </div>
        </div>
    )
}
