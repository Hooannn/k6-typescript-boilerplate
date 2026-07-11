import type { Options } from "k6/options";
import { createBaseOptions } from "@/config/options";
import { getConfig } from "@/config/env";
import { visitHomepage } from "@/scenarios/web/homepage";

export const options: Options = createBaseOptions({
  vus: 1,
  iterations: 1,
});

export default function smoke(): void {
  const config = getConfig();
  visitHomepage(config.baseUrl);
}
