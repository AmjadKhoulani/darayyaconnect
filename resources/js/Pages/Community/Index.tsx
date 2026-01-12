import PortalLayout from '@/Layouts/PortalLayout';
import { Head } from '@inertiajs/react';
import CommunityForum from '@/Components/CommunityForum';
import LocalDirectory from '@/Components/LocalDirectory';

export default function Community({ auth }: { auth: any }) {
    return (
        <PortalLayout
            auth={auth}
            header={<h2 className="font-black text-2xl text-slate-800">🗣️ النقاشات المجتمعية</h2>}
        >
            <Head title="النقاشات" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Main Content: Forum */}
                        <div className="lg:col-span-2 space-y-6">
                            <CommunityForum />
                        </div>

                        {/* Sidebar: Directory & Info */}
                        <div className="space-y-6">
                            {/* Stats Card or Announcement could go here */}
                            <div className="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl p-6 px-10 text-white shadow-lg">
                                <h3 className="font-bold text-lg mb-2">👋 أهلاً بك في مجتمعنا!</h3>
                                <p className="text-emerald-50 text-sm leading-relaxed">
                                    هذه المساحة مخصصة لأهالي داريا لتبادل الآراء، طرح المشكلات، والوصول للخدمات المحلية.
                                    صوتك مسموع ومشاركتك تصنع الفرق.
                                </p>
                            </div>

                            <LocalDirectory />
                        </div>
                    </div>
                </div>
            </div>
        </PortalLayout>
    );
}
