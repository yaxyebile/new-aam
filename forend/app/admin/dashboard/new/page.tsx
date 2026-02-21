"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { isAuthenticated } from "@/lib/api"
import { ArticleForm } from "@/components/admin/article-form"

export default function NewArticlePage() {
  const router = useRouter()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    if (!isAuthenticated()) {
      router.push('/admin')
    }
  }, [router])

  if (!mounted) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground">Loading...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Header */}
      <header className="bg-card border-b border-border sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 flex items-center gap-4">
          <Link href="/" className="flex items-center gap-2">
            <div className="bg-primary text-primary-foreground font-bold text-lg px-2 py-0.5 rounded">
              AAM
            </div>
            <span className="font-bold text-xl tracking-tight text-foreground">NEWS</span>
          </Link>
          <span className="text-muted-foreground">/</span>
          <span className="font-medium text-foreground">New Article</span>
        </div>
      </header>

      {/* Content */}
      <main className="container mx-auto px-4 py-6">
        <ArticleForm mode="create" />
      </main>
    </div>
  )
}
