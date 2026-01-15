import { Haptics, ImpactStyle, NotificationType } from '@capacitor/haptics';

export const HapticService = {
    /**
     * Light impact for subtle UI interactions (tabs, switches)
     */
    async lightImpact() {
        try {
            await Haptics.impact({ style: ImpactStyle.Light });
        } catch (e) {
            // Ignore on browsers/web
        }
    },

    /**
     * Medium impact for main button clicks
     */
    async mediumImpact() {
        try {
            await Haptics.impact({ style: ImpactStyle.Medium });
        } catch (e) {
            // Ignore
        }
    },

    /**
     * Success notification pulse
     */
    async successNotification() {
        try {
            await Haptics.notification({ type: NotificationType.Success });
        } catch (e) {
            // Ignore
        }
    },

    /**
     * Warning/Error notification pulse
     */
    async errorNotification() {
        try {
            await Haptics.notification({ type: NotificationType.Error });
        } catch (e) {
            // Ignore
        }
    }
};
