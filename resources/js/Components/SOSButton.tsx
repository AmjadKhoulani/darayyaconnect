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
            <div
                className={`flex flex-col gap-3 transition-all duration-300 ${expanded ? 'translate-y-0 opacity-100' : 'pointer-events-none translate-y-10 opacity-0'}`}
            >
                {emergencyContacts.map((contact) => (
                    <a
                        key={contact.name}
                        href={`tel:${contact.number}`}
                        className={`${contact.color} flex h-12 w-12 items-center justify-center rounded-full text-white shadow-lg transition-transform hover:scale-110`}
                        title={contact.name}
                    >
                        <span className="text-xl">{contact.icon}</span>
                    </a>
                ))}
            </div>

            {/* Main Button */}
            <button
                onClick={() => setExpanded(!expanded)}
                className={`flex h-14 w-14 items-center justify-center rounded-full text-2xl shadow-xl transition-all duration-300 ${expanded ? 'rotate-45 bg-slate-800' : 'animate-pulse-slow bg-red-600'}`}
            >
                <span className="text-white">🆘</span>
            </button>
        </div>
    );
}
