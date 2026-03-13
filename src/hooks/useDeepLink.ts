import * as Linking from 'expo-linking';
import * as WebBrowser from 'expo-web-browser';
import { useAppStore } from '../store/useAppStore';

export function useDeepLink() {
  const showToast = useAppStore((s) => s.showToast);

  const openApp = async (name: string, scheme: string, playStoreUrl: string) => {
    showToast(`Opening ${name}...`);
    try {
      const canOpen = await Linking.canOpenURL(scheme);
      if (canOpen) {
        await Linking.openURL(scheme);
      } else {
        await WebBrowser.openBrowserAsync(playStoreUrl);
      }
    } catch {
      await WebBrowser.openBrowserAsync(playStoreUrl);
    }
  };

  return { openApp };
}
