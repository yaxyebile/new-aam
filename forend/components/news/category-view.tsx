"use client"

import { Header } from "@/components/news/header"
import { Footer } from "@/components/news/footer"
import { NewsCard } from "@/components/news/news-card"
import { type Article, CATEGORIES } from "@/lib/api"
import Link from "next/link"

interface CategoryViewProps {
    slug: string
    categoryName: string
    articles: Article[]
}

export function CategoryView({ slug, categoryName, articles }: CategoryViewProps) {
    return (
        <div className="min-h-screen bg-background flex flex-col">
            <Header />

            <main className="flex-1">
                {/* Category Header */}
                <div className="bg-card border-b border-border">
                    <div className="mx-auto max-w-7xl px-3 sm:px-4 py-6 sm:py-8">
                        <nav className="text-xs sm:text-sm text-muted-foreground mb-3 sm:mb-4">
                            <Link href="/" className="hover:text-primary">Home</Link>
                            <span className="mx-1.5 sm:mx-2">/</span>
                            <span className="text-foreground">{categoryName}</span>
                        </nav>
                        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground">
                            {categoryName}
                        </h1>
                        <p className="text-xs sm:text-sm text-muted-foreground mt-1.5 sm:mt-2">
                            Latest {categoryName.toLowerCase()} news and updates
                        </p>
                    </div>
                </div>

                {/* Category Quick Links */}
                <section className="border-b border-border bg-muted/30">
                    <div className="mx-auto max-w-7xl px-3 sm:px-4">
                        <div className="flex items-center gap-2 py-2.5 sm:py-3 overflow-x-auto scrollbar-hide">
                            <span className="text-xs sm:text-sm font-medium text-muted-foreground shrink-0">Categories:</span>
                            {CATEGORIES.map((category) => (
                                <Link
                                    key={category}
                                    href={`/category/${category.toLowerCase()}`}
                                    className={`shrink-0 px-2.5 sm:px-3 py-1 sm:py-1.5 text-xs sm:text-sm font-medium rounded-full border transition-colors whitespace-nowrap ${category.toLowerCase() === slug.toLowerCase()
                                        ? 'bg-primary text-primary-foreground border-primary'
                                        : 'border-border bg-card text-foreground hover:bg-primary hover:text-primary-foreground hover:border-primary'
                                        }`}
                                >
                                    {category}
                                </Link>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Articles List */}
                <section className="mx-auto max-w-7xl px-3 sm:px-4 py-6 sm:py-8">
                    {articles.length > 0 ? (
                        <div className="flex flex-col">
                            {articles.map((article) => (
                                <NewsCard key={article._id} article={article} variant="horizontal" />
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-12 sm:py-16">
                            <h2 className="text-lg sm:text-xl font-semibold text-foreground mb-1 sm:mb-2">No articles found</h2>
                            <p className="text-xs sm:text-sm text-muted-foreground mb-4 sm:mb-6">
                                There are no articles in this category yet.
                            </p>
                            <Link
                                href="/"
                                className="inline-flex items-center justify-center px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm rounded bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
                            >
                                Back to Home
                            </Link>
                        </div>
                    )}
                </section>
            </main>

            <Footer />
        </div>
    )
}
