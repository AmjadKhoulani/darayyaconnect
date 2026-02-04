export interface User {
    id: number;
    name: string;
    email: string;
    email_verified_at?: string;
    role: 'admin' | 'official' | 'citizen';
    department_id?: number;
    department?: {
        id: number;
        name: string;
        slug: string;
    };
    city_id?: number;
    governorate_id?: number;
}

export type PageProps<
    T extends Record<string, unknown> = Record<string, unknown>,
> = T & {
    auth: {
        user: User;
    };
};
