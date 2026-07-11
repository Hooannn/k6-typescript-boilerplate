import { check } from "k6";
import type { Response } from "k6/http";

export function expectStatus(response: Response, expectedStatus: number): void {
  check(response, {
    [`status is ${expectedStatus}`]: (res) => res.status === expectedStatus,
  });
}

export function expectJsonContentType(response: Response): void {
  check(response, {
    "response is JSON": (res) =>
      String(res.headers["Content-Type"] ?? "").toLowerCase().includes("application/json"),
  });
}
