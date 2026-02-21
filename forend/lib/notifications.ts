// Push Notifications helper for AAM NEWS

export async function requestNotificationPermission(): Promise<'granted' | 'denied' | 'unsupported'> {
    if (typeof window === 'undefined') return 'unsupported'
    if (!('Notification' in window)) return 'unsupported'

    if (Notification.permission === 'granted') return 'granted'

    const permission = await Notification.requestPermission()
    return permission as 'granted' | 'denied'
}

export function sendBreakingNewsNotification(title: string, body: string): void {
    if (typeof window === 'undefined') return
    if (!('Notification' in window)) return
    if (Notification.permission !== 'granted') return

    try {
        const notification = new Notification(`🔴 ${title}`, {
            body,
            icon: '/icon.svg',
            badge: '/icon.svg',
            tag: 'breaking-news',
            requireInteraction: false,
        })

        // Auto-close after 8 seconds
        setTimeout(() => notification.close(), 8000)

        notification.onclick = () => {
            window.focus()
            notification.close()
        }
    } catch (err) {
        console.error('Notification failed:', err)
    }
}

export function isNotificationSupported(): boolean {
    return typeof window !== 'undefined' && 'Notification' in window
}

export function getNotificationPermission(): NotificationPermission | 'unsupported' {
    if (!isNotificationSupported()) return 'unsupported'
    return Notification.permission
}

// Register service worker for richer notifications
export async function registerServiceWorker(): Promise<void> {
    if (typeof window === 'undefined') return
    if (!('serviceWorker' in navigator)) return

    try {
        await navigator.serviceWorker.register('/sw.js')
    } catch (err) {
        console.error('Service worker registration failed:', err)
    }
}
