import { translate } from "@vitalets/google-translate-api";
import { HttpsProxyAgent } from "https-proxy-agent";
import { preferences } from "../preferences";

export const googleTranslate = async (text: string): Promise<string> => {
  if (!text.trim()) return "";
  
  if (!preferences?.enableGoogleTranslate) {
    return "";
  }

  if (preferences?.httpProxy?.trim()) {
    const proxyAgent = new HttpsProxyAgent(preferences.httpProxy);
    const { text: translated } = await translate(text, {
      fetchOptions: {
        agent: proxyAgent,
      },
    });
    return translated;
  }
  
  const { text: translated } = await translate(text);
  return translated;
};