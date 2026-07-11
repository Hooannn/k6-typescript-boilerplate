import { expectJsonContentType, expectStatus } from "@/lib/checks";
import { postJson } from "@/lib/http";
import type { Credentials } from "@/fixtures/users";

interface LoginResponse {
  access: string;
  refresh: string;
}

export function login(baseUrl: string, credentials: Credentials): LoginResponse {
  const response = postJson(
    `${baseUrl}/auth/token/login/`,
    {
      username: credentials.username,
      password: credentials.password,
    },
    {
      tags: {
        name: "auth_login",
      },
    },
  );

  expectStatus(response, 200);
  expectJsonContentType(response);

  return response.json() as unknown as LoginResponse;
}
