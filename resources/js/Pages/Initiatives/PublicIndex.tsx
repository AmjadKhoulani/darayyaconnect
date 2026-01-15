import PortalLayout from '@/Layouts/PortalLayout';
import { Head } from '@inertiajs/react';

export default function PublicIndex({ initiatives, auth }: any) {
    return (
        <PortalLayout auth={auth}>
            <Head title="المبادرات المجتمعية" />

            <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
                <div className="mb-12 text-center">
                    <h1 className="mb-4 text-3xl font-black text-slate-900">
                        المبادرات المجتمعية
                    </h1>
                    <p className="mx-auto max-w-2xl text-slate-500">
                        مساحة للتشاركية والعمل الجماعي. استعرض المبادرات
                        القائمة، شارك في التصويت، وساهم في بناء مدينتنا.
                    </p>
                </div>

                <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
                    {initiatives.data.map((item: any) => (
                        <div
                            key={item.id}
                            className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:shadow-md"
                        >
                            <div className="relative h-48 overflow-hidden bg-slate-100">
                                {item.image ? (
                                    <img
                                        src={`/storage/${item.image}`}
                                        className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                                    />
                                ) : (
                                    <div className="flex h-full w-full items-center justify-center text-4xl">
                                        🗳️
                                    </div>
                                )}
                                <div className="absolute right-4 top-4 rounded-full bg-emerald-500 px-3 py-1 text-xs font-bold text-white shadow-lg">
                                    نشطة
                                </div>
                            </div>
                            <div className="p-6">
                                <h3 className="mb-2 text-xl font-bold transition group-hover:text-emerald-600">
                                    {item.title}
                                </h3>
                                <p className="mb-4 line-clamp-3 text-sm text-slate-500">
                                    {item.description}
                                </p>

                                <div className="flex items-center justify-between border-t border-slate-100 pt-4">
                                    <span className="text-xs font-bold text-slate-400">
                                        منذ{' '}
                                        {new Date(
                                            item.created_at,
                                        ).toLocaleDateString('ar-SY')}
                                    </span>
                                    <button className="text-sm font-bold text-emerald-600 hover:underline">
                                        عرض التفاصيل ←
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {initiatives.data.length === 0 && (
                    <div className="rounded-3xl border border-dashed border-slate-300 bg-white py-20 text-center">
                        <div className="mb-4 text-4xl">🌱</div>
                        <h3 className="text-lg font-bold text-slate-900">
                            لا توجد مبادرات نشطة حالياً
                        </h3>
                        <p className="mt-2 text-sm text-slate-500">
                            كن أول المبادرين واطرح فكرتك عبر التواصل مع المجلس.
                        </p>
                    </div>
                )}
            </main>
        </PortalLayout>
    );
}
