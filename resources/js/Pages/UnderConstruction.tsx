import { Head, Link } from '@inertiajs/react';
import PortalLayout from '@/Layouts/PortalLayout';

interface Props {
    title: string;
    description?: string;
    icon?: string;
    auth: any;
}

export default function UnderConstruction({ title, description, icon = '🚧', auth }: Props) {
    return (
        <PortalLayout auth={auth} header={null}>
            <Head title={title} />

            <div className="min-h-[60vh] flex flex-col items-center justify-center p-8 text-center" dir="rtl">
                <div className="mb-6 text-8xl animate-bounce">
                    {icon}
                </div>

                <h1 className="mb-4 text-4xl font-black text-slate-800">
                    {title}
                </h1>

                <p className="max-w-md text-lg text-slate-600 mb-8 leading-relaxed">
                    {description || 'نعمل حالياً على بناء هذه الصفحة لتوفير تجربة مميزة لكم. قريباً جداً ستكون متاحة!'}
                </p>

                <div className="flex gap-4">
                    <Link
                        href="/"
                        className="px-6 py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition shadow-lg hover:shadow-indigo-200"
                    >
                        العودة للرئيسية
                    </Link>
                </div>
            </div>
        </PortalLayout>
    );
}
