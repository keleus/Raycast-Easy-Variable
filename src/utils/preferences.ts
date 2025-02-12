import { getPreferenceValues } from "@raycast/api";

export interface Preferences {
  enableGoogleTranslate: boolean;
  enableTencentTranslate: boolean;
  enableGLMTranslate: boolean;
  httpProxy: string;
  tencentSecretId: string;
  tencentSecretKey: string;
  glmApiKey: string;
  enableOpenAITranslate: boolean;
  openaiApiKey: string;
  openaiModel: string;
  openaiBaseUrl: string;
  enableDeepseekTranslate: boolean;
  deepseekApiKey: string;
}

export const preferences = getPreferenceValues<Preferences>();