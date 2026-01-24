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
} from 'lucide-react';

// Define Types
type NetworkType = 'water' | 'electricity' | 'sewage' | 'phone';
type NodeType = 'manhole' | 'pump' | 'transformer' | 'pole';

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
}

export default function InfrastructureEditor({ auth }: Props) {
    const mapContainer = useRef<HTMLDivElement>(null);
    const map = useRef<maplibregl.Map | null>(null);
    const draw = useRef<MapboxDraw | null>(null);

    // State
    const [selectedType, setSelectedType] = useState<string>('');
    const [lines, setLines] = useState<any[]>([]);
    const [nodes, setNodes] = useState<any[]>([]);
    const [activeLayer, setActiveLayer] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [inspectorData, setInspectorData] = useState<any | null>(null);
    const [drawMode, setDrawMode] = useState<'simple_select' | 'draw_line_string' | 'draw_point'>('simple_select');

    // Permissions Logic
    const allowedTypes = useMemo(() => {
        const role = auth.user.role;
        const deptSlug = auth.user.department?.slug;

        if (role === 'admin')
            return ['water', 'electricity', 'sewage', 'phone'];
        if (deptSlug === 'water') return ['water'];
        if (deptSlug === 'electricity') return ['electricity'];
        if (deptSlug === 'municipality') return ['sewage'];
        if (deptSlug === 'telecom') return ['phone'];
        return [];
    }, [auth.user]);

    // Initial Selection
    useEffect(() => {
        if (allowedTypes.length > 0 && !selectedType) {
            setSelectedType(allowedTypes[0]);
        }
    }, [allowedTypes]);

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
                        tiles: [
                            'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
                        ],
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
            displayControlsDefault: false, // We use custom buttons
            styles: [
                // ACTIVE (being drawn)
                // line stroke
                {
                    id: 'gl-draw-line',
                    type: 'line',
                    filter: [
                        'all',
                        ['==', '$type', 'LineString'],
                        ['!=', 'mode', 'static'],
                    ],
                    layout: {
                        'line-cap': 'round',
                        'line-join': 'round',
                    },
                    paint: {
                        'line-color': '#2563eb',
                        'line-dasharray': [0.2, 2],
                        'line-width': 4,
                    },
                },
                // vertex point halos
                {
                    id: 'gl-draw-polygon-and-line-vertex-halo-active',
                    type: 'circle',
                    filter: [
                        'all',
                        ['==', 'meta', 'vertex'],
                        ['==', '$type', 'Point'],
                        ['!=', 'mode', 'static'],
                    ],
                    paint: {
                        'circle-radius': 7,
                        'circle-color': '#FFF',
                    },
                },
                // vertex points
                {
                    id: 'gl-draw-polygon-and-line-vertex-active',
                    type: 'circle',
                    filter: [
                        'all',
                        ['==', 'meta', 'vertex'],
                        ['==', '$type', 'Point'],
                        ['!=', 'mode', 'static'],
                    ],
                    paint: {
                        'circle-radius': 5,
                        'circle-color': '#2563eb',
                    },
                },
                // point
                {
                    id: 'gl-draw-point-point-stroke-active',
                    type: 'circle',
                    filter: [
                        'all',
                        ['==', '$type', 'Point'],
                        ['==', 'meta', 'feature'],
                        ['!=', 'mode', 'static'],
                    ],
                    paint: {
                        'circle-radius': 8,
                        'circle-opacity': 1,
                        'circle-color': '#fff',
                    },
                },
                {
                    id: 'gl-draw-point-active',
                    type: 'circle',
                    filter: [
                        'all',
                        ['==', '$type', 'Point'],
                        ['==', 'meta', 'feature'],
                        ['!=', 'mode', 'static'],
                    ],
                    paint: {
                        'circle-radius': 6,
                        'circle-color': '#facc15',
                    },
                },
            ],
        });

        map.current.addControl(draw.current, 'top-left');
        map.current.addControl(
            new maplibregl.NavigationControl(),
            'bottom-right',
        );

        // Event Listeners
        map.current.on('load', () => fetchData());

        map.current.on('draw.create', (e) => saveDraw(e.features[0]));
        map.current.on('draw.update', (e) => updateDraw(e.features[0]));
        map.current.on('draw.delete', (e) => deleteDraw(e.features[0]));
        map.current.on('draw.modechange', (e) => setDrawMode(e.mode));

        map.current.on('click', (e) => {
            // Check if clicked on existing feature
            const features = map.current?.queryRenderedFeatures(e.point);
            if (features && features.length > 0 && features[0].properties?.id) {
                setInspectorData({
                    id: features[0].properties.id,
                    type: features[0].properties.type,
                    layer: features[0].layer.id,
                });
            } else {
                setInspectorData(null);
            }
        });
    }, []);

    const fetchData = async () => {
        try {
            setLoading(true);
            const { data } = await axios.get('/api/infrastructure');
            setLines(data.lines);
            setNodes(data.nodes);
            renderData(data.lines, data.nodes);
        } catch (e) {
            console.error('Failed to fetch data', e);
        } finally {
            setLoading(false);
        }
    };

    const renderData = (linesData: any[], nodesData: any[]) => {
        if (!map.current) return;

        // Helper to add layer if not exists
        const addLayer = (
            id: string,
            color: string,
            type: 'line' | 'circle',
            data: any[],
        ) => {
            if (map.current?.getSource(id)) {
                (map.current.getSource(id) as maplibregl.GeoJSONSource).setData(
                    {
                        type: 'FeatureCollection',
                        features: data,
                    },
                );
                return;
            }

            map.current?.addSource(id, {
                type: 'geojson',
                data: { type: 'FeatureCollection', features: data },
            });

            if (type === 'line') {
                const lineWidth = id.includes('active') ? 6 : 4;
                map.current?.addLayer({
                    id: id,
                    type: 'line',
                    source: id,
                    layout: { 'line-join': 'round', 'line-cap': 'round' },
                    paint: {
                        'line-color': color,
                        'line-width': lineWidth,
                        'line-opacity': 0.8,
                    },
                });
            } else {
                map.current?.addLayer({
                    id: id,
                    type: 'circle',
                    source: id,
                    paint: {
                        'circle-radius': 6,
                        'circle-color': color,
                        'circle-stroke-width': 2,
                        'circle-stroke-color': '#fff',
                    },
                });
            }
        };

        // Group by type
        const networks = {
            water: { color: '#3b82f6', lines: [] as any[], nodes: [] as any[] },
            electricity: {
                color: '#eab308',
                lines: [] as any[],
                nodes: [] as any[],
            },
            sewage: {
                color: '#78350f',
                lines: [] as any[],
                nodes: [] as any[],
            },
            phone: { color: '#10b981', lines: [] as any[], nodes: [] as any[] },
        };

        linesData.forEach((l) => {
            const type = l.type as keyof typeof networks;
            if (networks[type]) {
                networks[type].lines.push({
                    type: 'Feature',
                    geometry: {
                        type: 'LineString',
                        coordinates: l.coordinates,
                    },
                    properties: { id: l.id, type: l.type },
                });
            }
        });

        nodesData.forEach((n) => {
            // Map Node to Network
            let net: string = '';
            if (['manhole'].includes(n.type)) net = 'sewage';
            else if (['pump'].includes(n.type)) net = 'water';
            else if (['transformer', 'pole'].includes(n.type))
                net = 'electricity';

            if (net && networks[net as keyof typeof networks]) {
                //@ts-ignore
                networks[net as keyof typeof networks].nodes.push({
                    type: 'Feature',
                    geometry: {
                        type: 'Point',
                        coordinates: [
                            parseFloat(n.longitude),
                            parseFloat(n.latitude),
                        ],
                    },
                    properties: { id: n.id, type: n.type },
                });
            }
        });

        // Render Layers
        Object.entries(networks).forEach(([key, val]) => {
            addLayer(`net-${key}-lines`, val.color, 'line', val.lines);
            addLayer(`net-${key}-nodes`, val.color, 'circle', val.nodes);
        });
    };

    const saveDraw = async (feature: any) => {
        if (!selectedType) return alert('الرجاء اختيار نوع الشبكة أولاً');
        if (!allowedTypes.includes(selectedType))
            return alert('ليس لديك صلاحية لهذا الإجراء');

        try {
            if (feature.geometry.type === 'Point') {
                // Determine node type based on network selection
                let nodeType = 'pole'; // Default
                if (selectedType === 'water') nodeType = 'pump';
                if (selectedType === 'sewage') nodeType = 'manhole';
                if (selectedType === 'electricity') nodeType = 'transformer';

                await axios.post('/api/infrastructure/nodes', {
                    type: nodeType, // Simplified
                    latitude: feature.geometry.coordinates[1],
                    longitude: feature.geometry.coordinates[0],
                    status: 'active',
                });
            } else {
                await axios.post('/api/infrastructure/lines', {
                    type: selectedType,
                    coordinates: feature.geometry.coordinates,
                    status: 'active',
                });
            }

            // Clear Draw and Refresh
            draw.current?.deleteAll();
            // Reset mode to simple select
            setTimeout(() => {
                draw.current?.changeMode('simple_select');
            }, 100);
            fetchData();
        } catch (e) {
            alert('فشل الحفظ');
            console.error(e);
        }
    };

    const updateDraw = (feature: any) => {
        console.log('Update not implemented yet', feature);
    };

    const deleteDraw = (feature: any) => {
        console.log('Delete not implemented yet', feature);
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
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    const startDraw = (mode: 'draw_line_string' | 'draw_point') => {
        if (draw.current) {
            draw.current.changeMode(mode);
        }
    };

    const networkConfig: Record<string, { label: string; color: string; icon: any }> = {
        water: { label: 'شبكة المياه', color: 'bg-blue-500', icon: CheckCircle2 },
        electricity: { label: 'شبكة الكهرباء', color: 'bg-amber-500', icon: Zap },
        sewage: { label: 'الصرف الصحي', color: 'bg-amber-900', icon: Trash2 },
        phone: { label: 'الاتصالات', color: 'bg-emerald-500', icon: CheckCircle2 },
    };

    // UI Components
    return (
        <AdminLayout
            user={auth.user}
            header={
                <h2 className="hidden text-xl font-bold text-slate-800">
                    Infrastructure
                </h2>
            }
        >
            <Head title="محرر البنية التحتية" />

            <div className="relative flex h-[calc(100vh-64px)] w-full overflow-hidden bg-slate-100" dir="rtl">

                {/* 1. Top Bar Controls */}
                <div className="absolute top-4 right-4 z-10 flex flex-col gap-3">
                    <div className="bg-white rounded-xl shadow-lg border border-slate-200 p-2 flex flex-col gap-2 w-14 items-center">
                        <div className="p-2 bg-slate-100 rounded-lg text-slate-600 mb-1" title="Editor">
                            <MapIcon size={20} />
                        </div>

                        {/* Selection Tool */}
                        <button
                            onClick={() => startDraw('simple_select')}
                            className={`p-2 rounded-lg transition-colors ${drawMode === 'simple_select' ? 'bg-sky-50 text-sky-600' : 'hover:bg-slate-50 text-slate-500'}`}
                            title="تحريك / تحديد"
                        >
                            <MousePointer2 size={20} />
                        </button>

                        {/* Draw Line */}
                        <button
                            onClick={() => startDraw('draw_line_string')}
                            disabled={allowedTypes.length === 0}
                            className={`p-2 rounded-lg transition-colors ${drawMode === 'draw_line_string' ? 'bg-sky-50 text-sky-600' : 'hover:bg-slate-50 text-slate-500'} ${allowedTypes.length === 0 ? 'opacity-50' : ''}`}
                            title="رسم خط"
                        >
                            <PenTool size={20} />
                        </button>

                        {/* Add Point */}
                        <button
                            onClick={() => startDraw('draw_point')}
                            disabled={allowedTypes.length === 0}
                            className={`p-2 rounded-lg transition-colors ${drawMode === 'draw_point' ? 'bg-sky-50 text-sky-600' : 'hover:bg-slate-50 text-slate-500'} ${allowedTypes.length === 0 ? 'opacity-50' : ''}`}
                            title="إضافة نقطة"
                        >
                            <AlertTriangle size={20} />
                        </button>
                    </div>

                    <div className="bg-white rounded-xl shadow-lg border border-slate-200 p-2 flex flex-col gap-2 w-14 items-center">
                        {/* Layer Control Placeholder */}
                        <button className="p-2 rounded-lg hover:bg-slate-50 text-slate-500" title="الطبقات">
                            <Layers size={20} />
                        </button>
                    </div>
                </div>

                {/* Network Selector (Floating Top Right Center) */}
                <div className="absolute top-4 left-1/2 -translate-x-1/2 z-10">
                    <div className="bg-white rounded-full shadow-lg border border-slate-200 p-1.5 flex items-center gap-2">
                        {allowedTypes.map(t => (
                            <button
                                key={t}
                                onClick={() => setSelectedType(t)}
                                className={`px-4 py-2 rounded-full text-xs font-bold transition-all flex items-center gap-2 ${selectedType === t
                                    ? 'bg-slate-900 text-white shadow-md'
                                    : 'text-slate-500 hover:bg-slate-50'}`}
                            >
                                <span className={`w-2 h-2 rounded-full ${t === 'water' ? 'bg-blue-500' : t === 'electricity' ? 'bg-amber-400' : 'bg-slate-400'}`}></span>
                                {t === 'water' ? 'مياه' : t === 'electricity' ? 'كهرباء' : t === 'sewage' ? 'صرف' : 'هاتف'}
                            </button>
                        ))}
                    </div>
                </div>

                {/* 2. Map Area */}
                <div ref={mapContainer} className="relative h-full flex-1" />

                {/* 3. Left Inspector Panel (Conditional) */}
                {inspectorData && (
                    <div className="animate-in slide-in-from-left-4 absolute left-4 top-4 z-10 w-72 rounded-xl border border-slate-200 bg-white p-4 shadow-2xl">
                        <div className="mb-4 flex items-center justify-between">
                            <h3 className="flex items-center gap-2 font-bold text-slate-800">
                                <Info size={16} className="text-blue-500" />{' '}
                                تفاصيل العنصر
                            </h3>
                            <button
                                onClick={() => setInspectorData(null)}
                                className="text-slate-400 hover:text-slate-600"
                            >
                                ✕
                            </button>
                        </div>

                        <div className="space-y-3">
                            <div className="rounded-lg border border-slate-100 bg-slate-50 p-3">
                                <div className="mb-1 text-xs font-bold uppercase text-slate-400">
                                    معرف العنصر
                                </div>
                                <div className="font-mono text-sm max-w-[200px] truncate">
                                    {inspectorData.id}
                                </div>
                            </div>

                            <div className="rounded-lg border border-slate-100 bg-slate-50 p-3">
                                <div className="mb-1 text-xs font-bold uppercase text-slate-400">
                                    النوع
                                </div>
                                <div className="font-bold capitalize text-slate-700">
                                    {inspectorData.type}
                                </div>
                            </div>

                            <div className="mt-4 flex gap-2">
                                <button
                                    onClick={deleteAsset}
                                    className="flex-1 rounded-lg bg-rose-50 py-2 text-xs font-bold text-rose-600 hover:bg-rose-100 flex items-center justify-center gap-2"
                                >
                                    <Trash2 size={14} />
                                    حذف
                                </button>
                                <button className="flex-1 rounded-lg bg-slate-800 py-2 text-xs font-bold text-white hover:bg-slate-700">
                                    تعديل
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Loading State */}
                {loading && (
                    <div className="absolute inset-0 z-50 flex items-center justify-center bg-white/50 backdrop-blur-sm">
                        <div className="h-12 w-12 animate-spin rounded-full border-4 border-slate-200 border-t-blue-600"></div>
                    </div>
                )}
            </div>
        </AdminLayout>
    );
}
