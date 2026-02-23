/* =========================
   QUOTES PAGE — quotes.js
   Supabase live DB + offline
   localStorage cache + copy UX
   ========================= */

// ─────────────────────────────────────
// !! REPLACE THESE WITH YOUR OWN !!
// Get them from supabase.com → your project → Settings → API
// ─────────────────────────────────────
const SUPABASE_URL  = 'https://YOUR_PROJECT_ID.supabase.co';
const SUPABASE_ANON = 'YOUR_ANON_PUBLIC_KEY';
// ─────────────────────────────────────

const CACHE_KEY = 'shaya_quotes_cache_v1';

// ── Supabase fetch (no SDK needed, plain REST) ──
async function fetchQuotesFromDB() {
  const res = await fetch(
    `${SUPABASE_URL}/rest/v1/quotes?select=id,text,author,created_at&order=created_at.asc`,
    {
      headers: {
        apikey: SUPABASE_ANON,
        Authorization: `Bearer ${SUPABASE_ANON}`,
      },
    }
  );
  if (!res.ok) throw new Error(`Supabase error: ${res.status}`);
  return res.json();
}

// ── Cache helpers ──
function getCached() {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch { return null; }
}

function setCache(quotes) {
  try { localStorage.setItem(CACHE_KEY, JSON.stringify(quotes)); } catch {}
}

// ── Render quotes into the grid ──
function renderQuotes(quotes) {
  const grid = document.getElementById('quotesGrid');
  if (!grid) return;
  grid.innerHTML = '';

  if (!quotes || quotes.length === 0) {
    grid.innerHTML = `<p class="quotes-empty">No quotes yet — check back soon.</p>`;
    return;
  }

  quotes.forEach((q, i) => {
    const article = document.createElement('article');
    article.className = 'quote-card';
    // cap stagger at 10 for CSS nth-child rules
    article.style.animationDelay = `${Math.min(i, 9) * 0.06 + 0.06}s`;

    article.innerHTML = `
      <p class="quote-text">${escapeHTML(q.text)}</p>
      <p class="quote-author">— ${escapeHTML(q.author)}</p>
      <button class="copy-btn" type="button" aria-label="Copy quote">
        ${copyIcon()} Copy
      </button>
    `;

    grid.appendChild(article);
  });

  attachCopyListeners();
}

// ── Show loading spinner ──
function showLoading() {
  const grid = document.getElementById('quotesGrid');
  if (!grid) return;
  grid.innerHTML = `
    <div class="quotes-loading">
      <div class="spinner"></div>
      <span>Loading quotes…</span>
    </div>
  `;
}

// ── Show error ──
function showError(msg) {
  const grid = document.getElementById('quotesGrid');
  if (!grid) return;
  grid.innerHTML = `<p class="quotes-error">${msg}</p>`;
}

// ── Main load logic: cache-first, then live ──
async function loadQuotes() {
  const cached = getCached();

  // Show cache immediately so the page feels instant
  if (cached && cached.length > 0) {
    renderQuotes(cached);
  } else {
    showLoading();
  }

  // Then try to fetch fresh data
  if (navigator.onLine) {
    try {
      const fresh = await fetchQuotesFromDB();
      setCache(fresh);
      renderQuotes(fresh); // re-render with latest
    } catch (err) {
      console.warn('Could not fetch from Supabase:', err);
      if (!cached || cached.length === 0) {
        showError('Could not load quotes. Check your connection.');
      }
      // else: silently keep showing cache
    }
  } else {
    // Offline — cached already shown, or show message
    if (!cached || cached.length === 0) {
      showError('You\'re offline and there\'s no local cache yet. Connect to load quotes.');
    }
  }
}

// ── Copy button logic ──
function attachCopyListeners() {
  document.querySelectorAll('.copy-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const card   = btn.closest('.quote-card');
      const text   = card.querySelector('.quote-text').textContent.trim();
      const author = card.querySelector('.quote-author').textContent.trim();
      const full   = `"${text}" ${author}`;

      navigator.clipboard.writeText(full).then(() => {
        btn.innerHTML = `${checkIcon()} Copied!`;
        btn.classList.add('copied');
        setTimeout(() => {
          btn.innerHTML = `${copyIcon()} Copy`;
          btn.classList.remove('copied');
        }, 2400);
      }).catch(() => {
        // Fallback
        const ta = document.createElement('textarea');
        ta.value = full;
        Object.assign(ta.style, { position: 'fixed', opacity: '0' });
        document.body.appendChild(ta);
        ta.select();
        document.execCommand('copy');
        document.body.removeChild(ta);
        btn.innerHTML = `${checkIcon()} Copied!`;
        btn.classList.add('copied');
        setTimeout(() => {
          btn.innerHTML = `${copyIcon()} Copy`;
          btn.classList.remove('copied');
        }, 2400);
      });
    });
  });
}

// ── SVG icons ──
function copyIcon() {
  return `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.3" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>`;
}

function checkIcon() {
  return `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="20 6 9 17 4 12"/></svg>`;
}

// ── Escape HTML (prevent XSS) ──
function escapeHTML(str) {
  return String(str)
    .replace(/&/g,'&amp;')
    .replace(/</g,'&lt;')
    .replace(/>/g,'&gt;')
    .replace(/"/g,'&quot;')
    .replace(/'/g,'&#039;');
}

// ── Mobile nav (matches site pattern) ──
function initMobileNav() {
  const toggle   = document.getElementById('mobileToggle');
  const panel    = document.getElementById('sidePanel');
  const closeBtn = document.getElementById('closePanel');

  const open  = () => { panel?.classList.add('open'); toggle?.classList.add('open'); document.body.style.overflow = 'hidden'; };
  const close = () => { panel?.classList.remove('open'); toggle?.classList.remove('open'); document.body.style.overflow = ''; };

  toggle?.addEventListener('click', open);
  toggle?.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); open(); } });
  closeBtn?.addEventListener('click', close);
  document.addEventListener('click', e => {
    if (panel?.classList.contains('open') && !panel.contains(e.target) && !toggle?.contains(e.target)) close();
  });
}

// ── Refresh quotes when coming back online ──
window.addEventListener('online', () => {
  console.log('Back online — refreshing quotes…');
  loadQuotes();
});

// ── Init ──
document.addEventListener('DOMContentLoaded', () => {
  initMobileNav();
  loadQuotes();
});