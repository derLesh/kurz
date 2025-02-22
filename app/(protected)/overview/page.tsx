import { Button } from "@/components/ui/button";
import { LinkIcon, TextIcon } from "lucide-react";
import Link from "next/link";
import OverviewLinks from "./overview-links";
import OverviewTexts from "./overview-texts";
import { getUserLinks } from "@/app/server/actions/kurz";
import { getUserTexts } from "@/app/server/actions/text";

export default async function Overview({
    searchParams,
}: {
    searchParams: Promise<{ tab?: string }>
}) {
    const activeTab = (await searchParams).tab || 'links';

    // Hole die Links einmalig auf Server-Seite
    const links = await getUserLinks();
    const texts = await getUserTexts();

    return (
        <div className="container mx-auto mt-20">
            <div className="flex flex-col gap-4">
                <div className="flex flex-row gap-10 border-b w-screen -mx-[50vw] left-[50%] relative">
                    <div className="container mx-auto flex flex-row gap-6">
                        <Link href="/overview?tab=links">
                            <Button 
                                variant="outline" 
                                className={`group border-b-2 border-l-0 border-r-0 border-t-0 rounded-none transition-colors ${
                                    activeTab === 'links' 
                                        ? 'border-b-white text-foreground' 
                                        : 'border-b-transparent text-muted-foreground hover:text-foreground'
                                }`}
                            >
                                <LinkIcon className="w-4 h-4 group-hover:rotate-12 group-hover:scale-110 transition-all duration-300" />
                                <span className="font-medium">Links</span>
                            </Button>
                        </Link>
                        <Link href="/overview?tab=texts">
                            <Button 
                                variant="outline" 
                                className={`group border-b-2 border-l-0 border-r-0 border-t-0 rounded-none transition-colors ${
                                    activeTab === 'texts' 
                                        ? 'border-b-white text-foreground' 
                                        : 'border-b-transparent text-muted-foreground hover:text-foreground'
                                }`}
                            >
                                <TextIcon className="w-4 h-4 group-hover:rotate-12 group-hover:scale-110 transition-all duration-300" />
                                <span className="font-medium">Texts</span>
                            </Button>
                        </Link>
                    </div>
                </div>
                <div>
                    {activeTab === 'links' && (
                        <OverviewLinks links={links} />
                    )}
                    {activeTab === 'texts' && (
                        <OverviewTexts texts={texts} />
                    )}
                </div>
            </div>
        </div>
    )
}
