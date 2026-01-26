import { useState, useEffect } from 'react';

export default function HelloCarousel() {
    const messages = [
        {
            title: "هلا بيك في",
            highlight: "مجتمع داريا",
            subtitle: "منصتك الأولى للتواصل، الخدمات، وإدارة المدينة بذكاء."
        },
        {
            title: "خدماتك",
            highlight: "بين يديك",
            subtitle: "تابع حالة الكهرباء، المياه، والخدمات لحظة بلحظة."
        },
        {
            title: "شاركنا",
            highlight: "بصوتك",
            subtitle: "قدم البلاغات، شارك في الاستطلاعات، وكن جزءاً من القرار."
        }
    ];

    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % messages.length);
        }, 5000); // Rotate every 5 seconds

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="relative h-32 flex flex-col justify-center">
            {messages.map((msg, index) => (
                <div
                    key={index}
                    className={`absolute inset-0 flex flex-col justify-center items-start text-right transition-all duration-700 ease-in-out ${index === currentIndex
                            ? 'opacity-100 translate-y-0'
                            : 'opacity-0 translate-y-4 pointer-events-none'
                        }`}
                >
                    <span className="inline-block px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-xs font-bold text-white border border-white/20 mb-3 shadow-sm">
                        ✨ {msg.title}
                    </span>
                    <h2 className="text-3xl font-black text-white mb-2 leading-tight drop-shadow-sm">
                        {msg.title} <span className="text-emerald-100">{msg.highlight}</span>
                    </h2>
                    <p className="text-emerald-50 text-sm font-medium leading-relaxed max-w-[95%] line-clamp-2">
                        {msg.subtitle}
                    </p>
                </div>
            ))}

            {/* Indicators */}
            <div className="absolute bottom-0 left-0 flex gap-1.5">
                {messages.map((_, index) => (
                    <div
                        key={index}
                        className={`h-1.5 rounded-full transition-all duration-500 ${index === currentIndex ? 'w-6 bg-white' : 'w-1.5 bg-white/40'
                            }`}
                    />
                ))}
            </div>
        </div>
    );
}
