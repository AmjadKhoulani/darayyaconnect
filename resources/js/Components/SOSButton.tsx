import { useState } from 'react';

export default function SOSButton() {
    const [expanded, setExpanded] = useState(false);

    const emergencyContacts = [
        { name: 'الإسعاف', number: '110', icon: '🚑', color: 'bg-red-500' },
        { name: 'الإطفاء', number: '113', icon: '🚒', color: 'bg-orange-500' },
        { name: 'الشرطة', number: '112', icon: '🚓', color: 'bg-blue-600' },
    ];

    return (
        <div className="fixed bottom-20 left-6 z-50 flex flex-col items-center gap-3 md:bottom-6">

            {/* Expanded List */}
            <div className={`flex flex-col gap-3 transition-all duration-300 ${expanded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10 pointer-events-none'}`}>
                {emergencyContacts.map((contact) => (
                    <a
                        key={contact.name}
                        href={`tel:${contact.number}`}
                        className={`${contact.color} text-white w-12 h-12 rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform`}
                        title={contact.name}
                    >
                        <span className="text-xl">{contact.icon}</span>
                    </a>
                ))}
            </div>

            {/* Main Button */}
            <button
                onClick={() => setExpanded(!expanded)}
                className={`w-14 h-14 rounded-full shadow-xl flex items-center justify-center text-2xl transition-all duration-300 ${expanded ? 'bg-slate-800 rotate-45' : 'bg-red-600 animate-pulse-slow'}`}
            >
                <span className="text-white">🆘</span>
            </button>
        </div>
    );
}
