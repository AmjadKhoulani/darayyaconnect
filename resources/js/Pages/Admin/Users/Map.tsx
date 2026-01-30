import AdminLayout from '@/Layouts/AdminLayout';
import { Head } from '@inertiajs/react';
import {
    Activity,
    Droplets,
    Eye,
    EyeOff,
    Filter,
    Layers,
    Map as MapIcon,
    Moon,
    Phone,
    Sun,
    Wifi,
    Zap,
} from 'lucide-react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { useEffect, useRef, useState } from 'react';

interface UserPoint {
    id: number;
    name: string;
    role: string;
    latitude: number;
    longitude: number;
}

export default function UserMap({
    auth,
    users,
}: {
    auth: any;
    users: UserPoint[];
}) {
    const mapContainer = useRef<HTMLDivElement>(null);
    const map = useRef<maplibregl.Map | null>(null);
    const [activeLayers, setActiveLayers] = useState<string[]>([
        'crowd-electricity',
        'crowd-water',
    ]);
    const [darkMode, setDarkMode] = useState(false);
    const [filterRole, setFilterRole] = useState<string>('all');
    const [isLayerPanelOpen, setIsLayerPanelOpen] = useState(true);

    const toggleLayer = (layer: string) => {
        const isActive = activeLayers.includes(layer);
        const newLayers = isActive
            ? activeLayers.filter((l) => l !== layer)
            : [...activeLayers, layer];
        setActiveLayers(newLayers);

        if (map.current) {
            const visibility = !isActive ? 'visible' : 'none'; // Note: Logic inverted because we just toggled state
            if (map.current.getLayer(`infra-${layer}`)) {
                map.current.setLayoutProperty(
                    `infra-${layer}`,
                    'visibility',
                    visibility,
                );
            }
            if (map.current.getLayer(`infra-${layer}-nodes-layer`)) {
                map.current.setLayoutProperty(
                    `infra-${layer}-nodes-layer`,
                    'visibility',
                    visibility,
                );
            }

            // Handle Crowd Layers
            if (layer.startsWith('crowd-')) {
                const type = layer.replace('crowd-', '');
                if (map.current.getLayer(`crowd-${type}-fill`)) {
                    map.current.setLayoutProperty(
                        `crowd-${type}-fill`,
                        'visibility',
                        visibility,
                    );
                }
                if (map.current.getLayer(`crowd-${type}-symbol`)) {
                    map.current.setLayoutProperty(
                        `crowd-${type}-symbol`,
                        'visibility',
                        visibility,
                    );
                }
                if (map.current.getLayer(`crowd-${type}-circle`)) {
                    map.current.setLayoutProperty(
                        `crowd-${type}-circle`,
                        'visibility',
                        visibility,
                    );
                }
            }
        }
    };

    // Filter Users Effect
    useEffect(() => {
        if (!map.current || !map.current.getSource('users')) return;

        const filter =
            filterRole === 'all'
                ? null
                : ([
                    '==',
                    ['get', 'role'],
                    filterRole,
                ] as maplibregl.FilterSpecification);

        map.current.setFilter('user-heatmap', filter);
        map.current.setFilter('user-point', filter);
    }, [filterRole]);

    useEffect(() => {
        if (map.current) return;
        if (!mapContainer.current) return;

        map.current = new maplibregl.Map({
            container: mapContainer.current,
            style: {
                version: 8,
                sources: {
                    osm: {
                        type: 'raster',
                        tiles: [
                            'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
                        ],
                        tileSize: 256,
                        attribution: '&copy; OpenStreetMap Contributors',
                    },
                },
                layers: [
                    {
                        id: 'osm',
                        type: 'raster',
                        source: 'osm',
                    },
                ],
            },
            center: [36.236, 33.456], // Darayya Center
            zoom: 13,
            pitch: 0,
        });

        map.current.on('load', () => {
            if (!map.current) return;

            // Convert users to GeoJSON
            const pointsPayload: GeoJSON.FeatureCollection = {
                type: 'FeatureCollection',
                features: users.map((user) => ({
                    type: 'Feature',
                    geometry: {
                        type: 'Point',
                        coordinates: [
                            Number(user.longitude),
                            Number(user.latitude),
                        ],
                    },
                    properties: {
                        id: user.id,
                        intensity: 1,
                        role: user.role, // Ensure role is available for filtering
                    },
                })),
            };

            map.current.addSource('users', {
                type: 'geojson',
                data: pointsPayload,
            });

            // 1. Heatmap Layer
            map.current.addLayer({
                id: 'user-heatmap',
                type: 'heatmap',
                source: 'users',
                maxzoom: 15,
                paint: {
                    'heatmap-weight': 1,
                    'heatmap-intensity': [
                        'interpolate',
                        ['linear'],
                        ['zoom'],
                        0,
                        1,
                        9,
                        3,
                    ],
                    'heatmap-color': [
                        'interpolate',
                        ['linear'],
                        ['heatmap-density'],
                        0,
                        'rgba(33,102,172,0)',
                        0.2,
                        'rgb(103,169,207)',
                        0.4,
                        'rgb(209,229,240)',
                        0.6,
                        'rgb(253,219,199)',
                        0.8,
                        'rgb(239,138,98)',
                        1,
                        'rgb(178,24,43)',
                    ],
                    'heatmap-radius': [
                        'interpolate',
                        ['linear'],
                        ['zoom'],
                        0,
                        2,
                        9,
                        20,
                    ],
                    'heatmap-opacity': [
                        'interpolate',
                        ['linear'],
                        ['zoom'],
                        7,
                        0.8,
                        15,
                        0.5,
                    ],
                },
            });

            // 2. Circle Layer
            map.current.addLayer({
                id: 'user-point',
                type: 'circle',
                source: 'users',
                minzoom: 13,
                paint: {
                    'circle-radius': 6,
                    'circle-color': [
                        'match',
                        ['get', 'role'],
                        'volunteer',
                        '#10b981', // Emerald for volunteers
                        'official',
                        '#3b82f6', // Blue for officials
                        '#d7191c', // Red for citizens
                    ],
                    'circle-stroke-color': 'white',
                    'circle-stroke-width': 2,
                    'circle-opacity': [
                        'interpolate',
                        ['linear'],
                        ['zoom'],
                        13,
                        0.5,
                        15,
                        1,
                    ],
                },
            });

            // 3. Infrastructure Layers
            fetch('/api/infrastructure')
                .then((res) => res.json())
                .then((data) => {
                    if (!map.current) return;
                    ['water', 'electricity', 'sewage', 'phone'].forEach(
                        (type) => {
                            const lines = data.lines.filter(
                                (l: any) => l.type === type,
                            );
                            const points = data.nodes.filter((n: any) => {
                                if (type === 'sewage' && n.type === 'manhole')
                                    return true;
                                if (
                                    type === 'electricity' &&
                                    (n.type === 'transformer' ||
                                        n.type === 'pole')
                                )
                                    return true;
                                if (type === 'water' && n.type === 'pump')
                                    return true;
                                return false;
                            });

                            const geoJson: GeoJSON.FeatureCollection = {
                                type: 'FeatureCollection',
                                features: lines.map((l: any) => ({
                                    type: 'Feature',
                                    geometry: {
                                        type: 'LineString',
                                        coordinates: l.coordinates,
                                    },
                                    properties: { type: l.type },
                                })),
                            };

                            if (
                                !map.current!.getSource(`infra-${type}-source`)
                            ) {
                                map.current!.addSource(`infra-${type}-source`, {
                                    type: 'geojson',
                                    data: geoJson,
                                });
                            }

                            const colors: Record<string, string> = {
                                water: '#3b82f6',
                                electricity: '#eab308',
                                sewage: '#78350f',
                                phone: '#10b981',
                            };

                            map.current!.addLayer({
                                id: `infra-${type}`,
                                type: 'line',
                                source: `infra-${type}-source`,
                                layout: {
                                    'line-join': 'round',
                                    'line-cap': 'round',
                                    visibility: 'none',
                                },
                                paint: {
                                    'line-color': colors[type],
                                    'line-width': 4,
                                    'line-opacity': 0.9,
                                },
                            });

                            if (points.length > 0) {
                                const nodesGeoJson: GeoJSON.FeatureCollection =
                                {
                                    type: 'FeatureCollection',
                                    features: points.map((p: any) => ({
                                        type: 'Feature',
                                        geometry: {
                                            type: 'Point',
                                            coordinates: [
                                                parseFloat(p.longitude),
                                                parseFloat(p.latitude),
                                            ],
                                        },
                                        properties: { type: p.type },
                                    })),
                                };
                                map.current!.addSource(`infra-${type}-nodes`, {
                                    type: 'geojson',
                                    data: nodesGeoJson,
                                });
                                map.current!.addLayer({
                                    id: `infra-${type}-nodes-layer`,
                                    type: 'circle',
                                    source: `infra-${type}-nodes`,
                                    paint: {
                                        'circle-radius': 6,
                                        'circle-color': colors[type],
                                        'circle-stroke-width': 2,
                                        'circle-stroke-color': '#fff',
                                    },
                                    layout: { visibility: 'none' },
                                });
                            }
                        },
                    );
                })
                .catch((err) =>
                    console.error('Failed to fetch web infra', err),
                );

            // 4. Crowdsourced Status Layers
            ['electricity', 'water'].forEach((type) => {
                fetch(`/api/infrastructure/status-heatmap?type=${type}`)
                    .then((res) => res.json())
                    .then((geoJson) => {
                        if (!map.current) return;
                        map.current.addSource(`crowd-${type}-source`, {
                            type: 'geojson',
                            data: geoJson,
                        });
                        map.current.addLayer({
                            id: `crowd-${type}-fill`,
                            type: 'fill',
                            source: `crowd-${type}-source`,
                            layout: { visibility: 'visible' },
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
                                'fill-opacity': 0.4,
                            },
                        });
                        map.current.addLayer({
                            id: `crowd-${type}-circle`,
                            type: 'circle',
                            source: `crowd-${type}-source`,
                            layout: { visibility: 'visible' },
                            paint: {
                                'circle-radius': 14,
                                'circle-color': [
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
                                'circle-stroke-width': 2,
                                'circle-stroke-color': '#fff',
                            },
                        });
                        map.current.addLayer({
                            id: `crowd-${type}-symbol`,
                            type: 'symbol',
                            source: `crowd-${type}-source`,
                            layout: {
                                visibility: 'visible',
                                'text-field': '{score}%',
                                'text-size': 12,
                                'text-font': ['Open Sans Bold'],
                            },
                            paint: {
                                'text-color': '#fff',
                                'text-halo-color': '#000',
                                'text-halo-width': 1,
                            },
                        });
                    })
                    .catch((err) =>
                        console.error(
                            `Failed to fetch ${type} crowd data`,
                            err,
                        ),
                    );
            });
        });
    }, []);

    return (
        <AdminLayout
            user={auth.user}
            header={
                <h2 className="flex items-center gap-2 text-xl font-bold text-slate-800">
                    <MapIcon /> التوزع الجغرافي للمستخدمين
                </h2>
            }
        >
            <Head title="خريطة المستخدمين" />

            <div
                className="relative w-full overflow-hidden rounded-2xl border border-slate-200 shadow-xl"
                style={{ height: '80vh' }}
            >
                {/* Map Container with Dark Mode Filter */}
                <div
                    ref={mapContainer}
                    className={`absolute inset-0 transition-all duration-500 ${darkMode ? 'contrast-125 hue-rotate-180 invert' : ''}`}
                    style={{ width: '100%', height: '100%' }}
                />

                {/* Floating Controls Container - Right Side */}
                <div
                    className="absolute right-6 top-6 z-10 flex w-72 flex-col gap-4"
                    dir="rtl"
                >
                    {/* Stats Card */}
                    <div className="animate-fade-in-up rounded-2xl border border-white/50 bg-white/90 p-5 shadow-lg backdrop-blur-md">
                        <div className="mb-2 flex items-start justify-between">
                            <div>
                                <h3 className="flex items-center gap-2 text-lg font-black text-slate-800">
                                    <Activity
                                        className="text-emerald-500"
                                        size={20}
                                    />
                                    الكثافة الحالية
                                </h3>
                                <p className="mt-1 text-[11px] font-bold text-slate-500">
                                    توزع المستخدمين النشطين
                                </p>
                            </div>
                            <button
                                onClick={() => setDarkMode(!darkMode)}
                                className={`rounded-xl p-2 transition-all ${darkMode ? 'bg-slate-800 text-yellow-400' : 'bg-slate-100 text-slate-400 hover:text-slate-600'}`}
                                title={
                                    darkMode ? 'الوضع النهاري' : 'الوضع الليلي'
                                }
                            >
                                {darkMode ? (
                                    <Sun size={18} />
                                ) : (
                                    <Moon size={18} />
                                )}
                            </button>
                        </div>

                        <div className="mt-4 flex items-end gap-3">
                            <span className="text-4xl font-black leading-none text-slate-900">
                                {users.length}
                            </span>
                            <span className="mb-1 rounded-lg bg-slate-100 px-2 py-1 text-xs font-bold text-slate-500">
                                مستخدم مسجل
                            </span>
                        </div>
                    </div>

                    {/* Filter Role Panel */}
                    <div className="rounded-2xl border border-white/50 bg-white/90 p-4 shadow-lg backdrop-blur-md">
                        <h4 className="mb-3 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-400">
                            <Filter size={14} /> تصفية حسب الدور
                        </h4>
                        <div className="flex flex-wrap gap-2">
                            {[
                                { id: 'all', label: 'الكل', color: 'slate' },
                                { id: 'user', label: 'مواطن', color: 'red' },
                                {
                                    id: 'volunteer',
                                    label: 'متطوع',
                                    color: 'emerald',
                                },
                                {
                                    id: 'official',
                                    label: 'مسؤول',
                                    color: 'blue',
                                },
                            ].map((role) => (
                                <button
                                    key={role.id}
                                    onClick={() => setFilterRole(role.id)}
                                    className={`rounded-lg border px-3 py-1.5 text-xs font-bold transition-all ${filterRole === role.id
                                            ? `bg-${role.color}-500 text-white border-${role.color}-600 shadow-md`
                                            : 'border-slate-200 bg-white text-slate-500 hover:bg-slate-50'
                                        }`}
                                >
                                    {role.label}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Infrastructure Controls - Left Side */}
                <div className="absolute left-6 top-6 z-10 w-64" dir="rtl">
                    <div className="overflow-hidden rounded-2xl border border-white/50 bg-white/90 shadow-lg backdrop-blur-md transition-all duration-300">
                        {/* Header to toggle panel */}
                        <button
                            onClick={() =>
                                setIsLayerPanelOpen(!isLayerPanelOpen)
                            }
                            className="flex w-full items-center justify-between bg-slate-50/50 p-4 transition-colors hover:bg-slate-100/50"
                        >
                            <h3 className="flex items-center gap-2 font-bold text-slate-800">
                                <Layers className="text-indigo-500" size={20} />
                                طبقات البنية التحتية
                            </h3>
                            {isLayerPanelOpen ? (
                                <Eye size={18} className="text-slate-400" />
                            ) : (
                                <EyeOff size={18} className="text-slate-400" />
                            )}
                        </button>

                        {/* Collapsible Content */}
                        <div
                            className={`scrollbar-thin scrollbar-thumb-slate-200 overflow-y-auto transition-all duration-300 ease-in-out ${isLayerPanelOpen ? 'max-h-[600px] opacity-100' : 'max-h-0 opacity-0'}`}
                        >
                            <div className="space-y-2 p-3">
                                <LayerToggle
                                    active={activeLayers.includes('water')}
                                    onClick={() => toggleLayer('water')}
                                    icon={<Droplets size={18} />}
                                    label="شبكة المياه"
                                    color="blue"
                                />
                                <LayerToggle
                                    active={activeLayers.includes(
                                        'electricity',
                                    )}
                                    onClick={() => toggleLayer('electricity')}
                                    icon={<Zap size={18} />}
                                    label="الكهرباء"
                                    color="yellow"
                                />
                                <LayerToggle
                                    active={activeLayers.includes('sewage')}
                                    onClick={() => toggleLayer('sewage')}
                                    icon={
                                        <Wifi size={18} className="rotate-90" />
                                    } // Abstract for sewage
                                    label="الصرف الصحي"
                                    color="orange"
                                />
                                <LayerToggle
                                    active={activeLayers.includes('phone')}
                                    onClick={() => toggleLayer('phone')}
                                    icon={<Phone size={18} />}
                                    label="الهاتف"
                                    color="emerald"
                                />

                                <div className="my-2 h-px bg-slate-200"></div>
                                <p className="mb-1 px-1 text-[10px] font-bold text-slate-400">
                                    حالة الشبكة (مجتمعي)
                                </p>

                                <LayerToggle
                                    active={activeLayers.includes(
                                        'crowd-electricity',
                                    )}
                                    onClick={() =>
                                        toggleLayer('crowd-electricity')
                                    }
                                    icon={<Activity size={18} />}
                                    label="كهرباء (بلاغات)"
                                    color="amber"
                                />
                                <LayerToggle
                                    active={activeLayers.includes(
                                        'crowd-water',
                                    )}
                                    onClick={() => toggleLayer('crowd-water')}
                                    icon={<Activity size={18} />}
                                    label="مياه (بلاغات)"
                                    color="blue"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Loading State Overlay */}
                {users.length === 0 && (
                    <div className="pointer-events-none absolute inset-0 z-0 flex items-center justify-center bg-slate-100/50 backdrop-blur-sm">
                        <div className="flex animate-pulse items-center gap-3 rounded-2xl bg-white px-6 py-4 shadow-xl">
                            <MapIcon className="text-slate-300" size={24} />
                            <span className="font-bold text-slate-400">
                                جاري تحميل بيانات الخريطة...
                            </span>
                        </div>
                    </div>
                )}
            </div>
        </AdminLayout>
    );
}

// Helper Component for cleaner code
const LayerToggle = ({ active, onClick, icon, label, color }: any) => (
    <button
        onClick={onClick}
        className={`group flex w-full items-center gap-3 rounded-xl border p-3 transition-all duration-200 ${active
                ? `bg-${color}-50 border-${color}-200 shadow-inner`
                : 'border-transparent bg-white hover:bg-slate-50'
            }`}
    >
        <div
            className={`flex h-8 w-8 items-center justify-center rounded-lg transition-colors ${active
                    ? `bg-${color}-500 text-white shadow-md`
                    : 'bg-slate-100 text-slate-400 group-hover:text-slate-600'
                }`}
        >
            {icon}
        </div>
        <div className="flex-1 text-right">
            <span
                className={`block text-xs font-bold ${active ? 'text-slate-800' : 'text-slate-500'}`}
            >
                {label}
            </span>
            <div
                className={`mt-1.5 h-1 w-full rounded-full transition-all ${active
                        ? `bg-${color}-500 opacity-100`
                        : 'bg-slate-200 opacity-0'
                    }`}
            ></div>
        </div>
        <div
            className={`flex h-4 w-4 items-center justify-center rounded-full border-2 transition-all ${active
                    ? `border-${color}-500 bg-${color}-500`
                    : 'border-slate-300'
                }`}
        >
            {active && <div className="h-1.5 w-1.5 rounded-full bg-white" />}
        </div>
    </button>
);
