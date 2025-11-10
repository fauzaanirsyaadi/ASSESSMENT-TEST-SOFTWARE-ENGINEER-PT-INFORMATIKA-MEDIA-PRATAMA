"use client";

import { useState, useEffect, FormEvent } from 'react';
import { useParams, useRouter } from 'next/navigation';
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
        <div className="container mx-auto max-w-2xl">
            <h1 className="text-4xl font-bold mb-8">Edit Post</h1>
            <div className="card bg-base-100 shadow-xl">
                <div className="card-body">
                    <form onSubmit={handleSubmit}>
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text">Title</span>
                            </label>
                            <input
                                type="text"
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
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                                required
                            ></textarea>
                        </div>
                        <div className="form-control mt-6">
                            <button className="btn btn-primary" type="submit" disabled={isLoading}>
                                {isLoading ? <span className="loading loading-spinner"></span> : 'Save Changes'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
