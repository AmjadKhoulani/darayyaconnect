import AdminLayout from '@/Layouts/AdminLayout';
import { Head, router } from '@inertiajs/react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { useEffect, useMemo, useRef, useState } from 'react';
// @ts-ignore
import MapboxDraw from '@mapbox/mapbox-gl-draw';
import '@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css';
import axios from 'axios';
import {
    Activity,
    AlertTriangle,
    CheckCircle2,
    Info,
    Layers,
    Map as MapIcon,
    MousePointer2,
    PenTool,
    Settings,
    Trash2,
    Zap,
    Home,
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
            department?: {
                id: number;
                slug: string;
                name: string;
            };
        };
    };
    sector: SectorType;
}

const SECTOR_CONFIG: Record<string, {
    label: string;
    color: string;
    nodeTypes: { type: string; label: string; icon: string }[];
    lineTypes: { type: string; label: string }[];
}> = {
    water: {
        label: 'شبكة الكياه',
        color: '#3b82f6',
        nodeTypes: [
            { type: 'water_tank', label: 'خزان رئيسي', icon: '🚰' },
            { type: 'pump', label: 'مضخة', icon: '⚙️' },
            { type: 'valve', label: 'صمام (سكر)', icon: '🔧' },
        ],
        lineTypes: [
            { type: 'water_pipe_main', label: 'انبوب رئيسي' },
            { type: 'water_pipe_distribution', label: 'انبوب فرعي' },
        ]
    },
    electricity: {
        label: 'شبكة الكهرباء',
        color: '#eab308',
        nodeTypes: [
            { type: 'transformer', label: 'محولة كهرباء', icon: '⚡' },
            { type: 'pole', label: 'عامود إنارة', icon: '💡' },
            { type: 'generator', label: 'مولدة', icon: '🔋' },
        ],
        lineTypes: [
            { type: 'power_cable_underground', label: 'كبل أرضي' },
            { type: 'power_line_overhead', label: 'كبل هوائي' },
        ]
    },
    sewage: {
        label: 'الصرف الصحي',
        color: '#78350f',
        nodeTypes: [
            { type: 'manhole', label: 'ريكار (Manhole)', icon: '🕳️' },
        ],
        lineTypes: [
            { type: 'sewage_pipe', label: 'قسطل صرف' },
        ]
    },
    phone: {
        label: 'الاتصالات',
        color: '#10b981',
        nodeTypes: [
            { type: 'exchange', label: 'مقسم', icon: '🏢' },
            { type: 'cabinet', label: 'علبة توزيع', icon: '📦' },
        ],
        lineTypes: [
            { type: 'telecom_cable', label: 'كبل هاتف' },
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
    const actionState = useState<'select' | 'line' | 'point'>('select');
    const [activeTool, setActiveTool] = actionState;
    const [selectedSubType, setSelectedSubType] = useState<string>(''); // For specific asset types (e.g. transformer)
    const [lines, setLines] = useState<any[]>([]);
    const [nodes, setNodes] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [inspectorData, setInspectorData] = useState<any | null>(null);
    const [assignedNeighborhood, setAssignedNeighborhood] = useState('');

    const config = SECTOR_CONFIG[sector] || SECTOR_CONFIG['water'];

    // Default selection
    useEffect(() => {
        if (config && !selectedSubType) {
            // Default to first node type
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
            // defaultMode: 'simple_select',
            styles: [
                // Style definitions... (Keep existing clean styles)
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
                // Clicked on an existing asset
                const props = features[0].properties;
                setInspectorData({
                    id: props.id,
                    type: props.type,
                    layer: features[0].layer.id,
                    properties: props
                });
            } else {
                // If not clicking a feature, and tool is select, clear inspector
                // if (activeTool === 'select') setInspectorData(null);
            }
        });
    }, [sector]);

    const fetchData = async () => {
        try {
            setLoading(true);
            const { data } = await axios.get('/api/infrastructure');

            // Filter client side as backend returns all
            const sectorNodes = data.nodes.filter((n: any) =>
                config.nodeTypes.some(t => t.type === n.type)
            );
            const sectorLines = data.lines.filter((l: any) =>
                config.lineTypes.some(t => t.type === l.type)
            );

            setNodes(sectorNodes);
            setLines(sectorLines);
            renderData(sectorLines, sectorNodes);
        } catch (e) {
            console.error('Failed to fetch data', e);
        } finally {
            setLoading(false);
        }
    };

    const renderData = (linesData: any[], nodesData: any[]) => {
        if (!map.current) return;

        // Clear existing layers if any (simplified)
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

            // Lines Layer
            map.current.addLayer({
                id: `${sourceId}-lines`,
                type: 'line',
                source: sourceId,
                filter: ['==', '$type', 'LineString'],
                layout: { 'line-join': 'round', 'line-cap': 'round' },
                paint: { 'line-color': config?.color || '#333', 'line-width': 4, 'line-opacity': 0.8 }
            });

            // Nodes Layer
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
                await axios.post('/api/infrastructure/nodes', {
                    type: selectedSubType,
                    latitude: feature.geometry.coordinates[1],
                    longitude: feature.geometry.coordinates[0],
                    status: 'active',
                });
            } else {
                if (feature.geometry.coordinates.length < 2) return; // Ignore invalid lines
                await axios.post('/api/infrastructure/lines', {
                    type: selectedSubType,
                    coordinates: feature.geometry.coordinates,
                    status: 'active',
                });
            }

            draw.current?.deleteAll();
            // Reset to select mode after drawing
            startTool('select');
            fetchData();
        } catch (e) {
            alert('فشل الحفظ');
            console.error(e);
        }
    };

    const updateAssignedNeighborhood = async () => {
        if (!inspectorData) return;
        try {
            const endpoint = inspectorData.layer.includes('nodes') ? 'nodes' : 'lines';
            // Update meta
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

    if (!config) return <div>Invalid Sector: {sector}</div>;

    return (
        <AdminLayout user={auth.user}>
            <Head title={`محرر ${config.label}`} />

            <div className="relative flex h-[calc(100vh-64px)] w-full overflow-hidden bg-slate-100" dir="rtl">

                {/* Right Toolbar */}
                <div className="absolute top-4 right-4 z-10 flex flex-col gap-3">
                    <div className="bg-white rounded-xl shadow-lg border border-slate-200 p-2 flex flex-col gap-2 w-64">
                        <div className="p-3 border-b border-slate-100 mb-2 flex items-center gap-2">
                            <div className={`w-3 h-3 rounded-full`} style={{ backgroundColor: config.color }}></div>
                            <h3 className="font-bold text-slate-800">{config.label}</h3>
                        </div>

                        {/* Add Points */}
                        <div className="mb-2">
                            <label className="text-xs font-bold text-slate-400 mb-2 block px-1">نقاط (Nodes)</label>
                            <div className="grid grid-cols-1 gap-2">
                                {config.nodeTypes.map(t => (
                                    <button
                                        key={t.type}
                                        onClick={() => startTool('point', t.type)}
                                        className={`flex items-center gap-2 p-2 rounded-lg text-right transition-colors ${activeTool === 'point' && selectedSubType === t.type ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'hover:bg-slate-50 text-slate-600'}`}
                                    >
                                        <span className="text-xl">{t.icon}</span>
                                        <span className="text-sm font-bold">{t.label}</span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Add Lines */}
                        <div>
                            <label className="text-xs font-bold text-slate-400 mb-2 block px-1">تمديدات (Lines)</label>
                            <div className="grid grid-cols-1 gap-2">
                                {config.lineTypes.map(t => (
                                    <button
                                        key={t.type}
                                        onClick={() => startTool('line', t.type)}
                                        className={`flex items-center gap-2 p-2 rounded-lg text-right transition-colors ${activeTool === 'line' && selectedSubType === t.type ? 'bg-blue-50 text-blue-700 border border-blue-200' : 'hover:bg-slate-50 text-slate-600'}`}
                                    >
                                        <PenTool size={16} />
                                        <span className="text-sm font-bold">{t.label}</span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="border-t border-slate-100 mt-2 pt-2">
                            <button
                                onClick={() => startTool('select')}
                                className={`w-full flex items-center justify-center gap-2 p-2 rounded-lg transition-colors ${activeTool === 'select' ? 'bg-slate-100 text-slate-800 font-bold' : 'text-slate-500 hover:bg-slate-50'}`}
                            >
                                <MousePointer2 size={16} />
                                وضع التحديد
                            </button>
                        </div>
                    </div>
                </div>

                {/* Map Area */}
                <div ref={mapContainer} className="relative h-full flex-1" />

                {/* Left Inspector */}
                {inspectorData && (
                    <div className="animate-in slide-in-from-left-4 absolute left-4 top-4 z-10 w-72 rounded-xl border border-slate-200 bg-white p-4 shadow-2xl">
                        <div className="mb-4 flex items-center justify-between">
                            <h3 className="flex items-center gap-2 font-bold text-slate-800">
                                <Info size={16} className="text-blue-500" />{' '}
                                تفاصيل العنصر
                            </h3>
                            <button onClick={() => setInspectorData(null)} className="text-slate-400 hover:text-slate-600">✕</button>
                        </div>

                        <div className="space-y-4">
                            <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                                <div className="text-xs text-slate-500 mb-1">النوع</div>
                                <div className="font-bold text-slate-800">{inspectorData.type}</div>
                            </div>

                            {/* Neighborhood Assignment */}
                            <div>
                                <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1">
                                    <Home size={12} />
                                    الحارة المستفيدة (Connect To)
                                </label>
                                <div className="flex gap-2">
                                    <select
                                        value={assignedNeighborhood}
                                        onChange={(e) => setAssignedNeighborhood(e.target.value)}
                                        className="flex-1 rounded-lg border-slate-200 text-sm py-2"
                                    >
                                        <option value="">اختر الحارة...</option>
                                        {NEIGHBORHOODS.map(n => (
                                            <option key={n} value={n}>{n}</option>
                                        ))}
                                    </select>
                                    <button
                                        onClick={updateAssignedNeighborhood}
                                        className="bg-slate-900 text-white p-2 rounded-lg hover:bg-slate-800"
                                        title="حفظ"
                                    >
                                        <CheckCircle2 size={16} />
                                    </button>
                                </div>
                                <p className="text-[10px] text-slate-400 mt-1">حدد الحارة التي تتغذى من هذا العنصر</p>
                            </div>

                            <button onClick={deleteAsset} className="w-full py-2 bg-rose-50 text-rose-600 font-bold rounded-lg hover:bg-rose-100 flex items-center justify-center gap-2">
                                <Trash2 size={16} /> حذف العنصر
                            </button>
                        </div>
                    </div>
                )}

                {loading && (
                    <div className="absolute inset-0 z-50 flex items-center justify-center bg-white/50 backdrop-blur-sm">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-slate-800"></div>
                    </div>
                )}
            </div>
        </AdminLayout>
    );
}
