import CommunityForum from '@/Components/CommunityForum';
import LocalDirectory from '@/Components/LocalDirectory';
import PortalLayout from '@/Layouts/PortalLayout';
import { Head } from '@inertiajs/react';

export default function Community({ auth }: { auth: any }) {
    return (
        <PortalLayout
            auth={auth}
            header={
                <h2 className="text-2xl font-black text-slate-800">
                    🗣️ النقاشات المجتمعية
                </h2>
            }
        >
            <Head title="النقاشات" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                        {/* Main Content: Forum */}
                        <div className="space-y-6 lg:col-span-2">
                            <CommunityForum />
                        </div>

                        {/* Sidebar: Directory & Info */}
                        <div className="space-y-6">
                            {/* Stats Card or Announcement could go here */}
                            <div className="rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 p-6 px-10 text-white shadow-lg">
                                <h3 className="mb-2 text-lg font-bold">
                                    👋 أهلاً بك في مجتمعنا!
                                </h3>
                                <p className="text-sm leading-relaxed text-emerald-50">
                                    هذه المساحة مخصصة لأهالي داريا لتبادل
                                    الآراء، طرح المشكلات، والوصول للخدمات
                                    المحلية. صوتك مسموع ومشاركتك تصنع الفرق.
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
