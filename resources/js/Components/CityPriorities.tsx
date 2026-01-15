import axios from 'axios';
import { useEffect, useState } from 'react';

interface Project {
    id: number;
    title: string;
    description: string;
    status: 'planned' | 'in_progress' | 'completed';
    progress: number;
    votes_count: number;
}

export default function CityPriorities() {
    const [projects, setProjects] = useState<Project[]>([]);

    useEffect(() => {
        axios
            .get('/api/portal/projects')
            .then((res) => setProjects(res.data))
            .catch((e) => console.error('Failed to fetch projects', e));
    }, []);

    const handleVote = (id: number) => {
        axios
            .post(`/api/portal/projects/${id}/vote`)
            .then((res) => {
                // Optimistic update
                setProjects(
                    projects.map((p) =>
                        p.id === id ? { ...p, votes_count: res.data.votes } : p,
                    ),
                );
            })
            .catch((e) => {
                console.error('Failed to vote', e);
                alert('يرجى تسجيل الدخول للتصويت');
            });
    };

    return (
        <div className="mt-6 rounded-xl border border-slate-100 bg-white p-5 shadow-sm">
            <h3 className="mb-4 flex items-center gap-2 text-lg font-bold text-slate-800">
                <span>🏗️</span> أولويات المدينة
            </h3>
            <p className="mb-6 text-sm text-slate-500">
                مشاريع نعمل عليها، صوت للمشروع الأهم برأيك.
            </p>

            <div className="space-y-6">
                {projects.map((project) => (
                    <div key={project.id} className="relative">
                        <div className="mb-2 flex items-start justify-between">
                            <div>
                                <h4 className="font-bold text-slate-900">
                                    {project.title}
                                </h4>
                                <p className="mt-1 text-xs text-slate-500">
                                    {project.description}
                                </p>
                            </div>
                            <span
                                className={`rounded px-2 py-1 text-[10px] font-bold ${
                                    project.status === 'in_progress'
                                        ? 'bg-amber-100 text-amber-700'
                                        : project.status === 'completed'
                                          ? 'bg-emerald-100 text-emerald-700'
                                          : 'bg-slate-100 text-slate-600'
                                }`}
                            >
                                {project.status === 'in_progress'
                                    ? 'قيد التنفيذ'
                                    : project.status === 'completed'
                                      ? 'مكتمل'
                                      : 'مخطط'}
                            </span>
                        </div>

                        {/* Progress Bar */}
                        <div className="mb-3 h-2 w-full overflow-hidden rounded-full bg-slate-100">
                            <div
                                className={`h-full rounded-full ${
                                    project.status === 'in_progress'
                                        ? 'bg-amber-500'
                                        : 'bg-slate-300'
                                }`}
                                style={{ width: `${project.progress}%` }}
                            ></div>
                        </div>

                        <div className="flex items-center justify-between text-xs">
                            <span className="text-slate-400">
                                الإنجاز: {project.progress}%
                            </span>
                            <button
                                onClick={() => handleVote(project.id)}
                                className="flex items-center gap-1 rounded-full bg-emerald-50 px-3 py-1 font-bold text-emerald-600 transition hover:bg-emerald-100"
                            >
                                <span>👍</span> {project.votes_count} صوت
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
