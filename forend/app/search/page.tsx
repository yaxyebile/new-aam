"use client"

import { Suspense, useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Search } from "lucide-react"
import { Header } from "@/components/news/header"
import { Footer } from "@/components/news/footer"
import { NewsCard } from "@/components/news/news-card"
import { getArticles, type Article } from "@/lib/api"
import { useLanguage } from "@/lib/language-context"

function SearchResults() {
    const searchParams = useSearchParams()
    const query = searchParams.get("q") || ""
    const { t } = useLanguage()
    const [results, setResults] = useState<Article[]>([])
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        if (!query.trim()) return
        setLoading(true)
        getArticles({ search: query, limit: 30 })
            .then(data => setResults(data.articles))
            .catch(() => setResults([]))
            .finally(() => setLoading(false))
    }, [query])

    return (
        <main className="flex-1">
            <section className="w-full px-3 sm:px-4 py-8">
                <div className="mx-auto max-w-7xl">
                    {/* Search Header */}
                    <div className="mb-8">
                        <Link
                            href="/"
                            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-4"
                        >
                            <ArrowLeft className="w-4 h-4" />
                            {t("backHome")}
                        </Link>
                        <div className="flex items-center gap-3 mb-2">
                            <Search className="w-6 h-6 text-primary" />
                            <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
                                {t("searchResults")}
                            </h1>
                        </div>
                        {query && (
                            <p className="text-muted-foreground">
                                {t("searchFor")}: <span className="text-foreground font-semibold">&ldquo;{query}&rdquo;</span>
                                {" "}— {results.length} {results.length === 1 ? "article" : "articles"}
                            </p>
                        )}
                    </div>

                    {/* Results */}
                    {loading ? (
                        <div className="text-center py-20">
                            <div className="animate-pulse text-muted-foreground">Searching...</div>
                        </div>
                    ) : results.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                            {results.map((article) => (
                                <NewsCard key={article._id} article={article} />
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-20">
                            <Search className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
                            <p className="text-xl font-semibold text-foreground mb-2">
                                {t("noResults")} &ldquo;{query}&rdquo;
                            </p>
                            <p className="text-muted-foreground">{t("tryDifferent")}</p>
                        </div>
                    )}
                </div>
            </section>
        </main>
    )
}

export default function SearchPage() {
    return (
        <div className="min-h-screen bg-background flex flex-col">
            <Header />
            <Suspense fallback={
                <div className="flex-1 flex items-center justify-center">
                    <div className="animate-pulse text-muted-foreground">Loading...</div>
                </div>
            }>
                <SearchResults />
            </Suspense>
            <Footer />
        </div>
    )
}
