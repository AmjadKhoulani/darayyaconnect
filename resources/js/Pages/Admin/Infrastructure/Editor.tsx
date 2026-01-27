import AdminLayout from '@/Layouts/AdminLayout';
import { Head, Link } from '@inertiajs/react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { useEffect, useMemo, useRef, useState } from 'react';
// @ts-ignore
import MapboxDraw from '@mapbox/mapbox-gl-draw';
import '@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css';
import axios from 'axios';
import {
    Check,
    Undo2,
    Redo2,
    Globe,
    Phone,
    Save,
    CheckCircle2,
    Info,
    MousePointer2,
    PenTool,
    Trash2,
    Home,
    Droplets,
    Zap,
    Wind,
    MessageSquare,
    AlertCircle,
    ClipboardList,
    Hash,
    Settings,
    Activity,
} from 'lucide-react';

// Define Types
type SectorType = 'water' | 'electricity' | 'sewage' | 'phone';

import { User } from '@/types';

interface Props {
    auth: {
        user: User;
    };
    sector: SectorType;
}

const SECTOR_CONFIG: Record<string, {
    label: string;
    color: string;
    icon: any;
    nodeTypes: { type: string; label: string; icon: string; canFeedNeighborhood?: boolean }[];
    lineTypes: { type: string; label: string; icon: string; canFeedNeighborhood?: boolean }[];
}> = {
    water: {
        label: 'شبكة المياه',
        color: '#3b82f6',
        icon: Droplets,
        nodeTypes: [
            { type: 'water_tank', label: 'خزان مياه', icon: '🏰', canFeedNeighborhood: true },
            { type: 'pump', label: 'مضخة مياه', icon: '⚙️', canFeedNeighborhood: true },
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
            { type: 'transformer', label: 'محولة كهرباء', icon: '⚡', canFeedNeighborhood: true },
            { type: 'pole', label: 'عامود إنارة', icon: '🗼' },
            { type: 'generator', label: 'مولدة', icon: '🔋', canFeedNeighborhood: true },
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
    const [assetSerialNumber, setAssetSerialNumber] = useState('');
    const [assetCondition, setAssetCondition] = useState('good');
    const [assetNotes, setAssetNotes] = useState('');
    const [associatedReports, setAssociatedReports] = useState<any[]>([]);
    const [history, setHistory] = useState<any[]>([]);
    const [redoStack, setRedoStack] = useState<any[]>([]);
    const [hasUnpublishedChanges, setHasUnpublishedChanges] = useState(false);
    const [mapData, setMapData] = useState<{ lines: any[], nodes: any[] }>({ lines: [], nodes: [] });

    // Refs for event listeners to avoid closure issues
    const subTypeRef = useRef<string>(selectedSubType);
    const activeToolRef = useRef<'select' | 'line' | 'point'>(activeTool);

    useEffect(() => { subTypeRef.current = selectedSubType; }, [selectedSubType]);
    useEffect(() => { activeToolRef.current = activeTool; }, [activeTool]);

    const config = SECTOR_CONFIG[sector] || SECTOR_CONFIG['water'];

    // Default selection
    useEffect(() => {
        if (config && !selectedSubType) {
            setSelectedSubType(config.nodeTypes[0].type);
        }
    }, [sector]);

    // Inspector Data Effect
    useEffect(() => {
        if (inspectorData) {
            setAssignedNeighborhood(inspectorData.properties.meta?.assigned_neighborhood || '');
            setAssetSerialNumber(inspectorData.properties.serial_number || '');
            setAssetCondition(inspectorData.properties.status || 'active');
            setAssetNotes(inspectorData.properties.meta?.notes || '');
            fetchAssetReports(inspectorData);
        } else {
            setAssetSerialNumber('');
            setAssetNotes('');
            setAssociatedReports([]);
        }
    }, [inspectorData]);

    const fetchAssetReports = async (data: any) => {
        try {
            const res = await axios.get('/admin/api/infrastructure/asset-reports', {
                params: {
                    type: data.layer.includes('nodes') ? 'node' : 'line',
                    id: data.id
                }
            });
            setAssociatedReports(res.data);
        } catch (e) {
            console.error('Failed to fetch reports', e);
        }
    };

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
                    paint: {
                        'line-color': config?.color || '#333',
                        'line-dasharray': ['case', ['==', ['get', 'is_published'], false], ['literal', [2, 2]], ['literal', [1, 0]]],
                        'line-width': 4
                    },
                },
                {
                    id: 'gl-draw-point',
                    type: 'circle',
                    filter: ['all', ['==', '$type', 'Point'], ['!=', 'mode', 'static']],
                    paint: {
                        'circle-radius': 8,
                        'circle-color': config?.color || '#333',
                        'circle-stroke-width': 2,
                        'circle-stroke-color': '#fff',
                        'circle-opacity': 0.7
                    },
                },
            ],
        });

        map.current.addControl(draw.current, 'top-left');
        map.current.addControl(new maplibregl.NavigationControl(), 'bottom-right');

        // Event Listeners
        map.current.on('load', () => fetchData());

        // Use a wrapper to always call the LATEST saveDraw or access CURRENT ref values
        map.current.on('draw.create', (e) => {
            saveHistory();
            handleSaveEvent(e.features[0]);
        });

        map.current.on('draw.update', () => {
            saveHistory();
        });

        map.current.on('draw.delete', () => {
            saveHistory();
        });

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

    const saveHistory = () => {
        if (!draw.current) return;
        const currentFeatures = draw.current.getAll();
        setHistory(prev => [...prev.slice(-19), currentFeatures]); // Keep last 20 steps
        setRedoStack([]);
    };

    const undo = () => {
        if (history.length === 0 || !draw.current) return;
        const currentFeatures = draw.current.getAll();
        const previous = history[history.length - 1];

        setRedoStack(prev => [...prev, currentFeatures]);
        setHistory(prev => prev.slice(0, -1));

        draw.current.set(previous);
    };

    const redo = () => {
        if (redoStack.length === 0 || !draw.current) return;
        const currentFeatures = draw.current.getAll();
        const next = redoStack[redoStack.length - 1];

        setHistory(prev => [...prev, next]);
        setRedoStack(prev => prev.slice(0, -1));

        draw.current.set(next);
    };

    const fetchData = async () => {
        try {
            setLoading(true);
            const { data } = await axios.get('/admin/api/infrastructure');

            const sectorNodes = data.nodes.filter((n: any) =>
                config.nodeTypes.some(t => t.type === n.type)
            );
            const sectorLines = data.lines.filter((l: any) =>
                config.lineTypes.some(t => t.type === l.type)
            );

            const hasDrafts = data.nodes.some((n: any) => !n.is_published && config.nodeTypes.some(t => t.type === n.type)) ||
                data.lines.some((l: any) => !l.is_published && config.lineTypes.some(t => t.type === l.type));
            setHasUnpublishedChanges(hasDrafts);

            setMapData({ lines: sectorLines, nodes: sectorNodes });
            renderData(sectorLines, sectorNodes);
        } catch (e) {
            console.error('Failed to fetch data', e);
        } finally {
            setLoading(false);
        }
    };

    // Auto-focus logic
    useEffect(() => {
        if (loading || !map.current) return;

        const params = new URLSearchParams(window.location.search);
        const focusId = params.get('focus');
        const focusType = params.get('type');

        if (focusId && focusType) {
            // Find feature
            const sourceId = `net-${sector}`;
            const features = map.current.querySourceFeatures(sourceId, {
                sourceLayer: focusType === 'node' ? undefined : undefined, // GeoJSON source doesn't have sourceLayer
                filter: ['==', 'id', parseInt(focusId)]
            });

            // Since source might not be fully loaded, we might need to find in raw data if querySourceFeatures fails?
            // querySourceFeatures only works for features in viewport often.
            // Better to use the raw data we just fetched? But we don't have it in state except implicitly.
            // Actually we called renderData with (sectorLines, sectorNodes).
            // But we didn't save them to state.

            // Alternative: rely on map source?
            // Best to save data to state or re-fetch?
            // Let's modify fetchData to return data or save to state.
        }
    }, [loading]); // Run when loading finishes

    const renderData = (linesData: any[], nodesData: any[]) => {
        if (!map.current) return;

        const sourceId = `net-${sector}`;
        const geojson = {
            type: 'FeatureCollection',
            features: [
                ...linesData.map(l => ({
                    type: 'Feature',
                    geometry: { type: 'LineString', coordinates: l.coordinates },
                    properties: { id: l.id, type: l.type, meta: l.meta, is_published: l.is_published }
                })),
                ...nodesData.map(n => ({
                    type: 'Feature',
                    geometry: { type: 'Point', coordinates: [parseFloat(n.longitude), parseFloat(n.latitude)] },
                    properties: { id: n.id, type: n.type, meta: n.meta, is_published: n.is_published }
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
                paint: {
                    'line-color': config?.color || '#333',
                    'line-width': 4,
                    'line-opacity': 0.8,
                    'line-dasharray': ['case', ['==', ['get', 'is_published'], false], ['literal', [2, 2]], ['literal', [1, 0]]]
                }
            });

            map.current.addLayer({
                id: `${sourceId}-nodes`,
                type: 'circle',
                source: sourceId,
                filter: ['==', '$type', 'Point'],
                paint: {
                    'circle-radius': 6,
                    'circle-color': config?.color || '#333',
                    'circle-stroke-width': 2,
                    'circle-stroke-color': '#fff',
                    'circle-opacity': ['case', ['==', ['get', 'is_published'], false], 0.5, 1]
                }
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

    const finishDrawing = () => {
        if (draw.current) {
            draw.current.changeMode('simple_select');
        }
    };

    const handleSaveEvent = async (feature: any) => {
        const currentType = subTypeRef.current;

        if (!currentType) {
            alert('الرجاء اختيار نوع العنصر أولاً من القائمة الجانبية');
            draw.current?.delete(feature.id);
            return;
        }

        try {
            if (feature.geometry.type === 'Point') {
                await axios.post('/admin/api/infrastructure/nodes', {
                    type: currentType,
                    latitude: feature.geometry.coordinates[1],
                    longitude: feature.geometry.coordinates[0],
                    status: 'active',
                });
            } else {
                if (feature.geometry.coordinates.length < 2) {
                    draw.current?.delete(feature.id);
                    return;
                }
                await axios.post('/admin/api/infrastructure/lines', {
                    type: currentType,
                    coordinates: feature.geometry.coordinates,
                    status: 'active',
                });
            }

            draw.current?.deleteAll();

            // Stay in tool mode for continuous addition
            if (activeToolRef.current === 'point' || activeToolRef.current === 'line') {
                startTool(activeToolRef.current, subTypeRef.current);
            } else {
                startTool('select');
            }

            fetchData();
        } catch (e: any) {
            const errorMsg = e.response?.data?.message || e.message || 'خطأ غير معروف';
            alert(`فشل الحفظ: ${errorMsg}`);
            console.error(e);
            draw.current?.delete(feature.id);
        }
    };

    const publishAll = async () => {
        if (!confirm('هل أنت متأكد من نشر كافة التعديلات في هذا القطاع للجمهور؟')) return;
        try {
            setLoading(true);
            await axios.post('/admin/api/infrastructure/publish-all', { sector });
            alert('تم نشر كافة التعديلات بنجاح');
            fetchData();
        } catch (e: any) {
            alert('فشل النشر الجماعي');
        } finally {
            setLoading(false);
        }
    };

    // Auto-focus logic
    useEffect(() => {
        if (loading || !map.current) return;

        const params = new URLSearchParams(window.location.search);
        const focusId = params.get('focus');
        const focusType = params.get('type');

        if (focusId && focusType) {
            // Find feature
            const sourceId = `net-${sector}`;
            const features = map.current.querySourceFeatures(sourceId, {
                sourceLayer: focusType === 'node' ? undefined : undefined, // GeoJSON source doesn't have sourceLayer
                filter: ['==', 'id', parseInt(focusId)]
            });

            // Since source might not be fully loaded, we might need to find in raw data if querySourceFeatures fails?
            // querySourceFeatures only works for features in viewport often.
            // Better to use the raw data we just fetched? But we don't have it in state except implicitly.
            // Actually we called renderData with (sectorLines, sectorNodes).
            // But we didn't save them to state.

            // Alternative: rely on map source?
            // Best to save data to state or re-fetch?
            // Let's modify fetchData to return data or save to state.
        }
    }, [loading]); // Run when loading finishes

    const saveDraft = () => {
        alert('تم حفظ المسودات بنجاح. يمكنك العودة وإكمال العمل لاحقاً.');
    };

    const updateAssetMetadata = async () => {
        if (!inspectorData) return;
        try {
            setLoading(true);
            const endpoint = inspectorData.layer.includes('nodes') ? 'nodes' : 'lines';

            // Handle both string and object meta
            const currentMeta = typeof inspectorData.properties.meta === 'string'
                ? JSON.parse(inspectorData.properties.meta || '{}')
                : (inspectorData.properties.meta || {});

            const newMeta = {
                ...currentMeta,
                assigned_neighborhood: assignedNeighborhood,
                notes: assetNotes
            };

            await axios.put(`/admin/api/infrastructure/${endpoint}/${inspectorData.id}`, {
                serial_number: assetSerialNumber,
                status: assetCondition,
                meta: newMeta
            });

            alert('تم حفظ البيانات بنجاح');
            fetchData();
        } catch (e: any) {
            const errorMsg = e.response?.data?.message || e.message || 'خطأ غير معروف';
            alert(`فشل التحديث: ${errorMsg}`);
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    // Auto-focus logic
    useEffect(() => {
        if (loading || !map.current) return;

        const params = new URLSearchParams(window.location.search);
        const focusId = params.get('focus');
        const focusType = params.get('type');

        if (focusId && focusType) {
            // Find feature
            const sourceId = `net-${sector}`;
            const features = map.current.querySourceFeatures(sourceId, {
                sourceLayer: focusType === 'node' ? undefined : undefined, // GeoJSON source doesn't have sourceLayer
                filter: ['==', 'id', parseInt(focusId)]
            });

            // Since source might not be fully loaded, we might need to find in raw data if querySourceFeatures fails?
            // querySourceFeatures only works for features in viewport often.
            // Better to use the raw data we just fetched? But we don't have it in state except implicitly.
            // Actually we called renderData with (sectorLines, sectorNodes).
            // But we didn't save them to state.

            // Alternative: rely on map source?
            // Best to save data to state or re-fetch?
            // Let's modify fetchData to return data or save to state.
        }
    }, [loading]); // Run when loading finishes

    const deleteAsset = async () => {
        if (!inspectorData || !confirm('هل أنت متأكد من الحذف؟')) return;
        try {
            setLoading(true);
            const endpoint = inspectorData.layer.includes('nodes') ? 'nodes' : 'lines';
            await axios.delete(`/admin/api/infrastructure/${endpoint}/${inspectorData.id}`);
            setInspectorData(null);
            fetchData();
        } catch (e) {
            alert('فشل الحذف');
        } finally {
            setLoading(false);
        }
    };

    // Auto-focus logic
    useEffect(() => {
        if (loading || !map.current) return;

        const params = new URLSearchParams(window.location.search);
        const focusId = params.get('focus');
        const focusType = params.get('type');

        if (focusId && focusType) {
            // Find feature
            const sourceId = `net-${sector}`;
            const features = map.current.querySourceFeatures(sourceId, {
                sourceLayer: focusType === 'node' ? undefined : undefined, // GeoJSON source doesn't have sourceLayer
                filter: ['==', 'id', parseInt(focusId)]
            });

            // Since source might not be fully loaded, we might need to find in raw data if querySourceFeatures fails?
            // querySourceFeatures only works for features in viewport often.
            // Better to use the raw data we just fetched? But we don't have it in state except implicitly.
            // Actually we called renderData with (sectorLines, sectorNodes).
            // But we didn't save them to state.

            // Alternative: rely on map source?
            // Best to save data to state or re-fetch?
            // Let's modify fetchData to return data or save to state.
        }
    }, [loading]); // Run when loading finishes

    const canServe = useMemo(() => {
        if (!inspectorData) return false;
        const assetType = inspectorData.properties.type;
        const isNode = inspectorData.layer.includes('nodes');

        const list = isNode ? config.nodeTypes : config.lineTypes;
        return list.find(t => t.type === assetType)?.canFeedNeighborhood || false;
    }, [inspectorData, config]);

    return (
        <AdminLayout user={auth.user}>
            <Head title={`محرر ${config.label}`} />

            <div className="relative flex h-[calc(100vh-64px)] w-full overflow-hidden bg-slate-100" dir="rtl">

                <div className="absolute top-4 left-4 z-20 flex gap-2">
                    {Object.entries(SECTOR_CONFIG).map(([key, val]) => {
                        const Icon = val.icon;
                        return (
                            <Link
                                key={key}
                                // @ts-ignore
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

                <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 flex items-center gap-3">
                    <div className="bg-white/90 backdrop-blur-md rounded-2xl shadow-2xl border border-slate-200 p-2 flex items-center gap-2">
                        <button
                            onClick={undo}
                            disabled={history.length === 0}
                            className={`p-3 rounded-xl transition-all ${history.length === 0 ? 'text-slate-300' : 'text-slate-700 hover:bg-slate-100'}`}
                            title="تراجع (Undo)"
                        >
                            <Undo2 size={20} />
                        </button>
                        <button
                            onClick={redo}
                            disabled={redoStack.length === 0}
                            className={`p-3 rounded-xl transition-all ${redoStack.length === 0 ? 'text-slate-300' : 'text-slate-700 hover:bg-slate-100'}`}
                            title="إعادة (Redo)"
                        >
                            <Redo2 size={20} />
                        </button>
                        <div className="w-px h-6 bg-slate-200 mx-1"></div>
                        <div className="flex items-center gap-2">
                            <button
                                onClick={saveDraft}
                                className="flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 transition-all shadow-sm"
                            >
                                <Save size={18} className="text-slate-400" />
                                حفظ كمسودة
                            </button>
                            <button
                                onClick={publishAll}
                                disabled={!hasUnpublishedChanges}
                                className={`flex items-center gap-2 px-6 py-3 rounded-xl font-black text-sm transition-all ${hasUnpublishedChanges
                                    ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-200 hover:bg-emerald-700'
                                    : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                                    }`}
                            >
                                <Globe size={18} />
                                نشر كافة التعديلات (Live)
                            </button>
                        </div>
                    </div>
                </div>

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

                    {activeTool !== 'select' && (
                        <button
                            onClick={finishDrawing}
                            className="bg-emerald-600 text-white rounded-xl shadow-lg border border-emerald-500 p-4 font-bold flex items-center justify-center gap-2 hover:bg-emerald-700 animate-in slide-in-from-bottom-5"
                        >
                            <Check size={20} />
                            إنهاء وحفظ الرسم
                        </button>
                    )}
                </div>

                <div ref={mapContainer} className="relative h-full flex-1" />

                {inspectorData && (
                    <div className="animate-in slide-in-from-left-4 absolute left-4 bottom-4 z-10 w-80 rounded-2xl border border-slate-200 bg-white/95 backdrop-blur-md p-5 shadow-2xl">
                        <div className="mb-5 flex items-center justify-between">
                            <h3 className="flex items-center gap-2 font-bold text-slate-800">
                                <Info size={18} className="text-blue-500" />
                                تفاصيل العنصر
                            </h3>
                            <button onClick={() => setInspectorData(null)} className="text-slate-400 hover:text-slate-600 p-1 hover:bg-slate-100 rounded-lg">✕</button>
                        </div>

                        <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-1 custom-scrollbar">
                            <div className="bg-slate-50/50 p-4 rounded-xl border border-slate-100 flex justify-between items-center">
                                <div>
                                    <div className="text-[10px] font-bold text-slate-400 mb-1 uppercase">نوع العنصر</div>
                                    <div className="font-bold text-slate-800">{inspectorData.properties.type}</div>
                                </div>
                                <div className="text-right">
                                    <div className="text-[10px] font-bold text-slate-400 mb-1 uppercase">رقم المعرف</div>
                                    <div className="text-xs font-mono bg-white px-2 py-0.5 rounded border">ID-{inspectorData.id}</div>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-slate-700 mb-2 flex items-center gap-1">
                                        <Hash size={14} className="text-slate-400" />
                                        الرقم التسلسلي (Serial No.)
                                    </label>
                                    <input
                                        type="text"
                                        value={assetSerialNumber}
                                        onChange={(e) => setAssetSerialNumber(e.target.value)}
                                        placeholder="مثلاً: TR-2024-001"
                                        className="w-full rounded-xl border-slate-200 text-sm py-2.5 focus:ring-slate-900 focus:border-slate-900 shadow-sm bg-white"
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-slate-700 mb-2 flex items-center gap-1">
                                        <Activity size={14} className="text-slate-400" />
                                        الحالة الفنية
                                    </label>
                                    <select
                                        value={assetCondition}
                                        onChange={(e) => setAssetCondition(e.target.value)}
                                        className="w-full rounded-xl border-slate-200 text-sm py-2.5 focus:ring-slate-900 focus:border-slate-900 shadow-sm bg-white"
                                    >
                                        <option value="active">يعمل (Active)</option>
                                        <option value="maintenance">تحت الصيانة (Maintenance)</option>
                                        <option value="broken">معطل (Broken)</option>
                                        <option value="planned">مخطط له (Planned)</option>
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-slate-700 mb-2 flex items-center gap-1">
                                    <MessageSquare size={14} className="text-slate-400" />
                                    ملاحظات فنية وإدارية
                                </label>
                                <textarea
                                    value={assetNotes}
                                    onChange={(e) => setAssetNotes(e.target.value)}
                                    placeholder="أضف ملاحظات فنية أو إدارية هنا..."
                                    className="w-full rounded-xl border-slate-200 text-sm py-2.5 focus:ring-slate-900 focus:border-slate-900 shadow-sm bg-white min-h-[80px]"
                                />
                            </div>

                            {canServe && (
                                <div>
                                    <label className="block text-xs font-bold text-slate-700 mb-2 flex items-center gap-1">
                                        <Home size={14} className="text-slate-400" />
                                        الحارة المستفيدة
                                    </label>
                                    <select
                                        value={assignedNeighborhood}
                                        onChange={(e) => setAssignedNeighborhood(e.target.value)}
                                        className="w-full rounded-xl border-slate-200 text-sm py-2.5 focus:ring-slate-900 focus:border-slate-900 shadow-sm bg-white"
                                    >
                                        <option value="">اختر الحارة...</option>
                                        {NEIGHBORHOODS.map(n => (
                                            <option key={n} value={n}>{n}</option>
                                        ))}
                                    </select>
                                </div>
                            )}

                            <div>
                                <label className="block text-xs font-bold text-slate-700 mb-3 flex items-center gap-1">
                                    <ClipboardList size={14} className="text-slate-400" />
                                    البلاغات المرتبطة ({associatedReports.length})
                                </label>
                                <div className="space-y-2">
                                    {associatedReports.map(report => (
                                        <div key={report.id} className="p-3 bg-amber-50 rounded-xl border border-amber-100 flex gap-2 items-start">
                                            <AlertCircle size={14} className="text-amber-500 mt-0.5 shrink-0" />
                                            <div className="flex-1">
                                                <div className="text-[10px] font-bold text-amber-800 mb-1">
                                                    {new Date(report.created_at).toLocaleDateString('ar-SY')}
                                                </div>
                                                <div className="text-xs text-amber-900 leading-snug">{report.description}</div>
                                            </div>
                                        </div>
                                    ))}
                                    {associatedReports.length === 0 && (
                                        <div className="text-center py-4 text-slate-400 text-xs italic bg-slate-50 rounded-xl border border-dashed">
                                            لا توجد بلاغات حالية
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="pt-2 flex flex-col gap-2">
                                <button
                                    onClick={updateAssetMetadata}
                                    className="w-full py-4 bg-slate-900 text-white font-black rounded-xl hover:bg-slate-800 flex items-center justify-center gap-2 shadow-lg shadow-slate-200"
                                >
                                    <Check size={20} /> حفظ الملاحظات والتعديلات
                                </button>

                                <button onClick={deleteAsset} className="w-full py-3 bg-rose-50 text-rose-600 font-bold rounded-xl hover:bg-rose-100 flex items-center justify-center gap-2 transition-colors border border-rose-100 mt-2">
                                    <Trash2 size={18} /> حذف هذا العنصر
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {loading && (
                    <div className="absolute inset-0 z-50 flex items-center justify-center bg-white/40 backdrop-blur-[2px]">
                        <div className="animate-spin rounded-full h-10 w-10 border-4 border-slate-200 border-t-slate-800"></div>
                    </div>
                )}
            </div>
        </AdminLayout >
    );
}
