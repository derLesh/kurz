"use client"

import { ModeToggle } from "@/components/toggle-theme";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { signOut, useSession } from "@/lib/authClient";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { LogIn, LogOut, PanelsTopLeft } from "lucide-react";
import { useRouter } from "next/navigation";

export default function Navbar() {
    const { data: session } = useSession()
    const router = useRouter()
    return (
        <div className="fixed top-0 w-full backdrop-blur-sm">
            <div className="container mx-auto">
                <div className="flex justify-between items-center py-4">
                    <h1 className="font-inter-sans text-2xl font-bold flex items-center gap-2">
                        <Link href="/">KURZ</Link>
                        {process.env.NODE_ENV === 'development' && (
                            <Badge variant="outline" className="ml-2">dev</Badge>
                        )}
                    </h1>
                    <div className="flex items-center gap-4">
                        <ModeToggle />
                            {session ? (
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="expand" size="sm">
                                            <Avatar className="h-6 w-6">
                                                <AvatarImage src={session.user.image! as string} />
                                                <AvatarFallback>
                                                    {session.user.name?.charAt(0)}
                                                </AvatarFallback>
                                            </Avatar>
                                            <span className="ml-2 hidden md:block">
                                                {session.user.username}
                                            </span>
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent>
                                        <DropdownMenuItem asChild className="cursor-pointer">
                                            <Link href="/overview">
                                                <PanelsTopLeft className="w-4 h-4 mr-2" />
                                                <span>Overview</span>
                                            </Link>
                                        </DropdownMenuItem>
                                        <DropdownMenuItem asChild className="cursor-pointer">
                                            <div onClick={() => signOut({
                                                fetchOptions: {
                                                    onSuccess: () => {
                                                        router.push('/');
                                                    }
                                                }
                                            })}>
                                                <LogOut className="w-4 h-4 mr-2" />
                                                <span>Logout</span>
                                            </div>
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            ) : (
                                <Link href="/auth">
                                    <Button variant="expand" size="sm">
                                        <LogIn className="w-4 h-4 mr-2" />
                                        <span>Login</span>
                                    </Button>
                                </Link>
                            )}
                    </div>
                </div>
            </div>
        </div>
    )
}
