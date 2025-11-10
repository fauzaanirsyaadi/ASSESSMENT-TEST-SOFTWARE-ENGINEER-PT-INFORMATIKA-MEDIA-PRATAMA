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
        if (window.confirm('Are you sure you want to delete this post? This action cannot be undone.')) {
            try {
                await api.delete(`/posts/${id}`);
                toast.success('Post deleted successfully.');
                router.push('/posts');
            } catch (err) {
                toast.error('Failed to delete post. You may not have permission.');
                console.error(err);
            }
        }
    };

    if (isLoading) {
        return <div className="flex justify-center items-center h-64"><span className="loading loading-lg loading-spinner"></span></div>;
    }

    if (error || !post) {
        return <div className="text-center text-red-500">{error || 'Post not found.'}</div>;
    }

    const isOwner = user && user.id === post.user_id;

    return (
        <div className="container mx-auto max-w-4xl">
            <article className="prose lg:prose-xl">
                <h1>{post.title}</h1>
                <div className="text-gray-500 mb-4">
                    By {post.user?.name || 'Unknown'} on {new Date(post.created_at).toLocaleDateString()}
                </div>
                <p>{post.content}</p>
            </article>

            {isOwner && (
                <div className="mt-8 border-t pt-4 flex gap-4">
                    <Link href={`/posts/${id}/edit`} className="btn btn-secondary">
                        Edit Post
                    </Link>
                    <button onClick={handleDelete} className="btn btn-error">
                        Delete Post
                    </button>
                </div>
            )}
        </div>
    );
}
