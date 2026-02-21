import { Metadata } from "next"
import { getArticles, CATEGORIES } from "@/lib/api"
import { CategoryView } from "@/components/news/category-view"

interface PageProps {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const categoryName = CATEGORIES.find(c => c.toLowerCase() === slug.toLowerCase()) || slug

  return {
    title: `${categoryName} News | AAM NEWS`,
    description: `Latest ${categoryName.toLowerCase()} news, breaking updates, and in-depth articles from AAM NEWS.`,
    openGraph: {
      title: `${categoryName} News - Latest Updates`,
      description: `Stay informed with the latest ${categoryName.toLowerCase()} news from AAM NEWS.`,
      type: 'website',
    }
  }
}

export default async function Page({ params }: PageProps) {
  const { slug } = await params
  const categoryName = CATEGORIES.find(c => c.toLowerCase() === slug.toLowerCase()) || slug

  try {
    const data = await getArticles({ category: categoryName, limit: 50 })
    return <CategoryView slug={slug} categoryName={categoryName} articles={data.articles} />
  } catch (err) {
    return <CategoryView slug={slug} categoryName={categoryName} articles={[]} />
  }
}
