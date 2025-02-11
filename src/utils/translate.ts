import { translate } from '@vitalets/google-translate-api';
import { HttpsProxyAgent } from 'https-proxy-agent';
import { showToast, Toast, getPreferenceValues } from "@raycast/api";

export const googleTranslate = async (text: string): Promise<string> => {
  if (!text.trim()) return '';

  const preferences = getPreferenceValues();

  try {
    if(preferences?.httpProxy?.trim()){
        const proxyAgent = new HttpsProxyAgent(preferences.httpProxy);
        const { text: translated } = await translate(text, {
            fetchOptions: {
              agent: proxyAgent
            }
          });
          return translated;
    }
    const { text: translated } = await translate(text);
    return translated;

  } catch (error) {
    await showToast({
      style: Toast.Style.Failure,
      title: "翻译失败",
      message: String(error),
    });
    return '';
  }
};