import PortalLayout from '@/Layouts/PortalLayout';
import { Head, Link } from '@inertiajs/react';
import { useEffect, useRef, useState } from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import {
    Layers,
    Zap,
    Droplets,
    Activity,
    Info,
    Map as MapIcon,
    Eye,
    EyeOff,
    Wifi,
    Phone,
    Wind,
    ShieldAlert
} from 'lucide-react';

interface Point {
    id: number;
    name: string;
    type: string;
    latitude: number;
    longitude: number;
    status: string;
    details?: string;
}

export default function InfrastructureIndex({ auth, points }: any) {
    const mapContainer = useRef<HTMLDivElement>(null);
    const map = useRef<maplibregl.Map | null>(null);
    const [selectedAsset, setSelectedAsset] = useState<any>(null);
    const [activeLayers, setActiveLayers] = useState<string[]>(['points', 'crowd-status']);
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    useEffect(() => {
        if (!mapContainer.current) return;

        // Initialize Map
        map.current = new maplibregl.Map({
            container: mapContainer.current,
            style: 'https://basemaps.cartocdn.com/gl/positron-gl-style/style.json',
            center: [36.2366, 33.4593],
            zoom: 14,
            maxZoom: 18,
            minZoom: 12
        });

        map.current.addControl(new maplibregl.NavigationControl(), 'bottom-right');

        map.current.on('load', () => {
            if (!map.current) return;

            // 1. Add Infrastructure Networks (Lines)
            const networks = ['water', 'electricity', 'sewage', 'phone'];
            const colors: Record<string, string> = {
                water: '#3b82f6',
                electricity: '#f59e0b',
                sewage: '#78350f',
                phone: '#10b981'
            };

            fetch('/api/infrastructure')
                .then(res => res.json())
                .then(data => {
                    if (!map.current) return;

                    networks.forEach(type => {
                        const lines = data.lines.filter((l: any) => l.type === type);
                        const pointsData = data.nodes.filter((n: any) => {
                            if (type === 'sewage' && n.type === 'manhole') return true;
                            if (type === 'electricity' && (n.type === 'transformer' || n.type === 'pole')) return true;
                            if (type === 'water' && n.type === 'pump') return true;
                            return false;
                        });

                        const lineGeoJson: GeoJSON.FeatureCollection = {
                            type: 'FeatureCollection',
                            features: lines.map((l: any) => ({
                                type: 'Feature',
                                geometry: { type: 'LineString', coordinates: l.coordinates },
                                properties: { id: l.id, type: l.type, category: 'network' }
                            }))
                        };

                        map.current!.addSource(`infra-${type}-source`, { type: 'geojson', data: lineGeoJson });
                        map.current!.addLayer({
                            id: `infra-${type}-layer`,
                            type: 'line',
                            source: `infra-${type}-source`,
                            layout: {
                                'line-join': 'round',
                                'line-cap': 'round',
                                'visibility': activeLayers.includes(type) ? 'visible' : 'none'
                            },
                            paint: {
                                'line-color': colors[type],
                                'line-width': 3,
                                'line-opacity': 0.7
                            }
                        });
                    });
                });

            // 2. Crowdsourced Status Layer (Heatmap/Zones)
            fetch('/api/infrastructure/status-heatmap?type=electricity')
                .then(res => res.json())
                .then(geoJson => {
                    if (!map.current) return;
                    map.current.addSource('status-zones-source', { type: 'geojson', data: geoJson });
                    map.current.addLayer({
                        id: 'status-zones-fill',
                        type: 'fill',
                        source: 'status-zones-source',
                        layout: { visibility: activeLayers.includes('crowd-status') ? 'visible' : 'none' },
                        paint: {
                            'fill-color': [
                                'match',
                                ['get', 'status'],
                                'available', '#10b981',
                                'unstable', '#f59e0b',
                                'cutoff', '#ef4444',
                                '#94a3b8'
                            ],
                            'fill-opacity': 0.2
                        }
                    });
                });

            // 3. Points of Interest (Markers/Icons)
            points.forEach((point: Point) => {
                const el = document.createElement('div');
                el.className = 'marker-icon';
                el.innerHTML = `<div class="bg-white p-1 rounded-full shadow-md border-2 border-emerald-500 cursor-pointer hover:scale-110 transition-transform">${getEmojiForType(point.type)}</div>`;

                const marker = new maplibregl.Marker({ element: el })
                    .setLngLat([point.longitude, point.latitude])
                    .addTo(map.current!);

                el.addEventListener('click', () => {
                    setSelectedAsset(point);
                    setIsSidebarOpen(true);
                });
            });
        });

        return () => map.current?.remove();
    }, []);

    // Effect to sync layer visibility
    useEffect(() => {
        if (!map.current) return;

        ['water', 'electricity', 'sewage', 'phone'].forEach(layer => {
            if (map.current!.getLayer(`infra-${layer}-layer`)) {
                map.current!.setLayoutProperty(
                    `infra-${layer}-layer`,
                    'visibility',
                    activeLayers.includes(layer) ? 'visible' : 'none'
                );
            }
        });

        if (map.current!.getLayer('status-zones-fill')) {
            map.current!.setLayoutProperty(
                'status-zones-fill',
                'visibility',
                activeLayers.includes('crowd-status') ? 'visible' : 'none'
            );
        }
    }, [activeLayers]);

    const toggleLayer = (layer: string) => {
        setActiveLayers(prev =>
            prev.includes(layer) ? prev.filter(l => l !== layer) : [...prev, layer]
        );
    };

    const getEmojiForType = (type: string) => {
        const map: Record<string, string> = {
            water_well: '💧',
            transformer: '⚡',
            school: '🎓',
            health_center: '🏥',
            park: '🌳',
            government: '🏛️'
        };
        return map[type] || '📍';
    };

    return (
        <PortalLayout auth={auth}>
            <Head title="خريطة المدينة الذكية" />

            <div className="relative w-full h-[85vh] bg-slate-50 overflow-hidden flex" dir="rtl">

                {/* 1. Left Sidebar (Asset Info & Layers) */}
                <div className={`absolute right-4 top-4 bottom-4 z-20 w-80 transition-transform duration-300 transform ${isSidebarOpen ? 'translate-x-0' : 'translate-x-[calc(100%+16px)]'}`}>
                    <div className="h-full bg-white/95 backdrop-blur-xl border border-slate-200 rounded-2xl shadow-2xl flex flex-col overflow-hidden">

                        {/* Header */}
                        <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
                            <h3 className="font-black text-slate-800 flex items-center gap-2">
                                <MapIcon className="text-emerald-500" size={20} />
                                مستكشف المدينة
                            </h3>
                            <button onClick={() => setIsSidebarOpen(false)} className="p-1 hover:bg-slate-200 rounded-lg transition">
                                <EyeOff size={18} className="text-slate-400" />
                            </button>
                        </div>

                        {/* Scrollable Content */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-6 custom-scrollbar">

                            {/* Selected Asset Info */}
                            {selectedAsset ? (
                                <div className="animate-in fade-in slide-in-from-top-2 duration-300">
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center text-2xl shadow-inner">
                                            {getEmojiForType(selectedAsset.type)}
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-slate-900 leading-tight">{selectedAsset.name}</h4>
                                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter bg-slate-100 px-1.5 py-0.5 rounded uppercase">
                                                ID: asset-{selectedAsset.id}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-2 mb-4">
                                        <div className="bg-slate-50 p-2 rounded-lg border border-slate-100">
                                            <div className="text-[10px] text-slate-400 font-bold mb-1 uppercase">حالة التشغيل</div>
                                            <span className={`text-xs font-bold ${selectedAsset.status === 'active' ? 'text-emerald-600' : 'text-rose-600'}`}>
                                                {selectedAsset.status === 'active' ? '● يعمل بكفاءة' : '● متوقف للصيانة'}
                                            </span>
                                        </div>
                                        <div className="bg-slate-50 p-2 rounded-lg border border-slate-100">
                                            <div className="text-[10px] text-slate-400 font-bold mb-1 uppercase">آخر تحديث</div>
                                            <span className="text-xs font-bold text-slate-700">منذ ساعتين</span>
                                        </div>
                                    </div>

                                    {selectedAsset.details && (
                                        <p className="text-xs text-slate-600 leading-relaxed bg-emerald-50/50 p-3 rounded-xl border border-emerald-100/50 mb-4">
                                            <Info size={14} className="inline mr-1 text-emerald-600" /> {selectedAsset.details}
                                        </p>
                                    )}

                                    <button className="w-full bg-slate-900 text-white py-2.5 rounded-xl text-xs font-bold hover:bg-emerald-600 transition shadow-lg shadow-emerald-900/10">
                                        فتح تقرير الحالة الكامل
                                    </button>
                                </div>
                            ) : (
                                <div className="text-center py-8 opacity-50">
                                    <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-3">
                                        <MousePointer2 size={24} className="text-slate-300" />
                                    </div>
                                    <p className="text-xs font-bold text-slate-400">انقر على أي نقطة في الخريطة<br />لعرض التفاصيل</p>
                                </div>
                            )}

                            <hr className="border-slate-100" />

                            {/* Layer Control */}
                            <div>
                                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                                    <Layers size={14} /> طبقات البيانات
                                </h4>
                                <div className="space-y-2">
                                    <LayerItem active={activeLayers.includes('electricity')} onClick={() => toggleLayer('electricity')} icon={<Zap size={16} />} label="شبكة الكهرباء" color="amber" />
                                    <LayerItem active={activeLayers.includes('water')} onClick={() => toggleLayer('water')} icon={<Droplets size={16} />} label="شبكة المياه" color="blue" />
                                    <LayerItem active={activeLayers.includes('sewage')} onClick={() => toggleLayer('sewage')} icon={<Wifi size={16} className="rotate-90" />} label="الصرف الصحي" color="stone" />
                                    <LayerItem active={activeLayers.includes('phone')} onClick={() => toggleLayer('phone')} icon={<Phone size={16} />} label="شبكة الهاتف" color="emerald" />

                                    <div className="h-px bg-slate-100 my-2"></div>

                                    <LayerItem active={activeLayers.includes('crowd-status')} onClick={() => toggleLayer('crowd-status')} icon={<ShieldAlert size={16} />} label="خريطة التوافر (مجتمعي)" color="rose" />
                                </div>
                            </div>
                        </div>

                        {/* Footer Link */}
                        <div className="p-4 bg-slate-50 border-t border-slate-100">
                            <Link href={route('community.index')} className="text-[10px] font-bold text-center block text-slate-400 hover:text-emerald-600 transition">
                                هل توجد بيانات غير دقيقة؟ بلغنا عبر المجتمع
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Toggle Button for Sidebar (When closed) */}
                {!isSidebarOpen && (
                    <button
                        onClick={() => setIsSidebarOpen(true)}
                        className="absolute right-4 top-4 z-20 bg-white p-3 rounded-2xl shadow-xl border border-slate-200 hover:bg-slate-50 transition animate-in fade-in"
                    >
                        <Layers className="text-emerald-600" size={20} />
                    </button>
                )}

                {/* 2. Map Viewport */}
                <div ref={mapContainer} className="flex-1 h-full shadow-inner" />

                {/* Floating Quick Stats (Bottom Left) */}
                <div className="absolute bottom-6 left-6 z-10 flex flex-col gap-2">
                    <div className="bg-white/90 backdrop-blur-md px-4 py-2 rounded-2xl shadow-xl border border-slate-200 flex items-center gap-3">
                        <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                        <span className="text-[10px] font-bold text-slate-600 tracking-tight">نظام المراقبة الذكي متصل</span>
                    </div>
                </div>
            </div>

            {/* Content List Section Below Map */}
            <div className="max-w-7xl mx-auto px-4 py-12">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <FacilityCard icon="⚡" title="محولات الكهرباء" count={points.filter((p: any) => p.type === 'transformer').length} status="75%" />
                    <FacilityCard icon="💧" title="آبار المياه" count={points.filter((p: any) => p.type === 'water_well').length} status="92%" />
                    <FacilityCard icon="🏥" title="النقاط الطبية" count={points.filter((p: any) => p.type === 'health_center').length} status="100%" />
                    <FacilityCard icon="🏛️" title="المباني الحكومية" count={points.filter((p: any) => p.type === 'government').length} status="100%" />
                </div>
            </div>
        </PortalLayout>
    );
}

// Sub-components

function LayerItem({ active, onClick, icon, label, color }: any) {
    const colors: Record<string, string> = {
        amber: 'bg-amber-500',
        blue: 'bg-blue-500',
        stone: 'bg-stone-500',
        emerald: 'bg-emerald-500',
        rose: 'bg-rose-500'
    };

    return (
        <button
            onClick={onClick}
            className={`w-full flex items-center justify-between p-3 rounded-xl border transition-all ${active ? 'bg-slate-50 border-slate-200 shadow-inner' : 'bg-white border-transparent hover:bg-slate-50/80'}`}
        >
            <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${active ? colors[color] + ' text-white shadow-md' : 'bg-slate-100 text-slate-400'} transition-all`}>
                    {icon}
                </div>
                <span className={`text-[11px] font-bold transition-colors ${active ? 'text-slate-800' : 'text-slate-500'}`}>{label}</span>
            </div>
            <div className={`w-3 h-3 rounded-full border-2 border-white shadow-sm transition-all ${active ? colors[color] : 'bg-slate-200'}`}></div>
        </button>
    );
}

function FacilityCard({ icon, title, count, status }: any) {
    return (
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition group">
            <div className="text-3xl mb-3 group-hover:scale-110 transition-transform inline-block">{icon}</div>
            <h4 className="font-bold text-slate-800 mb-1">{title}</h4>
            <div className="flex justify-between items-end">
                <span className="text-2xl font-black text-slate-900 leading-none">{count}</span>
                <div className="text-right">
                    <span className="text-[10px] text-slate-400 block font-bold mb-1 uppercase tracking-tighter">الحالة التشغيلية</span>
                    <div className="w-16 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                        <div className="h-full bg-emerald-500 rounded-full" style={{ width: status }}></div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function MousePointer2({ size, className }: any) {
    return <MapIcon size={size} className={className} />
}
