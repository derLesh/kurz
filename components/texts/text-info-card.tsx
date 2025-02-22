"use client"

export default function TextInfoCard({ info, data }: { info: string, data: string }) {
    return (
        <div className="group relative w-full flex flex-col rounded-md border-[1px] border-neutral-300 px-3 py-2 shadow-sm transition-colors duration-300 hover:border-neutral-400 dark:border-neutral-800 dark:hover:border-neutral-700">
            <div className="relative flex flex-col">
                <p className="text-sm font-mono">{info}</p>
                <p className="text-sm font-mono">{data}</p>
            </div>
        </div>
    )
}
