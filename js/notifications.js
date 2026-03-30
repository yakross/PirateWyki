(function() {
    async function checkNewsNotifications() {
        const db = window.db;
        if (!db) return;

        try {
            // Get the latest news item
            const snap = await db.collection('news').orderBy('createdAt', 'desc').limit(1).get();
            if (snap.empty) return;

            const latestNews = snap.docs[0].data();
            const latestDateMillis = latestNews.createdAt ? latestNews.createdAt.toMillis() : 0;

            const lastViewedNews = parseInt(localStorage.getItem('gw_last_news_viewed') || '0', 10);

            if (latestDateMillis > lastViewedNews) {
                // There are new news! Find the "Noticias" links in navbar and add a badge
                const navLinks = document.querySelectorAll('.nav-link');
                navLinks.forEach(link => {
                    if (link.textContent.toLowerCase().includes('noticias') || link.getAttribute('href').includes('news.html')) {
                        // Check if badge already exists
                        if (!link.querySelector('.news-badge')) {
                            const badge = document.createElement('span');
                            badge.className = 'news-badge';
                            badge.style.cssText = 'background: #ef4444; color: white; border-radius: 50%; width: 8px; height: 8px; display: inline-block; position: absolute; top: 12px; right: 10px;';
                            link.style.position = 'relative';
                            link.appendChild(badge);
                        }
                    }
                });
            }

            // If we are currently on the news page, update the last viewed to the latest
            if (window.location.href.includes('news.html')) {
                localStorage.setItem('gw_last_news_viewed', Date.now().toString());
                // Remove badges
                document.querySelectorAll('.news-badge').forEach(el => el.remove());
            }

        } catch (e) {
            console.error('Error checking news notifications', e);
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', checkNewsNotifications);
    } else {
        checkNewsNotifications();
    }
})();
