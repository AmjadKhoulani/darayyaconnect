import Modal from '@/Components/Modal';

interface GlobalExperienceModalProps {
    isOpen: boolean;
    onClose: () => void;
    model: {
        country: string;
        city: string;
        title: string;
        tag: string;
        color: string;
        description: string;
        details: {
            problem: string;
            solution: string;
            impact: string;
        };
        image?: string;
    } | null;
}

export default function GlobalExperienceModal({
    isOpen,
    onClose,
    model,
}: GlobalExperienceModalProps) {
    if (!model) return null;

    return (
        <Modal show={isOpen} onClose={onClose} maxWidth="2xl">
            <div
                className="relative overflow-hidden rounded-2xl bg-white"
                dir="rtl"
            >
                {/* Header / Banner */}
                <div
                    className={`h-32 ${model.color.replace('text-', 'bg-').replace('600', '100')} relative`}
                >
                    <button
                        onClick={onClose}
                        className="absolute left-4 top-4 flex h-8 w-8 items-center justify-center rounded-full bg-white/50 shadow-sm backdrop-blur-sm transition hover:bg-white"
                    >
                        ✕
                    </button>
                    <div className="absolute -bottom-8 right-8 flex items-end gap-4">
                        <div className="flex h-24 w-24 items-center justify-center rounded-2xl border-4 border-white bg-white text-6xl shadow-lg">
                            {model.country}
                        </div>
                        <div className="mb-10 text-slate-800">
                            <h2 className="text-2xl font-black">
                                {model.city}
                            </h2>
                            <span
                                className={`rounded-md bg-white/60 px-2 py-1 text-xs font-bold backdrop-blur-sm`}
                            >
                                {model.tag}
                            </span>
                        </div>
                    </div>
                </div>

                <div className="px-8 pb-8 pt-12">
                    <h3 className="mb-2 text-xl font-bold text-slate-900">
                        {model.title}
                    </h3>
                    <p className="mb-6 border-b border-slate-100 pb-6 leading-relaxed text-slate-600">
                        {model.description}
                    </p>

                    <div className="space-y-6">
                        <div className="flex gap-4">
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-rose-50 text-xl text-rose-600">
                                ⚠️
                            </div>
                            <div>
                                <h4 className="mb-1 font-bold text-slate-800">
                                    المشكلة
                                </h4>
                                <p className="text-sm leading-relaxed text-slate-600">
                                    {model.details.problem}
                                </p>
                            </div>
                        </div>

                        <div className="flex gap-4">
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-emerald-50 text-xl text-emerald-600">
                                💡
                            </div>
                            <div>
                                <h4 className="mb-1 font-bold text-slate-800">
                                    الحل المبتكر
                                </h4>
                                <p className="text-sm leading-relaxed text-slate-600">
                                    {model.details.solution}
                                </p>
                            </div>
                        </div>

                        <div className="flex gap-4">
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-50 text-xl text-blue-600">
                                📈
                            </div>
                            <div>
                                <h4 className="mb-1 font-bold text-slate-800">
                                    الأثر والنتيجة
                                </h4>
                                <p className="text-sm leading-relaxed text-slate-600">
                                    {model.details.impact}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="mt-8 flex justify-end border-t border-slate-100 pt-6">
                        <button
                            onClick={onClose}
                            className="rounded-xl bg-slate-900 px-6 py-2 font-bold text-white transition hover:bg-slate-800"
                        >
                            إغلاق
                        </button>
                    </div>
                </div>
            </div>
        </Modal>
    );
}
