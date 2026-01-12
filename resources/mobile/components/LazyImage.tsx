import { useState } from 'react';

interface LazyImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
    src: string;
    alt: string;
    className?: string;
    fallback?: string;
}

export default function LazyImage({ src, alt, className, fallback = 'https://via.placeholder.com/400x300?text=No+Image', ...props }: LazyImageProps) {
    const [isLoaded, setIsLoaded] = useState(false);
    const [hasError, setHasError] = useState(false);

    return (
        <div className={`relative overflow-hidden ${className}`}>
            {!isLoaded && (
                <div className="absolute inset-0 bg-slate-100 animate-pulse flex items-center justify-center">
                    <span className="text-slate-300 text-2xl">🖼️</span>
                </div>
            )}
            <img
                src={hasError ? fallback : src}
                alt={alt}
                className={`w-full h-full object-cover transition-opacity duration-300 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
                onLoad={() => setIsLoaded(true)}
                onError={() => {
                    setHasError(true);
                    setIsLoaded(true);
                }}
                {...props}
            />
        </div>
    );
}
