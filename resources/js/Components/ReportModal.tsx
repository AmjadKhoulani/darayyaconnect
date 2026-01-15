import { useState } from 'react';

interface ReportModalProps {
    isOpen: boolean;
    onClose: () => void;
    coordinates: [number, number] | null;
}

export default function ReportModal({
    isOpen,
    onClose,
    coordinates,
}: ReportModalProps) {
    const [category, setCategory] = useState('electricity');
    const [severity, setSeverity] = useState(1);
    const [description, setDescription] = useState('');
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    if (!isOpen || !coordinates) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        const reportData = {
            category,
            severity,
            description,
            longitude: coordinates[0],
            latitude: coordinates[1],
            timestamp: new Date().toISOString(),
        };

        // Offline Mode Check
        if (!navigator.onLine) {
            const existing = JSON.parse(
                localStorage.getItem('offline_reports') || '[]',
            );
            existing.push(reportData);
            localStorage.setItem('offline_reports', JSON.stringify(existing));

            setLoading(false);
            setSuccess(true);
            setTimeout(() => {
                setSuccess(false);
                setDescription('');
                onClose();
            }, 3000); // clear, show success
            alert(
                'أنت في وضع عدم الاتصال. تم حفظ البلاغ وسيتم إرساله عند عودة الإنترنت! 📶💾',
            );
            return;
        }

        try {
            const response = await fetch('/api/infrastructure/reports', {
                // CORRECTED ENDPOINT
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(reportData),
            });

            if (response.ok) {
                setSuccess(true);
                setTimeout(() => {
                    setSuccess(false);
                    setDescription('');
                    onClose();
                }, 2000);
            }
        } catch (error) {
            console.error(error);
            // Fallback to offline on error? Optional, but good practice.
            // For now just console error to avoid confusing UX if it's a server error vs network error.
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm">
            <div className="relative w-full max-w-md rounded-lg bg-white p-6 shadow-xl dark:bg-zinc-900">
                {success ? (
                    <div className="py-8 text-center">
                        <div className="mb-4 text-5xl text-green-500">✓</div>
                        <h3 className="text-xl font-bold dark:text-white">
                            تم استلام البلاغ
                        </h3>
                        <p className="mt-2 text-gray-500">
                            شكراً لمساهمتك في تحسين داريا.
                        </p>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} dir="rtl">
                        <h3 className="mb-4 text-xl font-bold dark:text-white">
                            إبلاغ عن مشكلة
                        </h3>
                        <p className="mb-4 text-sm text-gray-500">
                            الموقع: {coordinates[1].toFixed(5)},{' '}
                            {coordinates[0].toFixed(5)}
                        </p>

                        <div className="mb-4">
                            <label className="mb-1 block text-sm font-medium dark:text-gray-300">
                                نوع المشكلة
                            </label>
                            <select
                                className="w-full rounded-md border-gray-300 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
                                value={category}
                                onChange={(e) => setCategory(e.target.value)}
                            >
                                <option value="electricity">كهرباء</option>
                                <option value="water">مياه</option>
                                <option value="sanitation">صرف صحي</option>
                                <option value="safety">سلامة عامة</option>
                            </select>
                        </div>

                        <div className="mb-4">
                            <label className="mb-1 block text-sm font-medium dark:text-gray-300">
                                درجة الخطورة (1-5)
                            </label>
                            <input
                                type="range"
                                min="1"
                                max="5"
                                className="w-full"
                                value={severity}
                                onChange={(e) =>
                                    setSeverity(parseInt(e.target.value))
                                }
                            />
                            <div className="flex justify-between text-xs text-gray-500">
                                <span>بسيطة</span>
                                <span>حرجة</span>
                            </div>
                        </div>

                        <div className="mb-4">
                            <label className="mb-1 block text-sm font-medium dark:text-gray-300">
                                وصف المشكلة
                            </label>
                            <textarea
                                className="w-full rounded-md border-gray-300 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
                                rows={3}
                                required
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                placeholder="اوصف المشكلة باختصار..."
                            />
                        </div>

                        <div className="mt-6 flex justify-end gap-2">
                            <button
                                type="button"
                                onClick={onClose}
                                className="rounded-md px-4 py-2 text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-zinc-800"
                            >
                                إلغاء
                            </button>
                            <button
                                type="submit"
                                disabled={loading}
                                className="rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:opacity-50"
                            >
                                {loading ? 'جاري الإرسال...' : 'إرسال البلاغ'}
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
}
