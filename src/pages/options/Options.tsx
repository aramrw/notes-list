import { createEffect, createMemo, createSignal, onMount } from "solid-js";
import "@src/styles/index.css";
import style from "./Options.module.css";
import { getUserSettings, updateUserSettings } from "./utils/user-settings";
import { SettingsSchema } from "./utils/settings-schema";
import HomeIcon from "../newtab/components/icons/home";
import clsx from "clsx";

export default function SettingsPage() {
  const [theme, setTheme] = createSignal("light");
  const [userSettings, setUserSettings] = createSignal<SettingsSchema>(null);
  const [savedSettings, setSavedSettings] = createSignal<boolean>(false);

  onMount(() => {
    getUserSettings().then((settings) => {
      setUserSettings(settings);
    });
  });

  createMemo(() => {
    if (userSettings()) {
      updateUserSettings(userSettings());
      setSavedSettings(true);
    }
  });

  createEffect(() => {
    if (savedSettings()) {
      setTimeout(() => {
        setSavedSettings(false);
      }, 700);
    }
  });

  const changeExportOnUpdate = (value: boolean) => {
    let settings = userSettings();
    settings.data.exportOnUpdate = value;
    setUserSettings({ ...settings });
  };

  return (
    <div class={style.header}>
      <header>
        <div class="flex flex-row items-center p-2 gap-2">
          <li
            class="w-fit flex h-full flex-col justify-center items-center"
            onClick={() =>
              chrome.tabs.update({ url: "/src/pages/newtab/index.html" })
            }
          >
            <HomeIcon
              class={clsx(
                "h-full hover:opacity-70 cursor-pointer size-8 bg-zinc-900 rounded-sm p-1 border border-zinc-700"
              )}
            />
          </li>
          <h1 class="h-full text-2xl font-bold bg-zinc-900 px-1 rounded-sm border border-zinc-700">
            Quick Note Taker Settings
          </h1>
        </div>
      </header>

      <main class="w-full max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div class="px-4 py-6 sm:px-0">
          <div class="border-4 border-dashed border-gray-200 rounded-lg h-60 p-4">
            <h2 class="text-2xl font-semibold mb-4 bg-zinc-900 w-fit px-1 rounded-sm border border-zinc-700">
              General Settings
            </h2>
            <div class="mb-4 min-w-fit max-w-64 flex flex-col gap-2.5 font-medium">
              {/*<div class="flex flex-col">
                <label
                  class="block text-xl font-bold mb-2 w-fit px-1 rounded-sm border border-zinc-700"
                  for="data"
                >
                  Data
                </label>
                <div
                  class="flex flex-row cursor-pointer items-center"
                  onClick={() => {
                    let value = !userSettings().data.exportOnUpdate;
                    changeExportOnUpdate(value);
                  }}
                >
                  <input
                    type="checkbox"
                    class="form-checkbox h-5 w-5"
                    checked={
                      userSettings()
                        ? userSettings().data.exportOnUpdate
                        : false
                    }
                    onChange={(e) => changeExportOnUpdate(e.target.checked)}
                  />
                  <label
                    class="ml-2 text-base font-bold bg-zinc-800 w-fit px-1"
                    for="data"
                  >
                    Export on Update
                  </label>
                </div>
              <span class="h-0.5 w-full bg-zinc-300" />
              </div>*/}
              <div class="opacity-50">
                <div class="flex flex-col gap-1">
                  <span class="text-xs select-none">Coming Soon</span>
                  <label
                    class="block text-xl font-bold mb-2 w-fit px-1 rounded-sm border border-zinc-700"
                    for="theme"
                  >
                    Theme
                  </label>
                </div>
                <select
                  id="theme"
                  class="block w-fit pl-2 py-1 text-base bg-zinc-800 disabled:opacity-50"
                  disabled
                  value={theme()}
                  onChange={(e) => setTheme(e.target.value)}
                >
                  <option value="light">Light</option>
                  <option value="dark">Dark</option>
                </select>
              </div>
            </div>
            {savedSettings() && (
              <span class="animate-ping text-sm">Saved Settings</span>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
