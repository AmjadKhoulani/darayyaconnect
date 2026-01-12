import PortalLayout from '@/Layouts/PortalLayout';
import { Head, router } from '@inertiajs/react';
import { useState, useEffect } from 'react';

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

export default function AiStudies({ auth, studies, filters, stats, totalCount }: PageProps) {
    const [selectedStudy, setSelectedStudy] = useState<Study | null>(null);
    const [searchTerm, setSearchTerm] = useState(filters.search || '');

    // Debounce Search
    useEffect(() => {
        const timer = setTimeout(() => {
            if (searchTerm !== (filters.search || '')) {
                router.get(
                    route('ai-studies'),
                    { search: searchTerm, category: filters.category },
                    { preserveState: true, replace: true, preserveScroll: true }
                );
            }
        }, 300);

        return () => clearTimeout(timer);
    }, [searchTerm]);

    const handleCategoryChange = (category: string) => {
        router.get(
            route('ai-studies'),
            { category, search: searchTerm },
            { preserveState: true }
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
        <PortalLayout
            auth={auth}
            header={null}
        >
            <Head title="دراسات AI" />

            <div className="py-8" dir="rtl">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

                    {/* Hero Section */}
                    <div className="mb-8 bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 rounded-3xl p-8 text-white relative overflow-hidden shadow-2xl">
                        <div className="absolute inset-0 opacity-20">
                            <div className="absolute top-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl"></div>
                            <div className="absolute bottom-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl"></div>
                        </div>
                        <div className="relative z-10">
                            <h1 className="text-4xl font-black mb-4">📊 دراسات جدوى واقعية ومُفصّلة</h1>
                            <p className="text-xl leading-relaxed text-purple-100 max-w-3xl">
                                تحليلات مبنية على <strong>أرقام حقيقية للسياق السوري</strong>، وتتضمن: <strong>نطاقات التكلفة</strong>, <strong>تفصيل المصاريف</strong>, <strong>العوائد المتوقعة</strong>, <strong>المخاطر الواقعية</strong>, و<strong>خطة التنفيذ</strong>.
                            </p>
                        </div>
                    </div>

                    {/* Controls: Search & Filter */}
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                        {/* Categories */}
                        <div className="flex flex-wrap gap-3">
                            {categories.map(cat => (
                                <button
                                    key={cat.id}
                                    onClick={() => handleCategoryChange(cat.id)}
                                    className={`px-5 py-2.5 rounded-xl font-bold transition-all flex items-center gap-2 ${currentCategory === cat.id
                                        ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200'
                                        : 'bg-white text-slate-700 hover:bg-slate-50 border border-slate-200'
                                        }`}
                                >
                                    <span className="text-xl">{cat.icon}</span>
                                    <span>{cat.name}</span>
                                    <span className={`text-xs px-2 py-0.5 rounded-full ${currentCategory === cat.id ? 'bg-white/20' : 'bg-slate-100'
                                        }`}>
                                        {cat.count}
                                    </span>
                                </button>
                            ))}
                        </div>

                        {/* Search */}
                        <div className="relative w-full md:w-64">
                            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                                <span className="text-gray-400">🔍</span>
                            </div>
                            <input
                                type="text"
                                className="block w-full pr-10 border-gray-300 rounded-xl focus:ring-indigo-500 focus:border-indigo-500 shadow-sm"
                                placeholder="بحث في الدراسات..."
                                value={searchTerm}
                                onChange={e => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>

                    {/* Studies Grid */}
                    {studies.data.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                            {studies.data.map(study => (
                                <div
                                    key={study.id}
                                    onClick={() => setSelectedStudy(study)}
                                    className="cursor-pointer bg-white rounded-2xl p-6 shadow-sm hover:shadow-xl transition-all text-right group border-2 border-transparent hover:border-indigo-200"
                                >
                                    <div className="flex items-start justify-between mb-4">
                                        <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${study.gradient} flex items-center justify-center text-3xl shadow-lg group-hover:scale-110 transition-transform`}>
                                            {study.icon}
                                        </div>
                                        <span className={`text-xs font-bold px-3 py-1 rounded-full bg-${study.color}-50 text-${study.color}-700`}>
                                            {study.category}
                                        </span>
                                    </div>

                                    <h3 className="text-lg font-black text-slate-900 mb-2 group-hover:text-indigo-600 transition-colors">
                                        {study.title}
                                    </h3>

                                    <p className="text-sm text-slate-600 leading-relaxed mb-4 line-clamp-3">
                                        {study.summary}
                                    </p>

                                    {/* Quick Stats */}
                                    <div className="grid grid-cols-2 gap-3 pt-4 border-t border-slate-100">
                                        <div>
                                            <div className="text-xs text-slate-500 mb-1">الاستثمار</div>
                                            <div className="text-sm font-bold text-slate-900">{study.economics.investment}</div>
                                        </div>
                                        <div>
                                            <div className="text-xs text-slate-500 mb-1">فرص العمل</div>
                                            <div className="text-sm font-bold text-emerald-600">{study.economics.jobs}</div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="bg-white rounded-3xl p-12 text-center shadow-sm border border-slate-200 mb-8">
                            <span className="text-6xl mb-4 block">🧐</span>
                            <h3 className="text-xl font-bold text-slate-900 mb-2">لا توجد دراسات مطابقة</h3>
                            <p className="text-slate-500">حاول تغيير مصطلحات البحث أو اختيار تصنيف آخر.</p>
                            <button onClick={() => { setSearchTerm(''); handleCategoryChange('all'); }} className="mt-4 text-indigo-600 font-bold hover:underline">
                                إعادة ضبط الفلاتر
                            </button>
                        </div>
                    )}

                    {/* Pagination */}
                    {studies.links.length > 3 && (
                        <div className="flex justify-center mt-8">
                            <div className="flex bg-white rounded-lg shadow-sm border border-slate-200">
                                {studies.links.map((link, i) => (
                                    <button
                                        key={i}
                                        onClick={() => link.url && router.get(link.url, { search: searchTerm, category: filters.category }, { preserveState: true, preserveScroll: true })}
                                        disabled={!link.url || link.active}
                                        className={`px-4 py-2 text-sm font-medium border-l border-slate-100 last:border-l-0 transition-colors
                                            ${link.active ? 'bg-indigo-600 text-white' : 'text-slate-700 hover:bg-slate-50'}
                                            ${!link.url ? 'opacity-50 cursor-not-allowed' : ''}
                                        `}
                                        dangerouslySetInnerHTML={{ __html: link.label }}
                                    />
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Study Detail Modal */}
                    {selectedStudy && (
                        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50" onClick={() => setSelectedStudy(null)}>
                            <div className="bg-white rounded-3xl max-w-5xl w-full max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
                                {/* Header */}
                                <div className={`bg-gradient-to-br ${selectedStudy.gradient} p-8 text-white relative overflow-hidden`}>
                                    <button
                                        onClick={() => setSelectedStudy(null)}
                                        className="absolute top-4 left-4 w-10 h-10 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center backdrop-blur-sm transition"
                                    >
                                        ✕
                                    </button>
                                    <div className="flex items-start gap-4">
                                        <div className="text-6xl">{selectedStudy.icon}</div>
                                        <div className="flex-1">
                                            <span className="text-xs font-bold px-3 py-1 rounded-full bg-white/20 backdrop-blur-sm">
                                                {selectedStudy.category}
                                            </span>
                                            <h2 className="text-3xl font-black mt-2">{selectedStudy.title}</h2>
                                            <p className="text-lg text-white/90 mt-2">{selectedStudy.summary}</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="p-8 space-y-8">
                                    {/* Scenario Comparison */}
                                    <section>
                                        <h3 className="text-xl font-black text-slate-900 mb-4 flex items-center gap-2">
                                            <span>📊</span> مقارنة مفصلة للسيناريوهات
                                        </h3>
                                        <div className="grid md:grid-cols-2 gap-4">
                                            <div className="bg-rose-50 rounded-2xl p-5 border border-rose-200">
                                                <h4 className="font-bold text-rose-900 mb-2 flex items-center gap-2">
                                                    <span>❌</span> الوضع الحالي
                                                </h4>
                                                <p className="text-sm text-rose-800 leading-relaxed whitespace-pre-line">{selectedStudy.scenario.current}</p>
                                            </div>
                                            <div className="bg-emerald-50 rounded-2xl p-5 border border-emerald-200">
                                                <h4 className="font-bold text-emerald-900 mb-2 flex items-center gap-2">
                                                    <span>✅</span> مع المشروع
                                                </h4>
                                                <p className="text-sm text-emerald-800 leading-relaxed whitespace-pre-line">{selectedStudy.scenario.withProject}</p>
                                            </div>
                                        </div>
                                    </section>

                                    {/* Economics with Breakdown */}
                                    <section>
                                        <h3 className="text-xl font-black text-slate-900 mb-4 flex items-center gap-2">
                                            <span>💰</span> الجدوى الاقتصادية التفصيلية
                                        </h3>

                                        {/* Summary Cards */}
                                        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                                            <div className="bg-slate-50 rounded-xl p-4">
                                                <div className="text-xs text-slate-600 mb-1">الاستثمار المبدئي</div>
                                                <div className="text-lg font-black text-slate-900">{selectedStudy.economics.investment}</div>
                                                <div className="text-[10px] text-slate-500 mt-1">{selectedStudy.economics.investmentRange}</div>
                                            </div>
                                            <div className="bg-emerald-50 rounded-xl p-4">
                                                <div className="text-xs text-emerald-700 mb-1">العائد السنوي</div>
                                                <div className="text-lg font-black text-emerald-700">{selectedStudy.economics.revenue}</div>
                                                <div className="text-[10px] text-emerald-600 mt-1">{selectedStudy.economics.revenueRange}</div>
                                            </div>
                                            <div className="bg-blue-50 rounded-xl p-4">
                                                <div className="text-xs text-blue-700 mb-1">فترة الاسترداد</div>
                                                <div className="text-lg font-black text-blue-700">{selectedStudy.economics.payback}</div>
                                            </div>
                                            <div className="bg-amber-50 rounded-xl p-4">
                                                <div className="text-xs text-amber-700 mb-1">فرص العمل</div>
                                                <div className="text-lg font-black text-amber-700">{selectedStudy.economics.jobs}</div>
                                                <div className="text-[10px] text-amber-600 mt-1">{selectedStudy.economics.jobsBreakdown}</div>
                                            </div>
                                        </div>

                                        {/* Cost Breakdown Table */}
                                        <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200">
                                            <h4 className="font-bold text-slate-900 mb-3 text-sm">📋 تفصيل التكاليف</h4>
                                            <div className="space-y-2">
                                                {selectedStudy.economics.costBreakdown.map((item, idx) => (
                                                    <div key={idx} className="flex justify-between items-start gap-4 p-2 hover:bg-white rounded-lg transition">
                                                        <span className="text-sm text-slate-700 flex-1">{item.item}</span>
                                                        <span className="text-sm font-bold text-slate-900 shrink-0">{item.cost}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </section>

                                    {/* Technical Details */}
                                    <section>
                                        <h3 className="text-xl font-black text-slate-900 mb-4 flex items-center gap-2">
                                            <span>🔧</span> التفاصيل التقنية
                                        </h3>
                                        <div className="bg-indigo-50 rounded-2xl p-5 border border-indigo-200">
                                            <ul className="space-y-2">
                                                {selectedStudy.technicalDetails.map((detail, idx) => (
                                                    <li key={idx} className="flex items-start gap-2 text-sm text-indigo-900">
                                                        <span className="text-indigo-600 shrink-0">▸</span>
                                                        <span className="whitespace-pre-line">{detail}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    </section>

                                    {/* Environmental Impact */}
                                    <section>
                                        <h3 className="text-xl font-black text-slate-900 mb-4 flex items-center gap-2">
                                            <span>🌍</span> الأثر البيئي
                                        </h3>
                                        <div className="bg-green-50 rounded-2xl p-5 border border-green-200">
                                            <ul className="space-y-2">
                                                {selectedStudy.environmental.wasteReduction && (
                                                    <li className="flex items-start gap-2 text-sm text-green-900">
                                                        <span className="text-lg">♻️</span>
                                                        <span><strong>تقليل النفايات:</strong> {selectedStudy.environmental.wasteReduction}</span>
                                                    </li>
                                                )}
                                                {selectedStudy.environmental.emissions && (
                                                    <li className="flex items-start gap-2 text-sm text-green-900">
                                                        <span className="text-lg">🌫️</span>
                                                        <span><strong>خفض الانبعاثات:</strong> {selectedStudy.environmental.emissions}</span>
                                                    </li>
                                                )}
                                                {selectedStudy.environmental.waterSaved && (
                                                    <li className="flex items-start gap-2 text-sm text-green-900">
                                                        <span className="text-lg">💧</span>
                                                        <span><strong>توفير المياه:</strong> {selectedStudy.environmental.waterSaved}</span>
                                                    </li>
                                                )}
                                                {selectedStudy.environmental.energySaved && (
                                                    <li className="flex items-start gap-2 text-sm text-green-900">
                                                        <span className="text-lg">⚡</span>
                                                        <span><strong>توفير الطاقة:</strong> {selectedStudy.environmental.energySaved}</span>
                                                    </li>
                                                )}
                                            </ul>
                                        </div>
                                    </section>

                                    {/* Social Impact */}
                                    <section>
                                        <h3 className="text-xl font-black text-slate-900 mb-4 flex items-center gap-2">
                                            <span>👥</span> الأثر الاجتماعي
                                        </h3>
                                        <div className="bg-blue-50 rounded-2xl p-5 border border-blue-200">
                                            <div className="grid md:grid-cols-2 gap-4">
                                                <div>
                                                    <div className="text-xs text-blue-700 mb-1">المستفيدون</div>
                                                    <div className="text-lg font-bold text-blue-900">{selectedStudy.social.beneficiaries}</div>
                                                </div>
                                                <div>
                                                    <div className="text-xs text-blue-700 mb-1">التأثير</div>
                                                    <div className="text-sm text-blue-900">{selectedStudy.social.impact}</div>
                                                </div>
                                            </div>
                                        </div>
                                    </section>

                                    {/* Implementation Timeline */}
                                    <section>
                                        <h3 className="text-xl font-black text-slate-900 mb-4 flex items-center gap-2">
                                            <span>📅</span> خطة التنفيذ المفصلة
                                        </h3>
                                        <div className="space-y-3">
                                            <div className="flex gap-4 items-start">
                                                <div className="w-10 h-10 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold shrink-0">1</div>
                                                <div className="flex-1 bg-slate-50 rounded-xl p-4">
                                                    <div className="text-xs text-slate-600 mb-1">المرحلة الأولى - التحضيرات</div>
                                                    <div className="text-sm text-slate-900 whitespace-pre-line">{selectedStudy.implementation.phase1}</div>
                                                </div>
                                            </div>
                                            <div className="flex gap-4 items-start">
                                                <div className="w-10 h-10 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold shrink-0">2</div>
                                                <div className="flex-1 bg-slate-50 rounded-xl p-4">
                                                    <div className="text-xs text-slate-600 mb-1">المرحلة الثانية - التنفيذ</div>
                                                    <div className="text-sm text-slate-900 whitespace-pre-line">{selectedStudy.implementation.phase2}</div>
                                                </div>
                                            </div>
                                            <div className="flex gap-4 items-start">
                                                <div className="w-10 h-10 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold shrink-0">3</div>
                                                <div className="flex-1 bg-slate-50 rounded-xl p-4">
                                                    <div className="text-xs text-slate-600 mb-1">المرحلة الثالثة - التوسع</div>
                                                    <div className="text-sm text-slate-900 whitespace-pre-line">{selectedStudy.implementation.phase3}</div>
                                                </div>
                                            </div>
                                        </div>
                                    </section>

                                    {/* Risks */}
                                    <section>
                                        <h3 className="text-xl font-black text-slate-900 mb-4 flex items-center gap-2">
                                            <span>⚠️</span> المخاطر الواقعية
                                        </h3>
                                        <div className="bg-amber-50 rounded-2xl p-5 border border-amber-200">
                                            <ul className="space-y-2">
                                                {selectedStudy.risks.map((risk, idx) => (
                                                    <li key={idx} className="flex items-start gap-2 text-sm text-amber-900">
                                                        <span className="text-amber-600 shrink-0">▸</span>
                                                        <span className="whitespace-pre-line">{risk}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    </section>

                                    {/* Recommendations */}
                                    <section>
                                        <h3 className="text-xl font-black text-slate-900 mb-4 flex items-center gap-2">
                                            <span>💡</span> التوصيات العملية
                                        </h3>
                                        <div className="bg-indigo-50 rounded-2xl p-5 border border-indigo-200">
                                            <ul className="space-y-2">
                                                {selectedStudy.recommendations.map((rec, idx) => (
                                                    <li key={idx} className="flex items-start gap-2 text-sm text-indigo-900">
                                                        <span className="text-indigo-600 shrink-0">✓</span>
                                                        <span className="whitespace-pre-line">{rec}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    </section>

                                    {/* Footer */}
                                    <div className="pt-6 border-t border-slate-200 flex justify-between items-center">
                                        <div className="text-xs text-slate-500">
                                            💡 دراسة مبنية على <strong>أرقام حقيقية للسياق السوري</strong> · أسعار محدثة 2026
                                        </div>
                                        <button
                                            onClick={() => setSelectedStudy(null)}
                                            className="px-6 py-2.5 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 transition"
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
