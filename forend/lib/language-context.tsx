"use client"

import React, { createContext, useContext, useState, useEffect } from 'react'
import { translations, type Language, type TranslationKey } from './i18n'

interface LanguageContextValue {
    lang: Language
    setLang: (lang: Language) => void
    t: (key: TranslationKey) => string
}

const LanguageContext = createContext<LanguageContextValue>({
    lang: 'en',
    setLang: () => { },
    t: (key) => key,
})

const LANG_KEY = 'aam_news_language'

export function LanguageProvider({ children }: { children: React.ReactNode }) {
    const [lang, setLangState] = useState<Language>('en')

    useEffect(() => {
        const stored = localStorage.getItem(LANG_KEY) as Language | null
        if (stored === 'en' || stored === 'so') {
            setLangState(stored)
        }
    }, [])

    const setLang = (newLang: Language) => {
        setLangState(newLang)
        localStorage.setItem(LANG_KEY, newLang)
    }

    const t = (key: TranslationKey): string => {
        return translations[lang][key] ?? translations.en[key] ?? key
    }

    return (
        <LanguageContext.Provider value={{ lang, setLang, t }}>
            {children}
        </LanguageContext.Provider>
    )
}

export function useLanguage() {
    return useContext(LanguageContext)
}
