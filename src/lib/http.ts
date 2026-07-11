import http, { type Response, type ResponseType } from "k6/http";
import { check } from "k6";

export interface JsonRequestOptions {
  tags?: Record<string, string>;
  headers?: Record<string, string>;
  responseType?: ResponseType | "none";
}

export function getJson(
  url: string,
  options: JsonRequestOptions = {},
): Response {
  const response = http.get(url, {
    tags: options.tags,
    headers: {
      Accept: "application/json",
      ...options.headers,
    },
    responseType: options.responseType ?? "text",
  });

  check(response, {
    "GET request succeeds": (res) => res.status >= 200 && res.status < 300,
  });

  return response;
}

export function postJson(
  url: string,
  payload: unknown,
  options: JsonRequestOptions = {},
): Response {
  const response = http.post(url, JSON.stringify(payload), {
    tags: options.tags,
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      ...options.headers,
    },
    responseType: options.responseType ?? "text",
  });

  check(response, {
    "POST request succeeds": (res) => res.status >= 200 && res.status < 300,
  });

  return response;
}
