import axios from 'axios';
import { useEffect } from 'react';

export default function OfflineSync() {
    useEffect(() => {
        const syncReports = async () => {
            const offlineReports = localStorage.getItem('offline_reports');
            if (!offlineReports) return;

            const reports = JSON.parse(offlineReports);
            if (reports.length === 0) return;

            console.log(
                '🔄 Attempting to sync offline reports...',
                reports.length,
            );

            const remainingReports = [];

            for (const report of reports) {
                try {
                    // Re-construct FormData if needed, but for now assuming JSON body is fine for simple fields
                    // If file upload is needed, we can't easily store File objects in localStorage.
                    // For now, we will sync ONLY text data. Images might need complex handling (Base64 storage).

                    // Simple text-only sync for Phase 1
                    await axios.post('/api/infrastructure/reports', report);
                    console.log('✅ Synced report:', report.description);
                } catch (error) {
                    console.error('❌ Sync failed for report:', report, error);
                    remainingReports.push(report);
                }
            }

            if (remainingReports.length === 0) {
                localStorage.removeItem('offline_reports');
                alert('تم مزامنة جميع البلاغات المعلقة بنجاح! 📶✅');
            } else {
                localStorage.setItem(
                    'offline_reports',
                    JSON.stringify(remainingReports),
                );
            }
        };

        const handleOnline = () => {
            console.log('📶 Online! Syncing...');
            syncReports();
        };

        window.addEventListener('online', handleOnline);

        // Try sync on mount too
        if (navigator.onLine) {
            syncReports();
        }

        return () => window.removeEventListener('online', handleOnline);
    }, []);

    return null; // Headless component
}
