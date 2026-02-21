"use client"

import { useRef } from "react"
import { Trash2, MoveUp, MoveDown, AlignLeft, Image as ImageIcon, Video, Youtube, X } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import type { ContentBlock } from "@/lib/api"

interface BlockEditorProps {
    blocks: ContentBlock[]
    onChange: (blocks: ContentBlock[]) => void
}

type BlockType = 'text' | 'image' | 'video' | 'youtube'

function makeBlock(type: BlockType): ContentBlock {
    if (type === 'text') return { type: 'text', value: '' }
    if (type === 'image') return { type: 'image', url: '', caption: '' }
    if (type === 'video') return { type: 'video', url: '', caption: '' }
    return { type: 'youtube', videoId: '', caption: '' }
}

function getYtId(s: string) {
    if (s.includes('v=')) return s.split('v=')[1]?.split('&')[0] || s
    if (s.includes('youtu.be/')) return s.split('youtu.be/')[1]?.split('?')[0] || s
    return s.trim()
}

// ─── toolbar button config ──────────────────────────────────────────────────
const ADD_BUTTONS: { type: BlockType; label: string; icon: React.ReactNode; color: string }[] = [
    { type: 'text', label: 'Qoraal', icon: <AlignLeft className="w-4 h-4" />, color: 'hover:bg-blue-50 hover:text-blue-600 hover:border-blue-300 dark:hover:bg-blue-950' },
    { type: 'image', label: 'Sawir', icon: <ImageIcon className="w-4 h-4" />, color: 'hover:bg-green-50 hover:text-green-600 hover:border-green-300 dark:hover:bg-green-950' },
    { type: 'video', label: 'Video', icon: <Video className="w-4 h-4" />, color: 'hover:bg-purple-50 hover:text-purple-600 hover:border-purple-300 dark:hover:bg-purple-950' },
    { type: 'youtube', label: 'YouTube', icon: <Youtube className="w-4 h-4" />, color: 'hover:bg-red-50 hover:text-red-600 hover:border-red-300 dark:hover:bg-red-950' },
]

const BLOCK_HEADER: Record<BlockType, { icon: React.ReactNode; label: string; color: string }> = {
    text: { icon: <AlignLeft className="w-3.5 h-3.5" />, label: 'Qoraal', color: 'text-blue-500' },
    image: { icon: <ImageIcon className="w-3.5 h-3.5" />, label: 'Sawir', color: 'text-green-500' },
    video: { icon: <Video className="w-3.5 h-3.5" />, label: 'Video', color: 'text-purple-500' },
    youtube: { icon: <Youtube className="w-3.5 h-3.5" />, label: 'YouTube', color: 'text-red-500' },
}

// ─── main component ─────────────────────────────────────────────────────────
export function BlockEditor({ blocks, onChange }: BlockEditorProps) {
    // Track which block index was last focused so we can insert AFTER it
    const lastFocused = useRef<number>(blocks.length - 1)

    const insertAfter = (index: number, type: BlockType) => {
        const copy = [...blocks]
        copy.splice(index + 1, 0, makeBlock(type))
        onChange(copy)
        // move focus tracker to the new block
        lastFocused.current = index + 1
    }

    const appendBlock = (type: BlockType) => {
        // insert after the last-focused block, or at end if nothing focused
        const insertIdx = blocks.length === 0 ? -1 : lastFocused.current
        insertAfter(insertIdx, type)
    }

    const update = (i: number, b: ContentBlock) => {
        const c = [...blocks]; c[i] = b; onChange(c)
    }

    const remove = (i: number) => {
        onChange(blocks.filter((_, idx) => idx !== i))
        lastFocused.current = Math.max(0, i - 1)
    }

    const move = (i: number, dir: 'up' | 'down') => {
        const c = [...blocks]
        const j = dir === 'up' ? i - 1 : i + 1
        if (j < 0 || j >= c.length) return
            ;[c[i], c[j]] = [c[j], c[i]]
        onChange(c)
    }

    return (
        <div className="space-y-3">

            {/* ── TOOLBAR ─────────────────────────────────────────── */}
            <div className="flex items-center gap-2 p-2 bg-muted/60 rounded-lg border border-border flex-wrap">
                <span className="text-xs text-muted-foreground font-medium shrink-0">+ Ku dar:</span>
                {ADD_BUTTONS.map(({ type, label, icon, color }) => (
                    <button
                        key={type}
                        type="button"
                        onClick={() => appendBlock(type)}
                        className={`flex items-center gap-1.5 px-3 py-1.5 text-sm rounded-md border border-border bg-background transition-all ${color}`}
                    >
                        {icon} {label}
                    </button>
                ))}
            </div>

            {/* ── EMPTY STATE ─────────────────────────────────────── */}
            {blocks.length === 0 && (
                <div className="text-center py-12 text-muted-foreground text-sm border-2 border-dashed border-border rounded-lg">
                    ⬆️ Kor ka dooro nooca block-ka aad rabto
                    <div className="text-xs mt-1 opacity-60">Qoraal · Sawir · Video · YouTube</div>
                </div>
            )}

            {/* ── BLOCKS ──────────────────────────────────────────── */}
            {blocks.map((block, i) => {
                const hdr = BLOCK_HEADER[block.type]
                return (
                    <div
                        key={i}
                        onFocus={() => { lastFocused.current = i }}
                        className="border border-border rounded-lg bg-card overflow-hidden focus-within:border-primary/50 focus-within:shadow-sm transition-all"
                    >
                        {/* block bar */}
                        <div className="flex items-center justify-between px-3 py-1.5 bg-muted/40 border-b border-border">
                            <span className={`flex items-center gap-1.5 text-xs font-medium ${hdr.color}`}>
                                {hdr.icon} {hdr.label}
                            </span>
                            <div className="flex items-center gap-0.5">
                                <button type="button" onClick={() => move(i, 'up')} disabled={i === 0}
                                    className="p-1 rounded hover:bg-muted disabled:opacity-25 text-muted-foreground transition-colors" title="Kor u geli">
                                    <MoveUp className="w-3.5 h-3.5" />
                                </button>
                                <button type="button" onClick={() => move(i, 'down')} disabled={i === blocks.length - 1}
                                    className="p-1 rounded hover:bg-muted disabled:opacity-25 text-muted-foreground transition-colors" title="Hoos u geli">
                                    <MoveDown className="w-3.5 h-3.5" />
                                </button>

                                {/* insert-after mini buttons */}
                                <span className="w-px h-4 bg-border mx-1" />
                                {ADD_BUTTONS.map(({ type, icon }) => (
                                    <button key={type} type="button" onClick={() => insertAfter(i, type)}
                                        title={`Geli ${BLOCK_HEADER[type].label} ka dib`}
                                        className="p-1 rounded hover:bg-muted text-muted-foreground hover:text-foreground transition-colors">
                                        {icon}
                                    </button>
                                ))}

                                <span className="w-px h-4 bg-border mx-1" />
                                <button type="button" onClick={() => remove(i)}
                                    className="p-1 rounded hover:bg-destructive/10 hover:text-destructive text-muted-foreground transition-colors" title="Tirtir">
                                    <X className="w-3.5 h-3.5" />
                                </button>
                            </div>
                        </div>

                        {/* block body */}
                        <div className="p-3 space-y-2">
                            {block.type === 'text' && (
                                <Textarea
                                    placeholder="Qoraalka halkaan ku qor..."
                                    value={block.value}
                                    onChange={(e) => update(i, { ...block, value: e.target.value })}
                                    rows={4}
                                    className="text-sm resize-y border-0 shadow-none focus-visible:ring-0 p-0 bg-transparent"
                                    autoFocus={block.value === ''}
                                />
                            )}

                            {block.type === 'image' && (
                                <>
                                    <Input placeholder="URL sawirka: https://example.com/photo.jpg"
                                        value={block.url} onChange={(e) => update(i, { ...block, url: e.target.value })} />
                                    <Input placeholder="Sharaxaad hoose sawirka (ikhtiyaari)"
                                        value={block.caption || ''} onChange={(e) => update(i, { ...block, caption: e.target.value })} />
                                    {block.url && (
                                        <div className="rounded-lg overflow-hidden bg-muted border border-border">
                                            {/* eslint-disable-next-line @next/next/no-img-element */}
                                            <img src={block.url} alt={block.caption || ''} className="w-full max-h-56 object-contain"
                                                onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }} />
                                        </div>
                                    )}
                                </>
                            )}

                            {block.type === 'video' && (
                                <>
                                    <Input placeholder="URL video-ga .mp4: https://example.com/clip.mp4"
                                        value={block.url} onChange={(e) => update(i, { ...block, url: e.target.value })} />
                                    <Input placeholder="Sharaxaad (ikhtiyaari)"
                                        value={block.caption || ''} onChange={(e) => update(i, { ...block, caption: e.target.value })} />
                                    {block.url && (
                                        <video controls src={block.url} className="w-full rounded-lg bg-black max-h-52" />
                                    )}
                                </>
                            )}

                            {block.type === 'youtube' && (
                                <>
                                    <Input placeholder="YouTube link ama ID: https://youtube.com/watch?v=dQw4w9WgXcQ"
                                        value={block.videoId} onChange={(e) => update(i, { ...block, videoId: e.target.value })} />
                                    <Input placeholder="Sharaxaad (ikhtiyaari)"
                                        value={block.caption || ''} onChange={(e) => update(i, { ...block, caption: e.target.value })} />
                                    {block.videoId && (
                                        <div className="aspect-video rounded-lg overflow-hidden">
                                            <iframe src={`https://www.youtube.com/embed/${getYtId(block.videoId)}`}
                                                className="w-full h-full"
                                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                                allowFullScreen />
                                        </div>
                                    )}
                                </>
                            )}
                        </div>
                    </div>
                )
            })}

        </div>
    )
}
