import { User } from "./User";

export interface Post {
    id: number;
    title: string;
    content: string;
    user_id: number;
    user?: User; // User is optional, might not always be loaded
    created_at: string;
    updated_at: string;
}

// For paginated responses from Laravel
export interface PaginatedPosts {
    current_page: number;
    data: Post[];
    first_page_url: string;
    from: number;
    last_page: number;
    last_page_url: string;
    links: {
        url: string | null;
        label: string;
        active: boolean;
    }[];
    next_page_url: string | null;
    path: string;
    per_page: number;
    prev_page_url: string | null;
    to: number;
    total: number;
}
