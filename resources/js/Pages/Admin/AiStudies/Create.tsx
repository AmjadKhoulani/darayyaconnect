import AdminLayout from '@/Layouts/AdminLayout';
import { Head, useForm, Link } from '@inertiajs/react';
import TextInput from '@/Components/TextInput';
import InputLabel from '@/Components/InputLabel';
import InputError from '@/Components/InputError';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';
import { FormEventHandler, useState } from 'react';

export default function Create({ auth }: any) {
    const { data, setData, post, processing, errors } = useForm({
        title: '',
        icon: '🤖',
        category: 'بيئة',
        color: 'blue',
        gradient: 'from-blue-500 to-indigo-600',
        summary: '',
        is_published: true,
        scenario: {
            current: '',
            withProject: ''
        },
        economics: {
            investment: '',
            investmentRange: '',
            revenue: '',
            revenueRange: '',
            payback: '',
            jobs: '',
            jobsBreakdown: '',
            costBreakdown: [{ item: '', cost: '' }]
        },
        environmental: {
            wasteReduction: '',
            emissions: '',
            waterSaved: '',
            energySaved: ''
        },
        social: {
            beneficiaries: '',
            impact: ''
        },
        implementation: {
            phase1: '',
            phase2: '',
            phase3: ''
        },
        risks: [''],
        recommendations: [''],
        technicalDetails: ['']
    });

    const [activeTab, setActiveTab] = useState('basic');

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('admin.ai-studies.store'));
    };

    // Helper to handle nested object updates
    const updateNested = (section: string, field: string, value: string) => {
        setData(section as any, {
            ...data[section as keyof typeof data] as any,
            [field]: value
        });
    };

    // Helper to handle dynamic arrays (Strings)
    const updateArrayItem = (field: 'risks' | 'recommendations' | 'technicalDetails', index: number, value: string) => {
        const newArray = [...data[field]];
        newArray[index] = value;
        setData(field, newArray);
    };

    const addArrayItem = (field: 'risks' | 'recommendations' | 'technicalDetails') => {
        setData(field, [...data[field], '']);
    };

    const removeArrayItem = (field: 'risks' | 'recommendations' | 'technicalDetails', index: number) => {
        const newArray = [...data[field]];
        newArray.splice(index, 1);
        setData(field, newArray);
    };

    // Helper to handle cost breakdown (Objects)
    const updateCostItem = (index: number, field: 'item' | 'cost', value: string) => {
        const newBreakdown = [...data.economics.costBreakdown];
        newBreakdown[index] = { ...newBreakdown[index], [field]: value };
        setData('economics', { ...data.economics, costBreakdown: newBreakdown });
    };

    const addCostItem = () => {
        setData('economics', {
            ...data.economics,
            costBreakdown: [...data.economics.costBreakdown, { item: '', cost: '' }]
        });
    };

    const removeCostItem = (index: number) => {
        const newBreakdown = [...data.economics.costBreakdown];
        newBreakdown.splice(index, 1);
        setData('economics', { ...data.economics, costBreakdown: newBreakdown });
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
            <Head title="إضافة دراسة جديدة" />

            <div className="py-12" dir="rtl">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-2xl font-bold">إضافة دراسة جديدة</h2>
                                <Link
                                    href={route('admin.ai-studies.index')}
                                    className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
                                >
                                    إلغاء
                                </Link>
                            </div>

                            <form onSubmit={submit}>
                                {/* Tabs Header */}
                                <div className="flex border-b border-gray-200 mb-6 overflow-x-auto">
                                    {tabs.map(tab => (
                                        <button
                                            key={tab.id}
                                            type="button"
                                            onClick={() => setActiveTab(tab.id)}
                                            className={`px-6 py-3 font-medium text-sm whitespace-nowrap transition-colors border-b-2 ${activeTab === tab.id
                                                ? 'border-indigo-600 text-indigo-600'
                                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
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
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div>
                                                <InputLabel htmlFor="title" value="عنوان الدراسة" />
                                                <TextInput
                                                    id="title"
                                                    className="mt-1 block w-full"
                                                    value={data.title}
                                                    onChange={(e) => setData('title', e.target.value)}
                                                    required
                                                />
                                                <InputError message={errors.title} className="mt-2" />
                                            </div>

                                            <div>
                                                <InputLabel htmlFor="category" value="التصنيف" />
                                                <TextInput
                                                    id="category"
                                                    className="mt-1 block w-full"
                                                    value={data.category}
                                                    onChange={(e) => setData('category', e.target.value)}
                                                    placeholder="مثال: بيئة، طاقة، تعليم"
                                                />
                                            </div>

                                            <div>
                                                <InputLabel htmlFor="icon" value="الأيقونة (Emoji)" />
                                                <TextInput
                                                    id="icon"
                                                    className="mt-1 block w-full text-center text-2xl"
                                                    value={data.icon}
                                                    onChange={(e) => setData('icon', e.target.value)}
                                                />
                                            </div>

                                            <div>
                                                <InputLabel htmlFor="color" value="اللون الأساسي" />
                                                <select
                                                    id="color"
                                                    className="mt-1 block w-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm"
                                                    value={data.color}
                                                    onChange={(e) => setData('color', e.target.value)}
                                                >
                                                    <option value="blue">Blue</option>
                                                    <option value="green">Green</option>
                                                    <option value="amber">Amber</option>
                                                    <option value="red">Red</option>
                                                    <option value="indigo">Indigo</option>
                                                    <option value="purple">Purple</option>
                                                    <option value="cyan">Cyan</option>
                                                </select>
                                            </div>

                                            <div>
                                                <InputLabel htmlFor="gradient" value="تدرج الألوان (Tailwind Classes)" />
                                                <TextInput
                                                    id="gradient"
                                                    className="mt-1 block w-full"
                                                    value={data.gradient}
                                                    onChange={(e) => setData('gradient', e.target.value)}
                                                    placeholder="from-blue-500 to-indigo-600"
                                                />
                                            </div>

                                            <div className="md:col-span-2">
                                                <InputLabel htmlFor="summary" value="ملخص الدراسة" />
                                                <textarea
                                                    id="summary"
                                                    className="mt-1 block w-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm"
                                                    rows={3}
                                                    value={data.summary}
                                                    onChange={(e) => setData('summary', e.target.value)}
                                                ></textarea>
                                            </div>
                                        </div>
                                    )}

                                    {/* Scenario */}
                                    {activeTab === 'scenario' && (
                                        <div className="space-y-6">
                                            <div>
                                                <InputLabel htmlFor="scenario_current" value="الوضع الحالي (المشكلة)" />
                                                <textarea
                                                    id="scenario_current"
                                                    className="mt-1 block w-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm"
                                                    rows={4}
                                                    value={data.scenario.current}
                                                    onChange={(e) => updateNested('scenario', 'current', e.target.value)}
                                                ></textarea>
                                            </div>
                                            <div>
                                                <InputLabel htmlFor="scenario_withProject" value="مع المشروع (الحل)" />
                                                <textarea
                                                    id="scenario_withProject"
                                                    className="mt-1 block w-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm"
                                                    rows={4}
                                                    value={data.scenario.withProject}
                                                    onChange={(e) => updateNested('scenario', 'withProject', e.target.value)}
                                                ></textarea>
                                            </div>
                                        </div>
                                    )}

                                    {/* Economics */}
                                    {activeTab === 'economics' && (
                                        <div className="space-y-6">
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                <div>
                                                    <InputLabel value="قيمة الاستثمار" />
                                                    <TextInput className="w-full" value={data.economics.investment} onChange={e => updateNested('economics', 'investment', e.target.value)} />
                                                </div>
                                                <div>
                                                    <InputLabel value="نطاق الاستثمار (شرح)" />
                                                    <TextInput className="w-full" value={data.economics.investmentRange} onChange={e => updateNested('economics', 'investmentRange', e.target.value)} />
                                                </div>
                                                <div>
                                                    <InputLabel value="العائد المتوقع" />
                                                    <TextInput className="w-full" value={data.economics.revenue} onChange={e => updateNested('economics', 'revenue', e.target.value)} />
                                                </div>
                                                <div>
                                                    <InputLabel value="نطاق العائد (شرح)" />
                                                    <TextInput className="w-full" value={data.economics.revenueRange} onChange={e => updateNested('economics', 'revenueRange', e.target.value)} />
                                                </div>
                                                <div>
                                                    <InputLabel value="فترة الاسترداد" />
                                                    <TextInput className="w-full" value={data.economics.payback} onChange={e => updateNested('economics', 'payback', e.target.value)} />
                                                </div>
                                                <div>
                                                    <InputLabel value="فرص العمل" />
                                                    <TextInput className="w-full" value={data.economics.jobs} onChange={e => updateNested('economics', 'jobs', e.target.value)} />
                                                </div>
                                            </div>

                                            <div className="border-t pt-4">
                                                <InputLabel value="تفصيل التكاليف (Cost Breakdown)" className="mb-2 text-lg font-bold" />
                                                {data.economics.costBreakdown.map((item, idx) => (
                                                    <div key={idx} className="flex gap-4 mb-2">
                                                        <TextInput placeholder="البند" className="flex-1" value={item.item} onChange={e => updateCostItem(idx, 'item', e.target.value)} />
                                                        <TextInput placeholder="التكلفة" className="w-1/3" value={item.cost} onChange={e => updateCostItem(idx, 'cost', e.target.value)} />
                                                        <SecondaryButton onClick={() => removeCostItem(idx)} className="bg-red-50 text-red-600 hover:bg-red-100">حذف</SecondaryButton>
                                                    </div>
                                                ))}
                                                <SecondaryButton onClick={addCostItem} className="mt-2">إضافة بند تكلفة</SecondaryButton>
                                            </div>
                                        </div>
                                    )}

                                    {/* Impact */}
                                    {activeTab === 'impact' && (
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                            <div className="space-y-4">
                                                <h3 className="font-bold text-lg border-b pb-2">الأثر البيئي</h3>
                                                <div><InputLabel value="تقليل النفايات" /> <TextInput className="w-full" value={data.environmental.wasteReduction} onChange={e => updateNested('environmental', 'wasteReduction', e.target.value)} /></div>
                                                <div><InputLabel value="الانبعاثات" /> <TextInput className="w-full" value={data.environmental.emissions} onChange={e => updateNested('environmental', 'emissions', e.target.value)} /></div>
                                                <div><InputLabel value="توفير المياه" /> <TextInput className="w-full" value={data.environmental.waterSaved} onChange={e => updateNested('environmental', 'waterSaved', e.target.value)} /></div>
                                                <div><InputLabel value="توفير الطاقة" /> <TextInput className="w-full" value={data.environmental.energySaved} onChange={e => updateNested('environmental', 'energySaved', e.target.value)} /></div>
                                            </div>
                                            <div className="space-y-4">
                                                <h3 className="font-bold text-lg border-b pb-2">الأثر الاجتماعي</h3>
                                                <div><InputLabel value="المستفيدون" /> <TextInput className="w-full" value={data.social.beneficiaries} onChange={e => updateNested('social', 'beneficiaries', e.target.value)} /></div>
                                                <div>
                                                    <InputLabel value="التأثير الاجتماعي" />
                                                    <textarea className="w-full border-gray-300 rounded-md" rows={4} value={data.social.impact} onChange={e => updateNested('social', 'impact', e.target.value)}></textarea>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {/* Implementation */}
                                    {activeTab === 'implementation' && (
                                        <div className="space-y-6">
                                            <div>
                                                <InputLabel value="المرحلة الأولى (التحضيرات)" />
                                                <textarea className="w-full border-gray-300 rounded-md" rows={3} value={data.implementation.phase1} onChange={e => updateNested('implementation', 'phase1', e.target.value)}></textarea>
                                            </div>
                                            <div>
                                                <InputLabel value="المرحلة الثانية (التنفيذ)" />
                                                <textarea className="w-full border-gray-300 rounded-md" rows={3} value={data.implementation.phase2} onChange={e => updateNested('implementation', 'phase2', e.target.value)}></textarea>
                                            </div>
                                            <div>
                                                <InputLabel value="المرحلة الثالثة (التوسع)" />
                                                <textarea className="w-full border-gray-300 rounded-md" rows={3} value={data.implementation.phase3} onChange={e => updateNested('implementation', 'phase3', e.target.value)}></textarea>
                                            </div>
                                        </div>
                                    )}

                                    {/* Lists */}
                                    {activeTab === 'lists' && (
                                        <div className="space-y-8">
                                            {/* Risks */}
                                            <div>
                                                <div className="flex justify-between items-center mb-2">
                                                    <InputLabel value="المخاطر (Risks)" className="text-lg font-bold" />
                                                    <SecondaryButton onClick={() => addArrayItem('risks')}>إضافة خطر</SecondaryButton>
                                                </div>
                                                {data.risks.map((item, idx) => (
                                                    <div key={idx} className="flex gap-2 mb-2">
                                                        <TextInput className="w-full" value={item} onChange={e => updateArrayItem('risks', idx, e.target.value)} />
                                                        <button type="button" onClick={() => removeArrayItem('risks', idx)} className="text-red-500 font-bold px-2">X</button>
                                                    </div>
                                                ))}
                                            </div>

                                            {/* Recommendations */}
                                            <div>
                                                <div className="flex justify-between items-center mb-2">
                                                    <InputLabel value="التوصيات (Recommendations)" className="text-lg font-bold" />
                                                    <SecondaryButton onClick={() => addArrayItem('recommendations')}>إضافة توصية</SecondaryButton>
                                                </div>
                                                {data.recommendations.map((item, idx) => (
                                                    <div key={idx} className="flex gap-2 mb-2">
                                                        <TextInput className="w-full" value={item} onChange={e => updateArrayItem('recommendations', idx, e.target.value)} />
                                                        <button type="button" onClick={() => removeArrayItem('recommendations', idx)} className="text-red-500 font-bold px-2">X</button>
                                                    </div>
                                                ))}
                                            </div>

                                            {/* Technical Details */}
                                            <div>
                                                <div className="flex justify-between items-center mb-2">
                                                    <InputLabel value="التفاصيل التقنية (Technical Details)" className="text-lg font-bold" />
                                                    <SecondaryButton onClick={() => addArrayItem('technicalDetails')}>إضافة تفصيل</SecondaryButton>
                                                </div>
                                                {data.technicalDetails.map((item, idx) => (
                                                    <div key={idx} className="flex gap-2 mb-2">
                                                        <TextInput className="w-full" value={item} onChange={e => updateArrayItem('technicalDetails', idx, e.target.value)} />
                                                        <button type="button" onClick={() => removeArrayItem('technicalDetails', idx)} className="text-red-500 font-bold px-2">X</button>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                </div>

                                {/* Actions */}
                                <div className="flex items-center justify-end mt-8 border-t pt-6 gap-4">
                                    <Link href={route('admin.ai-studies.index')} className="text-gray-600 hover:text-gray-900">
                                        إلغاء
                                    </Link>
                                    <PrimaryButton className="ml-4" disabled={processing}>
                                        {processing ? 'جاري الحفظ...' : 'حفظ الدراسة'}
                                    </PrimaryButton>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
