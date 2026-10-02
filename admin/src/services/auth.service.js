import { apiRequest } from "./api";


export function login(
  username,
  password,
) {
  return apiRequest(
    "/api/auth/login",
    {
      method: "POST",


      body: JSON.stringify({
        username,
        password,
      }),
    },
  );
}


export function getCurrentUser() {
  return apiRequest(
    "/api/auth/me",
  );
}


export function logout() {
  return apiRequest(
    "/api/auth/logout",
    {
      method: "POST",
    },
  );
}