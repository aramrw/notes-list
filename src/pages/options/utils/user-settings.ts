import { SettingsSchema } from "./settings-schema";

export function updateUserSettings(
  settings: SettingsSchema
): Promise<SettingsSchema> {
  return new Promise<SettingsSchema>((resolve, reject) => {
    chrome.storage.local.set({ settings }, () => {
      if (chrome.runtime.lastError) {
        reject(chrome.runtime.lastError);
      } else {
        resolve(settings);
      }
    });
  });
}

export function getUserSettings(): Promise<SettingsSchema> {
  return new Promise<SettingsSchema>((resolve, reject) => {
    chrome.storage.local.get("settings", (result) => {
      if (chrome.runtime.lastError) {
        reject(chrome.runtime.lastError);
      } else {
        let settings = result.settings as SettingsSchema | undefined;

        if (!settings) {
          settings = {
            data: {
              exportOnUpdate: false,
            },
          };
          updateUserSettings(settings).then(() => {
            resolve(settings);
          });
        }

        resolve(settings);
      }
    });
  });
}
