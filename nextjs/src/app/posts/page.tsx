"use client";

import { useState, useEffect } from 'react';
import api from '@/lib/axios';
import { PaginatedPosts, Post } from '@/types/Post';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';

export default function PostsPage() {
    const [postData, setPostData] = useState<PaginatedPosts | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const { user } = useAuth();

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

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'short', 
            day: 'numeric' 
        });
    };

    if (isLoading) {
        return (
            <div className="container mx-auto px-4">
                <div className="flex justify-center items-center min-h-[60vh]">
                    <div className="text-center">
                        <span className="loading loading-spinner loading-lg text-primary"></span>
                        <p className="mt-4 text-gray-500">Loading posts...</p>
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="container mx-auto px-4">
                <div className="alert alert-error shadow-lg mt-8">
                    <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <div>
                        <h3 className="font-bold">Error loading posts</h3>
                        <div className="text-xs">{error}</div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            {/* Header Section */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
                <div>
                    <h1 className="text-4xl font-bold mb-2">All Posts</h1>
                    <p className="text-gray-500">
                        {postData?.total ? `${postData.total} post${postData.total > 1 ? 's' : ''} found` : 'No posts yet'}
                    </p>
                </div>
                {user && (
                    <Link href="/posts/create" className="btn btn-primary gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        Create New Post
                    </Link>
                )}
            </div>

            {/* Posts Grid */}
            {postData && postData.data.length > 0 ? (
                <>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                        {postData.data.map((post: Post) => (
                            <div 
                                key={post.id} 
                                className="card bg-base-100 shadow-lg hover:shadow-2xl transition-all duration-300 border border-base-300 hover:border-primary/50"
                            >
                                <div className="card-body">
                                    <div className="flex items-start justify-between mb-2">
                                        <div className="badge badge-primary badge-sm">
                                            {post.user?.name || 'Unknown'}
                                        </div>
                                        <span className="text-xs text-gray-400">
                                            {formatDate(post.created_at)}
                                        </span>
                                    </div>
                                    <h2 className="card-title text-xl mb-2 line-clamp-2">
                                        {post.title}
                                    </h2>
                                    <p className="text-gray-600 line-clamp-3 mb-4">
                                        {post.content}
                                    </p>
                                    <div className="card-actions justify-end">
                                        <Link 
                                            href={`/posts/${post.id}`} 
                                            className="btn btn-primary btn-sm gap-2"
                                        >
                                            Read More
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                            </svg>
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Pagination */}
                    {postData.last_page > 1 && (
                        <div className="flex justify-center items-center gap-2 mt-8">
                            <button
                                className="btn btn-sm"
                                onClick={() => handlePageChange(postData.current_page - 1)}
                                disabled={postData.current_page === 1}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                </svg>
                                Previous
                            </button>
                            
                            <div className="join">
                                {Array.from({ length: postData.last_page }, (_, i) => i + 1).map((pageNum) => {
                                    if (
                                        pageNum === 1 ||
                                        pageNum === postData.last_page ||
                                        (pageNum >= postData.current_page - 1 && pageNum <= postData.current_page + 1)
                                    ) {
                                        return (
                                            <button
                                                key={pageNum}
                                                className={`join-item btn btn-sm ${postData.current_page === pageNum ? 'btn-active' : ''}`}
                                                onClick={() => handlePageChange(pageNum)}
                                            >
                                                {pageNum}
                                            </button>
                                        );
                                    } else if (pageNum === postData.current_page - 2 || pageNum === postData.current_page + 2) {
                                        return <span key={pageNum} className="join-item btn btn-sm btn-disabled">...</span>;
                                    }
                                    return null;
                                })}
                            </div>

                            <button
                                className="btn btn-sm"
                                onClick={() => handlePageChange(postData.current_page + 1)}
                                disabled={postData.current_page === postData.last_page}
                            >
                                Next
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                            </button>
                        </div>
                    )}
                </>
            ) : (
                <div className="text-center py-16">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-24 w-24 mx-auto text-gray-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <h3 className="text-2xl font-bold mb-2">No posts yet</h3>
                    <p className="text-gray-500 mb-6">Be the first to create a post!</p>
                    {user && (
                        <Link href="/posts/create" className="btn btn-primary">
                            Create Your First Post
                        </Link>
                    )}
                </div>
            )}
        </div>
    );
}
