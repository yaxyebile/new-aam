"use client"

import { Button } from "@/components/ui/button"
import { Facebook, Twitter, Link2, MessageCircle } from "lucide-react"
import { useState } from "react"

interface SocialShareProps {
    title: string
    url?: string
}

export function SocialShare({ title, url }: SocialShareProps) {
    const [copied, setCopied] = useState(false)
    const shareUrl = url || (typeof window !== 'undefined' ? window.location.href : '')

    const handleCopy = () => {
        navigator.clipboard.writeText(shareUrl)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
    }

    const shareLinks = {
        facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`,
        twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(shareUrl)}`,
        whatsapp: `https://wa.me/?text=${encodeURIComponent(title + ' ' + shareUrl)}`,
    }

    return (
        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mr-2">Share:</span>

            <Button
                variant="outline"
                size="sm"
                className="h-8 w-8 sm:h-9 sm:w-auto px-0 sm:px-3 text-xs border-[#25D366] text-[#25D366] hover:bg-[#25D366] hover:text-white transition-colors"
                onClick={() => window.open(shareLinks.whatsapp, '_blank')}
                title="Share on WhatsApp"
            >
                <MessageCircle className="w-4 h-4 sm:mr-2" />
                <span className="hidden sm:inline">WhatsApp</span>
            </Button>

            <Button
                variant="outline"
                size="sm"
                className="h-8 w-8 sm:h-9 sm:w-auto px-0 sm:px-3 text-xs border-[#1877F2] text-[#1877F2] hover:bg-[#1877F2] hover:text-white transition-colors"
                onClick={() => window.open(shareLinks.facebook, '_blank')}
                title="Share on Facebook"
            >
                <Facebook className="w-4 h-4 sm:mr-2" />
                <span className="hidden sm:inline">Facebook</span>
            </Button>

            <Button
                variant="outline"
                size="sm"
                className="h-8 w-8 sm:h-9 sm:w-auto px-0 sm:px-3 text-xs border-[#1DA1F2] text-[#1DA1F2] hover:bg-[#1DA1F2] hover:text-white transition-colors"
                onClick={() => window.open(shareLinks.twitter, '_blank')}
                title="Share on Twitter"
            >
                <Twitter className="w-4 h-4 sm:mr-2" />
                <span className="hidden sm:inline">Twitter</span>
            </Button>

            <Button
                variant="outline"
                size="sm"
                className="h-8 w-8 sm:h-9 sm:w-auto px-0 sm:px-3 text-xs"
                onClick={handleCopy}
                title="Copy Link"
            >
                <Link2 className="w-4 h-4 sm:mr-2" />
                <span className="hidden sm:inline">{copied ? 'Copied!' : 'Copy Link'}</span>
                <span className="sm:hidden">{copied ? '✓' : 'Link'}</span>
            </Button>
        </div>
    )
}
