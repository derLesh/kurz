import { getText, expiredText, incrementViews, limitReached } from '@/app/server/actions/text';
import TextContent from './text-content';
import CopyText from '@/components/texts/copy-text';
import TextInfoCard from '@/components/texts/text-info-card';
import CreateTextButton from '@/components/texts/create-text-button';
import PasswordAuth from '@/components/layout/password-auth';
import { cookies, headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { ERROR_TYPES, getErrorUrl } from '@/lib/errors';
import { auth } from '@/lib/auth';

// Caching the text data does not work with the view limit feature
// const getTextFromDb = unstable_cache(
//     async (textId: string) => {
//         const text = await getText(textId);
//         return text;
//     },
//     ['text-cache'],
//     {
//         revalidate: 3600
//     }
// );

export default async function TextPage(props: { params: Promise<{ text: string }> }) {
    const { text } = await props.params;
    let textData;
    let isOwner = false;

    try {
        const cookieStore = await cookies();
        const isNewText = cookieStore.get(`new-text-${text}`)?.value === 'true';
        const result = await getText(text);
        textData = result.text;
        
        if (!textData) {
            throw new Error('NOT_FOUND');
        }

        if(textData.expiresAt && textData.expiresAt < new Date()) {
            await expiredText(textData.id);
            throw new Error('EXPIRED');
        }

        if(textData.viewLimit && textData.views >= textData.viewLimit) {
            await limitReached(textData.id);
            throw new Error('VIEW_LIMIT_REACHED');
        }

        // Hole aktuelle Session
        const session = await auth.api.getSession({
            headers: await headers()
        })
        isOwner = session?.user?.id === textData.userId;

        if (!isNewText && (!textData.password || isOwner)) {
            await incrementViews(textData.id);
        }

        console.log(textData);

    } catch (error) {
        console.error(error);
        let errorType: keyof typeof ERROR_TYPES = "INTERNAL_SERVER_ERROR";
        
        if (error instanceof Error) {
            errorType = error.message as keyof typeof ERROR_TYPES;
            if (!(errorType in ERROR_TYPES)) {
                errorType = "INTERNAL_SERVER_ERROR";
            }
        }
        
        redirect(getErrorUrl(errorType));
    }

    // Check if password exists and if user is not the owner
    if (textData.password && !isOwner) {
        const cookieStore = await cookies();
        const authCookie = cookieStore.get(`text-auth-${textData.id}`);
        
        if (!authCookie) {
            return (
                <div className='container mx-auto mt-20'>
                    <PasswordAuth
                        onAuth={async (password) => {
                            'use server';
                            if (password === textData.password) {
                                await incrementViews(textData.id);
                                (await cookies()).set(`text-auth-${textData.id}`, 'authenticated', {
                                    httpOnly: true,
                                    secure: process.env.NODE_ENV === 'production',
                                    sameSite: 'strict',
                                    maxAge: 3600
                                });
                                return true;
                            }
                            return false;
                        }}
                    />
                </div>
            );
        }
    }

    return (
        <div className='container mx-auto mt-20'>
            <div className='flex flex-col justify-center gap-2'>
                <div className='flex flex-row gap-2 items-center justify-between'>
                    <div className='flex flex-row gap-2 items-center'>
                        <CopyText text={textData.text} />
                        <h1 className='text-2xl font-bold'>{textData.title}</h1>
                    </div>
                    <CreateTextButton />
                </div>
                <TextContent text={textData.text} />
                <div className='flex flex-row gap-2'>
                    <TextInfoCard 
                        info="Created:" 
                        data={new Date(textData.createdAt).toLocaleString()} 
                    />
                    <TextInfoCard 
                        info="Expires:" 
                        data={textData.expiresAt ? new Date(textData.expiresAt).toLocaleString() : 'Never'} 
                    />
                    <TextInfoCard info="Views:" data={textData.views.toString()} />
                    <TextInfoCard info="Syntax:" data={textData.syntax!} />
                </div>
            </div>
        </div>
    );
}
