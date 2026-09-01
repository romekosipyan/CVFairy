import { defaultSettings } from "../defaults";
import type { ResumeSlice, SettingsSlice } from "../types";

export const createSettingsSlice: ResumeSlice<SettingsSlice> = (set) => ({
  settings: defaultSettings,
  setSettings: (patch) =>
    set((state) => {
      Object.assign(state.settings, patch);
    }),
});
