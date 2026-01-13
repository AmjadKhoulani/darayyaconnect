import { Geolocation, Position } from '@capacitor/geolocation';

export interface LocationResult {
    coords?: {
        latitude: number;
        longitude: number;
    };
    error?: string;
    permissionStatus?: 'granted' | 'denied' | 'prompt';
}

export const GeolocationService = {
    /**
     * Request permissions and get current position with timeout
     */
    getCurrentPosition: async (): Promise<LocationResult> => {
        try {
            // 1. Check/Request Permissions
            const permissionStatus = await Geolocation.checkPermissions();

            if (permissionStatus.location !== 'granted') {
                const request = await Geolocation.requestPermissions();
                if (request.location !== 'granted') {
                    return { error: 'Location permission denied', permissionStatus: 'denied' };
                }
            }

            // 2. Get Position with Timeout
            // We use a Promise.race to enforce a strict timeout because Capacitor's timeout sometimes hangs
            const positionPromise = Geolocation.getCurrentPosition({
                enableHighAccuracy: true,
                timeout: 10000, // 10 seconds
                maximumAge: 3000 // Accept positions up to 3 seconds old
            });

            const timeoutPromise = new Promise((_, reject) =>
                setTimeout(() => reject(new Error('Location timeout')), 10000)
            );

            const position = await Promise.race([positionPromise, timeoutPromise]) as Position;

            return {
                coords: {
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude
                },
                permissionStatus: 'granted'
            };

        } catch (err: any) {
            console.error('Geolocation Error:', err);
            let errorMessage = 'Failed to get location';

            if (err.message === 'Location timeout') {
                errorMessage = 'Taking too long to locate. Please try outdoors.';
            } else if (err.message.includes('denied')) {
                errorMessage = 'Location permission denied.';
            } else if (err.message.includes('disabled')) {
                errorMessage = 'Location services are disabled.';
            }

            return { error: errorMessage, permissionStatus: 'denied' };
        }
    },

    /**
     * Open device settings (helper)
     */
    openSettings: async () => {
        // specific to platform (not implemented in standard plugin, usually needs another plugin or alert instruction)
        // For now, we rely on user manually going to settings
        return;
    }
};
