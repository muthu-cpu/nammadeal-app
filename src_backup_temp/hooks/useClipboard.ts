import * as Clipboard from 'expo-clipboard';
import * as Linking from 'expo-linking';
import * as WebBrowser from 'expo-web-browser';
import { useAppStore } from '../store/useAppStore';

export function useClipboard() {
  const showToast = useAppStore((s) => s.showToast);

  const copyText = async (text: string) => {
    await Clipboard.setStringAsync(text);
    showToast('Copied!');
  };

  const shareWhatsApp = async (text: string) => {
    const url = `https://wa.me/?text=${encodeURIComponent(text)}`;
    try {
      const canOpen = await Linking.canOpenURL(url);
      if (canOpen) {
        await Linking.openURL(url);
      } else {
        await WebBrowser.openBrowserAsync(url);
      }
    } catch {
      await WebBrowser.openBrowserAsync(url);
    }
  };

  return { copyText, shareWhatsApp };
}
