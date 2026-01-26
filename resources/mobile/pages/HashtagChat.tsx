import { useState, useRef, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Hash, Send, Users, MoreVertical, Plus, Image as ImageIcon, Smile, Bell, BellOff, X, MapPin, Navigation } from 'lucide-react';
import api from '../services/api';
import { NotificationService } from '../services/notification';
import { Geolocation } from '@capacitor/geolocation';

interface ChatMessage {
    id: number;
    user_id: number;
    user: { id: number; name: string };
    body: string;
    created_at: string;
    type: string;
    reply_to_id?: number | null;
    reactions?: Record<string, number>;
}

interface Channel {
    id: number;
    name: string;
    slug: string;
    description: string;
    icon: string;
    is_muted: boolean;
}

export default function HashtagChat() {
    const navigate = useNavigate();
    const [channels, setChannels] = useState<Channel[]>([]);
    const [activeChannelId, setActiveChannelId] = useState('general');
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [newMessage, setNewMessage] = useState('');
    const [showChannels, setShowChannels] = useState(false);
    const [showAddChannel, setShowAddChannel] = useState(false);
    const [replyingTo, setReplyingTo] = useState<ChatMessage | null>(null);
    const [currentUser, setCurrentUser] = useState<any>(null);
    const [loading, setLoading] = useState(false);
    const [newChannelData, setNewChannelData] = useState({ name: '', description: '' });

    // Swipe & Touch states
    const [touchStartX, setTouchStartX] = useState<number | null>(null);
    const [touchCurrentX, setTouchCurrentX] = useState<number | null>(null);
    const [swipingCardId, setSwipingCardId] = useState<number | null>(null);

    const scrollRef = useRef<HTMLDivElement>(null);
    const longPressTimer = useRef<any>(null);
    const pollingInterval = useRef<any>(null);

    const fetchChannels = async () => {
        try {
            const res = await api.get('/chat-channels');
            setChannels(res.data.channels);
        } catch (error) {
            console.error('Failed to fetch channels', error);
        }
    };

    useEffect(() => {
        const userStr = localStorage.getItem('user');
        if (userStr) {
            setCurrentUser(JSON.parse(userStr));
        }
        fetchChannels();
        NotificationService.requestPermissions();
    }, []);

    const fetchMessages = useCallback(async () => {
        try {
            const res = await api.get(`/chat/${activeChannelId}`);
            setMessages(res.data);
        } catch (error) {
            console.error('Failed to fetch messages', error);
        }
    }, [activeChannelId]);

    const [initialLoad, setInitialLoad] = useState(true);

    const scrollToBottom = (instant = false) => {
        if (scrollRef.current) {
            const scroll = () => {
                scrollRef.current!.scrollTop = scrollRef.current!.scrollHeight;
            };
            if (instant) {
                scroll();
            } else {
                requestAnimationFrame(() => setTimeout(scroll, 100));
            }
        }
    };

    useEffect(() => {
        setLoading(true);
        setInitialLoad(true);

        fetchMessages().then(() => {
            setLoading(false);
            setInitialLoad(false);
            scrollToBottom(false);
        });

        pollingInterval.current = setInterval(async () => {
            await fetchMessages();
        }, 1500);

        return () => {
            if (pollingInterval.current) clearInterval(pollingInterval.current);
        };
    }, [activeChannelId]);

    useEffect(() => {
        if (initialLoad) {
            scrollToBottom(true);
        }
    }, [messages, initialLoad]);

    const handleSendMessage = async (type = 'text', content = '') => {
        const bodyToSend = content || newMessage;
        if (!bodyToSend.trim()) return;

        const tempId = Date.now();
        const optimisticMsg: any = {
            id: tempId,
            user_id: currentUser?.id || 0,
            user: { id: currentUser?.id || 0, name: currentUser?.name || 'أنت' },
            body: bodyToSend,
            created_at: new Date().toISOString(),
            type: type,
            reply_to_id: replyingTo?.id
        };

        setMessages(prev => [...prev, optimisticMsg]);
        setNewMessage('');
        setReplyingTo(null);

        setTimeout(() => {
            if (scrollRef.current) {
                scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
            }
        }, 100);

        try {
            await api.post(`/chat/${activeChannelId}`, {
                body: optimisticMsg.body,
                reply_to_id: optimisticMsg.reply_to_id,
                type: type // NOTE: Backend needs to support this field in fillable
            });
            fetchMessages();
        } catch (error) {
            console.error('Failed to send message', error);
            fetchMessages();
        }
    };

    const handleShareLocation = async () => {
        try {
            const pos = await Geolocation.getCurrentPosition();
            const { latitude, longitude } = pos.coords;
            const locationString = `${latitude},${longitude}`;
            await handleSendMessage('location', locationString);
        } catch (e) {
            alert('تعذر الحصول على موقعك. تأكد من تفعيل GPS.');
        }
    };

    const handleOpenMap = (coords: string, userName: string) => {
        // Navigate to a new Live Tracking Page or Google Maps
        // For internal tracking:
        const [lat, lng] = coords.split(',');
        // For now, simpler Google Maps link, but user asked for "Open full map with moving dot".
        // Use the AdminUserMap logic but specific to this user?
        // Let's assume we build a `LiveTrackUser.tsx` page.
        navigate(`/live-track?lat=${lat}&lng=${lng}&name=${userName}`);
    };

    // --- Touch & Swipe Handlers ---
    const handleTouchStart = (e: React.TouchEvent, messageId: number) => {
        setTouchStartX(e.touches[0].clientX);
        setSwipingCardId(messageId);
        longPressTimer.current = setTimeout(() => {
            if (window.confirm('هل تريد الإبلاغ عن هذه الرسالة؟')) alert('تم الإبلاغ.');
        }, 800);
    };

    const handleTouchMove = (e: React.TouchEvent) => {
        if (touchStartX === null) return;
        setTouchCurrentX(e.touches[0].clientX);
        if (Math.abs(touchStartX - e.touches[0].clientX) > 10) clearTimeout(longPressTimer.current);
    };

    const handleTouchEnd = (e: React.TouchEvent, message: ChatMessage) => {
        clearTimeout(longPressTimer.current);
        if (touchStartX === null) return;
        const diff = touchStartX - e.changedTouches[0].clientX;
        if (diff > 100) setReplyingTo(message);
        setTouchStartX(null);
        setTouchCurrentX(null);
        setSwipingCardId(null);
    };

    const toggleMute = async (channelId: number) => {
        try {
            const res = await api.post(`/chat-channels/${channelId}/mute`);
            setChannels(prev => prev.map(c => c.id === channelId ? { ...c, is_muted: res.data.is_muted } : c));
        } catch (error) {
            console.error('Failed to toggle mute', error);
        }
    };

    const handleCreateChannel = async () => {
        if (!newChannelData.name) return;
        try {
            const slug = newChannelData.name.toLowerCase().replace(/\s+/g, '-');
            await api.post('/chat-channels', { ...newChannelData, slug });
            setShowAddChannel(false);
            setNewChannelData({ name: '', description: '' });
            fetchChannels();
        } catch (error: any) {
            console.error(error);
            const msg = error.response?.data?.message || 'Failed to create channel';
            alert(`خطأ: ${msg}`);
        }
    };

    const activeChannel = channels.find(c => c.slug === activeChannelId);
    const isAdmin = currentUser?.role === 'admin';

    return (
        <div className="flex h-[100dvh] bg-slate-50 dark:bg-slate-900 transition-colors duration-300 overflow-hidden overscroll-none" dir="rtl">
            {/* Sidebar */}
            <aside className={`fixed inset-y-0 right-0 z-40 w-64 bg-slate-100 dark:bg-slate-800 border-l border-slate-200 dark:border-slate-700 transition-transform duration-300 transform ${showChannels ? 'translate-x-0' : 'translate-x-full'} md:translate-x-0 md:relative`}>
                <div className="flex flex-col h-full">
                    <div className="p-4 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between bg-white dark:bg-slate-800">
                        <h2 className="font-black text-slate-800 dark:text-slate-100">هاشتاغ داريا</h2>
                        <Plus size={20} className="text-slate-400" />
                    </div>
                    <div className="flex-1 overflow-y-auto p-2 space-y-1">
                        {channels.map((channel) => (
                            <div key={channel.id} className="flex items-center gap-1 group/channel">
                                <button
                                    onClick={() => { setActiveChannelId(channel.slug); setShowChannels(false); }}
                                    className={`flex-1 flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-bold transition-all ${activeChannelId === channel.slug
                                        ? 'bg-indigo-600 text-white shadow-lg'
                                        : 'text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700/50'
                                        }`}
                                >
                                    <Hash size={18} className={activeChannelId === channel.slug ? 'text-indigo-200' : 'text-slate-400'} />
                                    <span>{channel.name}</span>
                                </button>
                                <button
                                    onClick={() => toggleMute(channel.id)}
                                    className={`p-2 rounded-lg transition-colors ${channel.is_muted ? 'text-slate-400' : 'text-indigo-500 bg-indigo-50 dark:bg-indigo-900/20'} active:scale-90`}
                                >
                                    {channel.is_muted ? <BellOff size={16} /> : <Bell size={16} />}
                                </button>
                            </div>
                        ))}
                    </div>
                    {isAdmin && (
                        <div className="p-2 border-t border-slate-200 dark:border-slate-700">
                            <button
                                onClick={() => setShowAddChannel(true)}
                                className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl text-xs font-bold bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-50"
                            >
                                <Plus size={14} />
                                إضافة قناة جديدة
                            </button>
                        </div>
                    )}
                    {currentUser && (
                        <div className="p-4 bg-slate-200 dark:bg-slate-900/50 flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-indigo-500 border-2 border-white dark:border-slate-700 flex items-center justify-center text-white font-bold">
                                {currentUser.name.charAt(0)}
                            </div>
                            <div className="flex-1 text-right truncate">
                                <p className="text-xs font-black text-slate-800 dark:text-slate-100 truncate">{currentUser.name}</p>
                                <p className="text-[10px] text-emerald-500 font-bold uppercase">متصل</p>
                            </div>
                        </div>
                    )}
                </div>
            </aside>

            {/* Main Chat Area */}
            <main className="flex-1 flex flex-col relative bg-slate-50 dark:bg-slate-900 overflow-hidden">
                {/* Header */}
                <header className="flex-none h-16 flex items-center justify-between px-4 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 z-30 shadow-sm">
                    <div className="flex items-center gap-3">
                        <button onClick={() => navigate(-1)} className="w-10 h-10 flex items-center justify-center bg-slate-50 dark:bg-slate-800 rounded-xl text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700 md:hidden active:scale-95">
                            <ArrowRight size={20} />
                        </button>
                        <button onClick={() => setShowChannels(!showChannels)} className="flex items-center gap-3 group px-2 py-1 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                            <div className="w-10 h-10 bg-indigo-50 dark:bg-indigo-900/30 rounded-full flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                                <Hash size={20} />
                            </div>
                            <div className="text-right">
                                <h3 className="font-bold text-slate-800 dark:text-slate-100 leading-none text-sm">{activeChannel?.name}</h3>
                                <p className="text-[10px] text-slate-400 font-medium mt-1 truncate max-w-[150px]">{activeChannel?.description}</p>
                            </div>
                        </button>
                    </div>
                </header>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto scrollbar-hide bg-pattern relative w-full pb-24">
                    <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#6366f1 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
                    <div ref={scrollRef} className="p-4 space-y-4 pb-4 min-h-full flex flex-col justify-end">
                        {loading && messages.length === 0 && (
                            <div className="flex justify-center p-10"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div></div>
                        )}

                        {!loading && messages.length === 0 && (
                            <div className="flex flex-col items-center py-10 opacity-40 text-center mb-auto">
                                <div className="w-20 h-20 bg-indigo-100 dark:bg-indigo-900/30 rounded-full flex items-center justify-center mb-4 text-indigo-500 dark:text-indigo-400"><Hash size={40} /></div>
                                <h4 className="font-black text-lg text-slate-700 dark:text-slate-200">مرحباً بك في #{activeChannel?.name}!</h4>
                                <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 px-10">كن أول من يكتب هنا...</p>
                            </div>
                        )}

                        {messages.map((message) => {
                            const isMe = message.user_id === currentUser?.id;
                            const repliedMessage = message.reply_to_id ? messages.find(m => m.id === message.reply_to_id) : null;
                            const isSwiping = swipingCardId === message.id && touchCurrentX !== null && touchStartX !== null;
                            const swipeDiff = isSwiping ? touchCurrentX! - touchStartX! : 0;
                            const swipeStyle = isSwiping ? { transform: `translateX(${swipeDiff * 0.5}px)`, transition: 'none' } : { transition: 'transform 0.2s ease-out' };
                            const isLocation = message.type === 'location';

                            return (
                                <div
                                    key={message.id}
                                    className={`relative flex gap-3 group ${isMe ? 'flex-row-reverse' : ''}`}
                                    style={swipeStyle}
                                    onTouchStart={(e) => handleTouchStart(e, message.id)}
                                    onTouchMove={handleTouchMove}
                                    onTouchEnd={(e) => handleTouchEnd(e, message)}
                                >
                                    {isSwiping && swipeDiff > 50 && <div className="absolute left-[-40px] top-1/2 -translate-y-1/2 text-indigo-500 animate-pulse"><ArrowRight size={24} className="rotate-180" /></div>}

                                    <div className="flex flex-col items-center justify-end pb-1">
                                        <div className={`w-8 h-8 rounded-full flex-shrink-0 overflow-hidden shadow-sm border-2 flex items-center justify-center bg-slate-200 dark:bg-slate-700 font-bold text-xs ${isMe ? 'border-indigo-200 dark:border-indigo-900 text-indigo-700' : 'border-white dark:border-slate-700 text-slate-600'}`}>
                                            {message.user.name.charAt(0)}
                                        </div>
                                    </div>

                                    <div className={`flex flex-col max-w-[85%] ${isMe ? 'items-end' : 'items-start'}`}>
                                        <div className="flex items-center gap-2 mb-1 px-1">
                                            <span className={`text-[11px] font-bold ${isMe ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-600 dark:text-slate-400'}`}>{message.user.name}</span>
                                        </div>

                                        {repliedMessage && (
                                            <div className={`mb-1 text-[10px] bg-slate-100 dark:bg-slate-800/80 px-3 py-1.5 rounded-xl border-l-4 ${isMe ? 'border-indigo-300 rounded-tr-none' : 'border-slate-300 rounded-tl-none'} opacity-80 max-w-full truncate`}>
                                                <span className="font-bold opacity-70 block mb-0.5">رد على {repliedMessage.user.name}</span>
                                                <span className="opacity-60">{repliedMessage.body}</span>
                                            </div>
                                        )}

                                        <div className={`relative px-4 py-2 shadow-sm text-sm font-medium leading-snug break-words ${isLocation
                                                ? 'bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-2 rounded-2xl w-56'
                                                : (isMe ? 'bg-indigo-600 text-white rounded-2xl rounded-tr-none' : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 rounded-2xl rounded-tl-none border border-slate-100 dark:border-slate-700/50')
                                            }`}>
                                            {isLocation ? (
                                                <div onClick={() => handleOpenMap(message.body, message.user.name)} className="cursor-pointer">
                                                    <div className="flex items-center gap-2 mb-2">
                                                        <div className="w-8 h-8 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center text-emerald-600">
                                                            <MapPin size={16} />
                                                        </div>
                                                        <span className="text-xs font-black text-slate-700 dark:text-slate-200">مشاركة موقع مباشر</span>
                                                    </div>
                                                    <div className="h-24 bg-slate-200 dark:bg-slate-700 rounded-xl relative overflow-hidden flex items-center justify-center group mb-2">
                                                        {/* Mini Map Placeholder pattern */}
                                                        <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '10px 10px' }} />
                                                        <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm px-3 py-1.5 rounded-full text-[10px] font-bold shadow-sm flex items-center gap-1">
                                                            <Navigation size={12} className="text-indigo-500" />
                                                            اضغط للتتبع
                                                        </div>
                                                    </div>
                                                    <div className="text-[10px] text-slate-400 text-center">يتم تحديث الموقع مباشرة</div>
                                                </div>
                                            ) : (
                                                <>
                                                    {message.body}
                                                    <span className={`text-[9px] block text-left mt-1 opacity-70 ${isMe ? 'text-indigo-100' : 'text-slate-400'}`}>
                                                        {new Date(message.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                    </span>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Input Area */}
                <div className="fixed bottom-0 left-0 right-0 z-20 bg-white/80 dark:bg-slate-900/90 backdrop-blur-xl border-t border-slate-200 dark:border-slate-800 pb-[env(safe-area-inset-bottom)] shadow-up md:absolute md:w-full">
                    {replyingTo && (
                        <div className="px-4 pt-3 pb-1 flex items-center justify-between animate-slide-up">
                            <div className="flex-1 bg-slate-50 dark:bg-slate-800 border-l-4 border-indigo-500 rounded-r-lg px-3 py-2">
                                <p className="text-[10px] font-bold text-indigo-600 mb-0.5">الرد على {replyingTo.user.name}</p>
                                <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1">{replyingTo.body}</p>
                            </div>
                            <button onClick={() => setReplyingTo(null)} className="ml-3 w-8 h-8 rounded-full hover:bg-slate-100 flex items-center justify-center text-slate-400"><Plus size={20} className="rotate-45" /></button>
                        </div>
                    )}

                    <div className="p-3 flex items-end gap-2 max-w-4xl mx-auto w-full">
                        <button
                            onClick={handleShareLocation}
                            className="w-11 h-11 rounded-full flex items-center justify-center transition-all bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-100 active:scale-95 border border-emerald-100 dark:border-emerald-800/50"
                        >
                            <MapPin size={20} />
                        </button>

                        <div className="flex-1 bg-slate-100 dark:bg-slate-800 rounded-[24px] flex items-end border border-transparent focus-within:border-indigo-500/50 focus-within:ring-2 focus-within:ring-indigo-500/10 transition-all max-h-[140px] overflow-hidden">
                            <textarea
                                rows={1}
                                style={{ minHeight: '44px', maxHeight: '120px' }}
                                placeholder={`رسالة إلى #${activeChannel?.name}`}
                                className="flex-1 bg-transparent border-none focus:ring-0 text-sm font-medium text-slate-800 dark:text-slate-100 placeholder-slate-400 px-4 py-3 resize-none custom-scrollbar"
                                value={newMessage}
                                onChange={(e) => { setNewMessage(e.target.value); e.target.style.height = 'auto'; e.target.style.height = `${Math.min(e.target.scrollHeight, 120)}px`; }}
                                onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSendMessage(); } }}
                            />
                            <button className="p-3 text-slate-400 hover:text-amber-500 transition-colors"><Smile size={20} /></button>
                        </div>
                        <button onClick={() => handleSendMessage()} disabled={!newMessage.trim()} className={`w-11 h-11 rounded-full flex items-center justify-center transition-all shadow-md flex-shrink-0 ${newMessage.trim() ? 'bg-indigo-600 text-white hover:bg-indigo-700 hover:scale-105' : 'bg-slate-200 dark:bg-slate-800 text-slate-400 cursor-not-allowed'}`}><Send size={20} className="rtl:rotate-180 ml-0.5" /></button>
                    </div>
                </div>
            </main>

            {/* Show Channels Overlay */}
            {showChannels && <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-30 md:hidden animate-fade-in" onClick={() => setShowChannels(false)} />}

            {/* Add Channel Modal */}
            {showAddChannel && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-white dark:bg-slate-800 w-full max-w-sm rounded-3xl shadow-2xl p-6">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-lg font-black text-slate-800 dark:text-white">إنشاء قناة جديدة</h3>
                            <button onClick={() => setShowAddChannel(false)} className="p-2 bg-slate-100 dark:bg-slate-700 rounded-full text-slate-400">
                                <X size={20} />
                            </button>
                        </div>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-slate-500 mb-1.5 ml-1">اسم القناة</label>
                                <input
                                    type="text"
                                    className="w-full bg-slate-50 dark:bg-slate-900 border-none rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-indigo-500 transition-all font-medium"
                                    placeholder="مثلاً: أخبار-الحي"
                                    value={newChannelData.name}
                                    onChange={(e) => setNewChannelData({ ...newChannelData, name: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-500 mb-1.5 ml-1">الوصف</label>
                                <textarea
                                    className="w-full bg-slate-50 dark:bg-slate-900 border-none rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-indigo-500 transition-all font-medium resize-none h-24"
                                    placeholder="عن ماذا تتحدث هذه القناة؟"
                                    value={newChannelData.description}
                                    onChange={(e) => setNewChannelData({ ...newChannelData, description: e.target.value })}
                                />
                            </div>
                            <button
                                onClick={handleCreateChannel}
                                disabled={!newChannelData.name}
                                className="w-full bg-indigo-600 text-white py-4 rounded-xl font-bold text-sm shadow-lg shadow-indigo-200 dark:shadow-none hover:bg-indigo-700 transition-all disabled:opacity-50 disabled:bg-slate-400"
                            >
                                إنشاء القناة
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
