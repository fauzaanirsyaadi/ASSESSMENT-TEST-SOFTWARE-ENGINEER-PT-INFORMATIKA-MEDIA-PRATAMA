"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function HomePage() {
    const router = useRouter();

    useEffect(() => {
        router.replace('/posts');
    }, [router]);

    return (
        <div className="flex justify-center items-center h-64">
            <span className="loading loading-lg loading-spinner"></span>
        </div>
    );
}

