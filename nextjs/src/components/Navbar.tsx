"use client";

import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";

export default function Navbar() {
    const { user, logout, isLoading } = useAuth();

    return (
        <div className="navbar bg-base-100 shadow-md">
            <div className="flex-1">
                <Link href="/posts" className="btn btn-ghost text-xl">
                    IMP Posts
                </Link>
            </div>
            <div className="flex-none gap-2">
                {isLoading ? (
                    <span className="loading loading-spinner"></span>
                ) : user ? (
                    <>
                        <span className="font-semibold hidden sm:inline">{user.name}</span>
                        <div className="dropdown dropdown-end">
                            <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
                                <div className="w-10 rounded-full bg-neutral-focus text-neutral-content">
                                    <span className="text-xl">{user.name.charAt(0).toUpperCase()}</span>
                                </div>
                            </div>
                            <ul tabIndex={0} className="mt-3 z-[1] p-2 shadow menu menu-sm dropdown-content bg-base-100 rounded-box w-52">
                                <li>
                                    <Link href="/posts/create" className="justify-between">
                                        New Post
                                    </Link>
                                </li>
                                <li><button onClick={logout}>Logout</button></li>
                            </ul>
                        </div>
                    </>
                ) : (
                    <div className="space-x-2">
                         <Link href="/login" className="btn btn-ghost">
                            Login
                        </Link>
                        <Link href="/register" className="btn btn-primary">
                            Register
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
}
