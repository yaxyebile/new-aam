"use client"

import { Header } from "@/components/news/header"
import { Footer } from "@/components/news/footer"
import { NewsCard } from "@/components/news/news-card"
import { type Article, CATEGORIES } from "@/lib/api"
import { useLanguage } from "@/lib/language-context"
import Link from "next/link"

interface HomeViewProps {
    featuredArticles: Article[]
    articles: Article[]
}

export function HomeView({ featuredArticles, articles }: HomeViewProps) {
    const { t } = useLanguage()

    const latestArticles = articles.slice(0, 8)
    const sidebarArticles = articles.slice(3, 8)

    return (
        <div className="min-h-screen bg-background flex flex-col">
            <Header />

            <main className="flex-1">
                {/* Featured Section */}
                <section className="w-full px-3 sm:px-4 py-6 sm:py-8">
                    <div className="mx-auto max-w-7xl space-y-6">
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
                            {/* Main Featured */}
                            <div className="lg:col-span-2">
                                {featuredArticles[0] && (
                                    <NewsCard article={featuredArticles[0]} variant="featured" />
                                )}
                            </div>

                            {/* Secondary Featured */}
                            <div className="flex flex-col gap-4">
                                {featuredArticles.slice(1, 3).map((article) => (
                                    <NewsCard key={article._id} article={article} variant="default" />
                                ))}
                            </div>
                        </div>

                        {/* Additional Featured (up to 10) */}
                        {featuredArticles.length > 3 && (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-4 border-t border-border">
                                {featuredArticles.slice(3, 10).map((article) => (
                                    <NewsCard key={article._id} article={article} variant="compact" />
                                ))}
                            </div>
                        )}
                    </div>
                </section>

                {/* Category Quick Links */}
                <section className="border-y border-border bg-muted/30">
                    <div className="mx-auto max-w-7xl px-3 sm:px-4">
                        <div className="flex items-center gap-2 py-3 sm:py-4 overflow-x-auto scrollbar-hide">
                            <span className="text-xs sm:text-sm font-medium text-muted-foreground shrink-0">{t("browse")}</span>
                            {CATEGORIES.map((category) => (
                                <Link
                                    key={category}
                                    href={`/category/${category.toLowerCase()}`}
                                    className="shrink-0 px-2.5 sm:px-3 py-1 sm:py-1.5 text-xs sm:text-sm font-medium rounded-full border border-border bg-card text-foreground hover:bg-primary hover:text-primary-foreground hover:border-primary transition-colors whitespace-nowrap"
                                >
                                    {t(category as "World")}
                                </Link>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Latest News */}
                <section className="w-full px-3 sm:px-4 py-6 sm:py-8">
                    <div className="mx-auto max-w-7xl grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
                        {/* Main Content */}
                        <div className="lg:col-span-2">
                            <div className="flex items-center justify-between mb-4 sm:mb-6">
                                <h2 className="text-xl sm:text-2xl font-bold text-foreground">{t("latestNews")}</h2>
                            </div>
                            <div className="flex flex-col divide-y divide-border">
                                {latestArticles.map((article) => (
                                    <Link
                                        key={article._id}
                                        href={`/article/${article._id}`}
                                        className="flex gap-3 sm:gap-4 py-4 first:pt-0 group hover:bg-muted/40 transition-colors rounded px-2 -mx-2"
                                    >
                                        {article.imageUrl && (
                                            <div className="shrink-0 w-20 h-16 sm:w-28 sm:h-20 rounded overflow-hidden bg-muted relative">
                                                <img
                                                    src={article.imageUrl}
                                                    alt={article.title}
                                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                                />
                                            </div>
                                        )}
                                        <div className="flex flex-col justify-center min-w-0 gap-1">
                                            {article.breaking && (
                                                <span className="text-[10px] font-bold uppercase tracking-wider text-primary">
                                                    {t("breaking")}
                                                </span>
                                            )}
                                            <p className="text-sm sm:text-base font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-2 leading-snug">
                                                {article.title}
                                            </p>
                                            <p className="text-xs text-muted-foreground line-clamp-1 hidden sm:block">
                                                {article.excerpt}
                                            </p>
                                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                                <span className="px-1.5 py-0.5 bg-muted rounded text-[10px] font-medium">
                                                    {t(article.category as "World")}
                                                </span>
                                                <span>{article.author}</span>
                                            </div>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </div>

                        {/* Sidebar */}
                        <aside className="lg:col-span-1">
                            <div className="sticky top-24">
                                <div className="bg-card rounded-lg border border-border p-4 mb-4 sm:mb-6">
                                    <h3 className="text-sm sm:text-base font-bold text-foreground mb-4 pb-2 border-b border-border">
                                        {t("mostRead")}
                                    </h3>
                                    <div className="divide-y divide-border">
                                        {sidebarArticles.map((article, index) => (
                                            <Link
                                                key={article._id}
                                                href={`/article/${article._id}`}
                                                className="flex gap-2 sm:gap-3 py-2 sm:py-3 first:pt-0 last:pb-0 group"
                                            >
                                                <span className="text-lg sm:text-2xl font-bold text-muted-foreground/50 shrink-0">
                                                    {index + 1}
                                                </span>
                                                <span className="text-xs sm:text-sm font-medium text-foreground group-hover:text-primary transition-colors line-clamp-2">
                                                    {article.title}
                                                </span>
                                            </Link>
                                        ))}
                                    </div>
                                </div>

                                {/* Categories Widget */}
                                <div className="bg-card rounded-lg border border-border p-4">
                                    <h3 className="text-sm sm:text-base font-bold text-foreground mb-4 pb-2 border-b border-border">
                                        {t("categories")}
                                    </h3>
                                    <div className="flex flex-wrap gap-2">
                                        {CATEGORIES.map((category) => (
                                            <Link
                                                key={category}
                                                href={`/category/${category.toLowerCase()}`}
                                                className="px-2.5 py-1 sm:px-3 sm:py-1.5 text-xs sm:text-sm rounded border border-border hover:bg-primary hover:text-primary-foreground hover:border-primary transition-colors"
                                            >
                                                {t(category as "World")}
                                            </Link>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </aside>
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    )
}
