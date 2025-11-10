"use client";

import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";

export default function Navbar() {
    const { user, logout, isLoading } = useAuth();

    return (
        <div className="navbar bg-base-100 shadow-lg border-b border-base-300">
            <div className="flex-1">
                <Link href="/posts" className="btn btn-ghost text-xl font-bold gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    IMP Posts
                </Link>
            </div>
            <div className="flex-none gap-2">
                {isLoading ? (
                    <span className="loading loading-spinner loading-sm"></span>
                ) : user ? (
                    <>
                        <div className="hidden sm:flex items-center gap-3">
                            <span className="text-sm font-medium">{user.name}</span>
                        </div>
                        <div className="dropdown dropdown-end">
                            <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
                                <div className="w-10 rounded-full bg-primary text-primary-content ring ring-primary ring-offset-base-100 ring-offset-2">
                                    <span className="text-lg font-bold">{user.name.charAt(0).toUpperCase()}</span>
                                </div>
                            </div>
                            <ul tabIndex={0} className="mt-3 z-[1] p-2 shadow-lg menu menu-sm dropdown-content bg-base-100 rounded-box w-52 border border-base-300">
                                <li>
                                    <Link href="/posts" className="gap-2">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                        </svg>
                                        All Posts
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/posts/create" className="gap-2">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                        </svg>
                                        New Post
                                    </Link>
                                </li>
                                <li><div className="divider my-1"></div></li>
                                <li>
                                    <button onClick={logout} className="gap-2 text-error">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                        </svg>
                                        Logout
                                    </button>
                                </li>
                            </ul>
                        </div>
                    </>
                ) : (
                    <div className="flex gap-2">
                        <Link href="/login" className="btn btn-ghost btn-sm">
                            Login
                        </Link>
                        <Link href="/register" className="btn btn-primary btn-sm">
                            Register
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
}
