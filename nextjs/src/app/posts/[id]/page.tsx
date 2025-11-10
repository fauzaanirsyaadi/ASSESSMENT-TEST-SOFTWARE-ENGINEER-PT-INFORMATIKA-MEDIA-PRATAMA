"use client";

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import api from '@/lib/axios';
import { Post } from '@/types/Post';
import { useAuth } from '@/hooks/useAuth';
import Link from 'next/link';
import toast from 'react-hot-toast';

export default function PostDetailPage() {
    const [post, setPost] = useState<Post | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);
    const params = useParams();
    const router = useRouter();
    const { user } = useAuth();
    const { id } = params;

    useEffect(() => {
        if (id) {
            const fetchPost = async () => {
                setIsLoading(true);
                try {
                    const response = await api.get(`/posts/${id}`);
                    setPost(response.data);
                } catch (err) {
                    setError('Failed to fetch post. It may not exist.');
                    console.error(err);
                } finally {
                    setIsLoading(false);
                }
            };
            fetchPost();
        }
    }, [id]);

    const handleDelete = async () => {
        if (!window.confirm('Are you sure you want to delete this post? This action cannot be undone.')) {
            return;
        }

        setIsDeleting(true);
        try {
            await api.delete(`/posts/${id}`);
            toast.success('Post deleted successfully.');
            router.push('/posts');
        } catch (err) {
            toast.error('Failed to delete post. You may not have permission.');
            console.error(err);
            setIsDeleting(false);
        }
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    if (isLoading) {
        return (
            <div className="container mx-auto px-4">
                <div className="flex justify-center items-center min-h-[60vh]">
                    <div className="text-center">
                        <span className="loading loading-spinner loading-lg text-primary"></span>
                        <p className="mt-4 text-gray-500">Loading post...</p>
                    </div>
                </div>
            </div>
        );
    }

    if (error || !post) {
        return (
            <div className="container mx-auto px-4">
                <div className="alert alert-error shadow-lg mt-8">
                    <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <div>
                        <h3 className="font-bold">Post not found</h3>
                        <div className="text-xs">{error || 'The post you are looking for does not exist.'}</div>
                    </div>
                </div>
                <div className="mt-4">
                    <Link href="/posts" className="btn btn-primary">
                        Back to Posts
                    </Link>
                </div>
            </div>
        );
    }

    const isOwner = user && user.id === post.user_id;

    return (
        <div className="container mx-auto px-4 py-8 max-w-4xl">
            {/* Back Button */}
            <Link href="/posts" className="btn btn-ghost btn-sm mb-6 gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Back to Posts
            </Link>

            {/* Post Content */}
            <article className="card bg-base-100 shadow-xl mb-6">
                <div className="card-body">
                    {/* Header */}
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 pb-4 border-b">
                        <div className="flex-1">
                            <h1 className="text-4xl font-bold mb-3">{post.title}</h1>
                            <div className="flex flex-wrap items-center gap-3 text-sm text-gray-500">
                                <div className="flex items-center gap-2">
                                    <div className="avatar placeholder">
                                        <div className="bg-primary text-primary-content rounded-full w-8">
                                            <span className="text-xs">{post.user?.name?.charAt(0).toUpperCase() || 'U'}</span>
                                        </div>
                                    </div>
                                    <span className="font-medium">{post.user?.name || 'Unknown'}</span>
                                </div>
                                <span>•</span>
                                <span>{formatDate(post.created_at)}</span>
                                {post.updated_at !== post.created_at && (
                                    <>
                                        <span>•</span>
                                        <span className="text-xs">Updated {formatDate(post.updated_at)}</span>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Content */}
                    <div className="prose max-w-none">
                        <p className="text-lg leading-relaxed whitespace-pre-wrap">{post.content}</p>
                    </div>

                    {/* Actions */}
                    {isOwner && (
                        <div className="card-actions justify-end mt-6 pt-6 border-t">
                            <Link href={`/posts/${id}/edit`} className="btn btn-secondary gap-2">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                </svg>
                                Edit Post
                            </Link>
                            <button 
                                onClick={handleDelete} 
                                className="btn btn-error gap-2"
                                disabled={isDeleting}
                            >
                                {isDeleting ? (
                                    <>
                                        <span className="loading loading-spinner loading-sm"></span>
                                        Deleting...
                                    </>
                                ) : (
                                    <>
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                        </svg>
                                        Delete Post
                                    </>
                                )}
                            </button>
                        </div>
                    )}
                </div>
            </article>
        </div>
    );
}
