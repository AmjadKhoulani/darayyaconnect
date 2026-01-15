import { useState, useRef, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Hash, Send, Users, MoreVertical, Plus, Image as ImageIcon, Smile } from 'lucide-react';
import api from '../services/api';

interface ChatMessage {
    id: number;
    user_id: number;
    user: { id: number; name: string };
    body: string;
    created_at: string;
    type: string;
    reply_to_id?: number | null;
    reactions?: Record<string, number>; // Local only for now
}

const channels = [
    { id: 'general', name: 'عام', description: 'دردشة عامة لكل أهل داريا' },
    { id: 'help', name: 'مساعدة', description: 'طلب وتقديم المساعدة العاجلة' },
    { id: 'news', name: 'أخبار-المدينة', description: 'آخر المستجدات لحظة بلحظة' },
    { id: 'trading', name: 'بيع-وشراء', description: 'سوق محلي لتبادل السلع' },
    { id: 'tech', name: 'تقنية', description: 'نقاشات حول التكنولوجيا والبرمجة' },
];

export default function HashtagChat() {
    const navigate = useNavigate();
    const [activeChannelId, setActiveChannelId] = useState('general');
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [newMessage, setNewMessage] = useState('');
    const [showChannels, setShowChannels] = useState(false);
    const [replyingTo, setReplyingTo] = useState<ChatMessage | null>(null);
    const [currentUser, setCurrentUser] = useState<any>(null);
    const [loading, setLoading] = useState(false);

    // Swipe & Touch states
    const [touchStartX, setTouchStartX] = useState<number | null>(null);
    const [touchCurrentX, setTouchCurrentX] = useState<number | null>(null);
    const [swipingCardId, setSwipingCardId] = useState<number | null>(null);

    const scrollRef = useRef<HTMLDivElement>(null);
    const longPressTimer = useRef<any>(null);
    const pollingInterval = useRef<any>(null);

    useEffect(() => {
        const userStr = localStorage.getItem('user');
        if (userStr) {
            setCurrentUser(JSON.parse(userStr));
        }
    }, []);

    const fetchMessages = useCallback(async () => {
        try {
            const res = await api.get(`/chat/${activeChannelId}`);
            setMessages(res.data);
        } catch (error) {
            console.error('Failed to fetch messages', error);
        }
    }, [activeChannelId]);

    useEffect(() => {
        setLoading(true);
        fetchMessages().then(() => {
            setLoading(false);
            setTimeout(() => {
                if (scrollRef.current) {
                    scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
                }
            }, 100);
        });

        // Polling every 3 seconds
        pollingInterval.current = setInterval(fetchMessages, 3000);

        return () => {
            if (pollingInterval.current) clearInterval(pollingInterval.current);
        };
    }, [activeChannelId, fetchMessages]);

    const handleSendMessage = async () => {
        if (!newMessage.trim()) return;

        const tempId = Date.now();
        const optimisticMsg: any = {
            id: tempId,
            user_id: currentUser?.id || 0,
            user: { id: currentUser?.id || 0, name: currentUser?.name || 'أنت' },
            body: newMessage,
            created_at: new Date().toISOString(),
            type: 'text',
            reply_to_id: replyingTo?.id
        };

        // Optimistic UI update
        setMessages(prev => [...prev, optimisticMsg]);
        setNewMessage('');
        setReplyingTo(null);

        // Scroll to bottom
        setTimeout(() => {
            if (scrollRef.current) {
                scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
            }
        }, 100);

        try {
            await api.post(`/chat/${activeChannelId}`, {
                body: optimisticMsg.body,
                reply_to_id: optimisticMsg.reply_to_id
            });
            fetchMessages(); // Sync real ID
        } catch (error) {
            console.error('Failed to send message', error);
            // Revert on failure (simple version: just refetch)
            fetchMessages();
        }
    };

    // --- Touch & Swipe Handlers (Same as before) ---
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
        if (diff > 100) setReplyingTo(message); // Swipe Left
        setTouchStartX(null);
        setTouchCurrentX(null);
        setSwipingCardId(null);
    };

    const activeChannel = channels.find(c => c.id === activeChannelId);

    return (
        <div className="flex h-screen bg-slate-50 dark:bg-slate-900 transition-colors duration-300 overflow-hidden" dir="rtl">
            {/* Sidebar */}
            <aside className={`fixed inset-y-0 right-0 z-40 w-64 bg-slate-100 dark:bg-slate-800 border-l border-slate-200 dark:border-slate-700 transition-transform duration-300 transform ${showChannels ? 'translate-x-0' : 'translate-x-full'} md:translate-x-0 md:relative`}>
                <div className="flex flex-col h-full">
                    <div className="p-4 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between bg-white dark:bg-slate-800">
                        <h2 className="font-black text-slate-800 dark:text-slate-100">هاشتاغ داريا</h2>
                        <Plus size={20} className="text-slate-400" />
                    </div>
                    <div className="flex-1 overflow-y-auto p-2 space-y-1">
                        {channels.map((channel) => (
                            <button
                                key={channel.id}
                                onClick={() => { setActiveChannelId(channel.id); setShowChannels(false); }}
                                className={`w-full flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-bold transition-all ${activeChannelId === channel.id
                                    ? 'bg-indigo-600 text-white shadow-lg'
                                    : 'text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700/50'
                                    }`}
                            >
                                <Hash size={18} className={activeChannelId === channel.id ? 'text-indigo-200' : 'text-slate-400'} />
                                <span>{channel.name}</span>
                            </button>
                        ))}
                    </div>
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
            <main className="flex-1 flex flex-col h-full relative bg-slate-50 dark:bg-slate-900 w-full max-w-full">
                {/* Header */}
                <header className="h-16 flex-none flex items-center justify-between px-4 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 z-30 shadow-sm">
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
                    <div className="flex items-center gap-2">
                        <button className="w-10 h-10 flex items-center justify-center text-slate-400 hover:text-indigo-600 rounded-xl"><Users size={20} /></button>
                    </div>
                </header>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto scrollbar-hide bg-pattern relative w-full">
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

                                        <div className={`relative px-4 py-2 shadow-sm text-sm font-medium leading-snug break-words ${isMe ? 'bg-indigo-600 text-white rounded-2xl rounded-tr-none' : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 rounded-2xl rounded-tl-none border border-slate-100 dark:border-slate-700/50'}`}>
                                            {message.body}
                                            <span className={`text-[9px] block text-left mt-1 opacity-70 ${isMe ? 'text-indigo-100' : 'text-slate-400'}`}>
                                                {new Date(message.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Input Area */}
                <div className="flex-none z-20 bg-white/80 dark:bg-slate-900/90 backdrop-blur-xl border-t border-slate-200 dark:border-slate-800 pb-[env(safe-area-inset-bottom)] shadow-up">
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
                        <button onClick={handleSendMessage} disabled={!newMessage.trim()} className={`w-11 h-11 rounded-full flex items-center justify-center transition-all shadow-md flex-shrink-0 ${newMessage.trim() ? 'bg-indigo-600 text-white hover:bg-indigo-700 hover:scale-105' : 'bg-slate-200 dark:bg-slate-800 text-slate-400 cursor-not-allowed'}`}><Send size={20} className="rtl:rotate-180 ml-0.5" /></button>
                    </div>
                </div>
            </main>

            {/* Show Channels Overlay */}
            {showChannels && <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-30 md:hidden animate-fade-in" onClick={() => setShowChannels(false)} />}
        </div>
    );
}
