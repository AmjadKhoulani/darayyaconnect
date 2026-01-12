import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.darayya.app',
  appName: 'Darayya Connect',
  webDir: 'public/mobile_build',
  server: {
    cleartext: true,
    androidScheme: 'http'
  },
  plugins: {
    Geolocation: {
      // Request permissions if needed
    }
  }
};

export default config;
