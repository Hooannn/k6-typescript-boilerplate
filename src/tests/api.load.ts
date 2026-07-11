import type { Options } from "k6/options";
import { createStagesOptions } from "@/config/options";
import { getConfig } from "@/config/env";
import { login } from "@/scenarios/api/auth";
import { demoUser } from "@/fixtures/users";
import { thinkTime } from "@/lib/sleep";

export const options: Options = createStagesOptions([
  { duration: "10s", target: 5 },
  { duration: "20s", target: 5 },
  { duration: "10s", target: 0 },
]);

export default function apiLoad(): void {
  const config = getConfig();

  if (!config.apiUsername || !config.apiPassword) {
    login(config.apiBaseUrl, demoUser);
  } else {
    login(config.apiBaseUrl, {
      username: config.apiUsername,
      password: config.apiPassword,
    });
  }

  thinkTime(1);
}
