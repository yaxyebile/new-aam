"use client"

import Link from "next/link"
import { CATEGORIES } from "@/lib/api"
import { useLanguage } from "@/lib/language-context"

export function Footer() {
  const { t } = useLanguage()
  return (
    <footer className="bg-sidebar text-sidebar-foreground">
      <div className="mx-auto max-w-7xl px-3 sm:px-4 py-8 sm:py-12">
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-8">
          {/* Brand */}
          <div className="col-span-2 sm:col-span-1">
            <Link href="/" className="flex items-center mb-3 sm:mb-4">
              <img
                src="/logo.png"
                alt="AAM NEWS"
                className="h-16 sm:h-20 w-auto object-contain"
              />
            </Link>
            <p className="text-xs sm:text-sm text-sidebar-foreground/70 leading-relaxed">
              {t("footerDescription")}
            </p>
          </div>

          {/* Categories */}
          <div>
            <h3 className="font-semibold text-xs sm:text-sm uppercase tracking-wider mb-3 sm:mb-4">{t("categoriesFooter")}</h3>
            <ul className="space-y-1.5 sm:space-y-2">
              {CATEGORIES.slice(0, 6).map((category) => (
                <li key={category}>
                  <Link
                    href={`/category/${category.toLowerCase()}`}
                    className="text-xs sm:text-sm text-sidebar-foreground/70 hover:text-sidebar-foreground transition-colors"
                  >
                    {t(category as "World")}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="font-semibold text-xs sm:text-sm uppercase tracking-wider mb-3 sm:mb-4">{t("company")}</h3>
            <ul className="space-y-1.5 sm:space-y-2">
              <li><Link href="#" className="text-xs sm:text-sm text-sidebar-foreground/70 hover:text-sidebar-foreground transition-colors">{t("aboutUs")}</Link></li>
              <li><Link href="#" className="text-xs sm:text-sm text-sidebar-foreground/70 hover:text-sidebar-foreground transition-colors">{t("contact")}</Link></li>
              <li><Link href="#" className="text-xs sm:text-sm text-sidebar-foreground/70 hover:text-sidebar-foreground transition-colors">{t("careers")}</Link></li>
              <li><Link href="#" className="text-xs sm:text-sm text-sidebar-foreground/70 hover:text-sidebar-foreground transition-colors">{t("advertise")}</Link></li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="font-semibold text-xs sm:text-sm uppercase tracking-wider mb-3 sm:mb-4">{t("legal")}</h3>
            <ul className="space-y-1.5 sm:space-y-2">
              <li><Link href="#" className="text-xs sm:text-sm text-sidebar-foreground/70 hover:text-sidebar-foreground transition-colors">{t("privacyPolicy")}</Link></li>
              <li><Link href="#" className="text-xs sm:text-sm text-sidebar-foreground/70 hover:text-sidebar-foreground transition-colors">{t("termsOfService")}</Link></li>
              <li><Link href="#" className="text-xs sm:text-sm text-sidebar-foreground/70 hover:text-sidebar-foreground transition-colors">{t("cookiePolicy")}</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-sidebar-border mt-6 sm:mt-8 pt-6 sm:pt-8 flex flex-col sm:flex-row justify-between items-center gap-3 sm:gap-4 text-center sm:text-left">
          <p className="text-xs sm:text-sm text-sidebar-foreground/70">
            &copy; {new Date().getFullYear()} AAM NEWS. {t("allRightsReserved")}
          </p>
          <div className="flex items-center gap-4">
            <span className="text-xs text-sidebar-foreground/50">
              {t("poweredBy")}
            </span>
          </div>
        </div>
      </div>
    </footer>
  )
}
