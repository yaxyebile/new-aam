"use client"

import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"
import { useLanguage } from "@/lib/language-context"

export function ThemeToggle() {
    const { resolvedTheme, setTheme } = useTheme()
    const { t } = useLanguage()

    return (
        <Button
            variant="ghost"
            size="icon"
            className="h-9 w-9 sm:h-10 sm:w-10"
            onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
            title={resolvedTheme === "dark" ? t("lightMode") : t("darkMode")}
        >
            <Sun className="h-4 sm:h-5 w-4 sm:w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-4 sm:h-5 w-4 sm:w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            <span className="sr-only">{resolvedTheme === "dark" ? t("lightMode") : t("darkMode")}</span>
        </Button>
    )
}
