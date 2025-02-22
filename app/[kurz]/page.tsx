import { redirect } from 'next/navigation';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import { protectedRoutes } from '@/routes';
import { incrementClicks, getLink, expiredLink } from '../server/actions/kurz';
import { ERROR_TYPES, getErrorUrl } from '@/lib/errors';

export default async function KurzPage(props: { params: Promise<{ kurz: string }> }) {
    const { kurz } = await props.params;

    const session = await auth.api.getSession({
        headers: await headers()
    })

    const isProtected = protectedRoutes.includes(kurz)

    let redirectRoute = '/';

    try {
        const link = await getLink(kurz);
        
        console.log(link)

        if (!link || link === undefined) {
            throw new Error('NOT_FOUND');
        }

        if(link.expiresAt && link.expiresAt < new Date()) {
            await expiredLink(link.id);
            throw new Error('EXPIRED');
        }

        if (isProtected && !session) {
            throw new Error('UNAUTHORIZED');
        }

        await incrementClicks(link.id);

        let finalUrl = link.url;
        if(!finalUrl.startsWith("http")) {
            finalUrl = "https://" + finalUrl;
        }

        redirectRoute = finalUrl;
    } catch (error) {
        console.error(error);
        const errorType = error instanceof Error ? error.message : 'INTERNAL_SERVER_ERROR';
        redirectRoute = getErrorUrl(errorType as keyof typeof ERROR_TYPES);
    }

    return redirect(redirectRoute);
}