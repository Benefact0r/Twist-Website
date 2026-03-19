const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:4000";

const ACCESS_TOKEN_KEY = "twist_access_token";
const CSRF_KEY = "twist_csrf_token";

type RequestOptions = {
  method?: "GET" | "POST" | "PATCH" | "PUT" | "DELETE";
  body?: unknown;
  auth?: boolean;
  retryOnAuthFail?: boolean;
};

export const tokenStore = {
  get accessToken() {
    return localStorage.getItem(ACCESS_TOKEN_KEY);
  },
  set accessToken(token: string | null) {
    if (!token) localStorage.removeItem(ACCESS_TOKEN_KEY);
    else localStorage.setItem(ACCESS_TOKEN_KEY, token);
  },
  get csrfToken() {
    return localStorage.getItem(CSRF_KEY);
  },
  set csrfToken(token: string | null) {
    if (!token) localStorage.removeItem(CSRF_KEY);
    else localStorage.setItem(CSRF_KEY, token);
  },
};

export async function ensureCsrfToken() {
  if (tokenStore.csrfToken) return tokenStore.csrfToken;
  const data = await request<{ csrfToken: string }>("/csrf", { auth: false });
  tokenStore.csrfToken = data.csrfToken;
  return data.csrfToken;
}

async function refreshAccessToken() {
  try {
    const csrfToken = tokenStore.csrfToken || (await ensureCsrfToken());
    const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        "x-csrf-token": csrfToken,
      },
    });
    if (!response.ok) return false;
    const json = await response.json();
    if (json.accessToken) {
      tokenStore.accessToken = json.accessToken;
      return true;
    }
    return false;
  } catch {
    return false;
  }
}

export async function request<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const method = options.method || "GET";
  const auth = options.auth ?? true;
  const retryOnAuthFail = options.retryOnAuthFail ?? true;

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  const csrfToken = tokenStore.csrfToken;
  if (csrfToken && method !== "GET") {
    headers["x-csrf-token"] = csrfToken;
  }
  if (auth && tokenStore.accessToken) {
    headers.Authorization = `Bearer ${tokenStore.accessToken}`;
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    method,
    headers,
    credentials: "include",
    body: options.body !== undefined ? JSON.stringify(options.body) : undefined,
  });

  if (response.status === 401 && auth && retryOnAuthFail) {
    const refreshed = await refreshAccessToken();
    if (refreshed) {
      return request<T>(path, { ...options, retryOnAuthFail: false });
    }
  }

  if (!response.ok) {
    let message = `Request failed (${response.status})`;
    try {
      const payload = await response.json();
      message = payload.error || message;
    } catch {
      // no-op
    }
    throw new Error(message);
  }

  if (response.status === 204) return undefined as T;
  return response.json() as Promise<T>;
}

export async function authSignIn(email: string, password: string) {
  await ensureCsrfToken();
  const data = await request<{ accessToken: string; user: unknown }>("/auth/login", {
    method: "POST",
    auth: false,
    body: { email, password },
  });
  tokenStore.accessToken = data.accessToken;
  return data;
}

export async function authSignUp(email: string, password: string, metadata?: Record<string, unknown>) {
  await ensureCsrfToken();
  const data = await request<{ accessToken: string; user: any }>("/auth/signup", {
    method: "POST",
    auth: false,
    body: { email, password, metadata },
  });
  tokenStore.accessToken = data.accessToken;
  return data;
}

export async function authSignOut() {
  await ensureCsrfToken();
  await request<void>("/auth/logout", { method: "POST" });
  tokenStore.accessToken = null;
}

export function createRealtimeSocket(onMessage: (payload: any) => void) {
  const token = tokenStore.accessToken;
  if (!token) return null;
  const wsUrl = API_BASE_URL.replace(/^http/, "ws");
  const ws = new WebSocket(`${wsUrl}/ws?access_token=${encodeURIComponent(token)}`);
  ws.onmessage = (event) => {
    try {
      onMessage(JSON.parse(event.data));
    } catch {
      // no-op
    }
  };
  return ws;
}
