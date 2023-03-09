import { reactive } from "vue";

interface Settings {
  enableRelativeTime: boolean;
}

const SETTINGS_LOCALSTORAGE_KEY = "settings";

const settings = reactive<Settings>({
  ...JSON.parse(localStorage.getItem(SETTINGS_LOCALSTORAGE_KEY) || "{}"),
});

export const useSettings = (): Readonly<Settings> => settings;

export const updateSettings = (updates: Partial<Settings>) => {
  const newSettings = {
    ...settings,
    ...updates,
  };

  localStorage.setItem(SETTINGS_LOCALSTORAGE_KEY, JSON.stringify(newSettings));

  for (const [key, val] of Object.entries(newSettings)) {
    settings[key as keyof Settings] = val;
  }
};
