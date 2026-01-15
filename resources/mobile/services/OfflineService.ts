import { Preferences } from '@capacitor/preferences';
import api from './api';

export interface OfflineReport {
    id: string;
    type: string;
    title: string;
    description: string;
    latitude?: number;
    longitude?: number;
    image?: string; // Base64 string
    timestamp: number;
}

const STORAGE_KEY = 'offline_reports';

export const OfflineService = {
    async saveReport(report: Omit<OfflineReport, 'id' | 'timestamp'>) {
        // Safe UUID generator
        const uuid = () => {
            return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
                var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
                return v.toString(16);
            });
        };

        const newReport: OfflineReport = {
            ...report,
            id: uuid(),
            timestamp: Date.now(),
        };

        const reports = await this.getReports();
        reports.push(newReport);

        await this.saveReportsList(reports);
        return newReport;
    },

    async getReports(): Promise<OfflineReport[]> {
        const { value } = await Preferences.get({ key: STORAGE_KEY });
        return value ? JSON.parse(value) : [];
    },

    async removeReport(id: string) {
        const reports = await this.getReports();
        const updatedReports = reports.filter(r => r.id !== id);
        await this.saveReportsList(updatedReports);
    },

    async clearReports() {
        await Preferences.remove({ key: STORAGE_KEY });
    },

    async saveReportsList(reports: OfflineReport[]) {
        await Preferences.set({
            key: STORAGE_KEY,
            value: JSON.stringify(reports),
        });
    },

    async getPendingCount(): Promise<number> {
        const reports = await this.getReports();
        return reports.length;
    },

    async syncReports(): Promise<number> {
        if (!navigator.onLine) return 0;

        const reports = await this.getReports();
        if (reports.length === 0) return 0;

        let syncedCount = 0;

        for (const report of reports) {
            try {
                const formData = new FormData();
                formData.append('title', report.title || 'بلاغ بدون عنوان');
                formData.append('description', report.description);
                formData.append('type', report.type);

                if (report.latitude) formData.append('latitude', report.latitude.toString());
                if (report.longitude) formData.append('longitude', report.longitude.toString());

                if (report.image) {
                    // Convert Base64 back to Blob (if it's a data URL)
                    if (report.image.startsWith('data:')) {
                        const response = await fetch(report.image);
                        const blob = await response.blob();
                        formData.append('image', blob, 'offline_image.jpg');
                    }
                }

                await api.post('/infrastructure/reports', formData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });

                await this.removeReport(report.id);
                syncedCount++;
            } catch (error) {
                console.error('Failed to sync report', report.id, error);
            }
        }

        return syncedCount;
    }
};
