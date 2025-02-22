import { Button } from "@/components/ui/button";
import { Text, Link as LinkIcon } from "lucide-react";
import Link from "next/link";

export default function Home() {
  return (
    <div className="container mx-auto">
      <div className="absolute inset-0 -z-10 h-full w-full bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px] "></div>
      <div className="flex flex-col items-center justify-center h-screen ">
        <div className="flex flex-col items-center justify-center ">
          <h1 className="font-inter-sans text-9xl font-bold">KURZ</h1>
          <h2 className="font-inter-sans text-xl">Quickly share texts and links with your friends</h2>
        </div>
        <div className="flex flex-row items-center justify-center gap-4 mt-8">
          <Button size="lg" className="group" asChild>
            <Link href="/create?t=text" className="flex items-center gap-2">
              <Text className="w-4 h-4 group-hover:rotate-12 group-hover:scale-110 transition-all duration-300" />
              <span>Share text</span>
            </Link>
          </Button>
          <Button size="lg" className="group" asChild>
            <Link href="/create?t=link" className="flex items-center gap-2">
              <LinkIcon className="w-4 h-4 group-hover:rotate-12 group-hover:scale-110 transition-all duration-300" />
              <span>Share link</span>
            </Link>
          </Button>
        </div>
        <div className="flex flex-row items-center justify-center gap-4 mt-2">
          <p className="font-mono text-xs">Sharing a text or link requires a login</p>
        </div>
      </div>
    </div>
  );
}
