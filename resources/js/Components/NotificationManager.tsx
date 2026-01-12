import { useEffect } from 'react';
import { LocalNotifications } from '@capacitor/local-notifications';
import { usePage } from '@inertiajs/react';
import { Capacitor } from '@capacitor/core';

export default function NotificationManager() {
    const { auth } = usePage().props as any;

    useEffect(() => {
        if (!auth.user) return;

        // STRICT GUARD: Only run on Native (Android/iOS)
        const isNative = Capacitor.isNativePlatform();
        if (!isNative) {
            console.log('🌐 Web Mode: Native notifications disabled.');
            return;
        }

        // Request permission on mount
        const requestPermission = async () => {
            try {
                const result = await LocalNotifications.requestPermissions();
                if (result.display === 'granted') {
                    console.log('🔔 Notifications permission granted');
                }
            } catch (e) {
                console.warn('🔔 LocalNotifications init error:', e);
            }
        };
        requestPermission();

        // 60-second polling
        const interval = setInterval(async () => {
            try {
                const res = await fetch('/api/notifications/unread');
                if (!res.ok) return;

                const notifications = await res.json();

                if (notifications.length > 0) {
                    notifications.forEach(async (n: any) => {
                        try {
                            await LocalNotifications.schedule({
                                notifications: [{
                                    title: n.title,
                                    body: n.body,
                                    id: n.id,
                                    schedule: { at: new Date(Date.now() + 1000) },
                                    sound: 'beep.wav',
                                    attachments: undefined,
                                    actionTypeId: '',
                                    extra: null
                                }]
                            });
                        } catch (e) {
                            console.error('🔔 Schedule error:', e);
                        }
                    });
                }

            } catch (err) {
                console.error('Polling failed', err);
            }
        }, 60000);

        return () => clearInterval(interval);

    }, [auth.user]);

    return null;
}
