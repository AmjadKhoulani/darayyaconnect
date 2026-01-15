
import { AlertTriangle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function ActionBanner() {
    const navigate = useNavigate();

    return (
        <button
            onClick={() => navigate('/add-report')}
            className="w-full bg-white dark:bg-slate-800 rounded-[28px] border border-slate-200/60 dark:border-slate-700 p-5 shadow-premium flex gap-4 items-center hover:border-emerald-200 dark:hover:border-emerald-700 hover:bg-emerald-50/10 active:scale-[0.98] transition-all group"
        >
            <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-emerald-500/30">
                <AlertTriangle size={24} />
            </div>
            <div className="flex-1 text-right">
                <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100 mb-0.5">هل من مشكلة تود الإبلاغ عنها؟</h4>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">اضغط هنا لإرسال بلاغ أو صورة</p>
            </div>
            <div className="w-8 h-8 rounded-full bg-slate-50 dark:bg-slate-700 flex items-center justify-center text-slate-300 dark:text-slate-500 group-hover:bg-emerald-100 dark:group-hover:bg-emerald-600 group-hover:text-emerald-600 dark:group-hover:text-emerald-100 transition-colors">
                <span className="text-lg">👈</span>
            </div>
        </button>
    );
}
