"use client";

import { useState, useEffect, FormEvent } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import api from '@/lib/axios';
import { Post } from '@/types/Post';
import { useAuth } from '@/hooks/useAuth';
import toast from 'react-hot-toast';

export default function EditPostPage() {
    const [post, setPost] = useState<Post | null>(null);
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isFetching, setIsFetching] = useState(true);
    const params = useParams();
    const router = useRouter();
    const { user, isLoading: isAuthLoading } = useAuth();
    const { id } = params;

    useEffect(() => {
        if (id) {
            api.get(`/posts/${id}`)
                .then(response => {
                    const fetchedPost = response.data;
                    setPost(fetchedPost);
                    setTitle(fetchedPost.title);
                    setContent(fetchedPost.content);
                })
                .catch(err => {
                    toast.error("Could not fetch post data.");
                    console.error(err);
                    router.replace('/posts');
                })
                .finally(() => setIsFetching(false));
        }
    }, [id, router]);

    // Client-side authorization check
    useEffect(() => {
        if (!isFetching && !isAuthLoading && (!user || post?.user_id !== user.id)) {
            toast.error("You are not authorized to edit this post.");
            router.replace(`/posts/${id}`);
        }
    }, [user, post, isFetching, isAuthLoading, router, id]);

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            await api.put(`/posts/${id}`, { title, content });
            toast.success('Post updated successfully!');
            router.push(`/posts/${id}`);
        } catch (error: any) {
            const errors = error.response?.data?.errors;
            if (errors) {
                Object.values(errors).flat().forEach((err: any) => toast.error(err));
            } else {
                toast.error('Failed to update post.');
            }
            setIsLoading(false);
        }
    };

    if (isFetching || isAuthLoading || !post || post.user_id !== user?.id) {
        return <div className="flex justify-center items-center h-64"><span className="loading loading-lg loading-spinner"></span></div>;
    }

    return (
        <div className="container mx-auto px-4 py-8 max-w-3xl">
            <div className="mb-6">
                <Link href={`/posts/${id}`} className="btn btn-ghost btn-sm gap-2 mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    Back to Post
                </Link>
                <h1 className="text-4xl font-bold mb-2">Edit Post</h1>
                <p className="text-gray-500">Update your post content</p>
            </div>

            <div className="card bg-base-100 shadow-xl">
                <div className="card-body">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text font-semibold text-base">Post Title</span>
                                <span className="label-text-alt text-gray-400">{title.length}/255</span>
                            </label>
                            <input
                                type="text"
                                placeholder="Enter a compelling title..."
                                className="input input-bordered input-lg focus:input-primary"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                maxLength={255}
                                required
                            />
                            <label className="label">
                                <span className="label-text-alt text-gray-400">A good title helps readers find your post</span>
                            </label>
                        </div>

                        <div className="form-control">
                            <label className="label">
                                <span className="label-text font-semibold text-base">Content</span>
                                <span className="label-text-alt text-gray-400">{content.length} characters</span>
                            </label>
                            <textarea
                                className="textarea textarea-bordered textarea-lg min-h-[300px] focus:textarea-primary"
                                placeholder="Write your post content here..."
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                                required
                            ></textarea>
                            <label className="label">
                                <span className="label-text-alt text-gray-400">Express yourself freely</span>
                            </label>
                        </div>

                        <div className="divider"></div>

                        <div className="form-control">
                            <div className="flex gap-3 justify-end">
                                <Link href={`/posts/${id}`} className="btn btn-ghost">
                                    Cancel
                                </Link>
                                <button 
                                    className="btn btn-primary gap-2" 
                                    type="submit" 
                                    disabled={isLoading || !title.trim() || !content.trim()}
                                >
                                    {isLoading ? (
                                        <>
                                            <span className="loading loading-spinner"></span>
                                            Saving...
                                        </>
                                    ) : (
                                        <>
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                            </svg>
                                            Save Changes
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
