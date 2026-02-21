// Internationalization (i18n) for AAM NEWS
// Supported languages: English (en) and Somali (so)

export type Language = 'en' | 'so'

export const translations = {
  en: {
    // Header
    breaking: 'Breaking',
    search: 'Search',
    searchPlaceholder: 'Search articles...',
    admin: 'Admin',
    language: 'SO',
    darkMode: 'Dark mode',
    lightMode: 'Light mode',
    notifications: 'Notifications',

    // Navigation
    browse: 'Browse:',
    home: 'Home',

    // Homepage sections
    latestNews: 'Latest News',
    mostRead: 'Most Read',
    categories: 'Categories',
    featuredArticles: 'Featured',
    loading: 'Loading...',
    noArticles: 'No articles found.',

    // Search page
    searchResults: 'Search Results',
    searchFor: 'Results for',
    noResults: 'No results found for',
    tryDifferent: 'Try a different search term.',
    backHome: 'Back to Home',

    // Categories
    All: 'All',
    World: 'World',
    Politics: 'Politics',
    Business: 'Business',
    Technology: 'Technology',
    Science: 'Science',
    Sports: 'Sports',
    Entertainment: 'Entertainment',
    Health: 'Health',

    // Footer
    footerDescription: 'Delivering breaking news, live updates, and in-depth coverage of world events around the clock.',
    categoriesFooter: 'Categories',
    company: 'Company',
    legal: 'Legal',
    aboutUs: 'About Us',
    contact: 'Contact',
    careers: 'Careers',
    advertise: 'Advertise',
    privacyPolicy: 'Privacy Policy',
    termsOfService: 'Terms of Service',
    cookiePolicy: 'Cookie Policy',
    allRightsReserved: 'All rights reserved.',
    poweredBy: 'Powered by AAM NEWS',

    // Notifications
    notifTitle: 'Enable Notifications',
    notifBody: 'Get notified of breaking news instantly!',
    notifGranted: 'Notifications enabled!',
    notifDenied: 'Notification permission denied.',
    notifUnsupported: 'Notifications not supported in this browser.',

    // Time
    minutesAgo: 'min ago',
    hoursAgo: 'h ago',
    daysAgo: 'd ago',
  },
  so: {
    // Header
    breaking: 'Wariye',
    search: 'Raadi',
    searchPlaceholder: 'Raadi maqaallada...',
    admin: 'Maamule',
    language: 'EN',
    darkMode: 'Habeyn madow',
    lightMode: 'Habeyn cad',
    notifications: 'Ogeysiisyada',

    // Navigation
    browse: 'Fiiri:',
    home: 'Guriga',

    // Homepage sections
    latestNews: 'Wararka Cusub',
    mostRead: 'Ugu Badan La Aqriyay',
    categories: 'Qaybaha',
    featuredArticles: 'Maqaallada Muhiimka ah',
    loading: 'Soo raraya...',
    noArticles: 'Maqaal lama helin.',

    // Search page
    searchResults: 'Natiijooyinka Raadinta',
    searchFor: 'Natiijooyinka',
    noResults: 'Wax lama helin:',
    tryDifferent: 'Isku day ereyad kale.',
    backHome: 'Ku Noqo Guriga',

    // Categories
    All: 'Dhammaan',
    World: 'Adduunka',
    Politics: 'Siyaasadda',
    Business: 'Ganacsiga',
    Technology: 'Teknolojiyada',
    Science: 'Sayniska',
    Sports: 'Ciyaaraha',
    Entertainment: 'Madadaalada',
    Health: 'Caafimaadka',

    // Footer
    footerDescription: 'Wararka deg-degga ah, wararka tooska ah, iyo faahfaahin qoto dheer oo ku saabsan dhacdooyinka adduunka maalintii iyo habeenkii.',
    categoriesFooter: 'Qaybaha',
    company: 'Shirkadda',
    legal: 'Sharci',
    aboutUs: 'Naga Daran',
    contact: 'Xiriir',
    careers: 'Shaqooyinka',
    advertise: 'Xayeysiiso',
    privacyPolicy: 'Xeerka Sirta',
    termsOfService: 'Shuruudaha Adeegga',
    cookiePolicy: 'Xeerka Cookie',
    allRightsReserved: 'Dhammaan xuquuqda way xafidsan yihiin.',
    poweredBy: 'Waxaa laga shaqeeyaa AAM NEWS',

    // Notifications
    notifTitle: 'Ogeysiisyada Fur',
    notifBody: 'Wararka deg-degga ah si degdeg ah ayuu kuu gaarsiinayaa!',
    notifGranted: 'Ogeysiisyada waa la ogolaaday!',
    notifDenied: 'Ogeysiinta la diiday.',
    notifUnsupported: 'Browser-kaagu ogeysiisyada ma taageerayo.',

    // Time
    minutesAgo: 'min ka hor',
    hoursAgo: 's ka hor',
    daysAgo: 'maalin ka hor',
  }
} as const

export type TranslationKey = keyof typeof translations.en
