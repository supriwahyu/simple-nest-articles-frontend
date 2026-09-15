export interface Author {
  id: number;
  name: string;
  email: string;
}

export interface Article {
  id: number;
  title: string;
  slug: string;
  content: string;
  published: boolean;
  authorId: number;
  author?: Author;
  createdAt: string;
  updatedAt: string;
}

export interface CreateArticleDto {
  title: string;
  slug: string;
  content: string;
}

export interface LoginDto {
  email: string;
  password: string;
}

export interface RegisterDto {
  name: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  access_token: string;
}

export interface UserProfile {
  sub: number;
  email: string;
  iat?: number;
  exp?: number;
}

export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

class ApiError extends Error {
  statusCode: number;
  constructor(message: string, statusCode: number) {
    super(message);
    this.name = 'ApiError';
    this.statusCode = statusCode;
  }
}

async function handleResponse<T>(res: Response): Promise<T> {
  if (!res.ok) {
    let errorMsg = `Request failed with status ${res.status}`;
    try {
      const errorData = await res.json();
      if (errorData.message) {
        if (Array.isArray(errorData.message)) {
          errorMsg = errorData.message.join(', ');
        } else {
          errorMsg = errorData.message;
        }
      }
    } catch {
      // ignore json parse error
    }
    throw new ApiError(errorMsg, res.status);
  }

  // Some responses like DELETE or 204 may have no content
  const contentType = res.headers.get('content-type');
  if (contentType && contentType.includes('application/json')) {
    return (await res.json()) as T;
  }
  return {} as T;
}

// Articles API
export async function getArticles(): Promise<Article[]> {
  const res = await fetch(`${API_BASE_URL}/articles`, {
    cache: 'no-store',
  });
  return handleResponse<Article[]>(res);
}

export async function getArticle(id: number | string): Promise<Article> {
  const res = await fetch(`${API_BASE_URL}/articles/${id}`, {
    cache: 'no-store',
  });
  return handleResponse<Article>(res);
}

export async function createArticle(
  data: CreateArticleDto,
  token: string
): Promise<Article> {
  const res = await fetch(`${API_BASE_URL}/articles`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });
  return handleResponse<Article>(res);
}

export async function deleteArticle(
  id: number | string,
  token: string
): Promise<void> {
  const res = await fetch(`${API_BASE_URL}/articles/${id}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return handleResponse<void>(res);
}

// Auth API
export async function login(credentials: LoginDto): Promise<AuthResponse> {
  const res = await fetch(`${API_BASE_URL}/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(credentials),
  });
  return handleResponse<AuthResponse>(res);
}

export async function register(data: RegisterDto): Promise<{ message: string; user: Record<string, unknown> }> {
  const res = await fetch(`${API_BASE_URL}/auth/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  return handleResponse<{ message: string; user: Record<string, unknown> }>(res);
}

export async function getProfile(token: string): Promise<UserProfile> {
  const res = await fetch(`${API_BASE_URL}/auth/profile`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    cache: 'no-store',
  });
  return handleResponse<UserProfile>(res);
}
