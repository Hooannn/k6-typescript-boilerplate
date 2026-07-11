import { sleep } from "k6";

export function thinkTime(seconds = 1): void {
  sleep(seconds);
}
