import { useState, useRef, useEffect } from 'react';

export function usePullToRefresh(onRefresh: () => Promise<void>) {
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [pullStartY, setPullStartY] = useState(0);
    const [pullMoveY, setPullMoveY] = useState(0);
    const containerRef = useRef<HTMLDivElement>(null);

    const MIN_DIST_TO_REFRESH = 80;

    const handleTouchStart = (e: React.TouchEvent) => {
        const scrollTop = window.scrollY;
        if (scrollTop === 0) {
            setPullStartY(e.touches[0].clientY);
        }
    };

    const handleTouchMove = (e: React.TouchEvent) => {
        if (pullStartY === 0) return;

        const touchY = e.touches[0].clientY;
        const diff = touchY - pullStartY;

        // Only allow pulling if we are at the top and pulling down
        if (diff > 0 && window.scrollY === 0) {
            // Add resistance
            setPullMoveY(Math.min(diff * 0.5, 120));
        }
    };

    const handleTouchEnd = async () => {
        if (pullMoveY > MIN_DIST_TO_REFRESH) {
            setIsRefreshing(true);
            setPullMoveY(60); // Keep it visible while refreshing
            try {
                await onRefresh();
            } finally {
                setTimeout(() => {
                    setIsRefreshing(false);
                    setPullMoveY(0);
                    setPullStartY(0);
                }, 500);
            }
        } else {
            setPullMoveY(0);
            setPullStartY(0);
        }
    };

    return {
        isRefreshing,
        pullMoveY,
        handlers: {
            onTouchStart: handleTouchStart,
            onTouchMove: handleTouchMove,
            onTouchEnd: handleTouchEnd
        }
    };
}

export function PullToRefreshContainer({ children, isRefreshing, pullMoveY }: { children: React.ReactNode, isRefreshing: boolean, pullMoveY: number }) {
    return (
        <div style={{ transform: `translateY(${pullMoveY}px)`, transition: isRefreshing ? 'transform 0.2s' : 'transform 0.1s' }}>
            <div
                className="absolute top-0 left-0 right-0 flex justify-center -mt-10"
                style={{ opacity: pullMoveY > 20 ? 1 : 0 }}
            >
                <div className={`w-8 h-8 rounded-full bg-white shadow-md flex items-center justify-center text-emerald-600 ${isRefreshing ? 'animate-spin' : ''}`}>
                    {isRefreshing ? '⏳' : '⬇️'}
                </div>
            </div>
            {children}
        </div>
    );
}
