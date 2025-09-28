/* eslint-disable @typescript-eslint/no-explicit-any */
import { logout } from "./auth";
import apiBase from "./axios";

export interface ApiResponse<T = any> {
  message: string;
  success: boolean;
  data?: T;
  error?: string;
  statusCode?: number;
  serverSuccess?: boolean;
}

type HttpMethod = "GET" | "POST" | "PUT" | "DELETE";

function normalize(res: any): ApiResponse {
  const ok = res.status >= 200 && res.status < 300;
  if (res.status === 401) {
    logout();
  }

  return {
    success: ok,
    serverSuccess: res.data?.success,
    message: res.data?.message ?? (ok ? "Request successful" : "Request failed"),
    data: res.data.data,
    error: ok ? undefined : (res.data?.message || res.statusText || "Request failed"),
    statusCode: res.status,
  };
}

export async function apiRequest<T = any>(
  method: HttpMethod,
  route: string,
  body: Record<string, any> = {},  
  token?: string
): Promise<ApiResponse<T>> {
  const baseConfig = {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
    validateStatus: () => true, 
  };

  try {
    let res;
    switch (method) {
      case "GET":
        res = await apiBase.get(route, { ...baseConfig, params: body });
        break;
      case "DELETE":
        res = await apiBase.delete(route, { ...baseConfig, params: body });
        break;
      case "POST":
        res = await apiBase.post(route, body, baseConfig);
        break;
      case "PUT":
        res = await apiBase.put(route, body, baseConfig);
        break;
      default:
        throw new Error("Invalid HTTP method");
    }
    return normalize(res);
  } catch (err: any) {
    if (err?.response) return normalize(err.response);

    return {
      success: false,
      message: err?.message || "Network error",
      error: err?.message || "Network error",
      statusCode: undefined,
    };
  }
}

export default apiRequest;
