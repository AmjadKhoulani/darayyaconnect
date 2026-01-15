import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { showToast } from '../components/Toast';
import SkeletonLoader from '../components/SkeletonLoader';
import LazyImage from '../components/LazyImage';
import { ThumbsUp, Users, Calendar, ChevronLeft, MapPin, Share2 } from 'lucide-react';

export default function InitiativeDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [project, setProject] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchProject();
    }, [id]);

    const fetchProject = async () => {
        try {
            const res = await api.get(`/portal/projects/${id}`);
            setProject(res.data);
        } catch (err) {
            console.error(err);
            showToast('فشل تحميل تفاصيل المبادرة', 'error');
            navigate('/initiatives');
        } finally {
            setLoading(false);
        }
    };

    const handleVote = async () => {
        const token = localStorage.getItem('token');
        if (!token) {
            showToast('يجب تسجيل الدخول لدعم المبادرة', 'error');
            navigate('/login');
            return;
        }

        try {
            // Optimistic Update
            setProject((prev: any) => ({
                ...prev,
                votes_count: (prev.votes_count || 0) + 1
            }));

            await api.post(`/portal/projects/${id}/vote`);
            showToast('تم تسجيل صوتك بنجاح! شكراً لمشاركتك 🎉', 'success');
        } catch (err: any) {
            // Revert on error
            setProject((prev: any) => ({
                ...prev,
                votes_count: (prev.votes_count || 0) - 1
            }));

            if (err.response?.status === 401) {
                showToast('انتهت الجلسة. يرجى تسجيل الدخول مجدداً', 'error');
                navigate('/login');
            } else if (err.response?.status === 400) {
                showToast('لقد قمت بالتصويت لهذه المبادرة مسبقاً', 'info');
            } else {
                showToast('فشل التصويت. حاول مرة أخرى', 'error');
            }
        }
    };

    if (loading) return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-900 p-4">
            <SkeletonLoader type="card" />
        </div>
    );

    if (!project) return null;

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-900 pb-24 transition-colors duration-300" dir="rtl">
            {/* Header with Image */}
            <div className="relative h-72 w-full">
                <div className="absolute top-0 left-0 w-full h-full">
                    {project.image ? (
                        <LazyImage
                            src={project.image}
                            alt={project.title}
                            className="w-full h-full object-cover"
                        />
                    ) : (
                        <div className="w-full h-full bg-gradient-to-br from-emerald-600 to-teal-800 flex items-center justify-center">
                            <span className="text-6xl">💡</span>
                        </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent"></div>
                </div>

                {/* Navbar */}
                <div className="absolute top-0 left-0 w-full p-4 flex justify-between items-center z-20">
                    <button
                        onClick={() => navigate(-1)}
                        className="w-10 h-10 bg-white/20 backdrop-blur-md rounded-xl flex items-center justify-center text-white border border-white/30 active:scale-95 transition"
                    >
                        <ChevronLeft size={24} />
                    </button>
                    <button className="w-10 h-10 bg-white/20 backdrop-blur-md rounded-xl flex items-center justify-center text-white border border-white/30 active:scale-95 transition">
                        <Share2 size={20} />
                    </button>
                </div>

                {/* Title Overlay */}
                <div className="absolute bottom-0 left-0 w-full p-6 z-20">
                    <span className={`inline-block px-3 py-1 rounded-full text-[10px] font-bold mb-3 ${project.status === 'مكتملة' ? 'bg-emerald-500 text-white' :
                            project.status === 'قيد التنفيذ' ? 'bg-blue-500 text-white' :
                                'bg-amber-500 text-white'
                        }`}>
                        {project.status || 'جاري التصويت'}
                    </span>
                    <h1 className="text-2xl font-black text-white leading-tight mb-2">
                        {project.title}
                    </h1>
                    <div className="flex items-center gap-4 text-slate-300 text-xs font-medium">
                        <div className="flex items-center gap-1">
                            <Users size={14} />
                            <span>بواسطة: {project.user?.name || 'مجهول'}</span>
                        </div>
                        <div className="flex items-center gap-1">
                            <Calendar size={14} />
                            <span>{project.created_at}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Content */}
            <main className="-mt-6 relative z-10 bg-slate-50 dark:bg-slate-900 rounded-t-3xl px-6 pt-8 space-y-8 min-h-[50vh]">

                {/* Stats */}
                <div className="flex gap-4">
                    <div className="flex-1 bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm flex items-center gap-3">
                        <div className="w-10 h-10 bg-emerald-50 dark:bg-emerald-900/30 rounded-full flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                            <ThumbsUp size={20} />
                        </div>
                        <div>
                            <p className="text-[10px] text-slate-400 font-bold">عدد الاصوات</p>
                            <p className="text-lg font-black text-slate-800 dark:text-slate-100">{project.votes_count || 0}</p>
                        </div>
                    </div>
                    <div className="flex-1 bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-50 dark:bg-blue-900/30 rounded-full flex items-center justify-center text-blue-600 dark:text-blue-400">
                            <MapPin size={20} />
                        </div>
                        <div>
                            <p className="text-[10px] text-slate-400 font-bold">موقع المبادرة</p>
                            <p className="text-xs font-bold text-slate-800 dark:text-slate-100">داريا</p>
                        </div>
                    </div>
                </div>

                {/* Description */}
                <div>
                    <h3 className="font-bold text-slate-800 dark:text-slate-100 mb-3 text-lg">تفاصيل المبادرة</h3>
                    <div className="prose prose-sm dark:prose-invert text-slate-600 dark:text-slate-300 leading-relaxed text-justify">
                        {project.description}
                    </div>
                </div>

                {/* Vote Button (Fixed Bottom) */}
                <div className="fixed bottom-0 left-0 w-full p-4 bg-white/80 dark:bg-slate-900/80 backdrop-blur-lg border-t border-slate-200 dark:border-slate-800 z-50 safe-bottom">
                    <button
                        onClick={handleVote}
                        className="w-full py-3.5 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white rounded-xl font-bold text-lg shadow-lg shadow-emerald-500/30 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
                    >
                        <ThumbsUp size={20} />
                        <span>دعم المبادرة بصوتك</span>
                    </button>
                    <p className="text-center text-[10px] text-slate-400 mt-2 font-medium">
                        صوتك يساهم في تحديد أولويات مشاريع المدينة
                    </p>
                </div>
            </main>
        </div>
    );
}
