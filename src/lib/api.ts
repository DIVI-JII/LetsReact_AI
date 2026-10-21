/**
 * Thin fetch wrapper for the LetsReact_AI API.
 * - Same-origin only: the session lives in an httpOnly cookie the browser attaches itself,
 *   so no token is ever stored in JavaScript, localStorage or the URL.
 * - Every error becomes an ApiError with a message that is safe to show.
 */
export class ApiError extends Error {
  readonly status: number;
  readonly code: string;
  readonly fields?: Record<string, string>;

  constructor(status: number, code: string, message: string, fields?: Record<string, string>) {
    super(message);
    this.status = status;
    this.code = code;
    this.fields = fields;
  }
}

let onUnauthorized: (() => void) | null = null;

/** Called when a non-auth request comes back 401, i.e. the session ended. */
export function setUnauthorizedHandler(handler: (() => void) | null): void {
  onUnauthorized = handler;
}

interface RequestOptions {
  /** Lets a save finish while the page is being closed. */
  keepalive?: boolean;
}

async function request<T>(method: string, path: string, body?: unknown, options: RequestOptions = {}): Promise<T> {
  let res: Response;
  try {
    res = await fetch(path, {
      method,
      credentials: 'same-origin',
      headers: {
        Accept: 'application/json',
        ...(body !== undefined ? { 'Content-Type': 'application/json' } : {}),
      },
      body: body !== undefined ? JSON.stringify(body) : undefined,
      keepalive: options.keepalive,
    });
  } catch {
    throw new ApiError(0, 'network', 'Can’t reach the server. Check your connection and try again.');
  }

  if (res.status === 204) return undefined as T;

  const isJson = res.headers.get('content-type')?.includes('application/json');
  const data = isJson ? await res.json().catch(() => null) : null;

  if (!res.ok) {
    const err = (data as { error?: { code?: string; message?: string; fields?: Record<string, string> } } | null)?.error;
    // A 401 from anywhere except the sign-in forms means the session has ended.
    if (res.status === 401 && !path.startsWith('/api/auth/')) onUnauthorized?.();
    throw new ApiError(
      res.status,
      err?.code ?? 'error',
      err?.message ?? (res.status >= 500 ? 'Something went wrong on our side. Please try again.' : 'Request failed.'),
      err?.fields,
    );
  }
  return data as T;
}

export const api = {
  get: <T>(path: string) => request<T>('GET', path),
  post: <T>(path: string, body?: unknown) => request<T>('POST', path, body ?? {}),
  put: <T>(path: string, body: unknown, options?: RequestOptions) => request<T>('PUT', path, body, options),
  patch: <T>(path: string, body: unknown) => request<T>('PATCH', path, body),
  delete: <T>(path: string, body?: unknown) => request<T>('DELETE', path, body ?? {}),
};

/** Fire-and-forget "the learner opened this" signal. Never blocks or breaks the UI. */
export function trackEvent(type: 'lesson_viewed' | 'challenge_viewed' | 'project_viewed', refId: string): void {
  api.post('/api/events', { type, refId }).catch(() => undefined);
}
