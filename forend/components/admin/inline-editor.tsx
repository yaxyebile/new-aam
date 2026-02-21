"use client"

import { useRef, useState } from "react"
import { Image as ImageIcon, Video, Youtube, X, Check } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

interface InlineEditorProps {
    value: string
    onChange: (value: string) => void
    rows?: number
    placeholder?: string
}

type InsertType = 'image' | 'video' | 'youtube' | null

const BUTTONS = [
    { type: 'image' as InsertType, icon: <ImageIcon className="w-4 h-4" />, label: '🖼 Sawir', placeholder: 'https://example.com/photo.jpg', colored: 'hover:bg-green-50 hover:text-green-700 hover:border-green-400 dark:hover:bg-green-950' },
    { type: 'video' as InsertType, icon: <Video className="w-4 h-4" />, label: '🎬 Video', placeholder: 'https://example.com/clip.mp4', colored: 'hover:bg-purple-50 hover:text-purple-700 hover:border-purple-400 dark:hover:bg-purple-950' },
    { type: 'youtube' as InsertType, icon: <Youtube className="w-4 h-4" />, label: '▶ YouTube', placeholder: 'https://youtube.com/watch?v=xxx  ama ID', colored: 'hover:bg-red-50 hover:text-red-700 hover:border-red-400 dark:hover:bg-red-950' },
]

export function InlineEditor({ value, onChange, rows = 14, placeholder }: InlineEditorProps) {
    const textareaRef = useRef<HTMLTextAreaElement>(null)
    const cursorRef = useRef<number>(0)            // saved cursor position
    const [inserting, setInserting] = useState<InsertType>(null)
    const [mediaUrl, setMediaUrl] = useState('')

    /** Save cursor before we lose focus to the URL input */
    const saveCursor = () => {
        cursorRef.current = textareaRef.current?.selectionStart ?? value.length
    }

    /** Build the tag string and splice it into `value` at saved cursor */
    const doInsert = () => {
        const url = mediaUrl.trim()
        if (!url || !inserting) return

        let tag = ''
        if (inserting === 'image') tag = `\n[IMAGE: ${url}]\n`
        if (inserting === 'video') tag = `\n[VIDEO: ${url}]\n`
        if (inserting === 'youtube') {
            // normalise to bare ID if full URL given
            let id = url
            if (url.includes('v=')) id = url.split('v=')[1]?.split('&')[0] || url
            if (url.includes('youtu.be/')) id = url.split('youtu.be/')[1]?.split('?')[0] || url
            tag = `\n[YOUTUBE: ${id.trim()}]\n`
        }

        const pos = cursorRef.current
        const newVal = value.slice(0, pos) + tag + value.slice(pos)
        onChange(newVal)

        // move cursor after inserted tag
        setTimeout(() => {
            const next = pos + tag.length
            textareaRef.current?.focus()
            textareaRef.current?.setSelectionRange(next, next)
        }, 30)

        setInserting(null)
        setMediaUrl('')
    }

    const cancel = () => { setInserting(null); setMediaUrl('') }

    return (
        <div className="space-y-2">
            {/* ── Toolbar ─────────────────────────────────────────── */}
            <div className="flex items-center gap-2 px-2 py-1.5 bg-muted/50 rounded-t-md border border-b-0 border-border flex-wrap">
                <span className="text-[11px] text-muted-foreground font-medium">Dhex geli:</span>
                {BUTTONS.map(btn => (
                    <button
                        key={btn.type as string}
                        type="button"
                        onClick={() => { saveCursor(); setInserting(inserting === btn.type ? null : btn.type); setMediaUrl('') }}
                        className={`flex items-center gap-1.5 px-2.5 py-1 text-xs rounded border border-border bg-background transition-all ${btn.colored} ${inserting === btn.type ? 'ring-1 ring-primary' : ''}`}
                    >
                        {btn.icon} {btn.label}
                    </button>
                ))}
                {inserting && (
                    <button type="button" onClick={cancel}
                        className="ml-auto p-1 rounded hover:bg-muted text-muted-foreground">
                        <X className="w-3.5 h-3.5" />
                    </button>
                )}
            </div>

            {/* ── URL input (shown when a button is active) ───────── */}
            {inserting && (
                <div className="flex gap-2 items-center px-2 py-2 bg-muted/30 border border-border border-t-0 border-b-0">
                    <span className="text-xs text-muted-foreground shrink-0 w-24">
                        {inserting === 'image' && '🖼 URL sawirka:'}
                        {inserting === 'video' && '🎬 URL video-ga:'}
                        {inserting === 'youtube' && '▶ YouTube ID:'}
                    </span>
                    <Input
                        autoFocus
                        value={mediaUrl}
                        onChange={e => setMediaUrl(e.target.value)}
                        placeholder={BUTTONS.find(b => b.type === inserting)?.placeholder}
                        className="h-8 text-sm"
                        onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); doInsert() } if (e.key === 'Escape') cancel() }}
                    />
                    <button type="button" onClick={doInsert} disabled={!mediaUrl.trim()}
                        className="flex items-center gap-1 px-3 py-1.5 text-xs rounded bg-primary text-primary-foreground disabled:opacity-40 hover:bg-primary/90 transition-colors shrink-0">
                        <Check className="w-3.5 h-3.5" /> Geli
                    </button>
                </div>
            )}

            {/* ── Main textarea ────────────────────────────────────── */}
            <Textarea
                ref={textareaRef}
                value={value}
                onChange={e => onChange(e.target.value)}
                onMouseUp={saveCursor}
                onKeyUp={saveCursor}
                onClick={saveCursor}
                placeholder={placeholder ?? "Qoraalka halkaan ku qor...\n\nMarka sawir ama video dhex geliso riix badhanka kor joga, ka dibna URL ku qor."}
                rows={rows}
                className={`font-mono text-sm rounded-none border-x border-b border-t-0 border-border rounded-b-md ${inserting ? 'border-t-0' : ''}`}
            />

            {/* ── Legend ──────────────────────────────────────────── */}
            <div className="px-1 flex flex-wrap gap-x-4 gap-y-0.5 text-[10px] text-muted-foreground/70">
                <span><code>[IMAGE: url]</code> → sawir</span>
                <span><code>[VIDEO: url]</code> → video</span>
                <span><code>[YOUTUBE: id]</code> → YouTube</span>
            </div>
        </div>
    )
}
