import AdminLayout from '@/Layouts/AdminLayout';
import { Head, Link } from '@inertiajs/react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { useEffect, useRef, useState } from 'react';
// @ts-ignore
import MapboxDraw from '@mapbox/mapbox-gl-draw';
import '@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css';
import axios from 'axios';
import {
    CheckCircle2,
    Info,
    MousePointer2,
    PenTool,
    Trash2,
    Home,
    Droplets,
    Zap,
    Wind,
    Phone,
} from 'lucide-react';

// Define Types
type SectorType = 'water' | 'electricity' | 'sewage' | 'phone';

interface Props {
    auth: {
        user: {
            id: number;
            name: string;
            email: string;
            role: string;
        };
    };
    sector: SectorType;
}

const SECTOR_CONFIG: Record<string, {
    label: string;
    color: string;
    icon: any;
    nodeTypes: { type: string; label: string; icon: string }[];
    lineTypes: { type: string; label: string; icon: string }[];
}> = {
    water: {
        label: 'شبكة المياه',
        color: '#3b82f6',
        icon: Droplets,
        nodeTypes: [
            { type: 'water_tank', label: 'خزان مياه', icon: '🏯' },
            { type: 'pump', label: 'مضخة مياه', icon: '⚙️' },
            { type: 'valve', label: 'صمام (سكر)', icon: '🔧' },
        ],
        lineTypes: [
            { type: 'water_pipe_main', label: 'أنبوب رئيسي', icon: '🌊' },
            { type: 'water_pipe_distribution', label: 'أنبوب فرعي', icon: '💧' },
        ]
    },
    electricity: {
        label: 'شبكة الكهرباء',
        color: '#eab308',
        icon: Zap,
        nodeTypes: [
            { type: 'transformer', label: 'محولة كهرباء', icon: '⚡' },
            { type: 'pole', label: 'عامود إنارة', icon: '💡' },
            { type: 'generator', label: 'مولدة', icon: '🔋' },
        ],
        lineTypes: [
            { type: 'power_cable_underground', label: 'كبل أرضي', icon: '🔌' },
            { type: 'power_line_overhead', label: 'كبل هوائي', icon: '🚡' },
        ]
    },
    sewage: {
        label: 'الصرف الصحي',
        color: '#78350f',
        icon: Wind,
        nodeTypes: [
            { type: 'manhole', label: 'ريكار (Manhole)', icon: '🕳️' },
        ],
        lineTypes: [
            { type: 'sewage_pipe', label: 'قسطل صرف', icon: '🚿' },
        ]
    },
    phone: {
        label: 'الاتصالات',
        color: '#10b981',
        icon: Phone,
        nodeTypes: [
            { type: 'exchange', label: 'مقسم', icon: '🏢' },
            { type: 'cabinet', label: 'علبة توزيع', icon: '📦' },
        ],
        lineTypes: [
            { type: 'telecom_cable', label: 'كبل هاتف', icon: '📞' },
        ]
    }
};

const NEIGHBORHOODS = [
    "الشرقي", "الغربي", "القبلية", "الكورنيش", "الثورة", "المركز", "الشاميات", "الخليج"
];

export default function InfrastructureEditor({ auth, sector }: Props) {
    const mapContainer = useRef<HTMLDivElement>(null);
    const map = useRef<maplibregl.Map | null>(null);
    const draw = useRef<MapboxDraw | null>(null);

    // State
    const [activeTool, setActiveTool] = useState<'select' | 'line' | 'point'>('select');
    const [selectedSubType, setSelectedSubType] = useState<string>('');
    const [loading, setLoading] = useState(false);
    const [inspectorData, setInspectorData] = useState<any | null>(null);
    const [assignedNeighborhood, setAssignedNeighborhood] = useState('');

    const config = SECTOR_CONFIG[sector] || SECTOR_CONFIG['water'];

    // Default selection
    useEffect(() => {
        if (config && !selectedSubType) {
            setSelectedSubType(config.nodeTypes[0].type);
        }
    }, [sector]);

    // Inspector Data Effect
    useEffect(() => {
        if (inspectorData?.properties?.meta) {
            try {
                const meta = typeof inspectorData.properties.meta === 'string'
                    ? JSON.parse(inspectorData.properties.meta)
                    : inspectorData.properties.meta;
                setAssignedNeighborhood(meta.served_neighborhood || '');
            } catch (e) {
                setAssignedNeighborhood('');
            }
        } else {
            setAssignedNeighborhood('');
        }
    }, [inspectorData]);

    useEffect(() => {
        if (map.current) return;
        if (!mapContainer.current) return;

        // Initialize Map
        map.current = new maplibregl.Map({
            container: mapContainer.current,
            style: {
                version: 8,
                sources: {
                    osm: {
                        type: 'raster',
                        tiles: ['https://tile.openstreetmap.org/{z}/{x}/{y}.png'],
                        tileSize: 256,
                        attribution: '&copy; OpenStreetMap',
                    },
                },
                layers: [{ id: 'osm', type: 'raster', source: 'osm' }],
            },
            center: [36.236, 33.456],
            zoom: 15,
        });

        // Initialize Draw Tools
        draw.current = new MapboxDraw({
            displayControlsDefault: false,
            styles: [
                {
                    id: 'gl-draw-line',
                    type: 'line',
                    filter: ['all', ['==', '$type', 'LineString'], ['!=', 'mode', 'static']],
                    layout: { 'line-cap': 'round', 'line-join': 'round' },
                    paint: { 'line-color': config?.color || '#333', 'line-dasharray': [0.2, 2], 'line-width': 4 },
                },
                {
                    id: 'gl-draw-point',
                    type: 'circle',
                    filter: ['all', ['==', '$type', 'Point'], ['!=', 'mode', 'static']],
                    paint: { 'circle-radius': 8, 'circle-color': config?.color || '#333', 'circle-stroke-width': 2, 'circle-stroke-color': '#fff' },
                },
            ],
        });

        map.current.addControl(draw.current, 'top-left');
        map.current.addControl(new maplibregl.NavigationControl(), 'bottom-right');

        // Event Listeners
        map.current.on('load', () => fetchData());
        map.current.on('draw.create', (e) => saveDraw(e.features[0]));

        map.current.on('click', (e) => {
            const features = map.current?.queryRenderedFeatures(e.point);
            if (features && features.length > 0 && features[0].properties?.id) {
                const props = features[0].properties;
                setInspectorData({
                    id: props.id,
                    type: props.type,
                    layer: features[0].layer.id,
                    properties: props
                });
            }
        });
    }, [sector]);

    const fetchData = async () => {
        try {
            setLoading(true);
            const { data } = await axios.get('/api/infrastructure');

            const sectorNodes = data.nodes.filter((n: any) =>
                config.nodeTypes.some(t => t.type === n.type)
            );
            const sectorLines = data.lines.filter((l: any) =>
                config.lineTypes.some(t => t.type === l.type)
            );

            renderData(sectorLines, sectorNodes);
        } catch (e) {
            console.error('Failed to fetch data', e);
        } finally {
            setLoading(false);
        }
    };

    const renderData = (linesData: any[], nodesData: any[]) => {
        if (!map.current) return;

        const sourceId = `net-${sector}`;
        const geojson = {
            type: 'FeatureCollection',
            features: [
                ...linesData.map(l => ({
                    type: 'Feature',
                    geometry: { type: 'LineString', coordinates: l.coordinates },
                    properties: { id: l.id, type: l.type, meta: l.meta }
                })),
                ...nodesData.map(n => ({
                    type: 'Feature',
                    geometry: { type: 'Point', coordinates: [parseFloat(n.longitude), parseFloat(n.latitude)] },
                    properties: { id: n.id, type: n.type, meta: n.meta }
                }))
            ]
        };

        if (map.current.getSource(sourceId)) {
            (map.current.getSource(sourceId) as maplibregl.GeoJSONSource).setData(geojson as any);
        } else {
            map.current.addSource(sourceId, { type: 'geojson', data: geojson as any });

            map.current.addLayer({
                id: `${sourceId}-lines`,
                type: 'line',
                source: sourceId,
                filter: ['==', '$type', 'LineString'],
                layout: { 'line-join': 'round', 'line-cap': 'round' },
                paint: { 'line-color': config?.color || '#333', 'line-width': 4, 'line-opacity': 0.8 }
            });

            map.current.addLayer({
                id: `${sourceId}-nodes`,
                type: 'circle',
                source: sourceId,
                filter: ['==', '$type', 'Point'],
                paint: { 'circle-radius': 6, 'circle-color': config?.color || '#333', 'circle-stroke-width': 2, 'circle-stroke-color': '#fff' }
            });
        }
    };

    const startTool = (mode: 'select' | 'line' | 'point', subType?: string) => {
        setActiveTool(mode);
        if (subType) setSelectedSubType(subType);

        if (draw.current) {
            if (mode === 'select') {
                draw.current.changeMode('simple_select');
            } else if (mode === 'line') {
                draw.current.changeMode('draw_line_string');
            } else if (mode === 'point') {
                draw.current.changeMode('draw_point');
            }
        }
    };

    const saveDraw = async (feature: any) => {
        try {
            if (feature.geometry.type === 'Point') {
                if (!selectedSubType) {
                    alert('الرجاء اختيار نوع العنصر أولاً');
                    return;
                }
                await axios.post('/api/infrastructure/nodes', {
                    type: selectedSubType,
                    latitude: feature.geometry.coordinates[1],
                    longitude: feature.geometry.coordinates[0],
                    status: 'active',
                });
            } else {
                if (feature.geometry.coordinates.length < 2) return;
                await axios.post('/api/infrastructure/lines', {
                    type: selectedSubType,
                    coordinates: feature.geometry.coordinates,
                    status: 'active',
                });
            }

            draw.current?.deleteAll();
            startTool('select');
            fetchData();
        } catch (e: any) {
            const errorMsg = e.response?.data?.message || e.message || 'خطأ غير معروف';
            alert(`فشل الحفظ: ${errorMsg}`);
            console.error(e);
        }
    };

    const updateAssignedNeighborhood = async () => {
        if (!inspectorData) return;
        try {
            const endpoint = inspectorData.layer.includes('nodes') ? 'nodes' : 'lines';
            const currentMeta = typeof inspectorData.properties.meta === 'string'
                ? JSON.parse(inspectorData.properties.meta || '{}')
                : (inspectorData.properties.meta || {});

            const newMeta = { ...currentMeta, served_neighborhood: assignedNeighborhood };

            await axios.put(`/api/infrastructure/${endpoint}/${inspectorData.id}`, {
                meta: newMeta
            });

            alert('تم تعيين الحارة بنجاح');
            setInspectorData(null);
            fetchData();
        } catch (e) {
            alert('فشل التحديث');
            console.error(e);
        }
    };

    const deleteAsset = async () => {
        if (!inspectorData || !confirm('هل أنت متأكد من الحذف؟')) return;
        try {
            setLoading(true);
            const endpoint = inspectorData.layer.includes('nodes') ? 'nodes' : 'lines';
            await axios.delete(`/api/infrastructure/${endpoint}/${inspectorData.id}`);
            setInspectorData(null);
            fetchData();
        } catch (e) {
            alert('فشل الحذف');
        } finally {
            setLoading(false);
        }
    };

    return (
        <AdminLayout user={auth.user}>
            <Head title={`محرر ${config.label}`} />

            <div className="relative flex h-[calc(100vh-64px)] w-full overflow-hidden bg-slate-100" dir="rtl">

                {/* Sector Switcher (Top Left) */}
                <div className="absolute top-4 left-4 z-20 flex gap-2">
                    {Object.entries(SECTOR_CONFIG).map(([key, val]) => {
                        const Icon = val.icon;
                        return (
                            <Link
                                key={key}
                                href={route('admin.infrastructure.sector.editor', { sector: key })}
                                className={`flex items-center gap-2 px-4 py-2 rounded-xl border shadow-sm transition-all ${sector === key
                                        ? 'bg-slate-900 border-slate-900 text-white shadow-lg'
                                        : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                                    }`}
                            >
                                <Icon size={16} />
                                <span className="text-sm font-bold">{val.label}</span>
                            </Link>
                        );
                    })}
                </div>

                {/* Right Toolbar */}
                <div className="absolute top-4 right-4 z-10 flex flex-col gap-3">
                    <div className="bg-white rounded-2xl shadow-xl border border-slate-200 p-3 flex flex-col gap-3 w-64">
                        <div className="p-3 border-b border-slate-100 mb-1 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: config.color }}></div>
                                <h3 className="font-bold text-slate-800">{config.label}</h3>
                            </div>
                            <button onClick={() => startTool('select')} className={`p-1.5 rounded-lg ${activeTool === 'select' ? 'bg-slate-100 text-slate-900' : 'text-slate-400 hover:bg-slate-50'}`}>
                                <MousePointer2 size={18} />
                            </button>
                        </div>

                        {/* Add Points */}
                        <div>
                            <label className="text-[10px] font-bold text-slate-400 mb-3 block px-1 uppercase tracking-wider">نقاط الشبكة (Nodes)</label>
                            <div className="grid grid-cols-1 gap-2">
                                {config.nodeTypes.map(t => (
                                    <button
                                        key={t.type}
                                        onClick={() => startTool('point', t.type)}
                                        className={`flex items-center gap-3 p-3 rounded-xl text-right transition-all border ${activeTool === 'point' && selectedSubType === t.type
                                                ? 'bg-emerald-50 text-emerald-700 border-emerald-200 shadow-sm'
                                                : 'bg-white border-transparent hover:border-slate-200 text-slate-600'
                                            }`}
                                    >
                                        <span className="text-2xl filter drop-shadow-sm">{t.icon}</span>
                                        <span className="text-sm font-bold flex-1">{t.label}</span>
                                        {activeTool === 'point' && selectedSubType === t.type && <CheckCircle2 size={14} className="text-emerald-500" />}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Add Lines */}
                        <div className="mt-2">
                            <label className="text-[10px] font-bold text-slate-400 mb-3 block px-1 uppercase tracking-wider">تمديدات وخطوط (Lines)</label>
                            <div className="grid grid-cols-1 gap-2">
                                {config.lineTypes.map(t => (
                                    <button
                                        key={t.type}
                                        onClick={() => startTool('line', t.type)}
                                        className={`flex items-center gap-3 p-3 rounded-xl text-right transition-all border ${activeTool === 'line' && selectedSubType === t.type
                                                ? 'bg-blue-50 text-blue-700 border-blue-200 shadow-sm'
                                                : 'bg-white border-transparent hover:border-slate-200 text-slate-600'
                                            }`}
                                    >
                                        <span className="text-2xl filter drop-shadow-sm">{t.icon}</span>
                                        <span className="text-sm font-bold flex-1">{t.label}</span>
                                        {activeTool === 'line' && selectedSubType === t.type && <PenTool size={14} className="text-blue-500" />}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Map Area */}
                <div ref={mapContainer} className="relative h-full flex-1" />

                {/* Left Inspector */}
                {inspectorData && (
                    <div className="animate-in slide-in-from-left-4 absolute left-4 bottom-4 z-10 w-80 rounded-2xl border border-slate-200 bg-white/95 backdrop-blur-md p-5 shadow-2xl">
                        <div className="mb-5 flex items-center justify-between">
                            <h3 className="flex items-center gap-2 font-bold text-slate-800">
                                <Info size={18} className="text-blue-500" />
                                تفاصيل العنصر
                            </h3>
                            <button onClick={() => setInspectorData(null)} className="text-slate-400 hover:text-slate-600 p-1 hover:bg-slate-100 rounded-lg">✕</button>
                        </div>

                        <div className="space-y-5">
                            <div className="bg-slate-50/50 p-4 rounded-xl border border-slate-100">
                                <div className="text-[10px] font-bold text-slate-400 mb-1 uppercase">نوع العنصر</div>
                                <div className="font-bold text-slate-800">{inspectorData.properties.type}</div>
                            </div>

                            {/* Neighborhood Assignment */}
                            <div>
                                <label className="block text-xs font-bold text-slate-700 mb-2 flex items-center gap-1">
                                    <Home size={14} className="text-slate-400" />
                                    الحارة المستفيدة (خدمة المنطقة)
                                </label>
                                <div className="flex gap-2">
                                    <select
                                        value={assignedNeighborhood}
                                        onChange={(e) => setAssignedNeighborhood(e.target.value)}
                                        className="flex-1 rounded-xl border-slate-200 text-sm py-2.5 focus:ring-slate-900 focus:border-slate-900 shadow-sm bg-white"
                                    >
                                        <option value="">اختر الحارة...</option>
                                        {NEIGHBORHOODS.map(n => (
                                            <option key={n} value={n}>{n}</option>
                                        ))}
                                    </select>
                                    <button
                                        onClick={updateAssignedNeighborhood}
                                        className="bg-slate-900 text-white px-3 rounded-xl hover:bg-slate-800 shadow-md flex items-center justify-center"
                                        title="حفظ"
                                    >
                                        <CheckCircle2 size={18} />
                                    </button>
                                </div>
                                <p className="text-[10px] text-slate-400 mt-2 px-1">حدد الحارة التي يتم تغذيتها من هذا العنصر لربط الشبكة بالسكان.</p>
                            </div>

                            <button onClick={deleteAsset} className="w-full py-3 bg-rose-50 text-rose-600 font-bold rounded-xl hover:bg-rose-100 flex items-center justify-center gap-2 transition-colors border border-rose-100 mt-2">
                                <Trash2 size={18} /> حذف هذا العنصر
                            </button>
                        </div>
                    </div>
                )}

                {loading && (
                    <div className="absolute inset-0 z-50 flex items-center justify-center bg-white/40 backdrop-blur-[2px]">
                        <div className="animate-spin rounded-full h-10 w-10 border-4 border-slate-200 border-t-slate-800"></div>
                    </div>
                )}
            </div>
        </AdminLayout>
    );
}
