import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';
import TextInput from '@/Components/TextInput';
import AdminLayout from '@/Layouts/AdminLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { FormEventHandler, useState } from 'react';

export default function Edit({ auth, study }: any) {
    const { data, setData, put, processing, errors } = useForm({
        title: study.title || '',
        icon: study.icon || '🤖',
        category: study.category || '',
        color: study.color || 'blue',
        gradient: study.gradient || '',
        summary: study.summary || '',
        is_published: study.is_published ?? true,
        is_featured: study.is_featured ?? false,
        scenario: study.scenario || {
            current: '',
            withProject: '',
        },
        economics: {
            investment: study.economics?.investment ?? '',
            investmentRange: study.economics?.investmentRange ?? '',
            revenue: study.economics?.revenue ?? '',
            revenueRange: study.economics?.revenueRange ?? '',
            payback: study.economics?.payback ?? '',
            jobs: study.economics?.jobs ?? '',
            jobsBreakdown: study.economics?.jobsBreakdown ?? '',
            costBreakdown: study.economics?.costBreakdown || [{ item: '', cost: '' }],
        },
        environmental: {
            wasteReduction: study.environmental?.wasteReduction ?? '',
            emissions: study.environmental?.emissions ?? '',
            waterSaved: study.environmental?.waterSaved ?? '',
            energySaved: study.environmental?.energySaved ?? '',
        },
        social: {
            beneficiaries: study.social?.beneficiaries ?? '',
            impact: study.social?.impact ?? '',
        },
        implementation: {
            phase1: study.implementation?.phase1 ?? '',
            phase2: study.implementation?.phase2 ?? '',
            phase3: study.implementation?.phase3 ?? '',
        },
        risks: study.risks || [''],
        recommendations: study.recommendations || [''],
        technicalDetails: study.technicalDetails || [''],
    });

    const [activeTab, setActiveTab] = useState('basic');

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        put(route('admin.ai-studies.update', study.id));
    };

    // Helper to handle nested object updates
    const updateNested = (section: string, field: string, value: string) => {
        setData(section as any, {
            ...(data[section as keyof typeof data] as any),
            [field]: value,
        });
    };

    // Helper to handle dynamic arrays (Strings)
    const updateArrayItem = (
        field: 'risks' | 'recommendations' | 'technicalDetails',
        index: number,
        value: string,
    ) => {
        const newArray = [...data[field]];
        newArray[index] = value;
        setData(field, newArray);
    };

    const addArrayItem = (
        field: 'risks' | 'recommendations' | 'technicalDetails',
    ) => {
        setData(field, [...data[field], '']);
    };

    const removeArrayItem = (
        field: 'risks' | 'recommendations' | 'technicalDetails',
        index: number,
    ) => {
        const newArray = [...data[field]];
        newArray.splice(index, 1);
        setData(field, newArray);
    };

    // Helper to handle cost breakdown (Objects)
    const updateCostItem = (
        index: number,
        field: 'item' | 'cost',
        value: string,
    ) => {
        const newBreakdown = [...data.economics.costBreakdown];
        newBreakdown[index] = { ...newBreakdown[index], [field]: value };
        setData('economics', {
            ...data.economics,
            costBreakdown: newBreakdown,
        });
    };

    const addCostItem = () => {
        setData('economics', {
            ...data.economics,
            costBreakdown: [
                ...data.economics.costBreakdown,
                { item: '', cost: '' },
            ],
        });
    };

    const removeCostItem = (index: number) => {
        const newBreakdown = [...data.economics.costBreakdown];
        newBreakdown.splice(index, 1);
        setData('economics', {
            ...data.economics,
            costBreakdown: newBreakdown,
        });
    };

    const tabs = [
        { id: 'basic', label: 'البيانات الأساسية' },
        { id: 'scenario', label: 'السيناريو' },
        { id: 'economics', label: 'الاقتصاد' },
        { id: 'impact', label: 'الأثر البيئي/الاجتماعي' },
        { id: 'implementation', label: 'التنفيذ' },
        { id: 'lists', label: 'القوائم (مخاطر/توصيات)' },
    ];

    return (
        <AdminLayout user={auth.user}>
            <Head title={`تعديل الدراسة: ${data.title}`} />

            <div className="py-12" dir="rtl">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            <div className="mb-6 flex items-center justify-between">
                                <h2 className="text-2xl font-bold">
                                    تعديل الدراسة: {study.title}
                                </h2>
                                <Link
                                    href={route('admin.ai-studies.index')}
                                    className="rounded-md bg-gray-200 px-4 py-2 text-gray-700 hover:bg-gray-300"
                                >
                                    إلغاء
                                </Link>
                            </div>

                            <form onSubmit={submit}>
                                {/* Tabs Header */}
                                <div className="mb-6 flex overflow-x-auto border-b border-gray-200">
                                    {tabs.map((tab) => (
                                        <button
                                            key={tab.id}
                                            type="button"
                                            onClick={() => setActiveTab(tab.id)}
                                            className={`whitespace-nowrap border-b-2 px-6 py-3 text-sm font-medium transition-colors ${activeTab === tab.id
                                                ? 'border-indigo-600 text-indigo-600'
                                                : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                                                }`}
                                        >
                                            {tab.label}
                                        </button>
                                    ))}
                                </div>

                                {/* Tab Content */}
                                <div className="space-y-6">
                                    {/* Basic Info */}
                                    {activeTab === 'basic' && (
                                        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                            <div>
                                                <InputLabel
                                                    htmlFor="title"
                                                    value="عنوان الدراسة"
                                                />
                                                <TextInput
                                                    id="title"
                                                    className="mt-1 block w-full"
                                                    value={data.title}
                                                    onChange={(e) =>
                                                        setData(
                                                            'title',
                                                            e.target.value,
                                                        )
                                                    }
                                                    required
                                                />
                                                <InputError
                                                    message={errors.title}
                                                    className="mt-2"
                                                />
                                            </div>

                                            <div>
                                                <InputLabel
                                                    htmlFor="category"
                                                    value="التصنيف"
                                                />
                                                <TextInput
                                                    id="category"
                                                    className="mt-1 block w-full"
                                                    value={data.category}
                                                    onChange={(e) =>
                                                        setData(
                                                            'category',
                                                            e.target.value,
                                                        )
                                                    }
                                                    placeholder="مثال: بيئة، طاقة، تعليم"
                                                />
                                            </div>

                                            <div>
                                                <InputLabel
                                                    htmlFor="icon"
                                                    value="الأيقونة (Emoji)"
                                                />
                                                <TextInput
                                                    id="icon"
                                                    className="mt-1 block w-full text-center text-2xl"
                                                    value={data.icon}
                                                    onChange={(e) =>
                                                        setData(
                                                            'icon',
                                                            e.target.value,
                                                        )
                                                    }
                                                />
                                            </div>

                                            <div>
                                                <InputLabel
                                                    htmlFor="color"
                                                    value="اللون الأساسي"
                                                />
                                                <select
                                                    id="color"
                                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                                    value={data.color}
                                                    onChange={(e) =>
                                                        setData(
                                                            'color',
                                                            e.target.value,
                                                        )
                                                    }
                                                >
                                                    <option value="blue">
                                                        Blue
                                                    </option>
                                                    <option value="green">
                                                        Green
                                                    </option>
                                                    <option value="amber">
                                                        Amber
                                                    </option>
                                                    <option value="red">
                                                        Red
                                                    </option>
                                                    <option value="indigo">
                                                        Indigo
                                                    </option>
                                                    <option value="purple">
                                                        Purple
                                                    </option>
                                                    <option value="cyan">
                                                        Cyan
                                                    </option>
                                                </select>
                                            </div>

                                            <div>
                                                <InputLabel
                                                    htmlFor="gradient"
                                                    value="تدرج الألوان (Tailwind Classes)"
                                                />
                                                <TextInput
                                                    id="gradient"
                                                    className="mt-1 block w-full"
                                                    value={data.gradient}
                                                    onChange={(e) =>
                                                        setData(
                                                            'gradient',
                                                            e.target.value,
                                                        )
                                                    }
                                                    placeholder="from-blue-500 to-indigo-600"
                                                />
                                            </div>

                                            <div className="md:col-span-2 border-t pt-4 mt-4">
                                                <div className="flex items-center gap-6">
                                                    <label className="flex items-center gap-2 cursor-pointer">
                                                        <input
                                                            type="checkbox"
                                                            checked={data.is_published}
                                                            onChange={(e) =>
                                                                setData(
                                                                    'is_published',
                                                                    e.target.checked,
                                                                )
                                                            }
                                                            className="rounded border-gray-300 text-indigo-600 shadow-sm focus:ring-indigo-500"
                                                        />
                                                        <span className="text-sm font-medium text-gray-700">
                                                            نشر الدراسة
                                                        </span>
                                                    </label>

                                                    <label className="flex items-center gap-2 cursor-pointer">
                                                        <input
                                                            type="checkbox"
                                                            checked={data.is_featured}
                                                            onChange={(e) =>
                                                                setData(
                                                                    'is_featured',
                                                                    e.target.checked,
                                                                )
                                                            }
                                                            className="rounded border-gray-300 text-emerald-600 shadow-sm focus:ring-emerald-500"
                                                        />
                                                        <span className="text-sm font-medium text-gray-700">
                                                            ⭐ دراسة مميزة (تظهر في السلايدر)
                                                        </span>
                                                    </label>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {/* Scenario */}
                                    {activeTab === 'scenario' && (
                                        <div className="space-y-6">
                                            <div>
                                                <InputLabel
                                                    htmlFor="scenario_current"
                                                    value="الوضع الحالي (المشكلة)"
                                                />
                                                <textarea
                                                    id="scenario_current"
                                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                                    rows={4}
                                                    value={
                                                        data.scenario.current
                                                    }
                                                    onChange={(e) =>
                                                        updateNested(
                                                            'scenario',
                                                            'current',
                                                            e.target.value,
                                                        )
                                                    }
                                                ></textarea>
                                            </div>
                                            <div>
                                                <InputLabel
                                                    htmlFor="scenario_withProject"
                                                    value="مع المشروع (الحل)"
                                                />
                                                <textarea
                                                    id="scenario_withProject"
                                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                                    rows={4}
                                                    value={
                                                        data.scenario
                                                            .withProject
                                                    }
                                                    onChange={(e) =>
                                                        updateNested(
                                                            'scenario',
                                                            'withProject',
                                                            e.target.value,
                                                        )
                                                    }
                                                ></textarea>
                                            </div>
                                        </div>
                                    )}

                                    {/* Economics */}
                                    {activeTab === 'economics' && (
                                        <div className="space-y-6">
                                            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                                <div>
                                                    <InputLabel value="قيمة الاستثمار" />
                                                    <TextInput
                                                        className="w-full"
                                                        value={
                                                            data.economics
                                                                .investment
                                                        }
                                                        onChange={(e) =>
                                                            updateNested(
                                                                'economics',
                                                                'investment',
                                                                e.target.value,
                                                            )
                                                        }
                                                    />
                                                </div>
                                                <div>
                                                    <InputLabel value="نطاق الاستثمار (شرح)" />
                                                    <TextInput
                                                        className="w-full"
                                                        value={
                                                            data.economics
                                                                .investmentRange
                                                        }
                                                        onChange={(e) =>
                                                            updateNested(
                                                                'economics',
                                                                'investmentRange',
                                                                e.target.value,
                                                            )
                                                        }
                                                    />
                                                </div>
                                                <div>
                                                    <InputLabel value="العائد المتوقع" />
                                                    <TextInput
                                                        className="w-full"
                                                        value={
                                                            data.economics
                                                                .revenue
                                                        }
                                                        onChange={(e) =>
                                                            updateNested(
                                                                'economics',
                                                                'revenue',
                                                                e.target.value,
                                                            )
                                                        }
                                                    />
                                                </div>
                                                <div>
                                                    <InputLabel value="نطاق العائد (شرح)" />
                                                    <TextInput
                                                        className="w-full"
                                                        value={
                                                            data.economics
                                                                .revenueRange
                                                        }
                                                        onChange={(e) =>
                                                            updateNested(
                                                                'economics',
                                                                'revenueRange',
                                                                e.target.value,
                                                            )
                                                        }
                                                    />
                                                </div>
                                                <div>
                                                    <InputLabel value="فترة الاسترداد" />
                                                    <TextInput
                                                        className="w-full"
                                                        value={
                                                            data.economics
                                                                .payback
                                                        }
                                                        onChange={(e) =>
                                                            updateNested(
                                                                'economics',
                                                                'payback',
                                                                e.target.value,
                                                            )
                                                        }
                                                    />
                                                </div>
                                                <div>
                                                    <InputLabel value="فرص العمل" />
                                                    <TextInput
                                                        className="w-full"
                                                        value={
                                                            data.economics.jobs
                                                        }
                                                        onChange={(e) =>
                                                            updateNested(
                                                                'economics',
                                                                'jobs',
                                                                e.target.value,
                                                            )
                                                        }
                                                    />
                                                </div>
                                            </div>

                                            <div className="border-t pt-4">
                                                <InputLabel
                                                    value="تفصيل التكاليف (Cost Breakdown)"
                                                    className="mb-2 text-lg font-bold"
                                                />
                                                {data.economics.costBreakdown.map(
                                                    (
                                                        item: any,
                                                        idx: number,
                                                    ) => (
                                                        <div
                                                            key={idx}
                                                            className="mb-2 flex gap-4"
                                                        >
                                                            <TextInput
                                                                placeholder="البند"
                                                                className="flex-1"
                                                                value={
                                                                    item.item
                                                                }
                                                                onChange={(e) =>
                                                                    updateCostItem(
                                                                        idx,
                                                                        'item',
                                                                        e.target
                                                                            .value,
                                                                    )
                                                                }
                                                            />
                                                            <TextInput
                                                                placeholder="التكلفة"
                                                                className="w-1/3"
                                                                value={
                                                                    item.cost
                                                                }
                                                                onChange={(e) =>
                                                                    updateCostItem(
                                                                        idx,
                                                                        'cost',
                                                                        e.target
                                                                            .value,
                                                                    )
                                                                }
                                                            />
                                                            <SecondaryButton
                                                                onClick={() =>
                                                                    removeCostItem(
                                                                        idx,
                                                                    )
                                                                }
                                                                className="bg-red-50 text-red-600 hover:bg-red-100"
                                                            >
                                                                حذف
                                                            </SecondaryButton>
                                                        </div>
                                                    ),
                                                )}
                                                <SecondaryButton
                                                    onClick={addCostItem}
                                                    className="mt-2"
                                                >
                                                    إضافة بند تكلفة
                                                </SecondaryButton>
                                            </div>
                                        </div>
                                    )}

                                    {/* Impact */}
                                    {activeTab === 'impact' && (
                                        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
                                            <div className="space-y-4">
                                                <h3 className="border-b pb-2 text-lg font-bold">
                                                    الأثر البيئي
                                                </h3>
                                                <div>
                                                    <InputLabel value="تقليل النفايات" />{' '}
                                                    <TextInput
                                                        className="w-full"
                                                        value={
                                                            data.environmental
                                                                .wasteReduction
                                                        }
                                                        onChange={(e) =>
                                                            updateNested(
                                                                'environmental',
                                                                'wasteReduction',
                                                                e.target.value,
                                                            )
                                                        }
                                                    />
                                                </div>
                                                <div>
                                                    <InputLabel value="الانبعاثات" />{' '}
                                                    <TextInput
                                                        className="w-full"
                                                        value={
                                                            data.environmental
                                                                .emissions
                                                        }
                                                        onChange={(e) =>
                                                            updateNested(
                                                                'environmental',
                                                                'emissions',
                                                                e.target.value,
                                                            )
                                                        }
                                                    />
                                                </div>
                                                <div>
                                                    <InputLabel value="توفير المياه" />{' '}
                                                    <TextInput
                                                        className="w-full"
                                                        value={
                                                            data.environmental
                                                                .waterSaved
                                                        }
                                                        onChange={(e) =>
                                                            updateNested(
                                                                'environmental',
                                                                'waterSaved',
                                                                e.target.value,
                                                            )
                                                        }
                                                    />
                                                </div>
                                                <div>
                                                    <InputLabel value="توفير الطاقة" />{' '}
                                                    <TextInput
                                                        className="w-full"
                                                        value={
                                                            data.environmental
                                                                .energySaved
                                                        }
                                                        onChange={(e) =>
                                                            updateNested(
                                                                'environmental',
                                                                'energySaved',
                                                                e.target.value,
                                                            )
                                                        }
                                                    />
                                                </div>
                                            </div>
                                            <div className="space-y-4">
                                                <h3 className="border-b pb-2 text-lg font-bold">
                                                    الأثر الاجتماعي
                                                </h3>
                                                <div>
                                                    <InputLabel value="المستفيدون" />{' '}
                                                    <TextInput
                                                        className="w-full"
                                                        value={
                                                            data.social
                                                                .beneficiaries
                                                        }
                                                        onChange={(e) =>
                                                            updateNested(
                                                                'social',
                                                                'beneficiaries',
                                                                e.target.value,
                                                            )
                                                        }
                                                    />
                                                </div>
                                                <div>
                                                    <InputLabel value="التأثير الاجتماعي" />
                                                    <textarea
                                                        className="w-full rounded-md border-gray-300"
                                                        rows={4}
                                                        value={
                                                            data.social.impact
                                                        }
                                                        onChange={(e) =>
                                                            updateNested(
                                                                'social',
                                                                'impact',
                                                                e.target.value,
                                                            )
                                                        }
                                                    ></textarea>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {/* Implementation */}
                                    {activeTab === 'implementation' && (
                                        <div className="space-y-6">
                                            <div>
                                                <InputLabel value="المرحلة الأولى (التحضيرات)" />
                                                <textarea
                                                    className="w-full rounded-md border-gray-300"
                                                    rows={3}
                                                    value={
                                                        data.implementation
                                                            .phase1
                                                    }
                                                    onChange={(e) =>
                                                        updateNested(
                                                            'implementation',
                                                            'phase1',
                                                            e.target.value,
                                                        )
                                                    }
                                                ></textarea>
                                            </div>
                                            <div>
                                                <InputLabel value="المرحلة الثانية (التنفيذ)" />
                                                <textarea
                                                    className="w-full rounded-md border-gray-300"
                                                    rows={3}
                                                    value={
                                                        data.implementation
                                                            .phase2
                                                    }
                                                    onChange={(e) =>
                                                        updateNested(
                                                            'implementation',
                                                            'phase2',
                                                            e.target.value,
                                                        )
                                                    }
                                                ></textarea>
                                            </div>
                                            <div>
                                                <InputLabel value="المرحلة الثالثة (التوسع)" />
                                                <textarea
                                                    className="w-full rounded-md border-gray-300"
                                                    rows={3}
                                                    value={
                                                        data.implementation
                                                            .phase3
                                                    }
                                                    onChange={(e) =>
                                                        updateNested(
                                                            'implementation',
                                                            'phase3',
                                                            e.target.value,
                                                        )
                                                    }
                                                ></textarea>
                                            </div>
                                        </div>
                                    )}

                                    {/* Lists */}
                                    {activeTab === 'lists' && (
                                        <div className="space-y-8">
                                            {/* Risks */}
                                            <div>
                                                <div className="mb-2 flex items-center justify-between">
                                                    <InputLabel
                                                        value="المخاطر (Risks)"
                                                        className="text-lg font-bold"
                                                    />
                                                    <SecondaryButton
                                                        onClick={() =>
                                                            addArrayItem(
                                                                'risks',
                                                            )
                                                        }
                                                    >
                                                        إضافة خطر
                                                    </SecondaryButton>
                                                </div>
                                                {data.risks.map(
                                                    (
                                                        item: string,
                                                        idx: number,
                                                    ) => (
                                                        <div
                                                            key={idx}
                                                            className="mb-2 flex gap-2"
                                                        >
                                                            <TextInput
                                                                className="w-full"
                                                                value={item}
                                                                onChange={(e) =>
                                                                    updateArrayItem(
                                                                        'risks',
                                                                        idx,
                                                                        e.target
                                                                            .value,
                                                                    )
                                                                }
                                                            />
                                                            <button
                                                                type="button"
                                                                onClick={() =>
                                                                    removeArrayItem(
                                                                        'risks',
                                                                        idx,
                                                                    )
                                                                }
                                                                className="px-2 font-bold text-red-500"
                                                            >
                                                                X
                                                            </button>
                                                        </div>
                                                    ),
                                                )}
                                            </div>

                                            {/* Recommendations */}
                                            <div>
                                                <div className="mb-2 flex items-center justify-between">
                                                    <InputLabel
                                                        value="التوصيات (Recommendations)"
                                                        className="text-lg font-bold"
                                                    />
                                                    <SecondaryButton
                                                        onClick={() =>
                                                            addArrayItem(
                                                                'recommendations',
                                                            )
                                                        }
                                                    >
                                                        إضافة توصية
                                                    </SecondaryButton>
                                                </div>
                                                {data.recommendations.map(
                                                    (
                                                        item: string,
                                                        idx: number,
                                                    ) => (
                                                        <div
                                                            key={idx}
                                                            className="mb-2 flex gap-2"
                                                        >
                                                            <TextInput
                                                                className="w-full"
                                                                value={item}
                                                                onChange={(e) =>
                                                                    updateArrayItem(
                                                                        'recommendations',
                                                                        idx,
                                                                        e.target
                                                                            .value,
                                                                    )
                                                                }
                                                            />
                                                            <button
                                                                type="button"
                                                                onClick={() =>
                                                                    removeArrayItem(
                                                                        'recommendations',
                                                                        idx,
                                                                    )
                                                                }
                                                                className="px-2 font-bold text-red-500"
                                                            >
                                                                X
                                                            </button>
                                                        </div>
                                                    ),
                                                )}
                                            </div>

                                            {/* Technical Details */}
                                            <div>
                                                <div className="mb-2 flex items-center justify-between">
                                                    <InputLabel
                                                        value="التفاصيل التقنية (Technical Details)"
                                                        className="text-lg font-bold"
                                                    />
                                                    <SecondaryButton
                                                        onClick={() =>
                                                            addArrayItem(
                                                                'technicalDetails',
                                                            )
                                                        }
                                                    >
                                                        إضافة تفصيل
                                                    </SecondaryButton>
                                                </div>
                                                {data.technicalDetails.map(
                                                    (
                                                        item: string,
                                                        idx: number,
                                                    ) => (
                                                        <div
                                                            key={idx}
                                                            className="mb-2 flex gap-2"
                                                        >
                                                            <TextInput
                                                                className="w-full"
                                                                value={item}
                                                                onChange={(e) =>
                                                                    updateArrayItem(
                                                                        'technicalDetails',
                                                                        idx,
                                                                        e.target
                                                                            .value,
                                                                    )
                                                                }
                                                            />
                                                            <button
                                                                type="button"
                                                                onClick={() =>
                                                                    removeArrayItem(
                                                                        'technicalDetails',
                                                                        idx,
                                                                    )
                                                                }
                                                                className="px-2 font-bold text-red-500"
                                                            >
                                                                X
                                                            </button>
                                                        </div>
                                                    ),
                                                )}
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Actions */}
                                <div className="mt-8 flex items-center justify-end gap-4 border-t pt-6">
                                    <Link
                                        href={route('admin.ai-studies.index')}
                                        className="text-gray-600 hover:text-gray-900"
                                    >
                                        إلغاء
                                    </Link>
                                    <PrimaryButton
                                        className="ml-4"
                                        disabled={processing}
                                    >
                                        {processing
                                            ? 'جاري الحفظ...'
                                            : 'حفظ التعديلات'}
                                    </PrimaryButton>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div >
        </AdminLayout >
    );
}
