"use client"

import React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, Save, Eye, FileText, Columns2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { createArticle, updateArticle, type Article, type ContentBlock, CATEGORIES } from "@/lib/api"
import { sendBreakingNewsNotification } from "@/lib/notifications"
import { BlockEditor } from "@/components/admin/block-editor"
import { InlineEditor } from "@/components/admin/inline-editor"

interface ArticleFormProps {
  article?: Article
  mode: "create" | "edit"
}

export function ArticleForm({ article, mode }: ArticleFormProps) {
  const router = useRouter()
  const [saving, setSaving] = useState(false)
  const [contentTab, setContentTab] = useState<"write" | "blocks" | "preview">("write")
  const [blocks, setBlocks] = useState<ContentBlock[]>(article?.blocks || [])

  const [formData, setFormData] = useState({
    title: article?.title || "",
    content: article?.content || "",
    category: article?.category || CATEGORIES[1], // Default to 'World' instead of 'All'
    imageUrl: article?.imageUrl || "",
    author: article?.author || "",
    featured: article?.featured || false,
    breaking: article?.breaking || false,
    mediaType: (article?.mediaType || 'image') as 'image' | 'video' | 'youtube' | 'audio',
    mediaUrl: article?.mediaUrl || "",
    tags: article?.tags?.join(', ') || "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)

    try {
      const articleData: Partial<Article> = {
        title: formData.title,
        excerpt: "",
        content: formData.content,
        category: formData.category,
        imageUrl: formData.imageUrl,
        author: formData.author,
        featured: formData.featured,
        breaking: formData.breaking,
        mediaType: formData.mediaType === 'image' ? undefined : formData.mediaType,
        mediaUrl: formData.mediaType === 'image' ? undefined : formData.mediaUrl || undefined,
        blocks: blocks.length > 0 ? blocks : undefined,
        tags: formData.tags.split(',').map(tag => tag.trim()).filter(Boolean),
      }

      if (mode === "edit" && article?._id) {
        await updateArticle(article._id, articleData)
      } else {
        await createArticle(articleData)
        // Trigger push notification only for new articles
        sendBreakingNewsNotification(
          formData.breaking ? "🔴 " + formData.title : formData.title,
          "New article published on AAM NEWS"
        )
      }

      router.push('/admin/dashboard')
    } catch (err: any) {
      console.error('Failed to save article:', err)
      alert(`Ma suurtagalin in la keydiyo: ${err.message || 'Cilad aan la garanayn'}`)
    } finally {
      setSaving(false)
    }
  }

  const handleChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const renderPreview = (text: string) => {
    return text.split('\n\n').filter(Boolean).map((para, i) => (
      <p key={i} className="mb-4 text-sm leading-relaxed text-foreground">{para.trim()}</p>
    ))
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Button type="button" variant="ghost" onClick={() => router.push('/admin/dashboard')}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
        <div className="flex items-center gap-2">
          {article && (
            <Button type="button" variant="outline" onClick={() => window.open(`/article/${article.id}`, '_blank')}>
              <Eye className="w-4 h-4 mr-2" />
              Preview
            </Button>
          )}
          <Button type="submit" disabled={saving}>
            {saving ? (
              <span className="flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                Saving...
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <Save className="w-4 h-4" />
                {mode === "create" ? "Publish Article" : "Save Changes"}
              </span>
            )}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-card rounded-lg border border-border p-6 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                placeholder="Enter article title"
                value={formData.title}
                onChange={(e) => handleChange("title", e.target.value)}
                required
                className="text-lg"
              />
            </div>



            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label>Content</Label>
                <div className="flex items-center gap-1 border border-border rounded p-0.5">
                  <button type="button" onClick={() => setContentTab("write")}
                    className={`flex items-center gap-1 px-2 py-1 text-xs rounded transition-colors ${contentTab === "write" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"}`}>
                    <FileText className="w-3 h-3" /> Qoraal
                  </button>
                  <button type="button" onClick={() => setContentTab("blocks")}
                    className={`flex items-center gap-1 px-2 py-1 text-xs rounded transition-colors ${contentTab === "blocks" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"}`}>
                    <Columns2 className="w-3 h-3" /> Blocks
                  </button>
                  <button type="button" onClick={() => setContentTab("preview")}
                    className={`flex items-center gap-1 px-2 py-1 text-xs rounded transition-colors ${contentTab === "preview" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"}`}>
                    <Eye className="w-3 h-3" /> Preview
                  </button>
                </div>
              </div>

              {contentTab === "write" && (
                <InlineEditor
                  value={formData.content}
                  onChange={(v) => handleChange("content", v)}
                  rows={14}
                />
              )}

              {contentTab === "blocks" && (
                <div>
                  <p className="text-xs text-muted-foreground mb-3">
                    📦 Block mode: Ku dar qoraal, sawir, video, ama YouTube sidii aad rabto
                  </p>
                  <BlockEditor blocks={blocks} onChange={setBlocks} />
                </div>
              )}

              {contentTab === "preview" && (
                <div className="min-h-[240px] border border-border rounded-md p-3 bg-muted/30 overflow-auto">
                  {formData.content ? (
                    renderPreview(formData.content)
                  ) : (
                    <p className="text-muted-foreground text-sm italic">Nothing to preview yet...</p>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <div className="bg-card rounded-lg border border-border p-6 space-y-4">
            <h3 className="font-semibold text-foreground">Publishing Options</h3>

            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select value={formData.category} onValueChange={(value) => handleChange("category", value)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {CATEGORIES.filter(c => c !== 'All').map((category) => (
                    <SelectItem key={category} value={category}>{category}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="author">Author</Label>
              <Input
                id="author"
                placeholder="Author name"
                value={formData.author}
                onChange={(e) => handleChange("author", e.target.value)}
                required
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="featured">Featured Article</Label>
                <p className="text-xs text-muted-foreground">Display on homepage hero</p>
              </div>
              <Switch id="featured" checked={formData.featured} onCheckedChange={(checked) => handleChange("featured", checked)} />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="breaking">Breaking News</Label>
                <p className="text-xs text-muted-foreground">Mark as breaking + notify users</p>
              </div>
              <Switch id="breaking" checked={formData.breaking} onCheckedChange={(checked) => handleChange("breaking", checked)} />
            </div>

            <div className="space-y-2 pt-2 border-t border-border">
              <Label htmlFor="tags">Tags (Keywords)</Label>
              <Input
                id="tags"
                placeholder="Tusaale: Somalia, Doorasho, Sports"
                value={formData.tags}
                onChange={(e) => handleChange("tags", e.target.value)}
              />
              <p className="text-[10px] text-muted-foreground">Kala xiriiri comma ( , )</p>
            </div>
          </div>

          <div className="bg-card rounded-lg border border-border p-6 space-y-4">
            <h3 className="font-semibold text-foreground">Media</h3>

            {/* Media type selector */}
            <div className="space-y-2">
              <Label>Media Type</Label>
              <div className="grid grid-cols-2 gap-2">
                {(['image', 'youtube', 'video', 'audio'] as const).map((type) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => handleChange('mediaType', type)}
                    className={`px-3 py-2 text-sm rounded border transition-colors capitalize ${formData.mediaType === type
                      ? 'bg-primary text-primary-foreground border-primary'
                      : 'border-border text-muted-foreground hover:border-primary hover:text-foreground'
                      }`}
                  >
                    {type === 'youtube' ? '▶ YouTube' : type === 'video' ? '🎬 Video' : type === 'audio' ? '🎵 Audio' : '🖼 Image'}
                  </button>
                ))}
              </div>
            </div>

            {/* Cover image URL (always needed for thumbnails) */}
            <div className="space-y-2">
              <Label htmlFor="imageUrl">Cover Image URL</Label>
              <Input
                id="imageUrl"
                placeholder="https://example.com/image.jpg"
                value={formData.imageUrl}
                onChange={(e) => handleChange('imageUrl', e.target.value)}
                required
              />
              <p className="text-xs text-muted-foreground">Used as article thumbnail (Unsplash recommended)</p>
            </div>

            {/* Media URL (only when not image-only) */}
            {formData.mediaType !== 'image' && (
              <div className="space-y-2">
                <Label htmlFor="mediaUrl">
                  {formData.mediaType === 'youtube' && 'YouTube Video URL or ID'}
                  {formData.mediaType === 'video' && 'Video File URL (.mp4)'}
                  {formData.mediaType === 'audio' && 'Audio File URL (.mp3)'}
                </Label>
                <Input
                  id="mediaUrl"
                  placeholder={
                    formData.mediaType === 'youtube' ? 'https://youtube.com/watch?v=... or video ID' :
                      formData.mediaType === 'video' ? 'https://example.com/video.mp4' :
                        'https://example.com/audio.mp3'
                  }
                  value={formData.mediaUrl}
                  onChange={(e) => handleChange('mediaUrl', e.target.value)}
                />
              </div>
            )}

            {/* Live preview */}
            {formData.mediaType === 'image' && formData.imageUrl && (
              <div className="aspect-video relative rounded overflow-hidden bg-muted">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={formData.imageUrl} alt="Preview" className="w-full h-full object-cover"
                  onError={(e) => { (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=800&h=500&fit=crop' }} />
              </div>
            )}

            {formData.mediaType === 'youtube' && formData.mediaUrl && (() => {
              const ytId = formData.mediaUrl.includes('v=')
                ? formData.mediaUrl.split('v=')[1]?.split('&')[0]
                : formData.mediaUrl.trim()
              return (
                <div className="aspect-video rounded overflow-hidden bg-muted">
                  <iframe
                    src={`https://www.youtube.com/embed/${ytId}`}
                    className="w-full h-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
              )
            })()}

            {formData.mediaType === 'video' && formData.mediaUrl && (
              <video controls className="w-full rounded bg-muted" src={formData.mediaUrl}>
                Your browser does not support video.
              </video>
            )}

            {formData.mediaType === 'audio' && formData.mediaUrl && (
              <audio controls className="w-full" src={formData.mediaUrl}>
                Your browser does not support audio.
              </audio>
            )}
          </div>
        </div>
      </div>
    </form>
  )
}
