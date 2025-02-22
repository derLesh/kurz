import { Button } from "@/components/ui/button";
import { LinkIcon, TextIcon } from "lucide-react";
import Link from "next/link";
import CreateText from "./create-text";
import CreateLink from "./create-link";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import SignIn from "../auth/signin-card";

export default async function CreatePage({
    searchParams,
}: {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
    const { t } = await searchParams || { t: "links" };
    const session = await auth.api.getSession({
        headers: await headers()
    });

    return (
        <div className="container mx-auto mt-20">
            <div className="flex flex-col gap-4">
                <div className="flex flex-row gap-10 border-b w-screen -mx-[50vw] left-[50%] relative">
                    <div className="container mx-auto flex flex-row gap-6 justify-center">
                        <Link href="/create?t=text" className="flex-1">
                            <Button 
                                variant="outline"
                                className={`w-full group border-b-2 border-l-0 border-r-0 border-t-0 rounded-none transition-colors ${
                                    t === 'text' 
                                        ? 'border-b-primary text-primary' 
                                        : 'border-b-transparent text-muted-foreground hover:text-foreground'
                                }`}
                            >
                                <TextIcon className="w-4 h-4 group-hover:rotate-12 group-hover:scale-110 transition-all duration-300" />
                                <span className="font-medium">Texts</span>
                            </Button>
                        </Link>
                        <Link href="/create?t=link" className="flex-1">
                            <Button 
                                variant="outline"
                                className={`w-full group border-b-2 border-l-0 border-r-0 border-t-0 rounded-none transition-colors ${
                                    t === 'link' 
                                        ? 'border-b-primary text-primary' 
                                        : 'border-b-transparent text-muted-foreground hover:text-foreground'
                                }`}
                            >
                                <LinkIcon className="w-4 h-4 group-hover:rotate-12 group-hover:scale-110 transition-all duration-300" />
                                <span className="font-medium">Links</span>
                            </Button>
                        </Link>
                    </div>
                </div>

                
                <div className="relative">
                    <div className={`flex flex-col items-center justify-center gap-4 ${!session && 'pointer-events-none blur-sm'}`}>
                        {t === "text" && (
                            <div className="flex flex-col items-center justify-center w-full mx-auto">
                                <CreateText />
                            </div>
                        )}
                        {t === "link" && (
                            <div className="flex flex-col items-center justify-center w-full mx-auto">
                                <CreateLink />
                            </div>
                        )}
                    </div>
                    {!session && (
                        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center justify-center gap-4 bg-background/80 p-8 rounded-lg shadow-lg">
                            <SignIn />
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
