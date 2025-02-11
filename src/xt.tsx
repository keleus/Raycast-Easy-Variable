import { ActionPanel, Action, Icon, List, Clipboard } from "@raycast/api";
import { useState, useCallback } from "react";
import { googleTranslate } from './utils/translate';
import debounce from 'lodash/debounce';


const formatCamelCase = (text: string) => {
  return text
    .split(/[\s_]+/)
    .map((word, index) => 
      index === 0 
        ? word.toLowerCase() 
        : word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
    )
    .join('');
};

export default function Command({ arguments: { queryText } }: { arguments: { queryText?: string } }) {
  const [searchText, setSearchText] = useState(queryText || "");
  const [googleResult, setGoogleResult] = useState("");

  const handleTranslate = async (text: string) => {
    const translated = await googleTranslate(text);
    setGoogleResult(formatCamelCase(translated));
  };

  const debouncedTranslate = useCallback(
    debounce((text: string) => {
      if (text.trim()) {
        handleTranslate(text);
      }
    }, 500),
    []
  );

  return (
    <List
      searchText={searchText}
      onSearchTextChange={(text) => {
        setSearchText(text);
        debouncedTranslate(text);
      }}
      searchBarPlaceholder="Enter text..."
    >
      {googleResult && (
        <List.Item
          icon={Icon.Text}
          title={googleResult}
          subtitle="Google Translate"
          actions={
            <ActionPanel>
              <ActionPanel.Section>
                <Action 
                  title="Paste" 
                  icon={Icon.TextInput}
                  onAction={async () => await Clipboard.paste(googleResult)} 
                />
                <Action
                  title="Copy to Clipboard"
                  icon={Icon.CopyClipboard}
                  onAction={async () => await Clipboard.copy(googleResult)}
                />
              </ActionPanel.Section>
            </ActionPanel>
          }
        />
      )}
    </List>
  );
}
