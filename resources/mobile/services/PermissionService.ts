import { Geolocation } from '@capacitor/geolocation';
import { Preferences } from '@capacitor/preferences';

const LOCATION_PERMISSION_KEY = 'location_permission_requested';

export const PermissionService = {
    async checkAndRequestLocationPermission(): Promise<boolean> {
        try {
            // Check current status
            const check = await Geolocation.checkPermissions();

            if (check.location === 'granted') {
                return true;
            }

            // If denied, we shouldn't keep asking if on Android/iOS (OS handles this mostly, but we can prevent app-side loops)
            // ideally we check if we already asked
            const { value: alreadyAsked } = await Preferences.get({ key: LOCATION_PERMISSION_KEY });

            if (check.location === 'prompt' || check.location === 'prompt-with-rationale' || !alreadyAsked) {
                const request = await Geolocation.requestPermissions();
                await Preferences.set({ key: LOCATION_PERMISSION_KEY, value: 'true' });
                return request.location === 'granted';
            }

            return false;
        } catch (error) {
            console.error('Permission check failed', error);
            return false;
        }
    },

    async hasLocationPermission(): Promise<boolean> {
        try {
            const check = await Geolocation.checkPermissions();
            return check.location === 'granted';
        } catch {
            return false;
        }
    }
};
