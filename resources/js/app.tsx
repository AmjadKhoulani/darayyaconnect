import 'maplibre-gl/dist/maplibre-gl.css';
import '../css/app.css';
import './bootstrap';

import { createInertiaApp } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { createRoot } from 'react-dom/client';

const appName = import.meta.env.VITE_APP_NAME || 'Laravel';

import { App as CapacitorApp } from '@capacitor/app';
import OfflineSync from './Components/OfflineSync';

createInertiaApp({
    title: (title) => `${title} - ${appName}`,
    resolve: (name) =>
        resolvePageComponent(
            `./Pages/${name}.tsx`,
            import.meta.glob('./Pages/**/*.tsx'),
        ),
    setup({ el, App, props }) {
        const root = createRoot(el);

        // Handle Hardware Back Button (Android)
        CapacitorApp.addListener('backButton', ({ canGoBack }) => {
            if (canGoBack) {
                window.history.back();
            } else {
                CapacitorApp.exitApp();
            }
        });

        root.render(
            <>
                <OfflineSync />
                {/* <NotificationManager /> */}
                <App {...props} />
            </>,
        );
    },
    progress: {
        color: '#4B5563',
    },
});
