"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import {
  LogOut,
  Plus,
  Pencil,
  Trash2,
  Newspaper,
  LayoutDashboard,
  Eye,
  Star,
  AlertCircle,
  MessageSquare,
  CheckCircle2
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import {
  isAuthenticated,
  logout,
  getArticles,
  getStats,
  deleteArticle,
  getAllComments,
  approveComment,
  deleteComment,
  type Article,
  type Comment,
  CATEGORIES
} from "@/lib/api"

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

export default function AdminDashboard() {
  const router = useRouter()
  const [articles, setArticles] = useState<Article[]>([])
  const [comments, setComments] = useState<Comment[]>([])
  const [view, setView] = useState<"articles" | "comments">("articles")
  const [mounted, setMounted] = useState(false)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [deleteCommentId, setDeleteCommentId] = useState<string | null>(null)

  const [stats, setStats] = useState({ total: 0, featured: 0, breaking: 0, categories: 0, totalViews: 0 })

  const loadData = async () => {
    try {
      // Fetch articles
      try {
        const data = await getArticles({ limit: 100 })
        setArticles(data.articles)
      } catch (err) {
        console.error("Failed to load articles:", err)
      }

      // Fetch stats
      try {
        const statsData = await getStats()
        setStats({
          total: statsData.total,
          featured: statsData.featured,
          breaking: statsData.breaking,
          categories: statsData.byCategory.length,
          totalViews: statsData.totalViews
        })
      } catch (err) {
        console.error("Failed to load stats:", err)
      }

      // Fetch comments
      try {
        const commentsData = await getAllComments()
        setComments(commentsData)
      } catch (err) {
        console.error("Failed to load comments:", err)
      }
    } catch (err) {
      console.error("General data load error:", err)
    }
  }

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push('/admin')
      return
    }
    loadData().then(() => setMounted(true))
  }, [router])

  const handleLogout = () => {
    logout()
    router.push('/admin')
  }

  const handleDelete = async (id: string) => {
    await deleteArticle(id)
    loadData()
    setDeleteId(null)
  }

  const handleDeleteComment = async (id: string) => {
    await deleteComment(id)
    loadData()
    setDeleteCommentId(null)
  }

  const handleApproveComment = async (id: string) => {
    await approveComment(id)
    loadData()
  }

  if (!mounted) return null

  return (
    <div className="min-h-screen bg-muted/30 flex flex-col lg:flex-row">
      {/* Sidebar */}
      <aside className="w-full lg:w-64 bg-sidebar text-sidebar-foreground border-r border-sidebar-border shrink-0 lg:sticky lg:top-0 lg:h-screen">
        <div className="p-4 border-b border-sidebar-border">
          <Link href="/" className="flex items-center">
            <img src="/logo.png" alt="AAM NEWS Logo" className="h-8 w-auto object-contain" />
          </Link>
        </div>

        <nav className="p-4 space-y-1">
          <button
            onClick={() => setView("articles")}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded transition-colors ${view === "articles" ? "bg-sidebar-accent text-sidebar-accent-foreground" : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"}`}
          >
            <LayoutDashboard className="w-5 h-5" />
            Articles
          </button>
          <button
            onClick={() => setView("comments")}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded transition-colors ${view === "comments" ? "bg-sidebar-accent text-sidebar-accent-foreground" : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"}`}
          >
            <MessageSquare className="w-5 h-5" />
            Comments
            {comments.filter(c => !c.approved).length > 0 && (
              <span className="ml-auto bg-primary text-primary-foreground text-[10px] px-1.5 py-0.5 rounded-full">
                {comments.filter(c => !c.approved).length}
              </span>
            )}
          </button>
          <div className="pt-4 mt-4 border-t border-sidebar-border">
            <Link
              href="/admin/dashboard/new"
              className="flex items-center gap-3 px-3 py-2 rounded text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-colors"
            >
              <Plus className="w-5 h-5" />
              New Article
            </Link>
            <Link
              href="/"
              target="_blank"
              className="flex items-center gap-3 px-3 py-2 rounded text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-colors"
            >
              <Eye className="w-5 h-5" />
              View Site
            </Link>
          </div>
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-sidebar-border">
          <Button
            variant="ghost"
            className="w-full justify-start text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent"
            onClick={handleLogout}
          >
            <LogOut className="w-5 h-5 mr-3" />
            Logout
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header */}
        <header className="bg-card border-b border-border sticky top-0 z-10">
          <div className="px-3 sm:px-4 md:px-6 py-3 sm:py-4 flex items-center justify-between">
            <h1 className="text-base sm:text-lg md:text-xl font-bold text-foreground">
              {view === "articles" ? "Article Management" : "Comment Moderation"}
            </h1>
            <div className="flex items-center gap-2">
              {view === "articles" && (
                <Link href="/admin/dashboard/new">
                  <Button size="sm" className="text-xs sm:text-sm">
                    <Plus className="w-3 sm:w-4 h-3 sm:h-4 mr-1 sm:mr-2" />
                    New Article
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <main className="flex-1 p-3 sm:p-4 md:p-6">
          {view === "articles" ? (
            <>
              {/* Stats */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-8">
                <div className="bg-card rounded-lg border border-border p-4">
                  <p className="text-2xl font-bold text-foreground">{stats.total}</p>
                  <p className="text-xs text-muted-foreground">Total Articles</p>
                </div>
                <div className="bg-card rounded-lg border border-border p-4">
                  <p className="text-2xl font-bold text-foreground">{stats.featured}</p>
                  <p className="text-xs text-muted-foreground">Featured</p>
                </div>
                <div className="bg-card rounded-lg border border-border p-4">
                  <p className="text-2xl font-bold text-foreground">{stats.breaking}</p>
                  <p className="text-xs text-muted-foreground">Breaking News</p>
                </div>
                <div className="bg-card rounded-lg border border-border p-4">
                  <p className="text-2xl font-bold text-foreground">{stats.totalViews.toLocaleString()}</p>
                  <p className="text-xs text-muted-foreground">Total Views</p>
                </div>
              </div>

              {/* Articles Table */}
              <div className="bg-card rounded-lg border border-border overflow-hidden">
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-12"></TableHead>
                        <TableHead>Title</TableHead>
                        <TableHead className="hidden md:table-cell">Category</TableHead>
                        <TableHead className="hidden md:table-cell">Status</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {articles.map((article) => (
                        <TableRow key={article._id}>
                          <TableCell>
                            <div className="w-10 h-10 relative rounded overflow-hidden bg-muted">
                              <Image src={article.imageUrl || "/placeholder.svg"} alt="" fill className="object-cover" />
                            </div>
                          </TableCell>
                          <TableCell className="font-medium max-w-xs sm:max-w-md">
                            <p className="truncate">{article.title}</p>
                            <p className="text-xs text-muted-foreground md:hidden">{article.category}</p>
                          </TableCell>
                          <TableCell className="hidden md:table-cell">
                            <Badge variant="outline">{article.category}</Badge>
                          </TableCell>
                          <TableCell className="hidden md:table-cell">
                            <div className="flex gap-1">
                              {article.breaking && <Badge className="bg-primary text-primary-foreground text-[10px]">Breaking</Badge>}
                              {article.featured && <Badge variant="secondary" className="text-[10px]">Featured</Badge>}
                            </div>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex items-center justify-end gap-1">
                              <Link href={`/article/${article._id}`} target="_blank">
                                <Button variant="ghost" size="icon" className="h-8 w-8"><Eye className="w-4 h-4" /></Button>
                              </Link>
                              <Link href={`/admin/dashboard/edit/${article._id}`}>
                                <Button variant="ghost" size="icon" className="h-8 w-8"><Pencil className="w-4 h-4" /></Button>
                              </Link>
                              <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => setDeleteId(article._id)}><Trash2 className="w-4 h-4" /></Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
            </>
          ) : (
            /* Comments Table */
            <div className="bg-card rounded-lg border border-border overflow-hidden">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Author</TableHead>
                      <TableHead className="hidden lg:table-cell">Article</TableHead>
                      <TableHead>Comment</TableHead>
                      <TableHead className="hidden md:table-cell">Date</TableHead>
                      <TableHead className="hidden md:table-cell">Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {comments.map((comment) => (
                      <TableRow key={comment._id} className={!comment.approved ? "bg-primary/5" : ""}>
                        <TableCell className="font-medium">
                          <p>{comment.author}</p>
                          <p className="text-xs text-muted-foreground">{comment.email}</p>
                        </TableCell>
                        <TableCell className="hidden lg:table-cell max-w-[150px]">
                          <p className="text-xs truncate" title={comment.article && typeof comment.article === 'object' ? (comment.article as any).title : ''}>
                            {comment.article && typeof comment.article === 'object' ? (comment.article as any).title : '---'}
                          </p>
                        </TableCell>
                        <TableCell className="max-w-xs sm:max-w-md">
                          <p className="text-sm line-clamp-2">{comment.content}</p>
                          <p className="text-[10px] text-muted-foreground lg:hidden mt-1 truncate">
                            Warka: {comment.article && typeof comment.article === 'object' ? (comment.article as any).title : '---'}
                          </p>
                        </TableCell>
                        <TableCell className="hidden md:table-cell text-xs text-muted-foreground">
                          {formatDate(comment.createdAt)}
                        </TableCell>
                        <TableCell className="hidden md:table-cell">
                          {comment.approved ? (
                            <Badge variant="outline" className="text-green-600 border-green-200 bg-green-50">Approved</Badge>
                          ) : (
                            <Badge variant="outline" className="text-amber-600 border-amber-200 bg-amber-50">Pending</Badge>
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-1">
                            <Button
                              variant="ghost"
                              size="icon"
                              className={`h-8 w-8 ${comment.approved ? "text-muted-foreground" : "text-green-600"}`}
                              onClick={() => handleApproveComment(comment._id)}
                              title={comment.approved ? "Unapprove" : "Approve"}
                            >
                              <CheckCircle2 className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-destructive"
                              onClick={() => setDeleteCommentId(comment._id)}
                              title="Delete"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                    {comments.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center py-12 text-muted-foreground italic">
                          No comments found.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Delete Article Dialog */}
      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader><AlertDialogTitle>Delete Article?</AlertDialogTitle></AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction className="bg-destructive" onClick={() => deleteId && handleDelete(deleteId)}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Delete Comment Dialog */}
      <AlertDialog open={!!deleteCommentId} onOpenChange={() => setDeleteCommentId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader><AlertDialogTitle>Delete Comment?</AlertDialogTitle></AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction className="bg-destructive" onClick={() => deleteCommentId && handleDeleteComment(deleteCommentId)}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
