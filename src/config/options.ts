import type { Options } from "k6/options";

export interface ScenarioThresholdOptions {
  httpReqDurationP95?: number;
  httpReqFailedRate?: number;
  checksRate?: number;
}

export function createBaseOptions(overrides: Partial<Options> = {}): Options {
  return {
    discardResponseBodies: false,
    noConnectionReuse: false,
    thresholds: {
      http_req_failed: ["rate<0.01"],
      http_req_duration: ["p(95)<1000"],
      checks: ["rate>0.99"],
    },
    ...overrides,
  };
}

export function createStagesOptions(
  stages: Options["stages"],
  overrides: Partial<Options> = {},
): Options {
  return createBaseOptions({
    stages,
    ...overrides,
  });
}
