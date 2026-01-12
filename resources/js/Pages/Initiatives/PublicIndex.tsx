import React from 'react';
import { Head, Link } from '@inertiajs/react';
import PortalLayout from '@/Layouts/PortalLayout';

export default function PublicIndex({ initiatives, auth }: any) {
    return (
        <PortalLayout auth={auth}>
            <Head title="المبادرات المجتمعية" />

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="text-center mb-12">
                    <h1 className="text-3xl font-black text-slate-900 mb-4">المبادرات المجتمعية</h1>
                    <p className="max-w-2xl mx-auto text-slate-500">
                        مساحة للتشاركية والعمل الجماعي. استعرض المبادرات القائمة، شارك في التصويت، وساهم في بناء مدينتنا.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {initiatives.data.map((item: any) => (
                        <div key={item.id} className="bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-200 hover:shadow-md transition group">
                            <div className="h-48 bg-slate-100 relative overflow-hidden">
                                {item.image ? (
                                    <img src={`/storage/${item.image}`} className="w-full h-full object-cover transition duration-500 group-hover:scale-105" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-4xl">🗳️</div>
                                )}
                                <div className="absolute top-4 right-4 bg-emerald-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
                                    نشطة
                                </div>
                            </div>
                            <div className="p-6">
                                <h3 className="font-bold text-xl mb-2 group-hover:text-emerald-600 transition">{item.title}</h3>
                                <p className="text-slate-500 text-sm line-clamp-3 mb-4">{item.description}</p>

                                <div className="flex items-center justify-between border-t border-slate-100 pt-4">
                                    <span className="text-xs font-bold text-slate-400">منذ {new Date(item.created_at).toLocaleDateString('ar-SY')}</span>
                                    <button className="text-emerald-600 text-sm font-bold hover:underline">عرض التفاصيل ←</button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {initiatives.data.length === 0 && (
                    <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-slate-300">
                        <div className="text-4xl mb-4">🌱</div>
                        <h3 className="font-bold text-lg text-slate-900">لا توجد مبادرات نشطة حالياً</h3>
                        <p className="text-slate-500 text-sm mt-2">كن أول المبادرين واطرح فكرتك عبر التواصل مع المجلس.</p>
                    </div>
                )}
            </main>
        </PortalLayout>
    );
}
