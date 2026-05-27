// import type { LoginPayload } from "../types/auth-login";
// export const authLogin = async (request?: LoginPayload) => {
//   const res = await fetch(`http://localhost:3000/api/v1/auth/login`, {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//     },
//     body: JSON.stringify(request),
//   });
//   const data = await res.json();
//   return data;
// };

import api from "./lib/axios";

export interface LoginPayload {
  email: string;
  password: string;
}

export const authLogin = async (request?: LoginPayload): Promise<any> => {
  return await api.post(`/api/v1/auth/login`, request);
};