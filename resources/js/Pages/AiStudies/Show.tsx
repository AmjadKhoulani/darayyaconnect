import PortalLayout from '@/Layouts/PortalLayout';
import { Head, Link } from '@inertiajs/react';

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

interface Props {
    auth: any;
    study: Study;
}

export default function Show({ auth, study }: Props) {
    return (
        <PortalLayout auth={auth} header={null}>
            <Head title={study.title} />

            <div className="py-8" dir="rtl">
                <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
                    {/* Back Button */}
                    <Link
                        href={route('ai-studies')}
                        className="mb-6 inline-flex items-center gap-2 rounded-lg bg-white px-4 py-2 text-slate-600 shadow-sm transition hover:bg-slate-50 hover:text-indigo-600"
                    >
                        <span>⬅️</span> عودة للدراسات
                    </Link>

                    <div className="overflow-hidden rounded-3xl bg-white shadow-xl">
                        {/* Header */}
                        <div
                            className={`bg-gradient-to-br ${study.gradient} relative overflow-hidden p-8 text-white`}
                        >
                            <div className="flex items-start gap-4">
                                <div className="text-6xl">
                                    {study.icon}
                                </div>
                                <div className="flex-1">
                                    <span className="rounded-full bg-white/20 px-3 py-1 text-xs font-bold backdrop-blur-sm">
                                        {study.category}
                                    </span>
                                    <h1 className="mt-2 text-3xl font-black">
                                        {study.title}
                                    </h1>
                                    <p className="mt-2 text-lg text-white/90">
                                        {study.summary}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-8 p-8">
                            {/* Scenario Comparison */}
                            {study.scenario?.current && (
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
                                                {study.scenario.current}
                                            </p>
                                        </div>
                                        <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-5">
                                            <h4 className="mb-2 flex items-center gap-2 font-bold text-emerald-900">
                                                <span>✅</span> مع المشروع
                                            </h4>
                                            <p className="whitespace-pre-line text-sm leading-relaxed text-emerald-800">
                                                {study.scenario.withProject || 'غير محدد'}
                                            </p>
                                        </div>
                                    </div>
                                </section>
                            )}

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
                                                study.economics
                                                    ?.investment || '-'
                                            }
                                        </div>
                                        <div className="mt-1 text-[10px] text-slate-500">
                                            {
                                                study.economics
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
                                                study.economics
                                                    ?.revenue || '-'
                                            }
                                        </div>
                                        <div className="mt-1 text-[10px] text-emerald-600">
                                            {
                                                study.economics
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
                                                study.economics
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
                                                study.economics
                                                    ?.jobs || '-'
                                            }
                                        </div>
                                        <div className="mt-1 text-[10px] text-amber-600">
                                            {
                                                study.economics
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
                                        {(study.economics?.costBreakdown || []).map(
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
                            {(study.technicalDetails || []).length > 0 && (
                                <section>
                                    <h3 className="mb-4 flex items-center gap-2 text-xl font-black text-slate-900">
                                        <span>🔧</span> التفاصيل التقنية
                                    </h3>
                                    <div className="rounded-2xl border border-indigo-200 bg-indigo-50 p-5">
                                        <ul className="space-y-2">
                                            {(study.technicalDetails || [] || []).map(
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
                            )}

                            {/* Environmental Impact */}
                            {(study.environmental?.wasteReduction ||
                                study.environmental?.emissions ||
                                study.environmental?.waterSaved ||
                                study.environmental?.energySaved) && (
                                    <section>
                                        <h3 className="mb-4 flex items-center gap-2 text-xl font-black text-slate-900">
                                            <span>🌍</span> الأثر البيئي
                                        </h3>
                                        <div className="rounded-2xl border border-green-200 bg-green-50 p-5">
                                            <ul className="space-y-2">
                                                {study.environmental
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
                                                                    study
                                                                        .environmental
                                                                        ?.wasteReduction
                                                                }
                                                            </span>
                                                        </li>
                                                    )}
                                                {study.environmental
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
                                                                    study
                                                                        .environmental
                                                                        ?.emissions
                                                                }
                                                            </span>
                                                        </li>
                                                    )}
                                                {study.environmental
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
                                                                    study
                                                                        .environmental
                                                                        ?.waterSaved
                                                                }
                                                            </span>
                                                        </li>
                                                    )}
                                                {study.environmental
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
                                                                    study
                                                                        .environmental
                                                                        ?.energySaved
                                                                }
                                                            </span>
                                                        </li>
                                                    )}
                                            </ul>
                                        </div>
                                    </section>
                                )}

                            {/* Social Impact */}
                            {(study.social?.beneficiaries || study.social?.impact) && (
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
                                                        study.social
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
                                                        study.social
                                                            ?.impact || '-'
                                                    }
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </section>
                            )}

                            {/* Implementation Timeline */}
                            {(study.implementation?.phase1) && (
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
                                                        study
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
                                                        study
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
                                                        study
                                                            .implementation
                                                            ?.phase3 || '-'
                                                    }
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </section>
                            )}

                            {/* Risks */}
                            {(study.risks || []).length > 0 && (
                                <section>
                                    <h3 className="mb-4 flex items-center gap-2 text-xl font-black text-slate-900">
                                        <span>⚠️</span> المخاطر الواقعية
                                    </h3>
                                    <div className="rounded-2xl border border-amber-200 bg-amber-50 p-5">
                                        <ul className="space-y-2">
                                            {(study.risks || [] || []).map(
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
                            )}

                            {/* Recommendations */}
                            {(study.recommendations || []).length > 0 && (
                                <section>
                                    <h3 className="mb-4 flex items-center gap-2 text-xl font-black text-slate-900">
                                        <span>💡</span> التوصيات العملية
                                    </h3>
                                    <div className="rounded-2xl border border-indigo-200 bg-indigo-50 p-5">
                                        <ul className="space-y-2">
                                            {(study.recommendations || [] || []).map(
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
                            )}

                            <div className="flex items-center justify-between border-t border-slate-200 pt-6">
                                <div className="text-xs text-slate-500">
                                    💡 دراسة مبنية على{' '}
                                    <strong>
                                        أرقام حقيقية للسياق السوري
                                    </strong>{' '}
                                    · أسعار محدثة 2026
                                </div>
                                <Link
                                    href={route('ai-studies')}
                                    className="rounded-xl bg-slate-900 px-6 py-2.5 font-bold text-white transition hover:bg-slate-800"
                                >
                                    إغلاق
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </PortalLayout>
    );
}
