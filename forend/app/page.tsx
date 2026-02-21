import { getArticles, getFeaturedArticles } from "@/lib/api"
import { HomeView } from "@/components/news/home-view"

export default async function Page() {
  try {
    const [featuredData, latestData] = await Promise.all([
      getFeaturedArticles(),
      getArticles({ limit: 10 })
    ])

    const featured = featuredData.slice(0, 10)
    const articles = latestData.articles

    const featuredArticles = featured.length > 0 ? featured : articles.filter(a => a.featured).slice(0, 10)

    return <HomeView featuredArticles={featuredArticles} articles={articles} />
  } catch (err) {
    console.error('Failed to load articles:', err)
    return <HomeView featuredArticles={[]} articles={[]} />
  }
}
