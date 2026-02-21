// Service Worker for AAM NEWS Push Notifications
// Place this file in the /public directory

self.addEventListener('install', (event) => {
    self.skipWaiting()
})

self.addEventListener('activate', (event) => {
    event.waitUntil(clients.claim())
})

self.addEventListener('push', (event) => {
    const data = event.data ? event.data.json() : {}
    const title = data.title || 'AAM NEWS'
    const options = {
        body: data.body || 'Breaking news update!',
        icon: '/icon.svg',
        badge: '/icon.svg',
        tag: 'aam-news-push',
        requireInteraction: false,
        data: { url: data.url || '/' }
    }

    event.waitUntil(
        self.registration.showNotification(title, options)
    )
})

self.addEventListener('notificationclick', (event) => {
    event.notification.close()
    const url = event.notification.data?.url || '/'
    event.waitUntil(
        clients.matchAll({ type: 'window' }).then((clientList) => {
            for (const client of clientList) {
                if (client.url === url && 'focus' in client) {
                    return client.focus()
                }
            }
            if (clients.openWindow) {
                return clients.openWindow(url)
            }
        })
    )
})
