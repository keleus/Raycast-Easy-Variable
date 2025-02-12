import { ActionPanel, Action, Icon, List, Clipboard } from "@raycast/api";
import { useState, useCallback } from "react";
import { googleTranslate } from "../utils/translators/google";
import { openaiTranslate } from "../utils/translators/openai";
import { deepseekTranslate } from "../utils/translators/deepseek";
import { glmTranslate } from "../utils/translators/glm";
import { tencentTranslate } from "../utils/translators/tencent";

import debounce from 'lodash/debounce';

interface TranslateListProps {
  formatFunction: (text: string) => string;
  queryText?: string;
}

export function TranslateList({ formatFunction, queryText }: TranslateListProps) {
  const [searchText, setSearchText] = useState(queryText || "");
  const [results, setResults] = useState<{[key: string]: string}>({});
  const [errors, setErrors] = useState<{[key: string]: string}>({});
  const [loading, setLoading] = useState<{[key: string]: boolean}>({});

  const handleTranslate = async (text: string) => {
    // 重置状态
    setResults({});
    setErrors({});
    setLoading({
      google: true,
      openai: true,
      deepseek: true,
      glm: true,
      tencent: true,
    });

    // 独立调用每个翻译服务
    const services = {
      google: googleTranslate,
      openai: openaiTranslate,
      deepseek: deepseekTranslate,
      glm: glmTranslate,
      tencent: tencentTranslate,
    };

    Object.entries(services).forEach(async ([key, translator]) => {
      try {
        const translated = await translator(text);
        setResults(prev => ({
          ...prev,
          [key]: translated ? formatFunction(translated) : '',
        }));
      } catch (error) {
        setErrors(prev => ({
          ...prev,
          [key]: String(error),
        }));
      } finally {
        setLoading(prev => ({
          ...prev,
          [key]: false,
        }));
      }
    });
  };

  const debouncedTranslate = useCallback(
    debounce((text: string) => {
      if (text.trim()) {
        handleTranslate(text);
      }
    }, 1000),
    []
  );

  const renderListItem = (key: string, title: string) => {
    if (errors[key]) {
      return (
        <List.Item
          icon={Icon.ExclamationMark}
          title={errors[key]}
          subtitle={title}
        />
      );
    }

    if (results[key]) {
      return (
        <List.Item
          title={results[key]}
          subtitle={title}
          actions={
            <ActionPanel>
              <ActionPanel.Section>
                <Action 
                  title="Paste" 
                  icon={Icon.TextInput}
                  onAction={async () => await Clipboard.paste(results[key])} 
                />
                <Action
                  title="Copy to Clipboard"
                  icon={Icon.CopyClipboard}
                  onAction={async () => await Clipboard.copy(results[key])}
                />
              </ActionPanel.Section>
            </ActionPanel>
          }
        />
      );
    }
    return null;
  };

  const isAnyLoading = Object.values(loading).some(Boolean);

  return (
    <List
      isLoading={isAnyLoading}
      searchText={searchText}
      onSearchTextChange={(text) => {
        setSearchText(text);
        debouncedTranslate(text);
      }}
      searchBarPlaceholder="Enter text..."
    >
      {Object.entries({
        google: "Google Translate",
        openai: "OpenAI Translate",
        deepseek: "Deepseek Translate",
        glm: "GLM Translate",
        tencent: "Tencent Translate",
      })
        .sort(([keyA], [keyB]) => {
          // 如果两个都是错误，保持原顺序
          if (errors[keyA] && errors[keyB]) return 0;
          // 错误的排在后面
          if (errors[keyA]) return 1;
          if (errors[keyB]) return -1;
          // 加载中的排在后面
          if (loading[keyA] && !loading[keyB]) return 1;
          if (!loading[keyA] && loading[keyB]) return -1;
          // 有结果的排在前面
          if (results[keyA] && !results[keyB]) return -1;
          if (!results[keyA] && results[keyB]) return 1;
          // 保持原顺序
          return 0;
        })
        .map(([key, title]) => renderListItem(key, title))}
    </List>
  );
}