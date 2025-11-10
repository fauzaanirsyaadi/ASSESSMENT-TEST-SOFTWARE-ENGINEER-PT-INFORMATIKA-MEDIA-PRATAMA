"use client";

import { useState, FormEvent, useEffect } from 'react';
import { useRouter } from 'next/navigation';
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
        <div className="container mx-auto max-w-2xl">
            <h1 className="text-4xl font-bold mb-8">Create a New Post</h1>
            <div className="card bg-base-100 shadow-xl">
                <div className="card-body">
                    <form onSubmit={handleSubmit}>
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text">Title</span>
                            </label>
                            <input
                                type="text"
                                placeholder="Your post title"
                                className="input input-bordered"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                required
                            />
                        </div>
                        <div className="form-control mt-4">
                            <label className="label">
                                <span className="label-text">Content</span>
                            </label>
                            <textarea
                                className="textarea textarea-bordered h-48"
                                placeholder="Write your post content here..."
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                                required
                            ></textarea>
                        </div>
                        <div className="form-control mt-6">
                            <button className="btn btn-primary" type="submit" disabled={isLoading}>
                                {isLoading ? <span className="loading loading-spinner"></span> : 'Publish Post'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
