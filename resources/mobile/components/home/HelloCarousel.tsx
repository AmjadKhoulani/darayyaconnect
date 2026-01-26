import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

interface Slide {
    id: number;
    title: string;
    highlight: string;
    subtitle: string;
    type?: string; // 'static' or 'study'
}

interface HelloCarouselProps {
    slides?: Slide[];
}

export default function HelloCarousel({ slides = [] }: HelloCarouselProps) {
    const defaultMessages: Slide[] = [
        {
            id: -1,
            title: "هلا بيك في",
            highlight: "مجتمع داريا",
            subtitle: "منصتك الأولى للتواصل، الخدمات، وإدارة المدينة بذكاء.",
            type: 'static'
        },
        {
            id: -2,
            title: "خدماتك",
            highlight: "بين يديك",
            subtitle: "تابع حالة الكهرباء، المياه، والخدمات لحظة بلحظة.",
            type: 'static'
        },
        {
            id: -3,
            title: "شاركنا",
            highlight: "بصوتك",
            subtitle: "قدم البلاغات، شارك في الاستطلاعات، وكن جزءاً من القرار.",
            type: 'static'
        }
    ];

    const items = slides.length > 0 ? slides : defaultMessages;
    const [currentIndex, setCurrentIndex] = useState(0);
    const navigate = useNavigate();

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % items.length);
        }, 5000);

        return () => clearInterval(interval);
    }, [items.length]);

    const handleClick = (item: Slide) => {
        if (item.type !== 'static') {
            navigate(`/study/${item.id}`);
        }
    };

    return (
        <div className="relative h-32 flex flex-col justify-center">
            {items.map((msg, index) => (
                <div
                    key={index}
                    onClick={() => handleClick(msg)}
                    className={`absolute inset-0 flex flex-col justify-center items-start text-right transition-all duration-700 ease-in-out ${index === currentIndex
                        ? 'opacity-100 translate-y-0 cursor-pointer pointer-events-auto'
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
            <div className="absolute bottom-0 left-0 flex gap-1.5 z-20">
                {items.map((_, index) => (
                    <button
                        key={index}
                        onClick={(e) => { e.stopPropagation(); setCurrentIndex(index); }}
                        className={`h-1.5 rounded-full transition-all duration-500 ${index === currentIndex ? 'w-6 bg-white' : 'w-1.5 bg-white/40'
                            }`}
                    />
                ))}
            </div>
        </div>
    );
}
