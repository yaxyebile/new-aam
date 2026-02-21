"use client"

import { useState, useRef, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Menu, X, Search, Bell, BellOff } from "lucide-react"
import { Button } from "@/components/ui/button"
import { CATEGORIES, getBreakingNews } from "@/lib/api"
import { ThemeToggle } from "@/components/theme-toggle"
import { useLanguage } from "@/lib/language-context"
import {
  requestNotificationPermission,
  getNotificationPermission,
  isNotificationSupported,
  registerServiceWorker,
} from "@/lib/notifications"

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [notifPermission, setNotifPermission] = useState<string>("default")
  const searchRef = useRef<HTMLInputElement>(null)
  const router = useRouter()
  const { lang, setLang, t } = useLanguage()

  useEffect(() => {
    if (isNotificationSupported()) {
      setNotifPermission(getNotificationPermission())
      registerServiceWorker()
    }
  }, [])

  useEffect(() => {
    if (searchOpen && searchRef.current) {
      searchRef.current.focus()
    }
  }, [searchOpen])

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`)
      setSearchOpen(false)
      setSearchQuery("")
    }
  }

  const handleNotificationClick = async () => {
    const result = await requestNotificationPermission()
    setNotifPermission(result)
  }

  const toggleLanguage = () => {
    setLang(lang === "en" ? "so" : "en")
  }

  // Get breaking news for ticker
  const [breakingTitle, setBreakingTitle] = useState("Stay updated with the latest breaking news from around the world.")
  useEffect(() => {
    async function load() {
      try {
        const breaking = await getBreakingNews()
        if (breaking.length > 0) {
          setBreakingTitle(breaking[0].title)
        }
      } catch (err) {
        console.error('Failed to load breaking news:', err)
      }
    }
    load()
  }, [])

  return (
    <header className="sticky top-0 z-50 bg-card border-b border-border">
      {/* Breaking News Ticker */}
      <div className="bg-primary text-primary-foreground py-1 sm:py-1.5 overflow-hidden text-xs sm:text-sm">
        <div className="mx-auto max-w-7xl px-3 sm:px-4">
          <div className="flex items-center gap-2 sm:gap-3">
            <span className="shrink-0 font-bold uppercase tracking-wider bg-card text-primary px-1.5 sm:px-2 py-0.5 rounded text-[10px] sm:text-xs">
              {t("breaking")}
            </span>
            <div className="overflow-hidden">
              <p className="truncate animate-in slide-in-from-right duration-500">
                {breakingTitle}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Search bar (slide-down) */}
      {searchOpen && (
        <div className="border-b border-border bg-card/95 backdrop-blur-sm">
          <div className="mx-auto max-w-7xl px-3 sm:px-4 py-2">
            <form onSubmit={handleSearchSubmit} className="flex items-center gap-2">
              <Search className="w-4 h-4 text-muted-foreground shrink-0" />
              <input
                ref={searchRef}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t("searchPlaceholder")}
                className="flex-1 bg-transparent text-foreground placeholder:text-muted-foreground text-sm outline-none"
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={() => { setSearchOpen(false); setSearchQuery("") }}
              >
                <X className="h-4 w-4" />
              </Button>
            </form>
          </div>
        </div>
      )}

      {/* Main Header */}
      <div className="mx-auto max-w-7xl px-3 sm:px-4">
        <div className="flex items-center justify-between h-20 sm:h-24">
          {/* Logo */}
          <Link href="/" className="flex items-center shrink-0 py-2">
            <img
              src="/logo.png"
              alt="AAM NEWS"
              className="h-16 sm:h-20 w-auto object-contain"
              onError={(e) => {
                // Return to text if image fails
                (e.target as HTMLImageElement).style.display = 'none';
                const parent = (e.target as HTMLElement).parentElement;
                if (parent) {
                  const textFallback = document.createElement('div');
                  textFallback.className = "flex items-center gap-1.5 sm:gap-2";
                  textFallback.innerHTML = `
                    <div class="bg-primary text-primary-foreground font-bold text-sm sm:text-xl px-2 sm:px-3 py-1 sm:py-1.5 rounded">AAM</div>
                    <span class="font-bold text-lg sm:text-2xl tracking-tight text-foreground">NEWS</span>
                  `;
                  parent.appendChild(textFallback);
                }
              }}
            />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1">
            {CATEGORIES.slice(0, 6).map((category) => (
              <Link
                key={category}
                href={`/category/${category.toLowerCase()}`}
                className="px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted rounded transition-colors"
              >
                {t(category as "World")}
              </Link>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-0.5 sm:gap-1">
            {/* Search */}
            <Button
              variant="ghost"
              size="icon"
              className="h-9 w-9 sm:h-10 sm:w-10"
              onClick={() => setSearchOpen(!searchOpen)}
              title={t("search")}
            >
              <Search className="h-4 sm:h-5 w-4 sm:w-5" />
              <span className="sr-only">{t("search")}</span>
            </Button>

            {/* Notifications */}
            {isNotificationSupported() && (
              <Button
                variant="ghost"
                size="icon"
                className="h-9 w-9 sm:h-10 sm:w-10 hidden md:flex"
                onClick={handleNotificationClick}
                title={t("notifications")}
              >
                {notifPermission === "granted" ? (
                  <Bell className="h-4 sm:h-5 w-4 sm:w-5 text-primary" />
                ) : (
                  <BellOff className="h-4 sm:h-5 w-4 sm:w-5" />
                )}
                <span className="sr-only">{t("notifications")}</span>
              </Button>
            )}

            {/* Theme Toggle */}
            <ThemeToggle />

            {/* Language Toggle */}
            <Button
              variant="ghost"
              size="sm"
              className="hidden md:flex h-9 px-2 sm:px-3 text-xs sm:text-sm font-bold"
              onClick={toggleLanguage}
            >
              {t("language")}
            </Button>

            {/* Mobile menu */}
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden h-9 w-9 sm:h-10 sm:w-10"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="h-4 sm:h-5 w-4 sm:w-5" /> : <Menu className="h-4 sm:h-5 w-4 sm:w-5" />}
              <span className="sr-only">Toggle menu</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-border bg-card">
          <nav className="mx-auto max-w-7xl px-3 sm:px-4 py-3 sm:py-4 flex flex-col gap-1">
            {CATEGORIES.map((category) => (
              <Link
                key={category}
                href={`/category/${category.toLowerCase()}`}
                className="px-2 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted rounded transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                {t(category as "World")}
              </Link>
            ))}
            <hr className="my-2 border-border" />
            <div className="flex items-center gap-2 px-2">
              {/* Mobile: Language + Notifications */}
              <Button
                variant="outline"
                size="sm"
                className="text-xs font-bold"
                onClick={() => { toggleLanguage(); setMobileMenuOpen(false) }}
              >
                {t("language")}
              </Button>
              {isNotificationSupported() && (
                <Button
                  variant="outline"
                  size="sm"
                  className="text-xs"
                  onClick={() => { handleNotificationClick(); setMobileMenuOpen(false) }}
                >
                  {notifPermission === "granted" ? (
                    <Bell className="h-3 w-3 mr-1 text-primary" />
                  ) : (
                    <BellOff className="h-3 w-3 mr-1" />
                  )}
                  {t("notifications")}
                </Button>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  )
}
