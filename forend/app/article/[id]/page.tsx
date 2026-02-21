import { Metadata } from "next"
import { getArticleById, getArticles, type Article } from "@/lib/api"
import { ArticleView } from "@/components/news/article-view"
import { Header } from "@/components/news/header"
import { Footer } from "@/components/news/footer"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"

interface PageProps {
  params: Promise<{ id: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params
  try {
    const article = await getArticleById(id)
    if (!article) return { title: 'Article Not Found' }

    return {
      title: `${article.title} | AAM NEWS`,
      description: article.excerpt,
      openGraph: {
        title: article.title,
        description: article.excerpt,
        type: 'article',
        publishedTime: article.publishedAt,
        authors: [article.author],
        images: [{ url: article.imageUrl || '/og-image.png' }],
      },
      twitter: {
        card: 'summary_large_image',
        title: article.title,
        description: article.excerpt,
        images: [article.imageUrl || '/og-image.png'],
      }
    }
  } catch (err) {
    return { title: 'AAM NEWS' }
  }
}

export default async function Page({ params }: PageProps) {
  const { id } = await params

  try {
    const article = await getArticleById(id)
    if (!article) {
      return (
        <div className="min-h-screen bg-background flex flex-col">
          <Header />
          <main className="flex-1 container mx-auto px-4 py-16 text-center">
            <h1 className="text-2xl font-bold text-foreground mb-4">Article Not Found</h1>
            <p className="text-muted-foreground mb-6">The article you're looking for doesn't exist.</p>
            <Button asChild>
              <a href="/">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Home
              </a>
            </Button>
          </main>
          <Footer />
        </div>
      )
    }

    const related = await getArticles({ category: article.category, limit: 6 })
    const relatedArticles = related.articles.filter((a: Article) => a._id !== id).slice(0, 3)

    return <ArticleView article={article} relatedArticles={relatedArticles} />
  } catch (err) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Header />
        <main className="flex-1 container mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">Error</h1>
          <p className="text-muted-foreground mb-6">Failed to load article. Please try again later.</p>
        </main>
        <Footer />
      </div>
    )
  }
}
