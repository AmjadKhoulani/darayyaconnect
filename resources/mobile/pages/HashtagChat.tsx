import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Hash, Send, Users, MoreVertical, Plus, Image as ImageIcon, Smile } from 'lucide-react';

interface ChatMessage {
    id: number;
    user: string;
    text: string;
    timestamp: string;
    isAdmin?: boolean;
    avatar?: string;
    reactions?: Record<string, number>;
    replyTo?: number;
    threadCount?: number;
}

const channels = [
    { id: 'general', name: 'عام', description: 'دردشة عامة لكل أهل داريا' },
    { id: 'help', name: 'مساعدة', description: 'طلب وتقديم المساعدة العاجلة' },
    { id: 'news', name: 'أخبار-المدينة', description: 'آخر المستجدات لحظة بلحظة' },
    { id: 'trading', name: 'بيع-وشراء', description: 'سوق محلي لتبادل السلع' },
    { id: 'tech', name: 'تقنية', description: 'نقاشات حول التكنولوجيا والبرمجة' },
];

const mockMessages: Record<string, ChatMessage[]> = {
    general: [
        { id: 1, user: 'أحمد محمود', text: 'السلام عليكم يا جماعة، في حدا بيعرف إذا الطريق لعند الساحة فاتح؟', timestamp: '10:30 AM', avatar: 'https://i.pravatar.cc/150?u=1' },
        { id: 2, user: 'خالد السيد', text: 'وعليكم السلام، أي فاتح بس في زحمة شوي عند الدوار.', timestamp: '10:32 AM', avatar: 'https://i.pravatar.cc/150?u=2' },
        { id: 3, user: 'مشرف الموقع', text: 'يرجى الالتزام بقواعد الدردشة وعدم نشر الإشاعات.', timestamp: '10:35 AM', isAdmin: true, avatar: 'https://i.pravatar.cc/150?u=admin' },
        { id: 4, user: 'ياسين ك.', text: 'تمام شكراً جزيلاً.', timestamp: '10:36 AM', avatar: 'https://i.pravatar.cc/150?u=3' },
    ],
    help: [
        { id: 1, user: 'سامر ن.', text: 'مطلوب تبرع بالدم زمرة O- لمشفى الباسل بشكل عاجل.', timestamp: '09:00 AM', avatar: 'https://i.pravatar.cc/150?u=4' },
        { id: 2, user: 'عمر ف.', text: 'أنا جاهز، كيف بقدر أتواصل؟', timestamp: '09:05 AM', avatar: 'https://i.pravatar.cc/150?u=5' },
    ]
};

export default function HashtagChat() {
    const navigate = useNavigate();
    const [activeChannelId, setActiveChannelId] = useState('general');
    const [messages, setMessages] = useState<ChatMessage[]>(mockMessages['general'] || []);
    const [newMessage, setNewMessage] = useState('');
    const [showChannels, setShowChannels] = useState(false);
    const [replyingTo, setReplyingTo] = useState<ChatMessage | null>(null);
    const [activeThread, setActiveThread] = useState<ChatMessage | null>(null);
    const [touchStartX, setTouchStartX] = useState<number | null>(null);
    const [touchCurrentX, setTouchCurrentX] = useState<number | null>(null);
    const [swipingCardId, setSwipingCardId] = useState<number | null>(null);
    const scrollRef = useRef<HTMLDivElement>(null);
    const longPressTimer = useRef<any>(null);

    useEffect(() => {
        setMessages(mockMessages[activeChannelId] || []);
    }, [activeChannelId]);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

    const handleSendMessage = () => {
        if (!newMessage.trim()) return;
        const msg: ChatMessage = {
            id: Date.now(),
            user: 'أنت',
            text: newMessage,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            avatar: 'https://i.pravatar.cc/150?u=me',
            replyTo: replyingTo?.id
        };
        setMessages([...messages, msg]);
        setNewMessage('');
        setReplyingTo(null);
    };

    const handleReaction = (messageId: number, emoji: string) => {
        setMessages(prev => prev.map(m => {
            if (m.id === messageId) {
                const reactions = { ...m.reactions };
                reactions[emoji] = (reactions[emoji] || 0) + 1;
                return { ...m, reactions };
            }
            return m;
        }));
    };

    const handleTouchStart = (e: React.TouchEvent, messageId: number) => {
        setTouchStartX(e.touches[0].clientX);
        setSwipingCardId(messageId);

        longPressTimer.current = setTimeout(() => {
            const confirmReport = window.confirm('هل تريد الإبلاغ عن هذه الرسالة؟');
            if (confirmReport) alert('تم إرسال البلاغ للمشرفين.');
        }, 800);
    };

    const handleTouchMove = (e: React.TouchEvent) => {
        if (touchStartX === null) return;
        const currentX = e.touches[0].clientX;
        setTouchCurrentX(currentX); // Track current position for visual feedback
        const diff = touchStartX - currentX;
        if (Math.abs(diff) > 10) clearTimeout(longPressTimer.current);
    };

    const handleTouchEnd = (e: React.TouchEvent, message: ChatMessage) => {
        clearTimeout(longPressTimer.current);
        if (touchStartX === null) return;
        const diff = touchStartX - e.changedTouches[0].clientX;

        if (diff > 100) { // Swipe Left (Reply)
            setReplyingTo(message);
        } else if (diff < -100) { // Swipe Right (Thread)
            setActiveThread(message);
        }

        setTouchStartX(null);
        setTouchCurrentX(null);
        setSwipingCardId(null);
    };

    const activeChannel = channels.find(c => c.id === activeChannelId);

    return (
        <div className="flex h-screen bg-slate-50 dark:bg-slate-900 transition-colors duration-300 overflow-hidden" dir="rtl">
            {/* Sidebar (Discord Style) */}
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
                                onClick={() => {
                                    setActiveChannelId(channel.id);
                                    setShowChannels(false);
                                }}
                                className={`w-full flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-bold transition-all ${activeChannelId === channel.id
                                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20'
                                    : 'text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700/50'
                                    }`}
                            >
                                <Hash size={18} className={activeChannelId === channel.id ? 'text-indigo-200' : 'text-slate-400'} />
                                <span>{channel.name}</span>
                            </button>
                        ))}
                    </div>
                    <div className="p-4 bg-slate-200 dark:bg-slate-900/50 flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-indigo-500 border-2 border-white dark:border-slate-700 overflow-hidden">
                            <img src="https://i.pravatar.cc/150?u=me" alt="User" />
                        </div>
                        <div className="flex-1 text-right">
                            <p className="text-xs font-black text-slate-800 dark:text-slate-100">أنت</p>
                            <p className="text-[10px] text-emerald-500 font-bold uppercase">متصل</p>
                        </div>
                    </div>
                </div>
            </aside>

            {/* Main Chat Area */}
            <main className="flex-1 flex flex-col h-full relative bg-slate-50 dark:bg-slate-900 w-full max-w-full">
                {/* Chat Header */}
                <header className="h-16 flex-none flex items-center justify-between px-4 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 z-30 shadow-sm">
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => navigate(-1)}
                            className="w-10 h-10 flex items-center justify-center bg-slate-50 dark:bg-slate-800 rounded-xl transition-colors text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700 md:hidden active:scale-95"
                        >
                            <ArrowRight size={20} />
                        </button>
                        <button
                            onClick={() => setShowChannels(!showChannels)}
                            className="flex items-center gap-3 group px-2 py-1 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                        >
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
                        <button className="w-10 h-10 flex items-center justify-center text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 rounded-xl transition-all">
                            <Users size={20} />
                        </button>
                        <button className="w-10 h-10 flex items-center justify-center text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 rounded-xl transition-all">
                            <MoreVertical size={20} />
                        </button>
                    </div>
                </header>

                {/* Messages List Container */}
                <div className="flex-1 overflow-y-auto scrollbar-hide bg-pattern relative w-full">
                    <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#6366f1 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>

                    <div ref={scrollRef} className="p-4 space-y-4 pb-4 min-h-full flex flex-col justify-end">
                        <div className="flex flex-col items-center py-10 opacity-40 text-center mb-auto">
                            <div className="w-20 h-20 bg-indigo-100 dark:bg-indigo-900/30 rounded-full flex items-center justify-center mb-4 text-indigo-500 dark:text-indigo-400">
                                <Hash size={40} />
                            </div>
                            <h4 className="font-black text-lg text-slate-700 dark:text-slate-200">مرحباً بك في #{activeChannel?.name}!</h4>
                            <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 px-10">
                                هذه بداية المحادثة. تذكر أن تكون لطيفاً ومحترماً مع الجميع.
                            </p>
                        </div>

                        {messages.map((message) => {
                            const isMe = message.user === 'أنت';
                            const repliedMessage = message.replyTo ? messages.find(m => m.id === message.replyTo) : null;
                            const isSwiping = swipingCardId === message.id && touchCurrentX !== null && touchStartX !== null;
                            const swipeDiff = isSwiping ? touchCurrentX! - touchStartX! : 0;

                            // Visual feedback for swipe
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
                                    {/* Swipe Indicators */}
                                    {isSwiping && swipeDiff > 50 && (
                                        <div className="absolute left-[-40px] top-1/2 -translate-y-1/2 text-indigo-500 animate-pulse">
                                            <ArrowRight size={24} className="rotate-180" />
                                        </div>
                                    )}
                                    {isSwiping && swipeDiff < -50 && (
                                        <div className="absolute right-[-40px] top-1/2 -translate-y-1/2 text-indigo-500 animate-pulse">
                                            <ArrowRight size={24} />
                                        </div>
                                    )}

                                    <div className="flex flex-col items-center justify-end pb-1">
                                        <div className={`w-8 h-8 rounded-full flex-shrink-0 overflow-hidden shadow-sm border-2 ${isMe ? 'border-indigo-200 dark:border-indigo-900' : 'border-white dark:border-slate-700'}`}>
                                            <img src={message.avatar} alt={message.user} className="w-full h-full object-cover" />
                                        </div>
                                    </div>

                                    <div className={`flex flex-col max-w-[85%] ${isMe ? 'items-end' : 'items-start'}`}>
                                        <div className="flex items-center gap-2 mb-1 px-1">
                                            <span className={`text-[11px] font-bold ${message.isAdmin ? 'text-red-500' : isMe ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-600 dark:text-slate-400'}`}>
                                                {message.user}
                                            </span>
                                            {message.isAdmin && (
                                                <span className="text-[8px] bg-red-100 dark:bg-red-900/40 text-red-600 dark:text-red-400 px-1.5 py-0.5 rounded font-black uppercase">مشرف</span>
                                            )}
                                        </div>

                                        {repliedMessage && (
                                            <div className={`mb-1 text-[10px] bg-slate-100 dark:bg-slate-800/80 px-3 py-1.5 rounded-xl border-l-4 ${isMe ? 'border-indigo-300 rounded-tr-none' : 'border-slate-300 rounded-tl-none'} opacity-80 max-w-full truncate`}>
                                                <span className="font-bold opacity-70 block mb-0.5">رد على {repliedMessage.user}</span>
                                                <span className="opacity-60">{repliedMessage.text}</span>
                                            </div>
                                        )}

                                        <div className={`relative px-4 py-2 shadow-sm text-sm font-medium leading-snug break-words ${isMe
                                            ? 'bg-indigo-600 text-white rounded-2xl rounded-tr-none'
                                            : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 rounded-2xl rounded-tl-none border border-slate-100 dark:border-slate-700/50'
                                            }`}>
                                            {message.text}
                                            <span className={`text-[9px] block text-left mt-1 opacity-70 ${isMe ? 'text-indigo-100' : 'text-slate-400'}`}>
                                                {message.timestamp}
                                            </span>
                                        </div>

                                        {/* Reactions Display */}
                                        {message.reactions && Object.keys(message.reactions).length > 0 && (
                                            <div className={`flex flex-wrap gap-1 mt-1 ${isMe ? 'justify-end' : 'justify-start'}`}>
                                                {Object.entries(message.reactions).map(([emoji, count]) => (
                                                    <button
                                                        key={emoji}
                                                        onClick={() => handleReaction(message.id, emoji)}
                                                        className="px-1.5 py-0.5 bg-white dark:bg-slate-800 rounded-full text-[10px] font-bold shadow-sm border border-slate-100 dark:border-slate-700 flex items-center gap-1 hover:scale-110 transition-transform"
                                                    >
                                                        <span>{emoji}</span>
                                                        {count > 1 && <span className="text-slate-400">{count}</span>}
                                                    </button>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Input Area (Flexbox, not fixed) */}
                <div className="flex-none z-20 bg-white/80 dark:bg-slate-900/90 backdrop-blur-xl border-t border-slate-200 dark:border-slate-800 pb-[env(safe-area-inset-bottom)] shadow-up">
                    {/* Reply Preview */}
                    {replyingTo && (
                        <div className="px-4 pt-3 pb-1 flex items-center justify-between animate-slide-up">
                            <div className="flex-1 bg-slate-50 dark:bg-slate-800 border-l-4 border-indigo-500 rounded-r-lg px-3 py-2">
                                <p className="text-[10px] font-bold text-indigo-600 mb-0.5">الرد على {replyingTo.user}</p>
                                <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1">{replyingTo.text}</p>
                            </div>
                            <button onClick={() => setReplyingTo(null)} className="ml-3 w-8 h-8 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-center text-slate-400 transition-colors">
                                <Plus size={20} className="rotate-45" />
                            </button>
                        </div>
                    )}

                    <div className="p-3 flex items-end gap-2 max-w-4xl mx-auto w-full">
                        <button className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 flex items-center justify-center transition-all flex-shrink-0">
                            <Plus size={22} />
                        </button>

                        <div className="flex-1 bg-slate-100 dark:bg-slate-800 rounded-[24px] flex items-end border border-transparent focus-within:border-indigo-500/50 focus-within:ring-2 focus-within:ring-indigo-500/10 transition-all max-h-[140px] overflow-hidden">
                            <textarea
                                rows={1}
                                style={{ minHeight: '44px', maxHeight: '120px' }}
                                placeholder={`رسالة إلى #${activeChannel?.name}`}
                                className="flex-1 bg-transparent border-none focus:ring-0 text-sm font-medium text-slate-800 dark:text-slate-100 placeholder-slate-400 px-4 py-3 resize-none custom-scrollbar"
                                value={newMessage}
                                onChange={(e) => {
                                    setNewMessage(e.target.value);
                                    e.target.style.height = 'auto'; // Reset height
                                    e.target.style.height = `${Math.min(e.target.scrollHeight, 120)}px`; // Auto-grow
                                }}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter' && !e.shiftKey) {
                                        e.preventDefault();
                                        handleSendMessage();
                                    }
                                }}
                            />
                            <button className="p-3 text-slate-400 hover:text-amber-500 transition-colors">
                                <Smile size={20} />
                            </button>
                        </div>

                        <button
                            onClick={handleSendMessage}
                            disabled={!newMessage.trim()}
                            className={`w-11 h-11 rounded-full flex items-center justify-center transition-all shadow-md flex-shrink-0 ${newMessage.trim()
                                ? 'bg-indigo-600 text-white hover:bg-indigo-700 hover:shadow-indigo-500/30 hover:scale-105'
                                : 'bg-slate-200 dark:bg-slate-800 text-slate-400 cursor-not-allowed'
                                }`}
                        >
                            <Send size={20} className="rtl:rotate-180 ml-0.5" />
                        </button>
                    </div>
                </div>
            </main>

            {/* Thread Drawer */}
            {activeThread && (
                <div className="fixed inset-0 z-50 flex justify-end">
                    <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setActiveThread(null)}></div>
                    <div className="relative w-full max-w-sm bg-white dark:bg-slate-900 h-full shadow-2xl animate-slide-in-right flex flex-col">
                        <header className="h-16 flex items-center justify-between px-4 border-b border-slate-200 dark:border-slate-800">
                            <h3 className="font-black text-slate-800 dark:text-slate-100">المحادثة المتصلة</h3>
                            <button onClick={() => setActiveThread(null)} className="w-8 h-8 flex items-center justify-center bg-slate-100 dark:bg-slate-800 rounded-full">×</button>
                        </header>
                        <div className="flex-1 overflow-y-auto p-4 space-y-4">
                            <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700">
                                <p className="text-xs font-black text-indigo-600 mb-1">{activeThread.user}</p>
                                <p className="text-sm text-slate-800 dark:text-slate-100 leading-relaxed font-bold">{activeThread.text}</p>
                            </div>
                            <div className="h-1 bg-slate-100 dark:bg-slate-800 rounded-full w-20 mx-auto my-4"></div>
                            <p className="text-center text-[10px] font-black text-slate-400 uppercase tracking-widest">جميع الردود</p>
                            <div className="text-center py-10 opacity-30 text-xs">لا يوجد ردود في هذا الخيط بعد.</div>
                        </div>
                        <div className="p-4 border-t border-slate-100 dark:border-slate-800">
                            <button className="w-full py-3 bg-indigo-600 text-white rounded-xl font-bold text-sm shadow-lg">أضف رداً للخيط</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Overlay for mobile channel list */}
            {showChannels && (
                <div
                    className="fixed inset-0 bg-black/20 backdrop-blur-sm z-30 md:hidden animate-fade-in"
                    onClick={() => setShowChannels(false)}
                />
            )}
        </div>
    );
}
