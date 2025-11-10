"use client";

import { useState, FormEvent, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import api from '@/lib/axios';
import toast from 'react-hot-toast';
import { useAuth } from '@/hooks/useAuth';

export default function CreatePostPage() {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();
    const { user, isLoading: isAuthLoading } = useAuth();

    // Protect the route client-side
    useEffect(() => {
        if (!isAuthLoading && !user) {
            router.replace('/login');
            toast.error('You must be logged in to create a post.');
        }
    }, [user, isAuthLoading, router]);

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const response = await api.post('/posts', { title, content });
            toast.success('Post created successfully!');
            router.push(`/posts/${response.data.id}`); // Redirect to the new post's page
        } catch (error: any) {
            const errors = error.response?.data?.errors;
            if (errors) {
                Object.values(errors).flat().forEach((err: any) => toast.error(err));
            } else {
                toast.error('Failed to create post. Please try again.');
            }
            setIsLoading(false);
        }
    };
    
    // Render a loading state while checking auth
    if (isAuthLoading || !user) {
        return <div className="flex justify-center items-center h-64"><span className="loading loading-lg loading-spinner"></span></div>;
    }

    return (
        <div className="container mx-auto px-4 py-8 max-w-3xl">
            <div className="mb-6">
                <Link href="/posts" className="btn btn-ghost btn-sm gap-2 mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    Back to Posts
                </Link>
                <h1 className="text-4xl font-bold mb-2">Create a New Post</h1>
                <p className="text-gray-500">Share your thoughts with the community</p>
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
                                placeholder="Write your post content here... Share your ideas, experiences, or knowledge with others."
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
                                <Link href="/posts" className="btn btn-ghost">
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
                                            Publishing...
                                        </>
                                    ) : (
                                        <>
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                            </svg>
                                            Publish Post
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
