import { homedir } from "node:os";
import { join } from "node:path";

export interface GlobalConfig {
  apiUrl: string;
  token?: string;
  user?: {
    id: string;
    email: string;
    name: string;
  };
}

export interface ProjectConfig {
  slug: string;
  title: string;
  description?: string;
  orgSlug?: string;
  visibility?: "private" | "org" | "public" | "unlisted";
}

const GLOBAL_CONFIG_PATH = join(homedir(), ".unsa-slidesrc.json");
const PROJECT_CONFIG_FILE = ".slidesrc.json";

export async function getGlobalConfig(): Promise<GlobalConfig> {
  const file = Bun.file(GLOBAL_CONFIG_PATH);
  if (!(await file.exists())) {
    return {
      apiUrl: Bun.env.UNSA_SLIDES_API_URL || "http://localhost:3000",
    };
  }
  try {
    return await file.json();
  } catch {
    return {
      apiUrl: Bun.env.UNSA_SLIDES_API_URL || "http://localhost:3000",
    };
  }
}

export async function saveGlobalConfig(
  config: Partial<GlobalConfig>,
): Promise<void> {
  const current = await getGlobalConfig();
  const updated = { ...current, ...config };
  await Bun.write(GLOBAL_CONFIG_PATH, JSON.stringify(updated, null, 2));
}

export async function getProjectConfig(
  cwd: string = process.cwd(),
): Promise<ProjectConfig | null> {
  const configPath = join(cwd, PROJECT_CONFIG_FILE);
  const file = Bun.file(configPath);
  if (!(await file.exists())) {
    return null;
  }
  try {
    return await file.json();
  } catch {
    return null;
  }
}

export async function saveProjectConfig(
  config: ProjectConfig,
  cwd: string = process.cwd(),
): Promise<void> {
  const configPath = join(cwd, PROJECT_CONFIG_FILE);
  await Bun.write(configPath, JSON.stringify(config, null, 2));
}
