'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface PasswordAuthProps {
    onAuth: (password: string) => Promise<boolean>;
}

export default function PasswordAuth({ onAuth }: PasswordAuthProps) {
    const [password, setPassword] = useState('');
    const [error, setError] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(false);

        const isValid = await onAuth(password);
        
        if (!isValid) {
            setError(true);
            setLoading(false);
        } else {
            window.location.reload();
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-[300px] gap-4">
            <h2 className="text-xl font-semibold">This text is password protected</h2>
            <form onSubmit={handleSubmit} className="flex flex-col gap-2 w-full max-w-sm">
                <Input
                    type="password"
                    placeholder="Enter password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className={error ? 'border-red-500' : ''}
                />
                {error && (
                    <p className="text-red-500 text-sm">Wrong password</p>
                )}
                <Button type="submit" disabled={loading}>
                    {loading ? 'Unlocking...' : 'Unlock'}
                </Button>
            </form>
        </div>
    );
}
