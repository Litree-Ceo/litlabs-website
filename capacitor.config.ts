import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.litlabs.app',
  appName: 'LiTree Lab Studios',
  webDir: 'out',
  server: {
    // This allows the app to load your live site while still behaving like a native app
    url: 'https://litlabs.net',
    allowNavigation: ['litlabs.net', '*.clerk.accounts.dev'],
  },
  android: {
    allowMixedContent: true
  },
  ios: {
    contentInset: 'always'
  }
};

export default config;
