import { supabaseRest } from "@/app/lib/supabase-rest";

export type HomeSelectedWorkSettings = {
  poolLimit: number;
  rotationEnabled: boolean;
  rotationIntervalMs: number;
  rotationMode: "random_single";
  transitionDurationMs: number;
  visibleCount: number;
};

const defaultHomeSelectedWorkSettings: HomeSelectedWorkSettings = {
  poolLimit: 12,
  rotationEnabled: true,
  rotationIntervalMs: 6500,
  rotationMode: "random_single",
  transitionDurationMs: 420,
  visibleCount: 4
};

type SiteSettingRow = {
  value: Partial<HomeSelectedWorkSettings> | null;
};

function clampNumber(value: unknown, fallback: number, min: number, max: number) {
  return typeof value === "number" && Number.isFinite(value) ? Math.min(Math.max(Math.round(value), min), max) : fallback;
}

function normalizeHomeSelectedWorkSettings(value: Partial<HomeSelectedWorkSettings> | null | undefined): HomeSelectedWorkSettings {
  return {
    poolLimit: clampNumber(value?.poolLimit, defaultHomeSelectedWorkSettings.poolLimit, 4, 24),
    rotationEnabled: typeof value?.rotationEnabled === "boolean" ? value.rotationEnabled : defaultHomeSelectedWorkSettings.rotationEnabled,
    rotationIntervalMs: clampNumber(value?.rotationIntervalMs, defaultHomeSelectedWorkSettings.rotationIntervalMs, 2500, 30000),
    rotationMode: "random_single",
    transitionDurationMs: clampNumber(value?.transitionDurationMs, defaultHomeSelectedWorkSettings.transitionDurationMs, 150, 1200),
    visibleCount: clampNumber(value?.visibleCount, defaultHomeSelectedWorkSettings.visibleCount, 1, 8)
  };
}

export async function getHomeSelectedWorkSettings() {
  try {
    const rows = await supabaseRest<SiteSettingRow[]>({
      path: "site_settings?select=value&key=eq.home_selected_work&is_public=eq.true&limit=1",
      revalidate: 300
    });

    return normalizeHomeSelectedWorkSettings(rows[0]?.value);
  } catch (error) {
    console.error(error);
    return defaultHomeSelectedWorkSettings;
  }
}
