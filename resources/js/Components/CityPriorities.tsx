import { useState, useEffect } from 'react';
import axios from 'axios';

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
        axios.get('/api/portal/projects')
            .then(res => setProjects(res.data))
            .catch(e => console.error("Failed to fetch projects", e));
    }, []);

    const handleVote = (id: number) => {
        axios.post(`/api/portal/projects/${id}/vote`)
            .then(res => {
                // Optimistic update
                setProjects(projects.map(p => p.id === id ? { ...p, votes_count: res.data.votes } : p));
            })
            .catch(e => {
                console.error("Failed to vote", e);
                alert("يرجى تسجيل الدخول للتصويت");
            });
    };

    return (
        <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-5 mt-6">
            <h3 className="font-bold text-slate-800 text-lg flex items-center gap-2 mb-4">
                <span>🏗️</span> أولويات المدينة
            </h3>
            <p className="text-sm text-slate-500 mb-6">مشاريع نعمل عليها، صوت للمشروع الأهم برأيك.</p>

            <div className="space-y-6">
                {projects.map((project) => (
                    <div key={project.id} className="relative">
                        <div className="flex justify-between items-start mb-2">
                            <div>
                                <h4 className="font-bold text-slate-900">{project.title}</h4>
                                <p className="text-xs text-slate-500 mt-1">{project.description}</p>
                            </div>
                            <span className={`px-2 py-1 rounded text-[10px] font-bold ${project.status === 'in_progress' ? 'bg-amber-100 text-amber-700' :
                                project.status === 'completed' ? 'bg-emerald-100 text-emerald-700' :
                                    'bg-slate-100 text-slate-600'
                                }`}>
                                {project.status === 'in_progress' ? 'قيد التنفيذ' :
                                    project.status === 'completed' ? 'مكتمل' : 'مخطط'}
                            </span>
                        </div>

                        {/* Progress Bar */}
                        <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden mb-3">
                            <div
                                className={`h-full rounded-full ${project.status === 'in_progress' ? 'bg-amber-500' : 'bg-slate-300'
                                    }`}
                                style={{ width: `${project.progress}%` }}
                            ></div>
                        </div>

                        <div className="flex justify-between items-center text-xs">
                            <span className="text-slate-400">الإنجاز: {project.progress}%</span>
                            <button
                                onClick={() => handleVote(project.id)}
                                className="flex items-center gap-1 bg-emerald-50 text-emerald-600 px-3 py-1 rounded-full font-bold hover:bg-emerald-100 transition"
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
