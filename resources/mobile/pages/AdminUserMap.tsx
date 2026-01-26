import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Users, Crosshair, RefreshCw } from 'lucide-react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import api from '../services/api';

export default function AdminUserMap() {
    const navigate = useNavigate();
    const mapContainer = useRef<HTMLDivElement>(null);
    const map = useRef<maplibregl.Map | null>(null);
    const markersRef = useRef<maplibregl.Marker[]>([]);
    const [users, setUsers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [lastUpdate, setLastUpdate] = useState<Date>(new Date());

    useEffect(() => {
        if (map.current) return;
        if (!mapContainer.current) return;

        map.current = new maplibregl.Map({
            container: mapContainer.current,
            style: {
                version: 8,
                sources: {
                    'osm': {
                        type: 'raster',
                        tiles: ['https://tile.openstreetmap.org/{z}/{x}/{y}.png'],
                        tileSize: 256,
                        attribution: '&copy; OpenStreetMap'
                    }
                },
                layers: [{ id: 'osm', type: 'raster', source: 'osm' }]
            },
            center: [36.236, 33.456],
            zoom: 14
        });

        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const res = await api.get('/admin/users/locations');
            setUsers(res.data);
            setLastUpdate(new Date());
            updateMarkers(res.data);
        } catch (err) {
            console.error("Failed to fetch users", err);
        } finally {
            setLoading(false);
        }
    };

    // Poll every 10 seconds
    useEffect(() => {
        const interval = setInterval(fetchUsers, 10000);
        return () => clearInterval(interval);
    }, []);

    const updateMarkers = (activeUsers: any[]) => {
        if (!map.current) return;

        // Clean existing
        markersRef.current.forEach(m => m.remove());
        markersRef.current = [];

        activeUsers.forEach(user => {
            const el = document.createElement('div');
            el.className = 'flex flex-col items-center justify-center cursor-pointer';

            // Pulse animation for very recent activity (last 2 mins)
            const lastActive = new Date(user.last_active_at).getTime();
            const now = new Date().getTime();
            const isRecent = (now - lastActive) < 2 * 60 * 1000;

            el.innerHTML = `
                <div class="relative group">
                    <div class="w-8 h-8 rounded-full border-2 border-white shadow-lg overflow-hidden ${isRecent ? 'ring-2 ring-emerald-500 ring-offset-1' : 'bg-slate-200'}">
                        ${user.profile_photo_url ?
                    `<img src="${user.profile_photo_url}" class="w-full h-full object-cover" />` :
                    `<div class="w-full h-full bg-indigo-600 flex items-center justify-center text-white font-bold text-xs">${user.name.charAt(0)}</div>`
                }
                    </div>
                    ${isRecent ? '<div class="absolute -top-1 -right-1 w-3 h-3 bg-emerald-500 rounded-full border border-white animate-pulse"></div>' : ''}
            <div class="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 bg-slate-900/90 text-white text-[10px] px-2 py-1 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                ${user.name} <br /> <span class="text-slate-400">منذ ${Math.round((now - lastActive) / 60000)} دقيقة</span>
            </div>
                </div >
        `;

            el.onclick = () => {
                map.current?.flyTo({ center: [user.longitude, user.latitude], zoom: 17 });
            };

            const marker = new maplibregl.Marker({ element: el })
                .setLngLat([user.longitude, user.latitude])
                .addTo(map.current!);

            markersRef.current.push(marker);
        });
    };

    return (
        <div className="flex flex-col h-screen bg-slate-100 dark:bg-slate-900" dir="rtl">
            {/* Header */}
            <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-md p-4 flex justify-between items-center shadow-sm z-10">
                <div className="flex items-center gap-3">
                    <button onClick={() => navigate(-1)} className="w-10 h-10 bg-slate-50 dark:bg-slate-800 rounded-xl flex items-center justify-center active:scale-95 transition-transform">
                        <ArrowRight size={20} className="text-slate-600 dark:text-slate-400" />
                    </button>
                    <div>
                        <h1 className="font-bold text-slate-800 dark:text-slate-100 text-lg">التتبع المباشر</h1>
                        <p className="text-[10px] text-emerald-600 font-bold flex items-center gap-1">
                            <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
                            {users.length} مستخدم نشط
                        </p>
                    </div>
                </div>
                <button onClick={fetchUsers} className="p-2 bg-slate-100 dark:bg-slate-800 rounded-lg text-slate-500 hover:text-indigo-600 active:rotate-180 transition-all">
                    <RefreshCw size={18} />
                </button>
            </div>

            {/* Map */}
            <div className="flex-1 relative">
                <div ref={mapContainer} className="absolute inset-0 z-0 bg-slate-200" />

                {/* Floating User List */}
                <div className="absolute bottom-6 left-4 right-4 z-10 pointer-events-none flex justify-center">
                    <div className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-md p-2 rounded-2xl shadow-xl border border-slate-100 dark:border-slate-700 pointer-events-auto max-w-full overflow-x-auto flex gap-2">
                        {users.map(user => (
                            <button
                                key={user.id}
                                onClick={() => map.current?.flyTo({ center: [user.longitude, user.latitude], zoom: 16 })}
                                className="flex items-center gap-2 bg-slate-50 dark:bg-slate-700/50 px-3 py-2 rounded-xl border border-slate-100 dark:border-slate-600 active:scale-95 transition-transform min-w-max"
                            >
                                <div className="w-6 h-6 bg-indigo-100 dark:bg-indigo-900/50 rounded-full flex items-center justify-center text-xs font-bold text-indigo-700 dark:text-indigo-400">
                                    {user.name.charAt(0)}
                                </div>
                                <span className="text-xs font-bold text-slate-700 dark:text-slate-200">{user.name}</span>
                            </button>
                        ))}
                        {users.length === 0 && (
                            <div className="px-4 py-2 text-xs text-slate-400 italic">لا يوجد مستخدمين نشطين حالياً</div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
