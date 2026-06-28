// Dark Mode Toggle
const darkToggle = document.getElementById('darkToggle');
const html = document.documentElement;

if (localStorage.getItem('darkMode') === 'true') {
    html.setAttribute('data-theme', 'dark');
    if (darkToggle) darkToggle.textContent = '☀️';
}

if (darkToggle) {
    darkToggle.addEventListener('click', () => {
        if (html.getAttribute('data-theme') === 'dark') {
            html.setAttribute('data-theme', 'light');
            localStorage.setItem('darkMode', 'false');
            darkToggle.textContent = '🌙';
        } else {
            html.setAttribute('data-theme', 'dark');
            localStorage.setItem('darkMode', 'true');
            darkToggle.textContent = '☀️';
        }
    });
}

// Mobile Menu
const menuToggle = document.getElementById('menuToggle');
const mainNav = document.getElementById('mainNav');

if (menuToggle && mainNav) {
    menuToggle.addEventListener('click', () => {
        mainNav.classList.toggle('open');
    });
}

// Language System
const translations = {
    en: {
        latest_news: 'Latest News',
        live_scores: 'Live Scores',
        career_goals: 'Career Goals',
        goals: 'Goals',
        assists: 'Assists',
        matches: 'Matches',
        trophies: 'Trophies',
        ballon_dor: "Ballon d'Or",
        portugal_goals: 'Portugal Goals',
        world_cup_path: 'Road to World Cup 2026',
        read_more: 'Read More',
        share: 'Share',
        no_posts: 'No posts yet',
        loading: 'Loading...',
        upcoming: 'Upcoming',
        tbd: 'TBD'
    },
    ar: {
        latest_news: 'آخر الأخبار',
        live_scores: 'نتائج مباشرة',
        career_goals: 'أهداف المسيرة',
        goals: 'أهداف',
        assists: 'تمريرات حاسمة',
        matches: 'مباريات',
        trophies: 'بطولات',
        ballon_dor: 'الكرة الذهبية',
        portugal_goals: 'أهداف البرتغال',
        world_cup_path: 'الطريق إلى كأس العالم 2026',
        read_more: 'اقرأ المزيد',
        share: 'مشاركة',
        no_posts: 'لا توجد مقالات',
        loading: 'جاري التحميل...',
        upcoming: 'قادم',
        tbd: 'يحدد لاحقاً'
    },
    fr: {
        latest_news: 'Dernières Nouvelles',
        live_scores: 'Scores en Direct',
        career_goals: 'Buts en Carrière',
        goals: 'Buts',
        assists: 'Passes',
        matches: 'Matchs',
        trophies: 'Trophées',
        ballon_dor: "Ballon d'Or",
        portugal_goals: 'Buts Portugal',
        world_cup_path: 'Route vers la Coupe du Monde 2026',
        read_more: 'Lire Plus',
        share: 'Partager',
        no_posts: 'Aucun article',
        loading: 'Chargement...',
        upcoming: 'À venir',
        tbd: 'À déterminer'
    },
    pt: {
        latest_news: 'Últimas Notícias',
        live_scores: 'Resultados ao Vivo',
        career_goals: 'Golos na Carreira',
        goals: 'Golos',
        assists: 'Assistências',
        matches: 'Jogos',
        trophies: 'Troféus',
        ballon_dor: 'Bola de Ouro',
        portugal_goals: 'Golos por Portugal',
        world_cup_path: 'Caminho para o Mundial 2026',
        read_more: 'Ler Mais',
        share: 'Partilhar',
        no_posts: 'Sem artigos',
        loading: 'A carregar...',
        upcoming: 'Próximo',
        tbd: 'A definir'
    },
    es: {
        latest_news: 'Últimas Noticias',
        live_scores: 'Resultados en Vivo',
        career_goals: 'Goles en Carrera',
        goals: 'Goles',
        assists: 'Asistencias',
        matches: 'Partidos',
        trophies: 'Trofeos',
        ballon_dor: 'Balón de Oro',
        portugal_goals: 'Goles Portugal',
        world_cup_path: 'Camino al Mundial 2026',
        read_more: 'Leer Más',
        share: 'Compartir',
        no_posts: 'Sin artículos',
        loading: 'Cargando...',
        upcoming: 'Próximo',
        tbd: 'Por definir'
    }
};

function changeLanguage(lang) {
    localStorage.setItem('lang', lang);
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (translations[lang] && translations[lang][key]) {
            el.textContent = translations[lang][key];
        }
    });
    if (lang === 'ar') {
        document.documentElement.setAttribute('dir', 'rtl');
    } else {
        document.documentElement.setAttribute('dir', 'ltr');
    }
    // Reload posts if on a page with posts
    if (typeof loadPosts === 'function') loadPosts(lang);
    if (typeof renderFilteredPosts === 'function') renderFilteredPosts();
}

// Load saved language
const savedLang = localStorage.getItem('lang') || 'en';
const langSwitch = document.getElementById('langSwitch');
if (langSwitch) langSwitch.value = savedLang;
changeLanguage(savedLang);

// Load Posts from JSON (for index.html and news.html)
async function loadPosts(lang = 'en') {
    const postsGrid = document.getElementById('postsGrid');
    if (!postsGrid) return;
    
    postsGrid.innerHTML = `<p style="text-align:center;padding:2rem;">${translations[lang]?.loading || 'Loading...'}</p>`;
    
    try {
        const response = await fetch('data/posts.json');
        const data = await response.json();
        const posts = data.posts || [];
        
        if (posts.length === 0) {
            postsGrid.innerHTML = `<p style="text-align:center;padding:2rem;">${translations[lang]?.no_posts || 'No posts yet'}</p>`;
            return;
        }
        
        const langPosts = posts.filter(p => p.lang === lang);
        const displayPosts = langPosts.length > 0 ? langPosts : posts;
        
        const postsPerPage = 9;
        const totalPages = Math.ceil(displayPosts.length / postsPerPage);
        let currentPage = 1;
        
        function renderPage(page) {
            currentPage = page;
            const start = (page - 1) * postsPerPage;
            const end = start + postsPerPage;
            const pagePosts = displayPosts.slice(start, end);
            
            postsGrid.innerHTML = pagePosts.map(post => `
                <article class="post-card">
                    <img src="${post.image || 'images/default-post.jpg'}" alt="${post.title}" class="card-image" loading="lazy" onerror="this.style.display='none'">
                    <div class="card-body">
                        <span class="card-category">${post.category || 'News'}</span>
                        <h3 class="card-title"><a href="article.html?id=${post.id}">${post.title}</a></h3>
                        <p class="card-excerpt">${post.excerpt || ''}</p>
                        <div class="card-meta">
                            <span>📅 ${post.date || ''}</span>
                            <span>⏱ ${post.readTime || '3'} min</span>
                        </div>
                    </div>
                </article>
            `).join('');
            
            const pagination = document.getElementById('pagination');
            if (pagination && totalPages > 1) {
                pagination.innerHTML = Array.from({length: totalPages}, (_, i) => `
                    <button class="${i + 1 === page ? 'active' : ''}" onclick="window._renderPage(${i + 1})">${i + 1}</button>
                `).join('');
            }
        }
        
        window._renderPage = renderPage;
        renderPage(1);
        
    } catch (error) {
        console.error('Error loading posts:', error);
        postsGrid.innerHTML = '<p style="text-align:center;padding:2rem;color:var(--secondary);">⚠️ Error loading posts.</p>';
    }
}

// Auto-load posts on pages with postsGrid
document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('postsGrid')) {
        const lang = localStorage.getItem('lang') || 'en';
        loadPosts(lang);
    }
});

console.log('🐐 CR7 - The Last Dance - Ready!');
console.log('🏆 The Greatest of All Time. One Final World Cup. One GOAT.');
