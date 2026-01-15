import { useState, useRef, useEffect, useCallback } from 'react';

export function usePullToRefresh(onRefresh: () => Promise<void>) {
    const [isRefreshing, setIsRefreshing] = useState(false);
    const pullStartY = useRef(0);
    const pullMoveY = useRef(0);
    const containerRef = useRef<HTMLDivElement>(null);
    const indicatorRef = useRef<HTMLDivElement>(null);

    const MIN_DIST_TO_REFRESH = 80;

    const updatePosition = (y: number) => {
        if (containerRef.current) {
            containerRef.current.style.transform = `translateY(${y}px)`;
            containerRef.current.style.transition = 'none';
        }
        if (indicatorRef.current) {
            indicatorRef.current.style.opacity = y > 20 ? '1' : '0';
            const icon = indicatorRef.current.querySelector('.pull-icon');
            if (icon) {
                (icon as HTMLElement).style.transform = `rotate(${Math.min(y * 2, 180)}deg)`;
            }
        }
    };

    const handleTouchStart = (e: React.TouchEvent) => {
        if (window.scrollY === 0) {
            pullStartY.current = e.touches[0].clientY;
        }
    };

    const handleTouchMove = (e: React.TouchEvent) => {
        if (pullStartY.current === 0) return;

        const touchY = e.touches[0].clientY;
        const diff = touchY - pullStartY.current;

        if (diff > 0 && window.scrollY === 0) {
            // Apply resistance
            const moveY = Math.min(diff * 0.4, 100);
            pullMoveY.current = moveY;

            // Direct DOM update for 60fps performance
            updatePosition(moveY);

            // Prevent native scroll/overscroll during pull
            if (e.cancelable) e.preventDefault();
        }
    };

    const handleTouchEnd = async () => {
        if (pullStartY.current === 0) return;

        const finalY = pullMoveY.current;

        if (finalY > MIN_DIST_TO_REFRESH) {
            setIsRefreshing(true);

            // Set refresh position with transition
            if (containerRef.current) {
                containerRef.current.style.transition = 'transform 0.3s cubic-bezier(0.2, 0, 0, 1)';
                containerRef.current.style.transform = 'translateY(60px)';
            }

            try {
                await onRefresh();
            } finally {
                // Reset with transition
                if (containerRef.current) {
                    containerRef.current.style.transition = 'transform 0.4s cubic-bezier(0.2, 0, 0, 1)';
                    containerRef.current.style.transform = 'translateY(0px)';
                }

                setTimeout(() => {
                    setIsRefreshing(false);
                    pullMoveY.current = 0;
                    pullStartY.current = 0;
                }, 400);
            }
        } else {
            // Cancel with transition
            if (containerRef.current) {
                containerRef.current.style.transition = 'transform 0.3s cubic-bezier(0.2, 0, 0, 1)';
                containerRef.current.style.transform = 'translateY(0px)';
            }
            pullMoveY.current = 0;
            pullStartY.current = 0;
        }
    };

    return {
        isRefreshing,
        containerRef,
        indicatorRef,
        handlers: {
            onTouchStart: handleTouchStart,
            onTouchMove: handleTouchMove,
            onTouchEnd: handleTouchEnd
        }
    };
}

export function PullToRefreshContainer({
    children,
    isRefreshing,
    containerRef,
    indicatorRef
}: {
    children: React.ReactNode,
    isRefreshing: boolean,
    containerRef: React.RefObject<HTMLDivElement>,
    indicatorRef: React.RefObject<HTMLDivElement>
}) {
    return (
        <div ref={containerRef} className="will-change-transform">
            <div
                ref={indicatorRef}
                className="absolute top-0 left-0 right-0 flex justify-center -mt-12 pointer-events-none transition-opacity duration-200"
                style={{ opacity: 0 }}
            >
                <div className={`w-10 h-10 rounded-full bg-white dark:bg-slate-800 shadow-premium flex items-center justify-center text-emerald-600 dark:text-emerald-400 border border-slate-100 dark:border-slate-700`}>
                    <div className={`pull-icon text-xl ${isRefreshing ? 'animate-spin' : 'transition-transform'}`}>
                        {isRefreshing ? '⌛' : '↓'}
                    </div>
                </div>
            </div>
            {children}
        </div>
    );
}
