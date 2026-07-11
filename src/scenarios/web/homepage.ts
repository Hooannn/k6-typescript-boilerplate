import { check } from "k6";
import http from "k6/http";
import { thinkTime } from "@/lib/sleep";

export function visitHomepage(baseUrl: string): void {
  const response = http.get(baseUrl, {
    tags: {
      name: "homepage",
    },
  });

  check(response, {
    "homepage loads": (res) => res.status === 200,
    "homepage contains k6": (res) => String(res.body).includes("k6"),
  });

  thinkTime(1);
}
