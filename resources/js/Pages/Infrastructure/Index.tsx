import PortalLayout from '@/Layouts/PortalLayout';
import { Head, Link } from '@inertiajs/react';
import {
    Droplets,
    EyeOff,
    Info,
    Layers,
    Map as MapIcon,
    Phone,
    ShieldAlert,
    Wifi,
    Zap,
} from 'lucide-react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { useEffect, useRef, useState } from 'react';

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
    const [activeLayers, setActiveLayers] = useState<string[]>([
        'points',
        'crowd-status',
    ]);
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
            minZoom: 12,
        });

        map.current.addControl(
            new maplibregl.NavigationControl(),
            'bottom-right',
        );

        map.current.on('load', () => {
            if (!map.current) return;

            // 1. Add Infrastructure Networks (Lines)
            const networks = ['water', 'electricity', 'sewage', 'phone'];
            const colors: Record<string, string> = {
                water: '#3b82f6',
                electricity: '#f59e0b',
                sewage: '#78350f',
                phone: '#10b981',
            };

            fetch('/api/infrastructure')
                .then((res) => res.json())
                .then((data) => {
                    if (!map.current) return;

                    networks.forEach((type) => {
                        const lines = data.lines.filter(
                            (l: any) => l.type === type,
                        );
                        const pointsData = data.nodes.filter((n: any) => {
                            if (type === 'sewage' && n.type === 'manhole')
                                return true;
                            if (
                                type === 'electricity' &&
                                (n.type === 'transformer' || n.type === 'pole')
                            )
                                return true;
                            if (type === 'water' && n.type === 'pump')
                                return true;
                            return false;
                        });

                        const lineGeoJson: GeoJSON.FeatureCollection = {
                            type: 'FeatureCollection',
                            features: lines.map((l: any) => ({
                                type: 'Feature',
                                geometry: {
                                    type: 'LineString',
                                    coordinates: l.coordinates,
                                },
                                properties: {
                                    id: l.id,
                                    type: l.type,
                                    category: 'network',
                                },
                            })),
                        };

                        map.current!.addSource(`infra-${type}-source`, {
                            type: 'geojson',
                            data: lineGeoJson,
                        });
                        map.current!.addLayer({
                            id: `infra-${type}-layer`,
                            type: 'line',
                            source: `infra-${type}-source`,
                            layout: {
                                'line-join': 'round',
                                'line-cap': 'round',
                                visibility: activeLayers.includes(type)
                                    ? 'visible'
                                    : 'none',
                            },
                            paint: {
                                'line-color': colors[type],
                                'line-width': 3,
                                'line-opacity': 0.7,
                            },
                        });
                    });
                });

            // 2. Crowdsourced Status Layer (Heatmap/Zones)
            fetch('/api/infrastructure/status-heatmap?type=electricity')
                .then((res) => res.json())
                .then((geoJson) => {
                    if (!map.current) return;
                    map.current.addSource('status-zones-source', {
                        type: 'geojson',
                        data: geoJson,
                    });
                    map.current.addLayer({
                        id: 'status-zones-fill',
                        type: 'fill',
                        source: 'status-zones-source',
                        layout: {
                            visibility: activeLayers.includes('crowd-status')
                                ? 'visible'
                                : 'none',
                        },
                        paint: {
                            'fill-color': [
                                'match',
                                ['get', 'status'],
                                'available',
                                '#10b981',
                                'unstable',
                                '#f59e0b',
                                'cutoff',
                                '#ef4444',
                                '#94a3b8',
                            ],
                            'fill-opacity': 0.2,
                        },
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

        ['water', 'electricity', 'sewage', 'phone'].forEach((layer) => {
            if (map.current!.getLayer(`infra-${layer}-layer`)) {
                map.current!.setLayoutProperty(
                    `infra-${layer}-layer`,
                    'visibility',
                    activeLayers.includes(layer) ? 'visible' : 'none',
                );
            }
        });

        if (map.current!.getLayer('status-zones-fill')) {
            map.current!.setLayoutProperty(
                'status-zones-fill',
                'visibility',
                activeLayers.includes('crowd-status') ? 'visible' : 'none',
            );
        }
    }, [activeLayers]);

    const toggleLayer = (layer: string) => {
        setActiveLayers((prev) =>
            prev.includes(layer)
                ? prev.filter((l) => l !== layer)
                : [...prev, layer],
        );
    };

    const getEmojiForType = (type: string) => {
        const map: Record<string, string> = {
            water_well: '💧',
            transformer: '⚡',
            school: '🎓',
            health_center: '🏥',
            park: '🌳',
            government: '🏛️',
        };
        return map[type] || '📍';
    };

    return (
        <PortalLayout auth={auth}>
            <Head title="خريطة المدينة الذكية" />

            <div
                className="relative flex h-[85vh] w-full overflow-hidden bg-slate-50"
                dir="rtl"
            >
                {/* 1. Left Sidebar (Asset Info & Layers) */}
                <div
                    className={`absolute bottom-4 right-4 top-4 z-20 w-80 transform transition-transform duration-300 ${isSidebarOpen ? 'translate-x-0' : 'translate-x-[calc(100%+16px)]'}`}
                >
                    <div className="flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white/95 shadow-2xl backdrop-blur-xl">
                        {/* Header */}
                        <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50/50 p-4">
                            <h3 className="flex items-center gap-2 font-black text-slate-800">
                                <MapIcon
                                    className="text-emerald-500"
                                    size={20}
                                />
                                مستكشف المدينة
                            </h3>
                            <button
                                onClick={() => setIsSidebarOpen(false)}
                                className="rounded-lg p-1 transition hover:bg-slate-200"
                            >
                                <EyeOff size={18} className="text-slate-400" />
                            </button>
                        </div>

                        {/* Scrollable Content */}
                        <div className="custom-scrollbar flex-1 space-y-6 overflow-y-auto p-4">
                            {/* Selected Asset Info */}
                            {selectedAsset ? (
                                <div className="animate-in fade-in slide-in-from-top-2 duration-300">
                                    <div className="mb-4 flex items-center gap-3">
                                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-100 text-2xl shadow-inner">
                                            {getEmojiForType(
                                                selectedAsset.type,
                                            )}
                                        </div>
                                        <div>
                                            <h4 className="font-bold leading-tight text-slate-900">
                                                {selectedAsset.name}
                                            </h4>
                                            <span className="rounded bg-slate-100 px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-tighter text-slate-400">
                                                ID: asset-{selectedAsset.id}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="mb-4 grid grid-cols-2 gap-2">
                                        <div className="rounded-lg border border-slate-100 bg-slate-50 p-2">
                                            <div className="mb-1 text-[10px] font-bold uppercase text-slate-400">
                                                حالة التشغيل
                                            </div>
                                            <span
                                                className={`text-xs font-bold ${selectedAsset.status === 'active' ? 'text-emerald-600' : 'text-rose-600'}`}
                                            >
                                                {selectedAsset.status ===
                                                'active'
                                                    ? '● يعمل بكفاءة'
                                                    : '● متوقف للصيانة'}
                                            </span>
                                        </div>
                                        <div className="rounded-lg border border-slate-100 bg-slate-50 p-2">
                                            <div className="mb-1 text-[10px] font-bold uppercase text-slate-400">
                                                آخر تحديث
                                            </div>
                                            <span className="text-xs font-bold text-slate-700">
                                                منذ ساعتين
                                            </span>
                                        </div>
                                    </div>

                                    {selectedAsset.details && (
                                        <p className="mb-4 rounded-xl border border-emerald-100/50 bg-emerald-50/50 p-3 text-xs leading-relaxed text-slate-600">
                                            <Info
                                                size={14}
                                                className="mr-1 inline text-emerald-600"
                                            />{' '}
                                            {selectedAsset.details}
                                        </p>
                                    )}

                                    <button className="w-full rounded-xl bg-slate-900 py-2.5 text-xs font-bold text-white shadow-lg shadow-emerald-900/10 transition hover:bg-emerald-600">
                                        فتح تقرير الحالة الكامل
                                    </button>
                                </div>
                            ) : (
                                <div className="py-8 text-center opacity-50">
                                    <div className="mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-full bg-slate-100">
                                        <MousePointer2
                                            size={24}
                                            className="text-slate-300"
                                        />
                                    </div>
                                    <p className="text-xs font-bold text-slate-400">
                                        انقر على أي نقطة في الخريطة
                                        <br />
                                        لعرض التفاصيل
                                    </p>
                                </div>
                            )}

                            <hr className="border-slate-100" />

                            {/* Layer Control */}
                            <div>
                                <h4 className="mb-4 flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400">
                                    <Layers size={14} /> طبقات البيانات
                                </h4>
                                <div className="space-y-2">
                                    <LayerItem
                                        active={activeLayers.includes(
                                            'electricity',
                                        )}
                                        onClick={() =>
                                            toggleLayer('electricity')
                                        }
                                        icon={<Zap size={16} />}
                                        label="شبكة الكهرباء"
                                        color="amber"
                                    />
                                    <LayerItem
                                        active={activeLayers.includes('water')}
                                        onClick={() => toggleLayer('water')}
                                        icon={<Droplets size={16} />}
                                        label="شبكة المياه"
                                        color="blue"
                                    />
                                    <LayerItem
                                        active={activeLayers.includes('sewage')}
                                        onClick={() => toggleLayer('sewage')}
                                        icon={
                                            <Wifi
                                                size={16}
                                                className="rotate-90"
                                            />
                                        }
                                        label="الصرف الصحي"
                                        color="stone"
                                    />
                                    <LayerItem
                                        active={activeLayers.includes('phone')}
                                        onClick={() => toggleLayer('phone')}
                                        icon={<Phone size={16} />}
                                        label="شبكة الهاتف"
                                        color="emerald"
                                    />

                                    <div className="my-2 h-px bg-slate-100"></div>

                                    <LayerItem
                                        active={activeLayers.includes(
                                            'crowd-status',
                                        )}
                                        onClick={() =>
                                            toggleLayer('crowd-status')
                                        }
                                        icon={<ShieldAlert size={16} />}
                                        label="خريطة التوافر (مجتمعي)"
                                        color="rose"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Footer Link */}
                        <div className="border-t border-slate-100 bg-slate-50 p-4">
                            <Link
                                href={route('community.index')}
                                className="block text-center text-[10px] font-bold text-slate-400 transition hover:text-emerald-600"
                            >
                                هل توجد بيانات غير دقيقة؟ بلغنا عبر المجتمع
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Toggle Button for Sidebar (When closed) */}
                {!isSidebarOpen && (
                    <button
                        onClick={() => setIsSidebarOpen(true)}
                        className="animate-in fade-in absolute right-4 top-4 z-20 rounded-2xl border border-slate-200 bg-white p-3 shadow-xl transition hover:bg-slate-50"
                    >
                        <Layers className="text-emerald-600" size={20} />
                    </button>
                )}

                {/* 2. Map Viewport */}
                <div
                    ref={mapContainer}
                    className="h-full flex-1 shadow-inner"
                />

                {/* Floating Quick Stats (Bottom Left) */}
                <div className="absolute bottom-6 left-6 z-10 flex flex-col gap-2">
                    <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white/90 px-4 py-2 shadow-xl backdrop-blur-md">
                        <div className="h-2 w-2 animate-pulse rounded-full bg-emerald-500"></div>
                        <span className="text-[10px] font-bold tracking-tight text-slate-600">
                            نظام المراقبة الذكي متصل
                        </span>
                    </div>
                </div>
            </div>

            {/* Content List Section Below Map */}
            <div className="mx-auto max-w-7xl px-4 py-12">
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
                    <FacilityCard
                        icon="⚡"
                        title="محولات الكهرباء"
                        count={
                            points.filter((p: any) => p.type === 'transformer')
                                .length
                        }
                        status="75%"
                    />
                    <FacilityCard
                        icon="💧"
                        title="آبار المياه"
                        count={
                            points.filter((p: any) => p.type === 'water_well')
                                .length
                        }
                        status="92%"
                    />
                    <FacilityCard
                        icon="🏥"
                        title="النقاط الطبية"
                        count={
                            points.filter(
                                (p: any) => p.type === 'health_center',
                            ).length
                        }
                        status="100%"
                    />
                    <FacilityCard
                        icon="🏛️"
                        title="المباني الحكومية"
                        count={
                            points.filter((p: any) => p.type === 'government')
                                .length
                        }
                        status="100%"
                    />
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
        rose: 'bg-rose-500',
    };

    return (
        <button
            onClick={onClick}
            className={`flex w-full items-center justify-between rounded-xl border p-3 transition-all ${active ? 'border-slate-200 bg-slate-50 shadow-inner' : 'border-transparent bg-white hover:bg-slate-50/80'}`}
        >
            <div className="flex items-center gap-3">
                <div
                    className={`rounded-lg p-2 ${active ? colors[color] + ' text-white shadow-md' : 'bg-slate-100 text-slate-400'} transition-all`}
                >
                    {icon}
                </div>
                <span
                    className={`text-[11px] font-bold transition-colors ${active ? 'text-slate-800' : 'text-slate-500'}`}
                >
                    {label}
                </span>
            </div>
            <div
                className={`h-3 w-3 rounded-full border-2 border-white shadow-sm transition-all ${active ? colors[color] : 'bg-slate-200'}`}
            ></div>
        </button>
    );
}

function FacilityCard({ icon, title, count, status }: any) {
    return (
        <div className="group rounded-2xl border border-slate-100 bg-white p-5 shadow-sm transition hover:shadow-md">
            <div className="mb-3 inline-block text-3xl transition-transform group-hover:scale-110">
                {icon}
            </div>
            <h4 className="mb-1 font-bold text-slate-800">{title}</h4>
            <div className="flex items-end justify-between">
                <span className="text-2xl font-black leading-none text-slate-900">
                    {count}
                </span>
                <div className="text-right">
                    <span className="mb-1 block text-[10px] font-bold uppercase tracking-tighter text-slate-400">
                        الحالة التشغيلية
                    </span>
                    <div className="h-1.5 w-16 overflow-hidden rounded-full bg-slate-100">
                        <div
                            className="h-full rounded-full bg-emerald-500"
                            style={{ width: status }}
                        ></div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function MousePointer2({ size, className }: any) {
    return <MapIcon size={size} className={className} />;
}
