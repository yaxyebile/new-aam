// Block-based content: text, image, video, or youtube embedded inline
export type ContentBlock =
  | { type: 'text'; value: string }
  | { type: 'image'; url: string; caption?: string }
  | { type: 'video'; url: string; caption?: string }
  | { type: 'youtube'; videoId: string; caption?: string }

export interface Article {
  id: string
  title: string
  excerpt: string
  content: string
  category: string
  imageUrl: string
  author: string
  publishedAt: string
  featured: boolean
  breaking: boolean
  // Media attachment (optional)
  mediaType?: 'image' | 'video' | 'audio' | 'youtube'
  mediaUrl?: string
  // Inline block content (replaces plain text `content` if present)
  blocks?: ContentBlock[]
}

export interface AdminCredentials {
  username: string
  password: string
}

const ARTICLES_KEY = 'aam_news_articles'
const AUTH_KEY = 'aam_news_auth'
const ADMIN_KEY = 'aam_news_admin'

// Default admin credentials
const DEFAULT_ADMIN: AdminCredentials = {
  username: 'admin',
  password: 'admin123'
}

// Sample initial articles
const INITIAL_ARTICLES: Article[] = [
  {
    id: '1',
    title: 'Global Leaders Summit Addresses Climate Crisis with Ambitious New Targets',
    excerpt: 'World leaders convene for emergency summit, announcing groundbreaking commitments to reduce carbon emissions by 2030.',
    content: `World leaders from over 150 nations gathered today for an emergency climate summit, announcing unprecedented commitments to combat the growing climate crisis.

The summit, held in Geneva, saw major economies pledge to reduce carbon emissions by 60% before the end of the decade, a significant increase from previous targets.

"This is a defining moment for humanity," said the UN Secretary-General. "The commitments made today represent the most ambitious climate action plan in history."

Key announcements include:
- $500 billion fund for developing nations
- Ban on new coal power plants by 2027
- Mandatory carbon pricing across all participating nations
- Investment in renewable energy infrastructure

Environmental groups have cautiously welcomed the announcements while calling for immediate implementation.`,
    category: 'World',
    imageUrl: 'https://images.unsplash.com/photo-1569163139599-0f4517e36f51?w=800&h=500&fit=crop',
    author: 'Sarah Mitchell',
    publishedAt: new Date().toISOString(),
    featured: true,
    breaking: true
  },
  {
    id: '2',
    title: 'Tech Giants Report Record Quarterly Earnings Amid AI Boom',
    excerpt: 'Major technology companies see unprecedented growth driven by artificial intelligence investments.',
    content: `Silicon Valley's biggest players have reported record-breaking quarterly earnings, with artificial intelligence emerging as the primary growth driver.

The combined market value of the top five tech companies surged past $12 trillion following the earnings announcements.

Analysts attribute the growth to massive enterprise adoption of AI tools and increasing consumer demand for AI-powered products.

"We're witnessing the beginning of a new technological era," said one Wall Street analyst. "Companies that invested early in AI infrastructure are now reaping the benefits."`,
    category: 'Business',
    imageUrl: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=500&fit=crop',
    author: 'Michael Chen',
    publishedAt: new Date(Date.now() - 3600000).toISOString(),
    featured: true,
    breaking: false
  },
  {
    id: '3',
    title: 'Scientists Discover New Species in Deep Ocean Expedition',
    excerpt: 'Researchers find over 30 previously unknown species during deep-sea exploration mission.',
    content: `A groundbreaking deep-sea expedition has discovered more than 30 species previously unknown to science, researchers announced today.

The three-month mission explored underwater mountain ranges in the Pacific Ocean at depths exceeding 4,000 meters.

Among the discoveries are bioluminescent fish, unique coral formations, and several invertebrate species that may hold potential for medical research.

"Every dive revealed something extraordinary," said the expedition's lead scientist. "These findings underscore how much we still have to learn about our own planet."`,
    category: 'Science',
    imageUrl: 'https://images.unsplash.com/photo-1551244072-5d12893278ab?w=800&h=500&fit=crop',
    author: 'Dr. Emily Watson',
    publishedAt: new Date(Date.now() - 7200000).toISOString(),
    featured: false,
    breaking: false
  },
  {
    id: '4',
    title: 'Championship Finals Set to Break Viewership Records',
    excerpt: 'Anticipation builds as two historic teams prepare for the most watched sporting event of the year.',
    content: `Sports fans around the world are gearing up for what promises to be the most-watched championship final in history.

The matchup between two storied franchises has generated unprecedented ticket demand and broadcast interest across global markets.

Streaming platforms report pre-registration numbers triple that of last year's final, while advertisers have paid premium rates for commercial slots.

"This is the sporting event of the decade," said one sports analyst. "The storylines, the rivalry, the stakes—everything has aligned for a historic moment."`,
    category: 'Sports',
    imageUrl: 'https://images.unsplash.com/photo-1461896836934- voices-sport?w=800&h=500&fit=crop',
    author: 'James Rodriguez',
    publishedAt: new Date(Date.now() - 10800000).toISOString(),
    featured: false,
    breaking: false
  },
  {
    id: '5',
    title: 'New Healthcare Policy Aims to Expand Coverage to Millions',
    excerpt: 'Government announces sweeping reforms to make healthcare more accessible and affordable.',
    content: `The government has unveiled a comprehensive healthcare reform package aimed at extending coverage to millions of uninsured citizens.

The policy includes subsidies for low-income families, caps on prescription drug prices, and increased funding for rural healthcare facilities.

Healthcare advocates have praised the initiative while critics raise concerns about implementation costs and timeline.

"This represents the most significant healthcare expansion in a generation," said the Health Minister during the announcement.`,
    category: 'Politics',
    imageUrl: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=800&h=500&fit=crop',
    author: 'Linda Thompson',
    publishedAt: new Date(Date.now() - 14400000).toISOString(),
    featured: true,
    breaking: false
  },
  {
    id: '6',
    title: 'Award-Winning Director Announces Surprise New Film Project',
    excerpt: 'Hollywood heavyweight reveals details of highly anticipated upcoming production.',
    content: `One of Hollywood's most celebrated directors has announced a surprise new film project that has already generated significant buzz in the entertainment industry.

The film, described as an "epic historical drama," will feature an ensemble cast of A-list actors and is scheduled to begin production next month.

Industry insiders predict the project could be a major contender during next year's award season.

"This story has been in my heart for over a decade," the director said during the announcement. "The time has finally come to bring it to life."`,
    category: 'Entertainment',
    imageUrl: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=800&h=500&fit=crop',
    author: 'Rachel Green',
    publishedAt: new Date(Date.now() - 18000000).toISOString(),
    featured: false,
    breaking: false
  }
]

export function getArticles(): Article[] {
  if (typeof window === 'undefined') return INITIAL_ARTICLES

  const stored = localStorage.getItem(ARTICLES_KEY)
  if (!stored) {
    localStorage.setItem(ARTICLES_KEY, JSON.stringify(INITIAL_ARTICLES))
    return INITIAL_ARTICLES
  }
  return JSON.parse(stored)
}

export function getArticleById(id: string): Article | undefined {
  const articles = getArticles()
  return articles.find(article => article.id === id)
}

export function getArticlesByCategory(category: string): Article[] {
  const articles = getArticles()
  return articles.filter(article => article.category.toLowerCase() === category.toLowerCase())
}

export function getFeaturedArticles(): Article[] {
  const articles = getArticles()
  return articles.filter(article => article.featured)
}

export function getBreakingNews(): Article[] {
  const articles = getArticles()
  return articles.filter(article => article.breaking)
}

export function saveArticle(article: Article): void {
  const articles = getArticles()
  const index = articles.findIndex(a => a.id === article.id)

  if (index >= 0) {
    articles[index] = article
  } else {
    articles.unshift(article)
  }

  localStorage.setItem(ARTICLES_KEY, JSON.stringify(articles))
}

export function deleteArticle(id: string): void {
  const articles = getArticles()
  const filtered = articles.filter(a => a.id !== id)
  localStorage.setItem(ARTICLES_KEY, JSON.stringify(filtered))
}

export function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substr(2)
}

// Auth functions
export function getAdminCredentials(): AdminCredentials {
  if (typeof window === 'undefined') return DEFAULT_ADMIN

  const stored = localStorage.getItem(ADMIN_KEY)
  if (!stored) {
    localStorage.setItem(ADMIN_KEY, JSON.stringify(DEFAULT_ADMIN))
    return DEFAULT_ADMIN
  }
  return JSON.parse(stored)
}

export function validateLogin(username: string, password: string): boolean {
  const admin = getAdminCredentials()
  return admin.username === username && admin.password === password
}

export function isAuthenticated(): boolean {
  if (typeof window === 'undefined') return false
  return localStorage.getItem(AUTH_KEY) === 'true'
}

export function setAuthenticated(value: boolean): void {
  if (value) {
    localStorage.setItem(AUTH_KEY, 'true')
  } else {
    localStorage.removeItem(AUTH_KEY)
  }
}

export function logout(): void {
  localStorage.removeItem(AUTH_KEY)
}

export const CATEGORIES = ['World', 'Politics', 'Business', 'Technology', 'Science', 'Sports', 'Entertainment', 'Health']

// Search
export function searchArticles(query: string): Article[] {
  if (!query.trim()) return []
  const articles = getArticles()
  const q = query.toLowerCase().trim()
  return articles.filter(article =>
    article.title.toLowerCase().includes(q) ||
    article.excerpt.toLowerCase().includes(q) ||
    article.content.toLowerCase().includes(q) ||
    article.author.toLowerCase().includes(q) ||
    article.category.toLowerCase().includes(q)
  )
}

// View count tracking
const VIEWS_KEY = 'aam_news_views'

export function incrementViewCount(id: string): void {
  if (typeof window === 'undefined') return
  const stored = localStorage.getItem(VIEWS_KEY)
  const views: Record<string, number> = stored ? JSON.parse(stored) : {}
  views[id] = (views[id] || 0) + 1
  localStorage.setItem(VIEWS_KEY, JSON.stringify(views))
}

export function getViewCount(id: string): number {
  if (typeof window === 'undefined') return 0
  const stored = localStorage.getItem(VIEWS_KEY)
  if (!stored) return 0
  const views: Record<string, number> = JSON.parse(stored)
  return views[id] || 0
}

export function getAllViewCounts(): Record<string, number> {
  if (typeof window === 'undefined') return {}
  const stored = localStorage.getItem(VIEWS_KEY)
  return stored ? JSON.parse(stored) : {}
}
