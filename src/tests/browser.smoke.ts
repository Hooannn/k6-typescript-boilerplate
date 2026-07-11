import type { Options } from "k6/options";
import { browser } from "k6/browser";
import { check } from "k6";
import { createBaseOptions } from "@/config/options";
import { getConfig } from "@/config/env";

const config = getConfig();

export const options: Options = createBaseOptions({
  scenarios: {
    browser: {
      executor: "shared-iterations",
      options: {
        browser: {
          type: "chromium",
        },
      },
      vus: 1,
      iterations: 1,
    },
  },
});

export default async function browserSmoke(): Promise<void> {
  const page = await browser.newPage();

  try {
    await page.goto(config.baseUrl, {
      waitUntil: "networkidle",
      timeout: config.browserTimeoutMs,
    });

    const title = await page.title();
    check(title, {
      "title is present": (value) => value.length > 0,
    });
  } finally {
    await page.close();
  }
}
