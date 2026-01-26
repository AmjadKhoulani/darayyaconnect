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

const networks = ['water', 'electricity', 'sewage', 'phone'];
const colors: Record<string, string> = {
    water: '#3b82f6',
    electricity: '#f59e0b',
    sewage: '#78350f',
    phone: '#10b981',
};

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
        'citizen-reports',
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

            // 2. Add Infrastructure Data (Lines & Nodes)
            fetch('/api/infrastructure')
                .then((res) => res.json())
                .then((data) => {
                    if (!map.current) return;

                    const allFeatures: GeoJSON.Feature[] = [];

                    // Process Lines
                    data.lines.forEach((l: any) => {
                        const sector = getSectorFromType(l.type);
                        allFeatures.push({
                            type: 'Feature',
                            geometry: { type: 'LineString', coordinates: l.coordinates },
                            properties: {
                                id: l.id,
                                type: l.type,
                                sector,
                                label: getLabelForType(l.type),
                                status: l.status,
                                meta: l.meta
                            }
                        });
                    });

                    // Process Nodes
                    data.nodes.forEach((n: any) => {
                        const sector = getSectorFromType(n.type);
                        allFeatures.push({
                            type: 'Feature',
                            geometry: { type: 'Point', coordinates: [parseFloat(n.longitude), parseFloat(n.latitude)] },
                            properties: {
                                id: n.id,
                                type: n.type,
                                sector,
                                label: getLabelForType(n.type),
                                icon: getEmojiForType(n.type),
                                status: n.status,
                                meta: n.meta
                            }
                        });
                    });

                    map.current.addSource('infra-source', {
                        type: 'geojson',
                        data: { type: 'FeatureCollection', features: allFeatures }
                    });

                    // Add Sector Layers (Lines)
                    networks.forEach(sector => {
                        map.current!.addLayer({
                            id: `infra-${sector}-lines`,
                            type: 'line',
                            source: 'infra-source',
                            filter: ['all', ['==', '$type', 'LineString'], ['==', 'sector', sector]],
                            layout: {
                                'line-join': 'round',
                                'line-cap': 'round',
                                visibility: activeLayers.includes(sector) ? 'visible' : 'none',
                            },
                            paint: {
                                'line-color': colors[sector],
                                'line-width': 4,
                                'line-opacity': 0.8,
                            },
                        });
                    });

                    // Add Sector Layers (Nodes/Icons)
                    networks.forEach(sector => {
                        map.current!.addLayer({
                            id: `infra-${sector}-nodes-bg`,
                            type: 'circle',
                            source: 'infra-source',
                            filter: ['all', ['==', '$type', 'Point'], ['==', 'sector', sector]],
                            layout: {
                                visibility: activeLayers.includes(sector) ? 'visible' : 'none',
                            },
                            paint: {
                                'circle-radius': 12,
                                'circle-color': '#fff',
                                'circle-stroke-width': 2,
                                'circle-stroke-color': colors[sector],
                            }
                        });

                        map.current!.addLayer({
                            id: `infra-${sector}-nodes-icon`,
                            type: 'symbol',
                            source: 'infra-source',
                            filter: ['all', ['==', '$type', 'Point'], ['==', 'sector', sector]],
                            layout: {
                                'text-field': ['get', 'icon'],
                                'text-size': 14,
                                'text-allow-overlap': true,
                                visibility: activeLayers.includes(sector) ? 'visible' : 'none',
                            }
                        });
                    });

                    // Setup Hover Popups
                    const popup = new maplibregl.Popup({
                        closeButton: false,
                        closeOnClick: false,
                        className: 'infra-popup'
                    });

                    const layersToHandle = [
                        ...networks.map(s => `infra-${s}-lines`),
                        ...networks.map(s => `infra-${s}-nodes-bg`)
                    ];

                    layersToHandle.forEach(layerId => {
                        map.current!.on('mouseenter', layerId, (e) => {
                            map.current!.getCanvas().style.cursor = 'pointer';
                            const feature = e.features![0];
                            const props = feature.properties as any;
                            const coordinates = feature.geometry.type === 'Point'
                                ? (feature.geometry as any).coordinates.slice()
                                : e.lngLat;

                            let metaHtml = '';
                            if (props.meta) {
                                try {
                                    const meta = typeof props.meta === 'string' ? JSON.parse(props.meta) : props.meta;
                                    if (meta.served_neighborhood) {
                                        metaHtml = `<div class="text-[10px] font-bold text-emerald-600 mt-1">🏠 يخدم حارة: ${meta.served_neighborhood}</div>`;
                                    }
                                } catch (e) { }
                            }

                            const html = `
                                <div class="p-2 text-right" dir="rtl">
                                    <div class="font-black text-slate-800 text-sm">${props.label}</div>
                                    <div class="text-[10px] text-slate-400 uppercase tracking-tighter">${props.type}</div>
                                    <div class="mt-2 flex items-center gap-1">
                                        <div class="w-2 h-2 rounded-full ${props.status === 'active' ? 'bg-emerald-500' : 'bg-rose-500'}"></div>
                                        <span class="text-[10px] font-bold">${props.status === 'active' ? 'يعمل' : 'تحت الصيانة'}</span>
                                    </div>
                                    ${metaHtml}
                                </div>
                            `;

                            popup.setLngLat(coordinates).setHTML(html).addTo(map.current!);
                        });

                        map.current!.on('mouseleave', layerId, () => {
                            map.current!.getCanvas().style.cursor = '';
                            popup.remove();
                        });
                    });
                });

            // 3. Crowdsourced Status Layer (Heatmap/Zones)
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

            // 4. Public Reports Layer (HTML Markers for animation)
            const reportMarkers: maplibregl.Marker[] = [];
            fetch('/api/infrastructure/public-reports')
                .then((res) => res.json())
                .then((data) => {
                    if (!map.current) return;

                    data.features.forEach((feat: any) => {
                        const props = feat.properties;
                        const el = document.createElement('div');
                        el.className = `status-bubble ${props.status === 'urgent' ? 'critical' : ''}`;
                        el.innerHTML = getEmojiForCategory(props.category);
                        el.style.animationDelay = `${Math.random() * -4}s`;

                        el.onclick = () => {
                            const categoryAr = {
                                water: 'شبكة المياه',
                                electricity: 'شبكة الكهرباء',
                                lighting: 'الإنارة العامة',
                                sanitation: 'الصرف الصحي',
                                trash: 'النظافة العامة',
                                road: 'الطرق والجسور',
                                communication: 'الاتصالات',
                                other: 'بلاغ عام'
                            }[props.category as string] || 'بلاغ خدمة';

                            alert(`📅 تاريخ البلاغ: ${props.created_at || 'غير محدد'}\n⚠️ نوع البلاغ: ${categoryAr}`);
                        };

                        const marker = new maplibregl.Marker({ element: el, anchor: 'bottom' })
                            .setLngLat(feat.geometry.coordinates)
                            .addTo(map.current!);

                        reportMarkers.push(marker);

                        // Sync visibility
                        if (!activeLayers.includes('citizen-reports')) {
                            el.style.display = 'none';
                        }
                    });
                });

            // 3. Points of Interest (Markers/Icons)
            const poiMarkers: maplibregl.Marker[] = [];
            points.forEach((point: Point) => {
                const el = document.createElement('div');
                const isIssue = point.status !== 'active';
                el.className = isIssue ? `status-bubble ${point.status === 'damaged' ? 'critical' : 'warning'}` : 'marker-icon';

                if (isIssue) {
                    el.innerHTML = point.status === 'maintenance' ? '🏗️' : getEmojiForType(point.type);
                    el.style.animationDelay = `${Math.random() * -4}s`;
                } else {
                    el.innerHTML = `<div class="bg-white p-1 rounded-full shadow-md border-2 border-emerald-500 cursor-pointer hover:scale-110 transition-transform">${getEmojiForType(point.type)}</div>`;
                }

                const marker = new maplibregl.Marker({ element: el, anchor: isIssue ? 'bottom' : 'center' })
                    .setLngLat([point.longitude, point.latitude])
                    .addTo(map.current!);

                el.addEventListener('click', () => {
                    setSelectedAsset(point);
                    setIsSidebarOpen(true);
                });

                poiMarkers.push(marker);
            });
        });

        return () => map.current?.remove();
    }, []);

    const getEmojiForCategory = (cat: string) => {
        const map: Record<string, string> = {
            water: '💧', electricity: '⚡', lighting: '💡', sanitation: '🗑️', trash: '🗑️', road: '🚧', communication: '📡'
        };
        return map[cat] || '⚠️';
    };

    // Effect to sync layer visibility
    useEffect(() => {
        if (!map.current) return;

        ['water', 'electricity', 'sewage', 'phone'].forEach((layer) => {
            const visibility = activeLayers.includes(layer) ? 'visible' : 'none';
            if (map.current!.getLayer(`infra-${layer}-lines`)) {
                map.current!.setLayoutProperty(`infra-${layer}-lines`, 'visibility', visibility);
            }
            if (map.current!.getLayer(`infra-${layer}-nodes-bg`)) {
                map.current!.setLayoutProperty(`infra-${layer}-nodes-bg`, 'visibility', visibility);
            }
            if (map.current!.getLayer(`infra-${layer}-nodes-icon`)) {
                map.current!.setLayoutProperty(`infra-${layer}-nodes-icon`, 'visibility', visibility);
            }
        });

        if (map.current!.getLayer('status-zones-fill')) {
            map.current!.setLayoutProperty(
                'status-zones-fill',
                'visibility',
                activeLayers.includes('crowd-status') ? 'visible' : 'none',
            );
        }

        if (map.current!.getLayer('public-reports-layer')) {
            map.current!.setLayoutProperty(
                'public-reports-layer',
                'visibility',
                activeLayers.includes('citizen-reports') ? 'visible' : 'none',
            );
        }

        // Toggle HTML markers for citizen reports
        const reportedBubbles = document.querySelectorAll('.status-bubble');
        reportedBubbles.forEach((el: any) => {
            if (el.innerHTML.match(/[💧⚡💡🗑️🚧📡⚠️]/)) { // Identify report bubbles
                el.style.display = activeLayers.includes('citizen-reports') ? 'flex' : 'none';
            }
        });
    }, [activeLayers]);

    const toggleLayer = (layer: string) => {
        setActiveLayers((prev) =>
            prev.includes(layer)
                ? prev.filter((l) => l !== layer)
                : [...prev, layer],
        );
    };

    const getEmojiForType = (type: string) => {
        const emojis: Record<string, string> = {
            // Water
            'water_tank': '🏯',
            'pump': '⚙️',
            'valve': '🔧',
            'water_well': '💧',
            // Electricity
            'transformer': '⚡',
            'pole': '💡',
            'generator': '🔋',
            // Sewage
            'manhole': '🕳️',
            // Phone
            'exchange': '🏢',
            'cabinet': '📦',
            // Public
            'school': '🎓',
            'health_center': '🏥',
            'park': '🌳',
            'government': '🏛️',
        };
        return emojis[type] || '📍';
    };

    const getSectorFromType = (type: string) => {
        if (type.startsWith('water') || ['pump', 'valve', 'water_well'].includes(type)) return 'water';
        if (type.startsWith('power') || ['transformer', 'pole', 'generator'].includes(type)) return 'electricity';
        if (type.startsWith('sewage') || ['manhole'].includes(type)) return 'sewage';
        if (type.startsWith('telecom') || ['exchange', 'cabinet'].includes(type)) return 'phone';
        return 'other';
    };

    const getLabelForType = (type: string) => {
        const labels: Record<string, string> = {
            'water_tank': 'خزان مياه',
            'pump': 'مضخة مياه',
            'valve': 'صمام أغلاق',
            'water_well': 'بئر مياه',
            'water_pipe_main': 'أنبوب رئيسي',
            'water_pipe_distribution': 'أنبوب فرعي',
            'transformer': 'محولة كهرباء',
            'pole': 'عامود إنارة',
            'generator': 'مولدة كهرباء',
            'power_cable_underground': 'كبل أرضي',
            'power_line_overhead': 'كبل هوائي',
            'manhole': 'ريكار (Manhole)',
            'sewage_pipe': 'قسطل صرف',
            'exchange': 'مقسم هاتف',
            'cabinet': 'كابينة توزيع',
            'telecom_cable': 'كبل هاتف',
        };
        return labels[type] || type;
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

                                    <LayerItem
                                        active={activeLayers.includes(
                                            'citizen-reports',
                                        )}
                                        onClick={() =>
                                            toggleLayer('citizen-reports')
                                        }
                                        icon={<ShieldAlert size={16} />}
                                        label="بلاغات المواطنين"
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
