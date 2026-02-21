import Link from "next/link"
import Image from "next/image"
import { Badge } from "@/components/ui/badge"
import type { Article } from "@/lib/api"

interface NewsCardProps {
  article: Article
  variant?: "default" | "featured" | "compact" | "horizontal"
}

function formatDate(dateString: string): string {
  const date = new Date(dateString)
  const now = new Date()
  const diff = now.getTime() - date.getTime()
  const hours = Math.floor(diff / (1000 * 60 * 60))

  if (hours < 1) return "Just now"
  if (hours < 24) return `${hours}h ago`
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

export function NewsCard({ article, variant = "default" }: NewsCardProps) {
  if (variant === "featured") {
    return (
      <Link href={`/article/${article._id || article.id}`} className="group block">
        <article className="relative overflow-hidden rounded-lg bg-card border border-border">
          <div className="aspect-video relative overflow-hidden">
            <Image
              src={article.imageUrl || "/placeholder.svg"}
              alt={article.title}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-4 md:p-6">
              <div className="flex items-center gap-2 mb-2 sm:mb-3">
                {article.breaking && (
                  <Badge className="bg-primary text-primary-foreground text-xs sm:text-sm">Breaking</Badge>
                )}
                <Badge variant="secondary" className="bg-card/90 text-foreground text-xs sm:text-sm">
                  {article.category}
                </Badge>
              </div>
              <h2 className="text-base sm:text-lg md:text-2xl font-bold text-white leading-tight mb-1 sm:mb-2 text-balance group-hover:underline decoration-2 underline-offset-2">
                {article.title}
              </h2>
              {article.excerpt && (
                <p className="text-white/80 text-xs sm:text-sm line-clamp-2 mb-2 sm:mb-3 hidden sm:block">
                  {article.excerpt}
                </p>
              )}
              <div className="flex items-center gap-2 text-white/70 text-xs">
                <span className="truncate">{article.author}</span>
                <span>•</span>
                <time dateTime={article.publishedAt} className="shrink-0">{formatDate(article.publishedAt)}</time>
              </div>
            </div>
          </div>
        </article>
      </Link>
    )
  }

  if (variant === "compact") {
    return (
      <Link href={`/article/${article._id || article.id}`} className="group block">
        <article className="flex gap-2 sm:gap-4 py-2 sm:py-4 border-b border-border last:border-0">
          <div className="relative w-16 sm:w-24 h-10 sm:h-16 shrink-0 overflow-hidden rounded">
            <Image
              src={article.imageUrl || "/placeholder.svg"}
              alt={article.title}
              fill
              className="object-cover"
            />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-medium text-xs sm:text-sm leading-snug text-foreground group-hover:text-primary transition-colors line-clamp-2">
              {article.title}
            </h3>
            <div className="flex items-center gap-2 mt-0.5 sm:mt-1 text-xs text-muted-foreground">
              <span className="truncate">{article.category}</span>
              <span>•</span>
              <time dateTime={article.publishedAt} className="shrink-0">{formatDate(article.publishedAt)}</time>
            </div>
          </div>
        </article>
      </Link>
    )
  }

  if (variant === "horizontal") {
    return (
      <Link href={`/article/${article._id || article.id}`} className="group block">
        <article className="flex flex-col sm:flex-row gap-4 py-4 sm:py-6 border-b border-border last:border-0 group">
          <div className="relative w-full sm:w-48 md:w-64 aspect-video sm:aspect-[4/3] md:aspect-video shrink-0 overflow-hidden rounded-lg bg-muted">
            <Image
              src={article.imageUrl || "/placeholder.svg"}
              alt={article.title}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
            />
            {article.breaking && (
              <Badge className="absolute top-2 left-2 bg-primary text-primary-foreground text-[10px] sm:text-xs">
                Breaking
              </Badge>
            )}
          </div>
          <div className="flex-1 min-w-0 flex flex-col justify-center gap-1 sm:gap-2">
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-[10px] sm:text-xs font-medium uppercase tracking-wider">
                {article.category}
              </Badge>
              <time dateTime={article.publishedAt} className="text-[10px] sm:text-xs text-muted-foreground">
                {formatDate(article.publishedAt)}
              </time>
            </div>
            <h3 className="font-bold text-base sm:text-lg md:text-xl text-foreground group-hover:text-primary transition-colors line-clamp-2 leading-tight">
              {article.title}
            </h3>
            {article.excerpt && (
              <p className="text-xs sm:text-sm text-muted-foreground line-clamp-2 sm:line-clamp-3">
                {article.excerpt}
              </p>
            )}
            <div className="flex items-center gap-2 mt-1">
              <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center text-[10px] text-primary font-bold">
                {article.author.charAt(0)}
              </div>
              <span className="text-xs font-medium capitalize text-muted-foreground">{article.author}</span>
            </div>
          </div>
        </article>
      </Link>
    )
  }

  return (
    <Link href={`/article/${article._id || article.id}`} className="group block">
      <article className="overflow-hidden rounded-lg bg-card border border-border h-full flex flex-col">
        <div className="aspect-video relative overflow-hidden">
          <Image
            src={article.imageUrl || "/placeholder.svg"}
            alt={article.title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
          {article.breaking && (
            <Badge className="absolute top-2 sm:top-3 left-2 sm:left-3 bg-primary text-primary-foreground text-xs sm:text-sm">
              Breaking
            </Badge>
          )}
        </div>
        <div className="p-2.5 sm:p-4 flex-1 flex flex-col">
          <Badge variant="outline" className="self-start mb-1.5 sm:mb-2 text-xs">
            {article.category}
          </Badge>
          <h3 className="font-semibold text-sm sm:text-base text-foreground leading-snug mb-1.5 sm:mb-2 group-hover:text-primary transition-colors line-clamp-2">
            {article.title}
          </h3>
          {article.excerpt && (
            <p className="text-xs sm:text-sm text-muted-foreground line-clamp-2 mb-2 sm:mb-3 flex-1">
              {article.excerpt}
            </p>
          )}
          <div className="flex items-center gap-2 text-xs text-muted-foreground mt-auto">
            <span className="truncate">{article.author}</span>
            <span>•</span>
            <time dateTime={article.publishedAt} className="shrink-0">{formatDate(article.publishedAt)}</time>
          </div>
        </div>
      </article>
    </Link>
  )
}
