import type { ExportEngine } from "./types";

export const jsonEngine: ExportEngine = {
  async export(resume, settings) {
    const payload = {
      data: resume,
      settings,
    };
    return new Blob([JSON.stringify(payload, null, 2)], {
      type: "application/json",
    });
  },
};
