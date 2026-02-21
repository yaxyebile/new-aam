"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { getComments, addComment, type Comment } from "@/lib/api"
import { useLanguage } from "@/lib/language-context"
import { MessageSquare, Send, User } from "lucide-react"

interface CommentSectionProps {
    articleId: string
}

export function CommentSection({ articleId }: CommentSectionProps) {
    const { t } = useLanguage()
    const [comments, setComments] = useState<Comment[]>([])
    const [loading, setLoading] = useState(true)
    const [submitting, setSubmitting] = useState(false)
    const [success, setSuccess] = useState(false)
    const [formData, setFormData] = useState({
        author: "",
        email: "",
        content: ""
    })

    const loadComments = async () => {
        try {
            const data = await getComments(articleId)
            setComments(data.filter(c => c.approved))
        } catch (err) {
            console.error("Failed to load comments:", err)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        loadComments()
    }, [articleId])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!formData.author || !formData.content) return

        setSubmitting(true)
        try {
            await addComment(articleId, formData)
            setSuccess(true)
            setFormData({ author: "", email: "", content: "" })

            // Reload comments to show the new one immediately
            await loadComments()

            // Auto hide success message
            setTimeout(() => setSuccess(false), 5000)
        } catch (err) {
            console.error("Failed to post comment:", err)
            alert("Maayada! Cilad ayaa dhacday markii la dirayey faallada.")
        } finally {
            setSubmitting(false)
        }
    }

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        })
    }

    return (
        <div className="mt-12 pt-8 border-t border-border">
            <div className="flex items-center gap-2 mb-6">
                <MessageSquare className="w-5 h-5 text-primary" />
                <h2 className="text-xl font-bold text-foreground">
                    Faallooyinka ({comments.length})
                </h2>
            </div>

            {/* Comment Form */}
            <div className="bg-muted/30 rounded-lg p-4 sm:p-6 mb-8">
                <h3 className="font-semibold text-foreground mb-4">Dhiibo ra'yigaaga</h3>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="author">Magacaaga *</Label>
                            <Input
                                id="author"
                                placeholder="Tusaale: Ahmed Hassan"
                                value={formData.author}
                                onChange={e => setFormData(p => ({ ...p, author: e.target.value }))}
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="email">Email-kaaga (Lama muujinayo)</Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="ahmed@example.com"
                                value={formData.email}
                                onChange={e => setFormData(p => ({ ...p, email: e.target.value }))}
                            />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="content">Faalladaada *</Label>
                        <Textarea
                            id="content"
                            placeholder="Maxaad ka qabtaa warkan?"
                            value={formData.content}
                            onChange={e => setFormData(p => ({ ...p, content: e.target.value }))}
                            required
                            rows={4}
                        />
                    </div>
                    <Button type="submit" disabled={submitting} className="w-full sm:w-auto">
                        {submitting ? "Loo dirayo..." : (
                            <>
                                <Send className="w-4 h-4 mr-2" />
                                Dir Faallada
                            </>
                        )}
                    </Button>
                    {success && (
                        <p className="text-sm text-green-600 bg-green-50 p-2 rounded border border-green-100 mt-2">
                            Mahadsanid! Faalladaada si guul leh ayaa loo daray.
                        </p>
                    )}
                </form>
            </div>

            {/* Comments List */}
            <div className="space-y-6">
                {loading ? (
                    <div className="animate-pulse text-muted-foreground text-sm">Soo raraya faallooyinka...</div>
                ) : comments.length > 0 ? (
                    comments.map((comment) => (
                        <div key={comment._id} className="flex gap-3 sm:gap-4 group">
                            <div className="shrink-0 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                                {comment.author.charAt(0).toUpperCase()}
                            </div>
                            <div className="flex-1 space-y-1">
                                <div className="flex items-center gap-2">
                                    <span className="font-semibold text-sm sm:text-base text-foreground">{comment.author}</span>
                                    <span className="text-[10px] sm:text-xs text-muted-foreground">
                                        • {formatDate(comment.createdAt)}
                                    </span>
                                </div>
                                <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                                    {comment.content}
                                </p>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="text-center py-8 text-muted-foreground border border-dashed rounded-lg">
                        <User className="w-8 h-8 mx-auto mb-2 opacity-20" />
                        <p className="text-sm italic">Weli wax faallo ah looma soo dirin maqaalkan. Noqo qofka ugu horreeya!</p>
                    </div>
                )}
            </div>
        </div>
    )
}
