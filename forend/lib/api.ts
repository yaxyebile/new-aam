/**
 * API client — all calls go to http://localhost:5000 (or NEXT_PUBLIC_API_URL)
 */

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || ''

// ── Types ────────────────────────────────────────────────────────────────────

export interface Article {
    _id: string
    id?: string            // alias for _id, used in legacy UI
    title: string
    slug: string
    excerpt?: string
    content: string
    category: string
    imageUrl: string
    author: string
    tags: string[]
    featured: boolean
    breaking: boolean
    published: boolean
    viewCount: number
    publishedAt: string
    createdAt: string
    commentsCount?: number
    // legacy media fields (kept for article page)
    mediaType?: 'image' | 'video' | 'audio' | 'youtube'
    mediaUrl?: string
    blocks?: ContentBlock[]
}

export type ContentBlock =
    | { type: 'text'; value: string }
    | { type: 'image'; url: string; caption?: string }
    | { type: 'video'; url: string; caption?: string }
    | { type: 'youtube'; videoId: string; caption?: string }

export interface ArticlesResponse {
    articles: Article[]
    total: number
    page: number
    totalPages: number
}

export interface AuthResponse {
    token: string
    user: { username: string; role: string; _id?: string }
}

export interface Comment {
    _id: string
    article: string | { _id: string, title: string }
    author: string
    email?: string
    content: string
    approved: boolean
    createdAt: string
}

export interface StatsResponse {
    total: number
    published: number
    featured: number
    breaking: number
    totalViews: number
    byCategory: { _id: string; count: number }[]
}

// ── Helpers ──────────────────────────────────────────────────────────────────

function getToken(): string | null {
    if (typeof window === 'undefined') return null
    return localStorage.getItem('aam_token')
}

function authHeaders(): Record<string, string> {
    const token = getToken()
    return token ? { Authorization: `Bearer ${token}` } : {}
}

function normalise(article: Article): Article {
    return { ...article, id: article._id }
}

async function request<T>(path: string, options?: RequestInit): Promise<T> {
    const res = await fetch(`${BASE_URL}${path}`, {
        headers: { 'Content-Type': 'application/json', ...authHeaders() },
        ...options,
    })
    if (!res.ok) {
        const body = await res.json().catch(() => ({}))
        throw new Error(body.message || `API error ${res.status}`)
    }
    return res.json()
}

// ── Articles ─────────────────────────────────────────────────────────────────

export async function getArticles(params: {
    category?: string
    search?: string
    featured?: boolean
    breaking?: boolean
    limit?: number
    page?: number
} = {}): Promise<ArticlesResponse> {
    const q = new URLSearchParams()
    if (params.category && params.category !== 'All') q.set('category', params.category)
    if (params.search) q.set('search', params.search)
    if (params.featured) q.set('featured', 'true')
    if (params.breaking) q.set('breaking', 'true')
    if (params.limit) q.set('limit', String(params.limit))
    if (params.page) q.set('page', String(params.page))

    const data = await request<ArticlesResponse>(`/api/articles?${q}`)
    return { ...data, articles: data.articles.map(normalise) }
}

export async function getFeaturedArticles(): Promise<Article[]> {
    const data = await request<Article[]>('/api/articles/featured')
    return data.map(normalise)
}

export async function getBreakingNews(): Promise<Article[]> {
    const data = await request<Article[]>('/api/articles/breaking')
    return data.map(normalise)
}

export async function getArticleById(id: string): Promise<Article> {
    const data = await request<Article>(`/api/articles/${id}`)
    return normalise(data)
}

export async function getStats(): Promise<StatsResponse> {
    return request<StatsResponse>('/api/articles/stats')
}

export async function createArticle(data: Partial<Article>): Promise<Article> {
    const res = await request<Article>('/api/articles', {
        method: 'POST',
        body: JSON.stringify(data),
    })
    return normalise(res)
}

export async function updateArticle(id: string, data: Partial<Article>): Promise<Article> {
    const res = await request<Article>(`/api/articles/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
    })
    return normalise(res)
}

export async function deleteArticle(id: string): Promise<void> {
    await request(`/api/articles/${id}`, { method: 'DELETE' })
}

// ── Auth ─────────────────────────────────────────────────────────────────────

export async function login(username: string, password: string): Promise<AuthResponse> {
    const data = await request<AuthResponse>('/api/auth/login', {
        method: 'POST',
        body: JSON.stringify({ username, password }),
    })
    if (typeof window !== 'undefined') {
        localStorage.setItem('aam_token', data.token)
        localStorage.setItem('aam_news_auth', 'true')
    }
    return data
}

export function logout(): void {
    if (typeof window !== 'undefined') {
        localStorage.removeItem('aam_token')
        localStorage.removeItem('aam_news_auth')
    }
}

export function isAuthenticated(): boolean {
    if (typeof window === 'undefined') return false
    return !!localStorage.getItem('aam_token')
}

// ── Comments ─────────────────────────────────────────────────────────────────

export async function getComments(articleId: string): Promise<Comment[]> {
    return request<Comment[]>(`/api/comments/${articleId}`)
}

export async function getAllComments(): Promise<Comment[]> {
    return request<Comment[]>('/api/comments')
}

export async function addComment(articleId: string, data: {
    author: string
    email?: string
    content: string
}): Promise<Comment> {
    return request<Comment>(`/api/comments/${articleId}`, {
        method: 'POST',
        body: JSON.stringify(data),
    })
}

export async function deleteComment(id: string): Promise<void> {
    await request(`/api/comments/${id}`, { method: 'DELETE' })
}

export async function approveComment(id: string): Promise<Comment> {
    return request<Comment>(`/api/comments/${id}/approve`, {
        method: 'PATCH'
    })
}

// ── Upload ───────────────────────────────────────────────────────────────────

export async function uploadImage(file: File): Promise<string> {
    const form = new FormData()
    form.append('image', file)
    const token = getToken()
    const res = await fetch(`${BASE_URL}/api/upload/image`, {
        method: 'POST',
        headers: token ? { Authorization: `Bearer ${token}` } : {},
        body: form,
    })
    if (!res.ok) {
        const body = await res.json().catch(() => ({}))
        throw new Error(body.message || 'Upload failed')
    }
    const { imageUrl } = await res.json()
    return `${BASE_URL}${imageUrl}`
}

export const CATEGORIES = ['All', 'World', 'Politics', 'Business', 'Technology', 'Science', 'Sports', 'Entertainment', 'Health']
