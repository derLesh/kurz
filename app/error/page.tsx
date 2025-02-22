import { ERROR_TYPES } from "@/lib/errors"

export default async function ErrorPage({
    searchParams,
}: {
    searchParams: Promise<{ code?: string }>
}) {
    const { code } = await searchParams
    const error = code 
        ? Object.values(ERROR_TYPES).find(err => err.code === parseInt(code))
        : null

    const errorCode = error?.code || null
    const errorMessage = error?.message || "An error occurred"
    const extendedMessage = error?.extendedMessage || "An error occurred while processing your request. Please try again later."

    return (
        <div className="container mx-auto h-screen flex items-center justify-center">
            <div className="flex flex-col items-center justify-center">
                <div className="flex flex-col items-center justify-center gap-2">
                    <h1 className="text-4xl font-bold">Error - {errorCode}</h1>
                    <h2 className="text-2xl font-bold">{errorMessage}</h2>
                </div>
                <p className="text-sm text-muted-foreground">{extendedMessage}</p>
            </div>
        </div>
    )
}