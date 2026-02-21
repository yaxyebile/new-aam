"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { ArrowLeft, User, Clock, Bookmark, Share2 } from "lucide-react"
import { Header } from "@/components/news/header"
import { Footer } from "@/components/news/footer"
import { NewsCard } from "@/components/news/news-card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { type Article } from "@/lib/api"
import { SocialShare } from "@/components/news/social-share"
import { CommentSection } from "@/components/news/comment-section"

interface ArticleViewProps {
    article: Article
    relatedArticles: Article[]
}

function formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString('en-US', {
        weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
        hour: '2-digit', minute: '2-digit'
    })
}

function renderContent(text: string): React.ReactNode[] {
    const TAG = /\[(IMAGE|VIDEO|YOUTUBE):\s*([^\]]+)\]/g
    const parts: React.ReactNode[] = []
    let last = 0
    let match: RegExpExecArray | null
    let key = 0

    while ((match = TAG.exec(text)) !== null) {
        const before = text.slice(last, match.index).trim()
        if (before) {
            before.split(/\n\n+/).filter(Boolean).forEach(para => {
                parts.push(
                    <p key={key++} className="text-sm sm:text-base text-foreground leading-relaxed mb-4">
                        {para.trim()}
                    </p>
                )
            })
        }

        const type = match[1]
        const val = match[2].trim()

        if (type === 'IMAGE') {
            parts.push(
                <figure key={key++} className="my-6">
                    <img src={val} alt="" className="w-full rounded-lg object-cover max-h-96"
                        onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }} />
                </figure>
            )
        } else if (type === 'VIDEO') {
            parts.push(
                <figure key={key++} className="my-6">
                    <video controls src={val} className="w-full rounded-lg bg-black max-h-80" />
                </figure>
            )
        } else if (type === 'YOUTUBE') {
            parts.push(
                <figure key={key++} className="my-6">
                    <div className="aspect-video rounded-lg overflow-hidden">
                        <iframe
                            src={`https://www.youtube.com/embed/${val}`}
                            className="w-full h-full"
                            allowFullScreen
                        />
                    </div>
                </figure>
            )
        }
        last = match.index + match[0].length
    }

    const after = text.slice(last).trim()
    if (after) {
        after.split(/\n\n+/).filter(Boolean).forEach(para => {
            parts.push(
                <p key={key++} className="text-sm sm:text-base text-foreground leading-relaxed mb-4">
                    {para.trim()}
                </p>
            )
        })
    }

    return parts.length > 0 ? parts : text.split('\n\n').map((p, i) => (
        <p key={i} className="text-sm sm:text-base text-foreground leading-relaxed mb-4">{p}</p>
    ))
}

export function ArticleView({ article, relatedArticles }: ArticleViewProps) {
    const router = useRouter()
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)
    }, [])

    if (!mounted) return null

    return (
        <div className="min-h-screen bg-background flex flex-col">
            <Header />

            <main className="flex-1 w-full overflow-hidden">
                <div className="bg-card border-b border-border">
                    <div className="mx-auto max-w-4xl px-3 sm:px-4 py-4 sm:py-6">
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => router.back()}
                            className="mb-3 sm:mb-4 h-8 sm:h-9 text-xs sm:text-sm"
                        >
                            <ArrowLeft className="w-3 sm:w-4 h-3 sm:h-4 mr-1 sm:mr-2" />
                            Back
                        </Button>

                        <div className="max-w-4xl">
                            <div className="flex items-center gap-2 mb-3 sm:mb-4 flex-wrap">
                                {article.breaking && (
                                    <Badge className="bg-primary text-primary-foreground text-xs sm:text-sm">Breaking News</Badge>
                                )}
                                <Link href={`/category/${article.category.toLowerCase()}`}>
                                    <Badge variant="outline" className="text-xs sm:text-sm">{article.category}</Badge>
                                </Link>
                            </div>

                            <h1 className="text-xl sm:text-3xl md:text-4xl font-bold text-foreground leading-tight mb-2 sm:mb-4 text-balance">
                                {article.title}
                            </h1>

                            {article.excerpt && (
                                <p className="text-sm sm:text-base md:text-lg text-muted-foreground leading-relaxed mb-4 sm:mb-6">
                                    {article.excerpt}
                                </p>
                            )}

                            <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-xs sm:text-sm text-muted-foreground">
                                <div className="flex items-center gap-1.5 sm:gap-2">
                                    <User className="w-3 sm:w-4 h-3 sm:h-4" />
                                    <span>By <strong className="text-foreground">{article.author}</strong></span>
                                </div>
                                <div className="flex items-center gap-1.5 sm:gap-2">
                                    <Clock className="w-3 sm:w-4 h-3 sm:h-4" />
                                    <time dateTime={article.publishedAt}>{formatDate(article.publishedAt)}</time>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <article className="mx-auto max-w-4xl px-3 sm:px-4 py-6 sm:py-8">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
                        <div className="lg:col-span-2">
                            <div className="relative rounded-lg overflow-hidden mb-6 sm:mb-8">
                                {(!article.mediaType || article.mediaType === 'image') && (
                                    <div className="aspect-video relative">
                                        <Image
                                            src={article.imageUrl || "/placeholder.svg"}
                                            alt={article.title}
                                            fill
                                            className="object-cover"
                                            priority
                                        />
                                    </div>
                                )}

                                {article.mediaType === 'youtube' && article.mediaUrl && (() => {
                                    const ytId = article.mediaUrl.includes('v=')
                                        ? article.mediaUrl.split('v=')[1]?.split('&')[0]
                                        : article.mediaUrl.trim()
                                    return (
                                        <div className="aspect-video">
                                            <iframe
                                                src={`https://www.youtube.com/embed/${ytId}`}
                                                className="w-full h-full"
                                                allowFullScreen
                                                title={article.title}
                                            />
                                        </div>
                                    )
                                })()}

                                {article.mediaType === 'video' && article.mediaUrl && (
                                    <div className="aspect-video bg-black">
                                        <video controls className="w-full h-full" src={article.mediaUrl} />
                                    </div>
                                )}
                            </div>

                            <div className="mb-8 border-y border-border py-4">
                                <SocialShare title={article.title} />
                            </div>

                            <div className="prose max-w-none space-y-6">
                                {article.blocks && article.blocks.length > 0 ? (
                                    article.blocks.map((block, i) => {
                                        if (block.type === 'text') {
                                            return (
                                                <div key={i}>
                                                    {block.value.split('\n\n').filter(Boolean).map((para: string, j: number) => (
                                                        <p key={j} className="text-sm sm:text-base text-foreground leading-relaxed mb-4">{para}</p>
                                                    ))}
                                                </div>
                                            )
                                        }
                                        if (block.type === 'image') {
                                            return (
                                                <figure key={i} className="my-6">
                                                    <img src={block.url} alt={block.caption || ''} className="w-full rounded-lg object-cover max-h-96" />
                                                    {block.caption && <figcaption className="text-xs text-muted-foreground text-center mt-2 italic">{block.caption}</figcaption>}
                                                </figure>
                                            )
                                        }
                                        return null
                                    })
                                ) : (
                                    renderContent(article.content)
                                )}
                            </div>

                            <div className="mt-8 pt-6 border-t border-border space-y-4">
                                <div className="flex flex-wrap gap-2">
                                    <Link href={`/category/${article.category.toLowerCase()}`} className="px-3 py-1 text-xs rounded-full border border-border bg-muted/50 hover:bg-primary hover:text-primary-foreground transition-colors font-medium">
                                        📁 {article.category}
                                    </Link>
                                    {article.tags && article.tags.length > 0 && article.tags.map((tag) => (
                                        <Link
                                            key={tag}
                                            href={`/search?q=${encodeURIComponent(tag)}`}
                                            className="px-3 py-1 text-xs rounded-full border border-border bg-muted/20 hover:bg-primary/10 hover:border-primary transition-colors text-muted-foreground hover:text-primary"
                                        >
                                            #{tag}
                                        </Link>
                                    ))}
                                </div>
                            </div>

                            <CommentSection articleId={(article._id || article.id) as string} />
                        </div>

                        <aside className="lg:col-span-1">
                            <div className="sticky top-24">
                                {relatedArticles.length > 0 && (
                                    <div className="bg-card rounded-lg border border-border p-4">
                                        <h3 className="font-bold text-foreground mb-4 pb-2 border-b border-border">Related Stories</h3>
                                        <div className="space-y-4">
                                            {relatedArticles.map((ra) => (
                                                <NewsCard key={ra._id} article={ra} variant="compact" />
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </aside>
                    </div>
                </article>
            </main>

            <Footer />
        </div>
    )
}
