/* ===== CR7 - THE LAST DANCE | MAIN JS ===== */

// ── Dark Mode ──────────────────────────────────────────────────────────
const html = document.documentElement;
const darkBtn = document.getElementById('darkBtn');

if (localStorage.getItem('darkMode') === 'true') {
  html.setAttribute('data-theme', 'dark');
  if (darkBtn) darkBtn.textContent = '☀️';
}

if (darkBtn) {
  darkBtn.addEventListener('click', () => {
    const isDark = html.getAttribute('data-theme') === 'dark';
    html.setAttribute('data-theme', isDark ? 'light' : 'dark');
    localStorage.setItem('darkMode', !isDark);
    darkBtn.textContent = isDark ? '🌙' : '☀️';
  });
}

// ── Mobile Menu ─────────────────────────────────────────────────────────
const menuBtn = document.getElementById('menuBtn');
const mainNav = document.getElementById('mainNav');
if (menuBtn && mainNav) {
  menuBtn.addEventListener('click', () => {
    mainNav.classList.toggle('open');
    menuBtn.textContent = mainNav.classList.contains('open') ? '✕' : '☰';
  });
  document.addEventListener('click', e => {
    if (!e.target.closest('.site-header')) mainNav.classList.remove('open');
  });
}

// ── Reading Progress Bar ────────────────────────────────────────────────
const progressBar = document.getElementById('progress-bar');
if (progressBar) {
  window.addEventListener('scroll', () => {
    const h = document.documentElement;
    const pct = (h.scrollTop / (h.scrollHeight - h.clientHeight)) * 100;
    progressBar.style.width = pct + '%';
  });
}

// ── Language System ─────────────────────────────────────────────────────
const i18n = {
  en: {
    latest_news: 'Latest News', live_scores: 'Live Scores', career_goals: 'Career Goals',
    goals: 'Goals', assists: 'Assists', matches: 'Matches', trophies: 'Trophies',
    ballon_dor: "Ballon d'Or", portugal_goals: 'Portugal Goals',
    world_cup_path: 'Road to World Cup 2026', read_more: 'Read More',
    share: 'Share', no_posts: 'No posts yet.', loading: 'Loading...',
    upcoming: 'Upcoming', tbd: 'TBD', search_placeholder: 'Search news...',
    all: 'All', breaking: 'Breaking'
  },
  ar: {
    latest_news: 'آخر الأخبار', live_scores: 'نتائج مباشرة', career_goals: 'أهداف المسيرة',
    goals: 'أهداف', assists: 'تمريرات', matches: 'مباريات', trophies: 'بطولات',
    ballon_dor: 'الكرة الذهبية', portugal_goals: 'أهداف البرتغال',
    world_cup_path: 'الطريق إلى كأس العالم 2026', read_more: 'اقرأ المزيد',
    share: 'مشاركة', no_posts: 'لا توجد مقالات.', loading: 'جاري التحميل...',
    upcoming: 'قادم', tbd: 'يحدد لاحقاً', search_placeholder: 'ابحث في الأخبار...',
    all: 'الكل', breaking: 'عاجل'
  },
  fr: {
    latest_news: 'Dernières Nouvelles', live_scores: 'Scores en Direct', career_goals: 'Buts en Carrière',
    goals: 'Buts', assists: 'Passes', matches: 'Matchs', trophies: 'Trophées',
    ballon_dor: "Ballon d'Or", portugal_goals: 'Buts Portugal',
    world_cup_path: 'Route vers le Mondial 2026', read_more: 'Lire Plus',
    share: 'Partager', no_posts: 'Aucun article.', loading: 'Chargement...',
    upcoming: 'À venir', tbd: 'À définir', search_placeholder: 'Rechercher...',
    all: 'Tout', breaking: 'Urgent'
  },
  pt: {
    latest_news: 'Últimas Notícias', live_scores: 'Resultados ao Vivo', career_goals: 'Golos na Carreira',
    goals: 'Golos', assists: 'Assistências', matches: 'Jogos', trophies: 'Troféus',
    ballon_dor: 'Bola de Ouro', portugal_goals: 'Golos por Portugal',
    world_cup_path: 'Caminho para o Mundial 2026', read_more: 'Ler Mais',
    share: 'Partilhar', no_posts: 'Sem artigos.', loading: 'A carregar...',
    upcoming: 'Próximo', tbd: 'A definir', search_placeholder: 'Pesquisar notícias...',
    all: 'Tudo', breaking: 'Urgente'
  },
  es: {
    latest_news: 'Últimas Noticias', live_scores: 'Resultados en Vivo', career_goals: 'Goles en Carrera',
    goals: 'Goles', assists: 'Asistencias', matches: 'Partidos', trophies: 'Trofeos',
    ballon_dor: 'Balón de Oro', portugal_goals: 'Goles Portugal',
    world_cup_path: 'Camino al Mundial 2026', read_more: 'Leer Más',
    share: 'Compartir', no_posts: 'Sin artículos.', loading: 'Cargando...',
    upcoming: 'Próximo', tbd: 'Por definir', search_placeholder: 'Buscar noticias...',
    all: 'Todo', breaking: 'Urgente'
  }
};

let currentLang = localStorage.getItem('lang') || 'en';

function t(key) { return (i18n[currentLang] && i18n[currentLang][key]) || i18n.en[key] || key; }

function applyLang(lang) {
  currentLang = lang;
  localStorage.setItem('lang', lang);
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    if (el.tagName === 'INPUT') el.placeholder = t(key);
    else el.textContent = t(key);
  });
  const isRtl = lang === 'ar';
  html.setAttribute('dir', isRtl ? 'rtl' : 'ltr');
  html.setAttribute('lang', lang);
  if (typeof renderPosts === 'function') renderPosts();
  if (typeof renderFiltered === 'function') renderFiltered();
}

const langSelect = document.getElementById('langSelect');
if (langSelect) {
  langSelect.value = currentLang;
  langSelect.addEventListener('change', e => applyLang(e.target.value));
}

applyLang(currentLang);

// ── Countdown to WC 2026 ────────────────────────────────────────────────
function updateCountdown() {
  const target = new Date('2026-06-11T18:00:00Z').getTime();
  const now = Date.now();
  const diff = target - now;
  if (diff <= 0) {
    document.querySelectorAll('.cd-num').forEach(el => el.textContent = '0');
    return;
  }
  const d = Math.floor(diff / 86400000);
  const h = Math.floor((diff % 86400000) / 3600000);
  const m = Math.floor((diff % 3600000) / 60000);
  const s = Math.floor((diff % 60000) / 1000);
  const set = (id, val) => { const el = document.getElementById(id); if (el) el.textContent = String(val).padStart(2,'0'); };
  set('cd-days', d); set('cd-hours', h); set('cd-mins', m); set('cd-secs', s);
}
if (document.getElementById('cd-secs')) {
  updateCountdown();
  setInterval(updateCountdown, 1000);
}

// ── Posts Loader ─────────────────────────────────────────────────────────
let allPosts = [];
let activeCategory = 'all';
let searchQuery = '';
const POSTS_PER_PAGE = 9;
let currentPage = 1;

async function loadPostsData() {
  if (allPosts.length) return allPosts;
  const r = await fetch('data/posts.json');
  const d = await r.json();
  allPosts = d.posts || [];
  return allPosts;
}

function getFilteredPosts() {
  return allPosts.filter(p => {
    const langMatch = p.lang === currentLang || (allPosts.filter(x => x.lang === currentLang).length === 0);
    if (!langMatch) return false;
    if (activeCategory !== 'all' && p.category !== activeCategory) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return p.title.toLowerCase().includes(q) || (p.excerpt || '').toLowerCase().includes(q);
    }
    return true;
  });
}

function renderSkeletons(grid, count = 6) {
  grid.innerHTML = Array.from({length: count}, () => `
    <div class="skeleton-card">
      <div class="skeleton skeleton-img"></div>
      <div class="skeleton-body">
        <div class="skeleton skeleton-line wide"></div>
        <div class="skeleton skeleton-line mid"></div>
        <div class="skeleton skeleton-line short"></div>
      </div>
    </div>
  `).join('');
}

function postCardHTML(post) {
  return `
    <article class="post-card reveal">
      <div class="card-img-wrap">
        <img src="${post.image || 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=600&q=80'}" 
             alt="${post.title}" loading="lazy"
             onerror="this.src='https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=600&q=80'">
        <span class="card-category">${post.category || 'News'}</span>
        ${post.breaking ? `<span class="card-breaking">Breaking</span>` : ''}
      </div>
      <div class="card-body">
        <h3 class="card-title"><a href="article.html?id=${post.id}">${post.title}</a></h3>
        <p class="card-excerpt">${post.excerpt || ''}</p>
        <div class="card-meta">
          <span>📅 ${post.date || ''}</span>
          <span>⏱ ${post.readTime || '3'} min read</span>
        </div>
      </div>
    </article>
  `;
}

function renderPagination(total) {
  const pag = document.getElementById('pagination');
  if (!pag) return;
  const pages = Math.ceil(total / POSTS_PER_PAGE);
  if (pages <= 1) { pag.innerHTML = ''; return; }
  let html = `<button class="page-btn" onclick="changePage(${currentPage - 1})" ${currentPage === 1 ? 'disabled' : ''}>‹</button>`;
  for (let i = 1; i <= pages; i++) {
    html += `<button class="page-btn ${i === currentPage ? 'active' : ''}" onclick="changePage(${i})">${i}</button>`;
  }
  html += `<button class="page-btn" onclick="changePage(${currentPage + 1})" ${currentPage === pages ? 'disabled' : ''}>›</button>`;
  pag.innerHTML = html;
}

window.changePage = function(p) {
  const filtered = getFilteredPosts();
  const pages = Math.ceil(filtered.length / POSTS_PER_PAGE);
  if (p < 1 || p > pages) return;
  currentPage = p;
  renderFiltered();
  document.getElementById('postsGrid')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
};

function renderFiltered() {
  const grid = document.getElementById('postsGrid');
  if (!grid) return;
  const filtered = getFilteredPosts();
  currentPage = Math.min(currentPage, Math.ceil(filtered.length / POSTS_PER_PAGE) || 1);
  const start = (currentPage - 1) * POSTS_PER_PAGE;
  const page = filtered.slice(start, start + POSTS_PER_PAGE);
  if (page.length === 0) {
    grid.innerHTML = `<p style="text-align:center;padding:3rem;color:var(--text-3);grid-column:1/-1;">${t('no_posts')}</p>`;
  } else {
    grid.innerHTML = page.map(postCardHTML).join('');
    observeReveal();
  }
  renderPagination(filtered.length);
}

async function initPosts() {
  const grid = document.getElementById('postsGrid');
  if (!grid) return;
  renderSkeletons(grid);
  try {
    await loadPostsData();
    buildCategoryTabs();
    renderFiltered();
  } catch (e) {
    grid.innerHTML = `<p style="text-align:center;padding:3rem;color:var(--text-3);">⚠️ Could not load posts.</p>`;
  }
}

function buildCategoryTabs() {
  const tabsEl = document.getElementById('categoryTabs');
  if (!tabsEl) return;
  const langPosts = allPosts.filter(p => p.lang === currentLang || allPosts.filter(x => x.lang === currentLang).length === 0);
  const cats = [...new Set(langPosts.map(p => p.category))];
  tabsEl.innerHTML = `<button class="filter-tab active" onclick="setCategory('all')" data-i18n="all">${t('all')}</button>` +
    cats.map(c => `<button class="filter-tab" onclick="setCategory('${c}')">${c}</button>`).join('');
}

window.setCategory = function(cat) {
  activeCategory = cat;
  currentPage = 1;
  document.querySelectorAll('.filter-tab').forEach(b => b.classList.toggle('active', b.textContent === t('all') ? cat === 'all' : b.textContent === cat));
  renderFiltered();
};

// Search
const searchInput = document.getElementById('searchInput');
if (searchInput) {
  let debounce;
  searchInput.addEventListener('input', e => {
    clearTimeout(debounce);
    debounce = setTimeout(() => {
      searchQuery = e.target.value.trim();
      currentPage = 1;
      renderFiltered();
    }, 250);
  });
}

// ── Article Loader ───────────────────────────────────────────────────────
async function loadArticle() {
  const params = new URLSearchParams(location.search);
  const id = params.get('id');
  if (!id) { document.getElementById('articleContent').innerHTML = '<p>No article found.</p>'; return; }
  await loadPostsData();
  const post = allPosts.find(p => p.id === id);
  if (!post) { document.getElementById('articleContent').innerHTML = '<p>Article not found.</p>'; return; }

  document.title = post.title + ' – CR7 The Last Dance';

  const heroEl   = document.getElementById('articleHero');
  const titleEl  = document.getElementById('articleTitle');
  const metaEl   = document.getElementById('articleMeta');
  const bodyEl   = document.getElementById('articleContent');

  if (heroEl) {
    const img = post.image ? `<img src="${post.image}" alt="${post.title}"><div class="article-hero-overlay"></div>` : '';
    heroEl.innerHTML = img + `<div class="article-hero-meta"><span class="card-category">${post.category}</span></div>`;
  }
  if (titleEl) titleEl.textContent = post.title;
  if (metaEl)  metaEl.innerHTML = `<span>📅 ${post.date}</span> &nbsp;·&nbsp; <span>⏱ ${post.readTime} min read</span>`;
  if (bodyEl)  bodyEl.innerHTML = post.content || '';

  // Related posts
  const related = allPosts.filter(p => p.id !== id && p.lang === post.lang && p.category === post.category).slice(0, 3);
  const relEl = document.getElementById('relatedPosts');
  if (relEl && related.length) {
    relEl.innerHTML = related.map(postCardHTML).join('');
    observeReveal();
  }

  // Share buttons
  document.querySelectorAll('.share-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const url = encodeURIComponent(location.href);
      const text = encodeURIComponent(post.title);
      const actions = {
        x:  `https://twitter.com/intent/tweet?text=${text}&url=${url}`,
        fb: `https://www.facebook.com/sharer/sharer.php?u=${url}`,
        wa: `https://wa.me/?text=${text}%20${url}`,
        tg: `https://t.me/share/url?url=${url}&text=${text}`,
        copy: null
      };
      const type = btn.dataset.share;
      if (type === 'copy') {
        navigator.clipboard.writeText(location.href);
        btn.textContent = '✅ Copied!';
        setTimeout(() => btn.innerHTML = '🔗 Copy Link', 1800);
      } else if (actions[type]) {
        window.open(actions[type], '_blank', 'width=580,height=400');
      }
    });
  });
}

// ── Scroll Reveal (Intersection Observer) ────────────────────────────────
function observeReveal() {
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); io.unobserve(e.target); } });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
  document.querySelectorAll('.reveal').forEach(el => io.observe(el));
}

// ── Animated Stat Counters ───────────────────────────────────────────────
function animateCount(el, target, duration = 1500) {
  const start = performance.now();
  const update = (now) => {
    const progress = Math.min((now - start) / duration, 1);
    const ease = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.floor(ease * target).toLocaleString();
    if (progress < 1) requestAnimationFrame(update);
    else el.textContent = target.toLocaleString();
  };
  requestAnimationFrame(update);
}

function initCounters() {
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting && !e.target.dataset.counted) {
        e.target.dataset.counted = 'true';
        const target = parseInt(e.target.dataset.count);
        animateCount(e.target, target);
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.3 });
  document.querySelectorAll('[data-count]').forEach(el => io.observe(el));
}

// ── Timeline Bars ────────────────────────────────────────────────────────
function initTimelineBars() {
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        const bar = e.target.querySelector('.timeline-bar-fill');
        if (bar) { bar.style.width = bar.dataset.width; }
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.3 });
  document.querySelectorAll('.timeline-item').forEach(el => { el.querySelector('.timeline-bar-fill') && io.observe(el); });
}

// ── Notifications ────────────────────────────────────────────────────────
const notifBtn    = document.getElementById('notifBtn');
const notifDrawer = document.getElementById('notifDrawer');

if (notifBtn && notifDrawer) {
  notifBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    notifDrawer.classList.toggle('open');
  });
  document.addEventListener('click', (e) => {
    if (!e.target.closest('.notif-wrap')) notifDrawer.classList.remove('open');
  });
}

// ── Chatbot ──────────────────────────────────────────────────────────────
const chatFab    = document.getElementById('chatFab');
const chatWindow = document.getElementById('chatWindow');
const chatClose  = document.getElementById('chatClose');
const chatInput  = document.getElementById('chatInput');
const chatSend   = document.getElementById('chatSend');
const chatMsgs   = document.getElementById('chatMsgs');

const CR7_CONTEXT = `You are CR7Bot — the official AI assistant for the "CR7 - The Last Dance" fan blog about Cristiano Ronaldo's final World Cup 2026.

Key facts you know:
- CR7's career goals: 920+, Portugal goals: 132, caps: 212, UCL goals: 140
- 5 Ballon d'Or awards, 5 UCL titles, 2 international trophies (Euro 2016, Nations League 2019)
- Clubs: Sporting CP, Man United, Real Madrid, Juventus, Al Nassr
- World Cup 2026: hosted by USA, Canada, Mexico. Kicks off June 11, 2026. Portugal in Group E (Czech Republic, Turkey, Egypt)
- This is Ronaldo's 6th World Cup; he will be 41 during the tournament
- Al Nassr: plays in Saudi Pro League

Reply in the same language the user writes in. Be enthusiastic but concise (2-4 sentences). If asked something you don't know, say so honestly. Start each reply with a football emoji.`;

function addMsg(text, role) {
  const div = document.createElement('div');
  div.className = `chat-msg ${role}`;
  div.textContent = text;
  chatMsgs.appendChild(div);
  chatMsgs.scrollTop = chatMsgs.scrollHeight;
  return div;
}

function addTyping() {
  const div = document.createElement('div');
  div.className = 'chat-msg bot typing';
  div.id = 'typing-indicator';
  div.innerHTML = '<span class="typing-dot"></span><span class="typing-dot"></span><span class="typing-dot"></span>';
  chatMsgs.appendChild(div);
  chatMsgs.scrollTop = chatMsgs.scrollHeight;
}

function removeTyping() { document.getElementById('typing-indicator')?.remove(); }

const chatHistory = [{ role: 'assistant', content: '⚽ Olá! I\'m CR7Bot. Ask me anything about Cristiano Ronaldo, Portugal\'s World Cup 2026 journey, or his incredible career!' }];

async function sendChat(msg) {
  if (!msg.trim()) return;
  addMsg(msg, 'user');
  chatInput.value = '';
  chatHistory.push({ role: 'user', content: msg });
  addTyping();

  try {
    const res = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'claude-sonnet-4-6',
        max_tokens: 1000,
        system: CR7_CONTEXT,
        messages: chatHistory.slice(-10)
      })
    });
    const data = await res.json();
    removeTyping();
    const reply = data.content?.[0]?.text || '⚽ Sorry, I couldn\'t get an answer right now. Try again!';
    addMsg(reply, 'bot');
    chatHistory.push({ role: 'assistant', content: reply });
  } catch {
    removeTyping();
    addMsg('⚽ Connection error. Please try again.', 'bot');
  }
}

if (chatFab && chatWindow) {
  chatFab.addEventListener('click', () => chatWindow.classList.toggle('open'));
  chatClose?.addEventListener('click', () => chatWindow.classList.remove('open'));
  chatSend?.addEventListener('click', () => sendChat(chatInput.value));
  chatInput?.addEventListener('keydown', e => { if (e.key === 'Enter') sendChat(chatInput.value); });
}

// ── Live Scores Last Updated ─────────────────────────────────────────────
function updateTimestamp() {
  const el = document.getElementById('lastUpdated');
  if (el) el.textContent = 'Updated: ' + new Date().toLocaleTimeString();
}

const refreshBtn = document.getElementById('refreshScores');
if (refreshBtn) {
  updateTimestamp();
  refreshBtn.addEventListener('click', () => {
    document.querySelectorAll('iframe').forEach(f => { const s = f.src; f.src = ''; f.src = s; });
    updateTimestamp();
    refreshBtn.textContent = '✅ Refreshed';
    setTimeout(() => { refreshBtn.textContent = '↻ Refresh'; }, 2000);
  });
}

// ── Init ─────────────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  observeReveal();
  initCounters();
  initTimelineBars();
  if (document.getElementById('postsGrid')) initPosts();
  if (document.getElementById('articleContent')) loadArticle();
});

console.log('🐐 CR7 – The Last Dance | Hard Level Build');
