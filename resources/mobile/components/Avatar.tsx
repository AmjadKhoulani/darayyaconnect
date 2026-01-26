import React from 'react';

interface AvatarProps {
    user: {
        name: string;
        profile_photo_url?: string;
    };
    size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
    className?: string;
}

const sizeClasses = {
    xs: 'w-6 h-6 text-[10px]',
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-12 h-12 text-base',
    xl: 'w-16 h-16 text-xl',
};

export default function Avatar({ user, size = 'md', className = '' }: AvatarProps) {
    const baseClass = `rounded-full flex items-center justify-center font-bold overflow-hidden shadow-sm border border-slate-100 dark:border-slate-700 ${sizeClasses[size]} ${className}`;

    if (user?.profile_photo_url) {
        return (
            <div className={baseClass}>
                <img
                    src={user.profile_photo_url}
                    alt={user.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                        // Fallback if image fails to load
                        e.currentTarget.style.display = 'none';
                        e.currentTarget.parentElement?.classList.add('bg-indigo-100', 'text-indigo-600');
                        if (e.currentTarget.parentElement) {
                            e.currentTarget.parentElement.innerText = user.name.charAt(0);
                        }
                    }}
                />
            </div>
        );
    }

    return (
        <div className={`${baseClass} bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400`}>
            {user?.name?.charAt(0) || '?'}
        </div>
    );
}
