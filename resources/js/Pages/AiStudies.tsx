import PortalLayout from '@/Layouts/PortalLayout';
import { Head, router } from '@inertiajs/react';
import { useEffect, useState } from 'react';

interface CostBreakdown {
    item: string;
    cost: string;
}

interface Study {
    id: number;
    title: string;
    icon: string;
    category: string;
    color: string;
    gradient: string;
    summary: string;
    scenario: {
        current: string;
        withProject: string;
    };
    economics: {
        investment: string;
        investmentRange: string;
        costBreakdown: CostBreakdown[];
        revenue: string;
        revenueRange: string;
        payback: string;
        jobs: string;
        jobsBreakdown: string;
    };
    environmental: {
        wasteReduction?: string;
        emissions?: string;
        waterSaved?: string;
        energySaved?: string;
    };
    social: {
        beneficiaries: string;
        impact: string;
    };
    implementation: {
        phase1: string;
        phase2: string;
        phase3: string;
    };
    risks: string[];
    recommendations: string[];
    technicalDetails: string[];
}

interface PageProps {
    auth: any;
    studies: {
        data: Study[];
        links: any[];
        current_page: number;
        last_page: number;
    };
    filters: {
        search?: string;
        category?: string;
    };
    stats: {
        [key: string]: number;
    };
    totalCount: number;
}

export default function AiStudies({
    auth,
    studies,
    filters,
    stats,
    totalCount,
}: PageProps) {

    const [searchTerm, setSearchTerm] = useState(filters.search || '');

    // Debounce Search
    useEffect(() => {
        const timer = setTimeout(() => {
            if (searchTerm !== (filters.search || '')) {
                router.get(
                    route('ai-studies'),
                    { search: searchTerm, category: filters.category },
                    {
                        preserveState: true,
                        replace: true,
                        preserveScroll: true,
                    },
                );
            }
        }, 300);

        return () => clearTimeout(timer);
    }, [searchTerm]);

    const handleCategoryChange = (category: string) => {
        router.get(
            route('ai-studies'),
            { category, search: searchTerm },
            { preserveState: true },
        );
    };

    const categories = [
        { id: 'all', name: 'كل الدراسات', icon: '📊', count: totalCount },
        { id: 'بيئة', name: 'بيئة', icon: '♻️', count: stats['بيئة'] || 0 },
        { id: 'طاقة', name: 'طاقة', icon: '☀️', count: stats['طاقة'] || 0 },
        { id: 'غذاء', name: 'غذاء', icon: '🌱', count: stats['غذاء'] || 0 },
    ];

    const currentCategory = filters.category || 'all';

    return (
        <PortalLayout auth={auth} header={null}>
            <Head title="دراسات AI" />

            <div className="py-8" dir="rtl">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    {/* Hero Section */}
                    <div className="relative mb-8 overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 p-8 text-white shadow-2xl">
                        <div className="absolute inset-0 opacity-20">
                            <div className="absolute right-0 top-0 h-96 w-96 rounded-full bg-white blur-3xl"></div>
                            <div className="absolute bottom-0 left-0 h-96 w-96 rounded-full bg-white blur-3xl"></div>
                        </div>
                        <div className="relative z-10">
                            <h1 className="mb-4 text-4xl font-black">
                                📊 دراسات جدوى واقعية ومُفصّلة
                            </h1>
                            <p className="max-w-3xl text-xl leading-relaxed text-purple-100">
                                تحليلات مبنية على{' '}
                                <strong>أرقام حقيقية للسياق السوري</strong>،
                                وتتضمن: <strong>نطاقات التكلفة</strong>,{' '}
                                <strong>تفصيل المصاريف</strong>,{' '}
                                <strong>العوائد المتوقعة</strong>,{' '}
                                <strong>المخاطر الواقعية</strong>, و
                                <strong>خطة التنفيذ</strong>.
                            </p>
                        </div>
                    </div>

                    {/* Controls: Search & Filter */}
                    <div className="mb-8 flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
                        {/* Categories */}
                        <div className="flex flex-wrap gap-3">
                            {categories.map((cat) => (
                                <button
                                    key={cat.id}
                                    onClick={() => handleCategoryChange(cat.id)}
                                    className={`flex items-center gap-2 rounded-xl px-5 py-2.5 font-bold transition-all ${currentCategory === cat.id
                                        ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200'
                                        : 'border border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                                        }`}
                                >
                                    <span className="text-xl">{cat.icon}</span>
                                    <span>{cat.name}</span>
                                    <span
                                        className={`rounded-full px-2 py-0.5 text-xs ${currentCategory === cat.id
                                            ? 'bg-white/20'
                                            : 'bg-slate-100'
                                            }`}
                                    >
                                        {cat.count}
                                    </span>
                                </button>
                            ))}
                        </div>

                        {/* Search */}
                        <div className="relative w-full md:w-64">
                            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                                <span className="text-gray-400">🔍</span>
                            </div>
                            <input
                                type="text"
                                className="block w-full rounded-xl border-gray-300 pr-10 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                placeholder="بحث في الدراسات..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>

                    {/* Studies Grid */}
                    {studies.data.length > 0 ? (
                        <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                            {studies.data.map((study) => (
                                <div
                                    key={study.id}
                                    onClick={() => router.visit(route('ai-studies.show', study.id))}
                                    className="group cursor-pointer rounded-2xl border-2 border-transparent bg-white p-6 text-right shadow-sm transition-all hover:border-indigo-200 hover:shadow-xl"
                                >
                                    <div className="mb-4 flex items-start justify-between">
                                        <div
                                            className={`h-14 w-14 rounded-2xl bg-gradient-to-br ${study.gradient} flex items-center justify-center text-3xl shadow-lg transition-transform group-hover:scale-110`}
                                        >
                                            {study.icon}
                                        </div>
                                        <span
                                            className={`rounded-full px-3 py-1 text-xs font-bold bg-${study.color}-50 text-${study.color}-700`}
                                        >
                                            {study.category}
                                        </span>
                                    </div>

                                    <h3 className="mb-2 text-lg font-black text-slate-900 transition-colors group-hover:text-indigo-600">
                                        {study.title}
                                    </h3>

                                    <p className="mb-4 line-clamp-3 text-sm leading-relaxed text-slate-600">
                                        {study.summary}
                                    </p>

                                    {/* Quick Stats */}
                                    <div className="grid grid-cols-2 gap-3 border-t border-slate-100 pt-4">
                                        <div>
                                            <div className="mb-1 text-xs text-slate-500">
                                                الاستثمار
                                            </div>
                                            <div className="text-sm font-bold text-slate-900">
                                                {study.economics?.investment || '-'}
                                            </div>
                                        </div>
                                        <div>
                                            <div className="mb-1 text-xs text-slate-500">
                                                فرص العمل
                                            </div>
                                            <div className="text-sm font-bold text-emerald-600">
                                                {study.economics?.jobs || '-'}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="mb-8 rounded-3xl border border-slate-200 bg-white p-12 text-center shadow-sm">
                            <span className="mb-4 block text-6xl">🧐</span>
                            <h3 className="mb-2 text-xl font-bold text-slate-900">
                                لا توجد دراسات مطابقة
                            </h3>
                            <p className="text-slate-500">
                                حاول تغيير مصطلحات البحث أو اختيار تصنيف آخر.
                            </p>
                            <button
                                onClick={() => {
                                    setSearchTerm('');
                                    handleCategoryChange('all');
                                }}
                                className="mt-4 font-bold text-indigo-600 hover:underline"
                            >
                                إعادة ضبط الفلاتر
                            </button>
                        </div>
                    )}

                    {/* Pagination */}
                    {studies.links.length > 3 && (
                        <div className="mt-8 flex justify-center">
                            <div className="flex rounded-lg border border-slate-200 bg-white shadow-sm">
                                {studies.links.map((link, i) => (
                                    <button
                                        key={i}
                                        onClick={() =>
                                            link.url &&
                                            router.get(
                                                link.url,
                                                {
                                                    search: searchTerm,
                                                    category: filters.category,
                                                },
                                                {
                                                    preserveState: true,
                                                    preserveScroll: true,
                                                },
                                            )
                                        }
                                        disabled={!link.url || link.active}
                                        className={`border-l border-slate-100 px-4 py-2 text-sm font-medium transition-colors last:border-l-0 ${link.active ? 'bg-indigo-600 text-white' : 'text-slate-700 hover:bg-slate-50'} ${!link.url ? 'cursor-not-allowed opacity-50' : ''} `}
                                        dangerouslySetInnerHTML={{
                                            __html: link.label,
                                        }}
                                    />
                                ))}
                            </div>
                        </div>
                    )}

                </div>
            </div>
        </PortalLayout >
    );
}
