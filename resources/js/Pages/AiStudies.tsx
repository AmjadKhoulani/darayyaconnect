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
    const [selectedStudy, setSelectedStudy] = useState<Study | null>(null);
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
                                    onClick={() => setSelectedStudy(study)}
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

                    {/* Study Detail Modal */}
                    {selectedStudy && (
                        <div
                            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
                            onClick={() => setSelectedStudy(null)}
                        >
                            <div
                                className="max-h-[90vh] w-full max-w-5xl overflow-y-auto rounded-3xl bg-white"
                                onClick={(e) => e.stopPropagation()}
                            >
                                {/* Header */}
                                <div
                                    className={`bg-gradient-to-br ${selectedStudy.gradient} relative overflow-hidden p-8 text-white`}
                                >
                                    <button
                                        onClick={() => setSelectedStudy(null)}
                                        className="absolute left-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm transition hover:bg-white/30"
                                    >
                                        ✕
                                    </button>
                                    <div className="flex items-start gap-4">
                                        <div className="text-6xl">
                                            {selectedStudy.icon}
                                        </div>
                                        <div className="flex-1">
                                            <span className="rounded-full bg-white/20 px-3 py-1 text-xs font-bold backdrop-blur-sm">
                                                {selectedStudy.category}
                                            </span>
                                            <h2 className="mt-2 text-3xl font-black">
                                                {selectedStudy.title}
                                            </h2>
                                            <p className="mt-2 text-lg text-white/90">
                                                {selectedStudy.summary}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-8 p-8">
                                    {/* Scenario Comparison */}
                                    <section>
                                        <h3 className="mb-4 flex items-center gap-2 text-xl font-black text-slate-900">
                                            <span>📊</span> مقارنة مفصلة
                                            للسيناريوهات
                                        </h3>
                                        <div className="grid gap-4 md:grid-cols-2">
                                            <div className="rounded-2xl border border-rose-200 bg-rose-50 p-5">
                                                <h4 className="mb-2 flex items-center gap-2 font-bold text-rose-900">
                                                    <span>❌</span> الوضع الحالي
                                                </h4>
                                                <p className="whitespace-pre-line text-sm leading-relaxed text-rose-800">
                                                    {
                                                        selectedStudy.scenario?.current || '-'
                                                    }
                                                </p>
                                            </div>
                                            <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-5">
                                                <h4 className="mb-2 flex items-center gap-2 font-bold text-emerald-900">
                                                    <span>✅</span> مع المشروع
                                                </h4>
                                                <p className="whitespace-pre-line text-sm leading-relaxed text-emerald-800">
                                                    {
                                                        selectedStudy.scenario?.withProject || '-'
                                                    }
                                                </p>
                                            </div>
                                        </div>
                                    </section>

                                    {/* Economics with Breakdown */}
                                    <section>
                                        <h3 className="mb-4 flex items-center gap-2 text-xl font-black text-slate-900">
                                            <span>💰</span> الجدوى الاقتصادية
                                            التفصيلية
                                        </h3>

                                        {/* Summary Cards */}
                                        <div className="mb-6 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                                            <div className="rounded-xl bg-slate-50 p-4">
                                                <div className="mb-1 text-xs text-slate-600">
                                                    الاستثمار المبدئي
                                                </div>
                                                <div className="text-lg font-black text-slate-900">
                                                    {
                                                        selectedStudy.economics
                                                            ?.investment || '-'
                                                    }
                                                </div>
                                                <div className="mt-1 text-[10px] text-slate-500">
                                                    {
                                                        selectedStudy.economics
                                                            ?.investmentRange || ''
                                                    }
                                                </div>
                                            </div>
                                            <div className="rounded-xl bg-emerald-50 p-4">
                                                <div className="mb-1 text-xs text-emerald-700">
                                                    العائد السنوي
                                                </div>
                                                <div className="text-lg font-black text-emerald-700">
                                                    {
                                                        selectedStudy.economics
                                                            ?.revenue || '-'
                                                    }
                                                </div>
                                                <div className="mt-1 text-[10px] text-emerald-600">
                                                    {
                                                        selectedStudy.economics
                                                            ?.revenueRange || ''
                                                    }
                                                </div>
                                            </div>
                                            <div className="rounded-xl bg-blue-50 p-4">
                                                <div className="mb-1 text-xs text-blue-700">
                                                    فترة الاسترداد
                                                </div>
                                                <div className="text-lg font-black text-blue-700">
                                                    {
                                                        selectedStudy.economics
                                                            ?.payback || '-'
                                                    }
                                                </div>
                                            </div>
                                            <div className="rounded-xl bg-amber-50 p-4">
                                                <div className="mb-1 text-xs text-amber-700">
                                                    فرص العمل
                                                </div>
                                                <div className="text-lg font-black text-amber-700">
                                                    {
                                                        selectedStudy.economics
                                                            ?.jobs || '-'
                                                    }
                                                </div>
                                                <div className="mt-1 text-[10px] text-amber-600">
                                                    {
                                                        selectedStudy.economics
                                                            ?.jobsBreakdown || ''
                                                    }
                                                </div>
                                            </div>
                                        </div>

                                        {/* Cost Breakdown Table */}
                                        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
                                            <h4 className="mb-3 text-sm font-bold text-slate-900">
                                                📋 تفصيل التكاليف
                                            </h4>
                                            <div className="space-y-2">
                                                {(selectedStudy.economics?.costBreakdown || []).map(
                                                    (item, idx) => (
                                                        <div
                                                            key={idx}
                                                            className="flex items-start justify-between gap-4 rounded-lg p-2 transition hover:bg-white"
                                                        >
                                                            <span className="flex-1 text-sm text-slate-700">
                                                                {item.item}
                                                            </span>
                                                            <span className="shrink-0 text-sm font-bold text-slate-900">
                                                                {item.cost}
                                                            </span>
                                                        </div>
                                                    ),
                                                )}
                                            </div>
                                        </div>
                                    </section>

                                    {/* Technical Details */}
                                    <section>
                                        <h3 className="mb-4 flex items-center gap-2 text-xl font-black text-slate-900">
                                            <span>🔧</span> التفاصيل التقنية
                                        </h3>
                                        <div className="rounded-2xl border border-indigo-200 bg-indigo-50 p-5">
                                            <ul className="space-y-2">
                                                {(selectedStudy.technicalDetails || [] || []).map(
                                                    (detail, idx) => (
                                                        <li
                                                            key={idx}
                                                            className="flex items-start gap-2 text-sm text-indigo-900"
                                                        >
                                                            <span className="shrink-0 text-indigo-600">
                                                                ▸
                                                            </span>
                                                            <span className="whitespace-pre-line">
                                                                {detail}
                                                            </span>
                                                        </li>
                                                    ),
                                                )}
                                            </ul>
                                        </div>
                                    </section>

                                    {/* Environmental Impact */}
                                    <section>
                                        <h3 className="mb-4 flex items-center gap-2 text-xl font-black text-slate-900">
                                            <span>🌍</span> الأثر البيئي
                                        </h3>
                                        <div className="rounded-2xl border border-green-200 bg-green-50 p-5">
                                            <ul className="space-y-2">
                                                {selectedStudy.environmental
                                                    ?.wasteReduction && (
                                                        <li className="flex items-start gap-2 text-sm text-green-900">
                                                            <span className="text-lg">
                                                                ♻️
                                                            </span>
                                                            <span>
                                                                <strong>
                                                                    تقليل النفايات:
                                                                </strong>{' '}
                                                                {
                                                                    selectedStudy
                                                                        .environmental
                                                                        ?.wasteReduction
                                                                }
                                                            </span>
                                                        </li>
                                                    )}
                                                {selectedStudy.environmental
                                                    ?.emissions && (
                                                        <li className="flex items-start gap-2 text-sm text-green-900">
                                                            <span className="text-lg">
                                                                🌫️
                                                            </span>
                                                            <span>
                                                                <strong>
                                                                    خفض الانبعاثات:
                                                                </strong>{' '}
                                                                {
                                                                    selectedStudy
                                                                        .environmental
                                                                        ?.emissions
                                                                }
                                                            </span>
                                                        </li>
                                                    )}
                                                {selectedStudy.environmental
                                                    ?.waterSaved && (
                                                        <li className="flex items-start gap-2 text-sm text-green-900">
                                                            <span className="text-lg">
                                                                💧
                                                            </span>
                                                            <span>
                                                                <strong>
                                                                    توفير المياه:
                                                                </strong>{' '}
                                                                {
                                                                    selectedStudy
                                                                        .environmental
                                                                        ?.waterSaved
                                                                }
                                                            </span>
                                                        </li>
                                                    )}
                                                {selectedStudy.environmental
                                                    ?.energySaved && (
                                                        <li className="flex items-start gap-2 text-sm text-green-900">
                                                            <span className="text-lg">
                                                                ⚡
                                                            </span>
                                                            <span>
                                                                <strong>
                                                                    توفير الطاقة:
                                                                </strong>{' '}
                                                                {
                                                                    selectedStudy
                                                                        .environmental
                                                                        ?.energySaved
                                                                }
                                                            </span>
                                                        </li>
                                                    )}
                                            </ul>
                                        </div>
                                    </section>

                                    {/* Social Impact */}
                                    <section>
                                        <h3 className="mb-4 flex items-center gap-2 text-xl font-black text-slate-900">
                                            <span>👥</span> الأثر الاجتماعي
                                        </h3>
                                        <div className="rounded-2xl border border-blue-200 bg-blue-50 p-5">
                                            <div className="grid gap-4 md:grid-cols-2">
                                                <div>
                                                    <div className="mb-1 text-xs text-blue-700">
                                                        المستفيدون
                                                    </div>
                                                    <div className="text-lg font-bold text-blue-900">
                                                        {
                                                            selectedStudy.social
                                                                ?.beneficiaries || '-'
                                                        }
                                                    </div>
                                                </div>
                                                <div>
                                                    <div className="mb-1 text-xs text-blue-700">
                                                        التأثير
                                                    </div>
                                                    <div className="text-sm text-blue-900">
                                                        {
                                                            selectedStudy.social
                                                                ?.impact || '-'
                                                        }
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </section>

                                    {/* Implementation Timeline */}
                                    <section>
                                        <h3 className="mb-4 flex items-center gap-2 text-xl font-black text-slate-900">
                                            <span>📅</span> خطة التنفيذ المفصلة
                                        </h3>
                                        <div className="space-y-3">
                                            <div className="flex items-start gap-4">
                                                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-indigo-100 font-bold text-indigo-700">
                                                    1
                                                </div>
                                                <div className="flex-1 rounded-xl bg-slate-50 p-4">
                                                    <div className="mb-1 text-xs text-slate-600">
                                                        المرحلة الأولى -
                                                        التحضيرات
                                                    </div>
                                                    <div className="whitespace-pre-line text-sm text-slate-900">
                                                        {
                                                            selectedStudy
                                                                .implementation
                                                                ?.phase1 || '-'
                                                        }
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex items-start gap-4">
                                                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-indigo-100 font-bold text-indigo-700">
                                                    2
                                                </div>
                                                <div className="flex-1 rounded-xl bg-slate-50 p-4">
                                                    <div className="mb-1 text-xs text-slate-600">
                                                        المرحلة الثانية -
                                                        التنفيذ
                                                    </div>
                                                    <div className="whitespace-pre-line text-sm text-slate-900">
                                                        {
                                                            selectedStudy
                                                                .implementation
                                                                ?.phase2 || '-'
                                                        }
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex items-start gap-4">
                                                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-indigo-100 font-bold text-indigo-700">
                                                    3
                                                </div>
                                                <div className="flex-1 rounded-xl bg-slate-50 p-4">
                                                    <div className="mb-1 text-xs text-slate-600">
                                                        المرحلة الثالثة - التوسع
                                                    </div>
                                                    <div className="whitespace-pre-line text-sm text-slate-900">
                                                        {
                                                            selectedStudy
                                                                .implementation
                                                                ?.phase3 || '-'
                                                        }
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </section>

                                    {/* Risks */}
                                    <section>
                                        <h3 className="mb-4 flex items-center gap-2 text-xl font-black text-slate-900">
                                            <span>⚠️</span> المخاطر الواقعية
                                        </h3>
                                        <div className="rounded-2xl border border-amber-200 bg-amber-50 p-5">
                                            <ul className="space-y-2">
                                                {(selectedStudy.risks || [] || []).map(
                                                    (risk, idx) => (
                                                        <li
                                                            key={idx}
                                                            className="flex items-start gap-2 text-sm text-amber-900"
                                                        >
                                                            <span className="shrink-0 text-amber-600">
                                                                ▸
                                                            </span>
                                                            <span className="whitespace-pre-line">
                                                                {risk}
                                                            </span>
                                                        </li>
                                                    ),
                                                )}
                                            </ul>
                                        </div>
                                    </section>

                                    {/* Recommendations */}
                                    <section>
                                        <h3 className="mb-4 flex items-center gap-2 text-xl font-black text-slate-900">
                                            <span>💡</span> التوصيات العملية
                                        </h3>
                                        <div className="rounded-2xl border border-indigo-200 bg-indigo-50 p-5">
                                            <ul className="space-y-2">
                                                {(selectedStudy.recommendations || [] || []).map(
                                                    (rec, idx) => (
                                                        <li
                                                            key={idx}
                                                            className="flex items-start gap-2 text-sm text-indigo-900"
                                                        >
                                                            <span className="shrink-0 text-indigo-600">
                                                                ✓
                                                            </span>
                                                            <span className="whitespace-pre-line">
                                                                {rec}
                                                            </span>
                                                        </li>
                                                    ),
                                                )}
                                            </ul>
                                        </div>
                                    </section>

                                    {/* Footer */}
                                    <div className="flex items-center justify-between border-t border-slate-200 pt-6">
                                        <div className="text-xs text-slate-500">
                                            💡 دراسة مبنية على{' '}
                                            <strong>
                                                أرقام حقيقية للسياق السوري
                                            </strong>{' '}
                                            · أسعار محدثة 2026
                                        </div>
                                        <button
                                            onClick={() =>
                                                setSelectedStudy(null)
                                            }
                                            className="rounded-xl bg-slate-900 px-6 py-2.5 font-bold text-white transition hover:bg-slate-800"
                                        >
                                            إغلاق
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </PortalLayout>
    );
}
