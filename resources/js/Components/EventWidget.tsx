import { router } from '@inertiajs/react';

export default function EventWidget({ events }: { events: any[] }) {
    if (!events || events.length === 0) return null;

    const toggleAttendance = (eventId: number) => {
        router.post(
            route('events.attend', eventId),
            {},
            {
                preserveScroll: true,
            },
        );
    };

    return (
        <div className="mb-6 rounded-lg border border-gray-100 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
            <div className="mb-4 flex items-center gap-2">
                <span className="text-xl">📅</span>
                <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">
                    فعاليات قادمة
                </h3>
            </div>

            <div className="space-y-4">
                {events.map((event) => (
                    <div
                        key={event.id}
                        className="border-l-4 border-indigo-500 py-1 pl-4"
                    >
                        <div className="font-bold text-gray-800 dark:text-gray-200">
                            {event.title}
                        </div>
                        <div className="mt-1 text-sm font-semibold text-indigo-600">
                            {new Date(event.start_time).toLocaleDateString(
                                'ar-SY',
                                {
                                    weekday: 'long',
                                    day: 'numeric',
                                    month: 'long',
                                },
                            )}
                            {' - '}
                            {new Date(event.start_time).toLocaleTimeString(
                                'ar-SY',
                                { hour: '2-digit', minute: '2-digit' },
                            )}
                        </div>
                        <div className="mt-1 text-xs text-gray-500">
                            📍 {event.location_name}
                        </div>

                        <div className="mt-3 flex items-center justify-between">
                            <span className="text-xs text-gray-400">
                                {event.attendees_count > 0
                                    ? `+${event.attendees_count} شخص سيحضرون`
                                    : 'كن أول الحاضرين!'}
                            </span>
                            <button
                                onClick={() => toggleAttendance(event.id)}
                                className={`rounded px-3 py-1 text-xs font-bold transition ${
                                    event.is_attending
                                        ? 'bg-green-100 text-green-700 hover:bg-red-100 hover:text-red-700'
                                        : 'bg-indigo-600 text-white hover:bg-indigo-700'
                                }`}
                            >
                                {event.is_attending ? 'سأحضر ✅' : 'سأحضر 🙋‍♂️'}
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
