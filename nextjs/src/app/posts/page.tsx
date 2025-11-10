"use client";

import { useState, useEffect } from 'react';
import api from '@/lib/axios';
import { PaginatedPosts, Post } from '@/types/Post';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';

export default function PostsPage() {
    const [postData, setPostData] = useState<PaginatedPosts | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const searchParams = useSearchParams();
    const router = useRouter();
    const page = searchParams.get('page') || '1';

    useEffect(() => {
        const fetchPosts = async () => {
            setIsLoading(true);
            setError(null);
            try {
                const response = await api.get(`/posts?page=${page}`);
                setPostData(response.data);
            } catch (err) {
                setError('Failed to fetch posts.');
                console.error(err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchPosts();
    }, [page]);

    const handlePageChange = (newPage: number) => {
        router.push(`/posts?page=${newPage}`);
    };

    if (isLoading) {
        return <div className="flex justify-center items-center h-64"><span className="loading loading-lg loading-spinner"></span></div>;
    }

    if (error) {
        return <div className="text-center text-red-500">{error}</div>;
    }

    return (
        <div className="container mx-auto">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-4xl font-bold">All Posts</h1>
                <Link href="/posts/create" className="btn btn-primary">
                    Create New Post
                </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {postData?.data.map((post: Post) => (
                    <div key={post.id} className="card bg-base-100 shadow-xl hover:shadow-2xl transition-shadow">
                        <div className="card-body">
                            <h2 className="card-title">{post.title}</h2>
                            <p className="text-sm text-gray-500">By {post.user?.name || 'Unknown'}</p>
                            <p>{post.content.substring(0, 100)}...</p>
                            <div className="card-actions justify-end">
                                <Link href={`/posts/${post.id}`} className="btn btn-secondary btn-sm">
                                    Read More
                                </Link>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Pagination */}
            <div className="join mt-12 flex justify-center">
                {postData?.links.map((link, index) => {
                    const pageNumber = parseInt(link.label);
                    if (!isNaN(pageNumber)) {
                        return (
                            <button
                                key={index}
                                className={`join-item btn ${link.active ? 'btn-active' : ''}`}
                                onClick={() => handlePageChange(pageNumber)}
                                disabled={link.active}
                            >
                                {link.label}
                            </button>
                        );
                    }
                    return null; // Don't render "Previous" or "Next" text links for this simple pagination
                })}
            </div>
        </div>
    );
}
