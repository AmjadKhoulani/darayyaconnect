import React from 'react';
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

export default function GlobalExperienceModal({ isOpen, onClose, model }: GlobalExperienceModalProps) {
    if (!model) return null;

    return (
        <Modal show={isOpen} onClose={onClose} maxWidth="2xl">
            <div className="relative bg-white rounded-2xl overflow-hidden" dir="rtl">
                {/* Header / Banner */}
                <div className={`h-32 ${model.color.replace('text-', 'bg-').replace('600', '100')} relative`}>
                    <button
                        onClick={onClose}
                        className="absolute top-4 left-4 w-8 h-8 bg-white/50 hover:bg-white rounded-full flex items-center justify-center transition backdrop-blur-sm shadow-sm"
                    >
                        ✕
                    </button>
                    <div className="absolute -bottom-8 right-8 flex items-end gap-4">
                        <div className="w-24 h-24 bg-white rounded-2xl shadow-lg flex items-center justify-center text-6xl border-4 border-white">
                            {model.country}
                        </div>
                        <div className="mb-10 text-slate-800">
                            <h2 className="text-2xl font-black">{model.city}</h2>
                            <span className={`text-xs font-bold px-2 py-1 rounded-md bg-white/60 backdrop-blur-sm`}>
                                {model.tag}
                            </span>
                        </div>
                    </div>
                </div>

                <div className="pt-12 px-8 pb-8">
                    <h3 className="text-xl font-bold text-slate-900 mb-2">{model.title}</h3>
                    <p className="text-slate-600 leading-relaxed mb-6 border-b border-slate-100 pb-6">
                        {model.description}
                    </p>

                    <div className="space-y-6">
                        <div className="flex gap-4">
                            <div className="w-10 h-10 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center text-xl shrink-0">⚠️</div>
                            <div>
                                <h4 className="font-bold text-slate-800 mb-1">المشكلة</h4>
                                <p className="text-sm text-slate-600 leading-relaxed">{model.details.problem}</p>
                            </div>
                        </div>

                        <div className="flex gap-4">
                            <div className="w-10 h-10 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center text-xl shrink-0">💡</div>
                            <div>
                                <h4 className="font-bold text-slate-800 mb-1">الحل المبتكر</h4>
                                <p className="text-sm text-slate-600 leading-relaxed">{model.details.solution}</p>
                            </div>
                        </div>

                        <div className="flex gap-4">
                            <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center text-xl shrink-0">📈</div>
                            <div>
                                <h4 className="font-bold text-slate-800 mb-1">الأثر والنتيجة</h4>
                                <p className="text-sm text-slate-600 leading-relaxed">{model.details.impact}</p>
                            </div>
                        </div>
                    </div>

                    <div className="mt-8 pt-6 border-t border-slate-100 flex justify-end">
                        <button
                            onClick={onClose}
                            className="bg-slate-900 text-white px-6 py-2 rounded-xl font-bold hover:bg-slate-800 transition"
                        >
                            إغلاق
                        </button>
                    </div>
                </div>
            </div>
        </Modal>
    );
}
