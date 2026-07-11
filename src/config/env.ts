export interface RuntimeConfig {
  baseUrl: string;
  apiBaseUrl: string;
  apiUsername?: string;
  apiPassword?: string;
  browserHeadless: boolean;
  browserTimeoutMs: number;
}

function readBoolean(value: string | undefined, fallback: boolean): boolean {
  if (value === undefined || value === "") {
    return fallback;
  }

  return value.toLowerCase() === "true";
}

function mustReadEnv(name: string, fallback?: string): string {
  const value = __ENV[name] ?? fallback;

  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }

  return value;
}

function parseDurationMs(value: string): number {
  const normalized = value.trim();

  if (/^\d+$/.test(normalized)) {
    return Number(normalized);
  }

  const match = normalized.match(/^(\d+(?:\.\d+)?)(ms|s|m)$/);
  if (!match) {
    throw new Error(`Unsupported duration value: ${value}`);
  }

  const amount = Number(match[1]);
  const unit = match[2];

  switch (unit) {
    case "ms":
      return amount;
    case "s":
      return amount * 1000;
    case "m":
      return amount * 60_000;
    default:
      throw new Error(`Unsupported duration unit: ${unit}`);
  }
}

export function getConfig(): RuntimeConfig {
  return {
    baseUrl: mustReadEnv("BASE_URL", "https://test.k6.io"),
    apiBaseUrl: mustReadEnv("API_BASE_URL", "https://test-api.k6.io"),
    apiUsername: __ENV.API_USERNAME,
    apiPassword: __ENV.API_PASSWORD,
    browserHeadless: readBoolean(__ENV.K6_BROWSER_HEADLESS, true),
    browserTimeoutMs: parseDurationMs(__ENV.K6_BROWSER_TIMEOUT ?? "60s"),
  };
}
