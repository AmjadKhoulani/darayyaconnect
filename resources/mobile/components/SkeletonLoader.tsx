export default function SkeletonLoader({ type }: { type: 'card' | 'list' | 'profile' }) {
    if (type === 'card') {
        return (
            <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm animate-pulse-slow">
                <div className="flex items-start gap-3 mb-3">
                    <div className="w-10 h-10 bg-slate-100 rounded-lg"></div>
                    <div className="flex-1 space-y-2">
                        <div className="h-4 bg-slate-100 rounded w-1/4"></div>
                        <div className="h-5 bg-slate-100 rounded w-3/4"></div>
                        <div className="h-3 bg-slate-100 rounded w-full"></div>
                    </div>
                </div>
                <div className="flex justify-between pt-3 border-t border-slate-50">
                    <div className="h-3 bg-slate-100 rounded w-20"></div>
                    <div className="h-3 bg-slate-100 rounded w-16"></div>
                </div>
            </div>
        );
    }

    if (type === 'list') {
        return (
            <div className="flex items-center gap-3 bg-white p-4 rounded-xl border border-slate-200 shadow-sm animate-pulse-slow">
                <div className="w-12 h-12 bg-slate-100 rounded-full"></div>
                <div className="flex-1 space-y-2">
                    <div className="h-4 bg-slate-100 rounded w-1/3"></div>
                    <div className="h-3 bg-slate-100 rounded w-1/2"></div>
                </div>
            </div>
        );
    }

    if (type === 'profile') {
        return (
            <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm text-center animate-pulse-slow">
                <div className="w-20 h-20 bg-slate-100 rounded-full mx-auto mb-4"></div>
                <div className="h-6 bg-slate-100 rounded w-1/2 mx-auto mb-2"></div>
                <div className="h-4 bg-slate-100 rounded w-1/3 mx-auto"></div>
            </div>
        );
    }

    return null;
}
