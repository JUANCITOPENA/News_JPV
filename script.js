// --- CONFIGURACIÓN SEGURA (APUNTA A TU BACKEND) ---
const NEWS_ENDPOINT = '/api/news';
const CINEMA_ENDPOINT = '/api/cinema';
const SUMMARY_ENDPOINT = '/api/summary';
const TMDB_IMG_BASE = 'https://image.tmdb.org/t/p/w500';

const FALLBACK_IMGS = [
    'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=800',
    'https://images.unsplash.com/photo-1586339949916-3e9457bef6d3?w=800',
    'https://images.unsplash.com/photo-1495020689067-958852a7765e?w=800'
];

const TRANSLATIONS = {
    es: {
        nav: { technology: '💻 Tecnología', movies: '🎬 Cine', business: '📈 Negocios', sports: '⚽ Deportes', health: '🏥 Salud', science: '🚀 Ciencia' },
        searchPlaceholder: 'Buscar...', readMore: 'Leer más', viewDetails: 'Ver Ficha', loadMore: 'CARGAR MÁS', back: 'Volver', error: 'Sin resultados o Error de Conexión.', sourceMsg: 'Fuente original', aiBtn: '✨ Resumen IA', noFavs: 'No tienes favoritos guardados.', demo: '⚠️ MODO DEMO', favTitle: '❤️ Mis Favoritos'
    },
    en: {
        nav: { technology: '💻 Technology', movies: '🎬 Movies', business: '📈 Business', sports: '⚽ Sports', health: '🏥 Health', science: '🚀 Science' },
        searchPlaceholder: 'Search...', readMore: 'Read more', viewDetails: 'View Details', loadMore: 'LOAD MORE', back: 'Back', error: 'No results or API Error.', sourceMsg: 'Original source', aiBtn: '✨ AI Summary', noFavs: 'No favorites saved.', demo: '⚠️ DEMO MODE', favTitle: '❤️ My Favorites'
    }
};

let state = {
    mode: 'news', 
    articles: [], // Artículos actualmente en pantalla
    cache: new Map(), // Caché global de todos los artículos por ID
    favorites: [], 
    seenIds: new Set(), 
    newsPageToken: null, 
    tmdbPage: 1, 
    currentCategory: 'technology', 
    movieFilter: 'now_playing', 
    currentQuery: null, 
    lang: 'es',
    initialLoadCount: 0
};

window.app = {
    init: function() {
        this.loadFavoritesFromStorage();
        document.getElementById('themeToggle').addEventListener('click', () => {
            const html = document.documentElement;
            html.setAttribute('data-bs-theme', html.getAttribute('data-bs-theme') === 'dark' ? 'light' : 'dark');
        });
        this.setLanguage('es');
    },

    setLanguage: function(lang) {
        state.lang = lang;
        const t = TRANSLATIONS[lang] || TRANSLATIONS.es;
        document.getElementById('current-lang-label').textContent = lang.toUpperCase();
        document.getElementById('search-input').placeholder = t.searchPlaceholder;
        document.getElementById('fav-label').textContent = lang === 'es' ? 'Favoritos' : 'Favorites';
        
        const menu = document.getElementById('category-menu');
        menu.innerHTML = '';
        Object.keys(t.nav).forEach(cat => {
            menu.innerHTML += `<li class="nav-item"><a class="nav-link" href="#" onclick="window.app.route('${cat}')">${t.nav[cat]}</a></li>`;
        });

        if (state.mode === 'favorites') this.loadFavorites();
        else if (state.mode === 'movies') this.fetchMovies();
        else this.fetchNews();
    },

    route: function(category) {
        state.currentQuery = null; state.articles = []; state.seenIds.clear(); state.initialLoadCount = 0;
        this.showLoader();
        if (category === 'movies') {
            state.mode = 'movies'; state.tmdbPage = 1;
            document.getElementById('movie-filters-container').classList.remove('d-none'); 
            this.fetchMovies();
        } else {
            state.mode = 'news'; state.currentCategory = category; state.newsPageToken = null;
            document.getElementById('movie-filters-container').classList.add('d-none'); 
            this.fetchNews();
        }
    },

    loadFavoritesFromStorage: function() {
        try {
            const saved = localStorage.getItem('jpv_favorites');
            state.favorites = saved ? JSON.parse(saved) : [];
        } catch(e) { state.favorites = []; }
    },
    loadFavorites: function() {
        state.mode = 'favorites';
        this.loadFavoritesFromStorage();
        state.articles = [...state.favorites]; 
        
        document.getElementById('pagination-wrapper').classList.add('d-none');
        document.getElementById('section-title').textContent = TRANSLATIONS[state.lang].favTitle;
        document.getElementById('section-title').classList.remove('d-none');

        if (state.articles.length === 0) {
            this.showError(TRANSLATIONS[state.lang].noFavs);
        } else {
            this.render(state.articles, 0, false, 'favorites');
        }
    },
    toggleFavorite: function(uniqueId, event) {
        event.stopPropagation();
        const item = state.cache.get(uniqueId);
        if (!item) return;

        const favIndex = state.favorites.findIndex(f => f.id === item.id);
        if (favIndex === -1) {
            state.favorites.push(item);
            event.currentTarget.classList.add('favorite-active');
        } else {
            state.favorites.splice(favIndex, 1);
            event.currentTarget.classList.remove('favorite-active');
        }
        localStorage.setItem('jpv_favorites', JSON.stringify(state.favorites));
        if (state.mode === 'favorites') this.loadFavorites();
    },

    shareItem: async function(link, title, e) {
        e.stopPropagation();
        if (navigator.share) { try { await navigator.share({ title, url: link }); } catch (err) {} }
        else { navigator.clipboard.writeText(link); alert('Enlace copiado'); }
    },

    filterMovies: function(val) { 
        state.movieFilter = val; 
        state.tmdbPage = 1; 
        state.articles = []; 
        state.seenIds.clear();
        this.fetchMovies(); 
    },
    search: function(q) { 
        state.currentQuery = q; 
        state.articles = []; 
        state.seenIds.clear();
        if (state.mode === 'movies') {
            state.tmdbPage = 1;
            this.fetchMovies();
        } else {
            state.newsPageToken = null;
            this.fetchNews();
        }
    },
    nextPage: function() { state.mode === 'movies' ? (state.tmdbPage++, this.fetchMovies(true)) : this.fetchNews(true); },

    fetchNews: async function(append = false) {
        let url = `${NEWS_ENDPOINT}?language=${state.lang}&category=${state.currentCategory}`;
        if(state.currentQuery) url += `&q=${encodeURIComponent(state.currentQuery)}`;
        if(state.newsPageToken) url += `&page=${state.newsPageToken}`;
        try {
            const res = await fetch(url);
            if (!res.ok) throw new Error("Backend Error");
            const data = await res.json();
            if (data.status === 'error') throw new Error(data.message);

            state.newsPageToken = data.nextPage;
            const newItems = data.results
                .map(art => {
                    const id = art.article_id || art.link;
                    return { id, title: art.title, desc: art.description, img: art.image_url, source: art.source_id, date: art.pubDate, link: art.link, content: art.content };
                })
                .filter(item => !state.seenIds.has(item.id));
            
            newItems.forEach(item => {
                state.seenIds.add(item.id);
                state.cache.set(item.id, item);
            });

            if (!append) state.articles = [];
            state.articles.push(...newItems);
            this.render(newItems, append ? state.articles.length - newItems.length : 0, append, 'news');

            if (!append && state.articles.length < 15 && state.newsPageToken && state.initialLoadCount < 1) {
                state.initialLoadCount++;
                await this.fetchNews(true); 
            }
        } catch(e) {
            if(!append) this.showError();
        } finally { this.resetBtn(); }
    },
    fetchMovies: async function(append = false) {
        let endpoint = state.currentQuery ? 'search' : state.movieFilter;
        let url = `${CINEMA_ENDPOINT}?endpoint=${endpoint}&language=${state.lang}&page=${state.tmdbPage}`;
        if(state.currentQuery) url += `&query=${encodeURIComponent(state.currentQuery)}`;
        try {
            const res = await fetch(url);
            if (!res.ok) throw new Error("Backend Error");
            const data = await res.json();
            if(data.error) throw new Error(data.error);

            const newItems = (data.results || [])
                .map(m => {
                    const id = `movie-${m.id}`;
                    return { id, title: m.title, desc: m.overview, img: m.poster_path ? TMDB_IMG_BASE+m.poster_path : null, source: 'TMDB', date: m.release_date, link: `https://www.themoviedb.org/movie/${m.id}`, content: m.overview, rating: m.vote_average?.toFixed(1) };
                })
                .filter(item => !state.seenIds.has(item.id));

            newItems.forEach(item => {
                state.seenIds.add(item.id);
                state.cache.set(item.id, item);
            });

            if (!append) state.articles = [];
            state.articles.push(...newItems);
            this.render(newItems, append ? state.articles.length - newItems.length : 0, append, 'movies');
        } catch(e) {
            if(!append) this.showError();
        } finally { this.resetBtn(); }
    },

    render: function(items, startIndex, append, type) {
        const container = document.getElementById('news-container');
        const t = TRANSLATIONS[state.lang];
        if (items.length === 0 && !append) { this.showError(type === 'favorites' ? t.noFavs : t.error); return; }
        
        const pagWrapper = document.getElementById('pagination-wrapper');
        if (type === 'favorites') pagWrapper.classList.add('d-none');
        else pagWrapper.classList.remove('d-none');

        let html = '';
        if (!append) {
            const titleEl = document.getElementById('section-title');
            if (type !== 'favorites') { 
                titleEl.textContent = state.currentQuery ? `Resultados: "${state.currentQuery}"` : (state.mode === 'movies' ? t.nav.movies : t.nav[state.currentCategory]);
                titleEl.classList.remove('d-none');
            }
            html = `<div class="row g-4" id="content-grid">`;
        }
        
        const cardsHTML = items.map(item => {
            const imgUrl = item.img || FALLBACK_IMGS[0];
            const isFav = state.favorites.some(f => f.id === item.id);
            // Escapar comillas para evitar errores de sintaxis en onclick
            const safeId = item.id.replace(/"/g, '&quot;').replace(/'/g, "\\'");

            return `
            <div class="col-md-6 col-lg-3 news-col">
                <article class="news-card">
                    <div class="img-wrapper" onclick="window.app.openDetail('${safeId}')" style="cursor:pointer;">
                        <img src="${imgUrl}" loading="lazy" referrerpolicy="no-referrer" onerror="this.src='${FALLBACK_IMGS[0]}'">
                        ${item.rating ? `<div class="movie-rating">⭐ ${item.rating}</div>` : ''}
                    </div>
                    <div class="card-body">
                        <div class="news-meta"><span>${item.source}</span></div>
                        <h3 class="news-title" onclick="window.app.openDetail('${safeId}')" style="cursor:pointer;">${item.title.replace(/'/g, '')}</h3>
                        <p class="news-desc">${item.desc || '...'}</p>
                        <div class="card-actions">
                            <a href="${item.link}" target="_blank" rel="noopener noreferrer" class="btn action-btn">🔗 Fuente</a>
                            <button class="btn btn-icon rounded-circle ${isFav ? 'favorite-active' : ''}" onclick="window.app.toggleFavorite('${safeId}', event)"><i class="fas fa-heart"></i></button>
                            <button class="btn btn-icon rounded-circle" onclick="window.app.shareItem('${item.link}', '${item.title.replace(/'/g, "")}', event)"><i class="fas fa-share-alt"></i></button>
                        </div>
                    </div>
                </article>
            </div>`;
        }).join('');

        if (append) document.getElementById('content-grid').insertAdjacentHTML('beforeend', cardsHTML);
        else container.innerHTML = html + cardsHTML + `</div>`;
    },

    openDetail: async function(uniqueId) {
        const item = state.cache.get(uniqueId);
        if(!item) return;

        const container = document.getElementById('news-container');
        const t = TRANSLATIONS[state.lang];
        container.innerHTML = `
            <div class="fade-in">
                <button class="btn btn-outline-secondary mb-4" onclick="window.app.route('${state.currentCategory}')">${t.back}</button>
                <div class="row justify-content-center">
                    <div class="col-lg-9">
                        <h1 class="display-5 fw-bold mb-3">${item.title}</h1>
                        <img src="${item.img || FALLBACK_IMGS[0]}" class="img-fluid rounded-3 w-100 mb-4 shadow" style="max-height:500px; object-fit:cover;">
                        
                        <div class="d-grid gap-2 mb-4">
                            <a href="${item.link}" target="_blank" class="btn btn-primary btn-lg w-100">
                                <i class="fas fa-external-link-alt me-2"></i> Leer noticia completa en la web oficial
                            </a>
                        </div>

                        <div id="ai-box" class="ai-box p-3 border border-info rounded-3 mb-4 bg-info-subtle">
                            <h5 class="fw-bold text-info-emphasis">🤖 Resumen IA:</h5>
                            <p class="mb-0">⚠️ <strong>Función en construcción</strong> - Acceso restringido para planes de pago y suscriptores Premium.</p>
                        </div>
                        
                        <div class="detail-content bg-body-tertiary p-4 rounded-3 text-justify">
                            <p class="lead fw-bold">📝 Extracto del artículo:</p>
                            <p style="text-align: justify; line-height: 1.6;">${item.content || item.desc || 'Contenido no disponible'}</p>
                        </div>
                    </div>
                </div>
            </div>`;
    },

    generateAISummary: function() {
        alert("Esta función está actualmente en mantenimiento y requiere una suscripción activa.");
    },
    
    showLoader: function() { document.getElementById('news-container').innerHTML = `<div class="d-flex justify-content-center py-5"><div class="spinner-border text-info"></div></div>`; },
    showError: function(msg) { document.getElementById('news-container').innerHTML = `<h3 class="text-center mt-5 text-danger">${msg || TRANSLATIONS[state.lang].error}</h3>`; },
    resetBtn: function() {
        const btn = document.getElementById('btn-load-more');
        if (btn) {
            btn.innerHTML = `${TRANSLATIONS[state.lang].loadMore} <i class="fas fa-arrow-down ms-2"></i>`;
            btn.disabled = false;
        }
    }
};

document.addEventListener('DOMContentLoaded', () => window.app.init());


