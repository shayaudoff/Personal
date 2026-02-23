/* =========================
   ADMIN PAGE — admin.js
   Password lock + Supabase
   CRUD for quotes
   ========================= */

// ─────────────────────────────────────
// !! REPLACE THESE WITH YOUR OWN !!
// supabase.com → your project → Settings → API
// ─────────────────────────────────────
const SUPABASE_URL  = 'https://lzsxfmvvgnhoktxuhffy.supabase.co';
const SUPABASE_ANON = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx6c3hmbXZ2Z25ob2t0eHVoZmZ5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjcyODEwMjQsImV4cCI6MjA4Mjg1NzAyNH0.Gx60NpGYhHSv9oHiUJtGPC-GuY8u5-hmss78o2Rxj8w';
// This key has INSERT + DELETE permissions — set up via Supabase RLS policies
// (see the setup PDF for full instructions)
// ─────────────────────────────────────

// !! CHANGE THIS TO YOUR OWN PASSWORD !!
const ADMIN_PASSWORD = '0000';
// ─────────────────────────────────────

const SESSION_KEY = 'shaya_admin_auth';

// ── Supabase helpers ──
async function dbFetch(path, options = {}) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      apikey: SUPABASE_ANON,
      Authorization: `Bearer ${SUPABASE_ANON}`,
      Prefer: 'return=representation',
      ...(options.headers || {}),
    },
  });
  if (!res.ok) {
    const err = await res.text();
    throw new Error(err || `HTTP ${res.status}`);
  }
  const text = await res.text();
  return text ? JSON.parse(text) : null;
}

async function getAllQuotes() {
  return dbFetch('quotes?select=id,text,author,created_at&order=created_at.asc');
}

async function insertQuote(text, author) {
  let ip = 'Unknown', location = 'Unknown';
  try {
    const r = await fetch('https://ipapi.co/json/');
    const d = await r.json();
    ip = d.ip || 'Unknown';
    location = [d.city, d.region, d.country_name].filter(Boolean).join(', ') || 'Unknown';
  } catch {}
  return dbFetch('quotes', {
    method: 'POST',
    body: JSON.stringify({ text, author, ip_address: ip, location }),
  });
}

async function deleteQuote(id) {
  return dbFetch(`quotes?id=eq.${id}`, {
    method: 'DELETE',
  });
}

// ── Session helpers ──
function isLoggedIn() {
  return sessionStorage.getItem(SESSION_KEY) === 'true';
}

function setLoggedIn(val) {
  if (val) {
    sessionStorage.setItem(SESSION_KEY, 'true');
  } else {
    sessionStorage.removeItem(SESSION_KEY);
  }
}

// ── Show / hide screens ──
function showDashboard() {
  document.getElementById('lockScreen').style.display   = 'none';
  document.getElementById('dashboardScreen').style.display = 'flex';
  loadQuotesList();
}

function showLockScreen() {
  document.getElementById('lockScreen').style.display   = 'flex';
  document.getElementById('dashboardScreen').style.display = 'none';
  setLoggedIn(false);
}

// ── Load & render quotes list ──
async function loadQuotesList() {
  const list  = document.getElementById('adminQuotesList');
  const count = document.getElementById('quoteCount');

  list.innerHTML = `
    <div class="admin-list-loading">
      <div class="spinner"></div>
      <span>Loading…</span>
    </div>
  `;

  try {
    const quotes = await getAllQuotes();
    count.textContent = quotes.length;
    list.innerHTML = '';

    if (quotes.length === 0) {
      list.innerHTML = `<p style="color:rgba(11,11,11,.4);font-style:italic;padding:1rem 0">No quotes yet.</p>`;
      return;
    }

    quotes.forEach((q, i) => {
      const item = document.createElement('div');
      item.className = 'admin-quote-item';
      item.style.animationDelay = `${i * 0.05}s`;
      item.setAttribute('data-id', q.id);
      item.innerHTML = `
        <div class="admin-quote-item-text">
          <em>${escapeHTML(q.text)}</em>
          <span>— ${escapeHTML(q.author)}</span>
        </div>
        <button class="admin-delete-btn" aria-label="Delete quote" data-id="${q.id}">
          ${trashIcon()}
        </button>
      `;
      list.appendChild(item);
    });

    // Attach delete listeners
    list.querySelectorAll('.admin-delete-btn').forEach(btn => {
      btn.addEventListener('click', async () => {
        if (!confirm('Delete this quote? This cannot be undone.')) return;
        const id = btn.getAttribute('data-id');
        btn.disabled = true;
        try {
          await deleteQuote(id);
          // Remove from DOM with a fade
          const item = btn.closest('.admin-quote-item');
          item.style.transition = 'opacity 0.3s, transform 0.3s';
          item.style.opacity = '0';
          item.style.transform = 'translateX(8px)';
          setTimeout(() => { item.remove(); }, 300);
          // Update count
          const current = parseInt(count.textContent || '0', 10);
          count.textContent = Math.max(0, current - 1);
        } catch (err) {
          alert('Could not delete: ' + err.message);
          btn.disabled = false;
        }
      });
    });

  } catch (err) {
    list.innerHTML = `<p style="color:#c0392b;font-size:.9rem">Could not load quotes: ${err.message}</p>`;
  }
}

// ── Escape HTML ──
function escapeHTML(str) {
  return String(str)
    .replace(/&/g,'&amp;')
    .replace(/</g,'&lt;')
    .replace(/>/g,'&gt;')
    .replace(/"/g,'&quot;')
    .replace(/'/g,'&#039;');
}

// ── SVG icons ──
function trashIcon() {
  return `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.3" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
    <polyline points="3 6 5 6 21 6"/>
    <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
    <path d="M10 11v6M14 11v6"/>
    <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
  </svg>`;
}

// ── Mobile nav ──
function initMobileNav() {
  const toggle   = document.getElementById('mobileToggle');
  const panel    = document.getElementById('sidePanel');
  const closeBtn = document.getElementById('closePanel');
  const open  = () => { panel?.classList.add('open'); toggle?.classList.add('open'); document.body.style.overflow = 'hidden'; };
  const close = () => { panel?.classList.remove('open'); toggle?.classList.remove('open'); document.body.style.overflow = ''; };
  toggle?.addEventListener('click', open);
  closeBtn?.addEventListener('click', close);
  document.addEventListener('click', e => {
    if (panel?.classList.contains('open') && !panel.contains(e.target) && !toggle?.contains(e.target)) close();
  });
}

// ── Init ──
document.addEventListener('DOMContentLoaded', () => {
  initMobileNav();

  // Check existing session
  if (isLoggedIn()) {
    showDashboard();
  }

  // ── Lock screen: unlock button ──
  const unlockBtn      = document.getElementById('unlockBtn');
  const passwordInput  = document.getElementById('passwordInput');
  const lockError      = document.getElementById('lockError');

  function attemptUnlock() {
    const val = passwordInput.value;
    if (val === ADMIN_PASSWORD) {
      lockError.textContent = '';
      setLoggedIn(true);
      showDashboard();
    } else {
      lockError.textContent = 'Incorrect password. Try again.';
      passwordInput.value = '';
      passwordInput.focus();
      // Shake animation
      passwordInput.style.animation = 'none';
      passwordInput.offsetHeight; // reflow
      passwordInput.style.animation = 'shake 0.4s ease';
    }
  }

  unlockBtn?.addEventListener('click', attemptUnlock);
  passwordInput?.addEventListener('keydown', e => {
    if (e.key === 'Enter') attemptUnlock();
  });

  // ── Dashboard: logout ──
  document.getElementById('logoutBtn')?.addEventListener('click', () => {
    showLockScreen();
  });

  // ── Dashboard: add quote ──
  const addBtn      = document.getElementById('addQuoteBtn');
  const textInput   = document.getElementById('quoteText');
  const authorInput = document.getElementById('quoteAuthor');
  const formError   = document.getElementById('formError');
  const formSuccess = document.getElementById('formSuccess');

  addBtn?.addEventListener('click', async () => {
    formError.textContent   = '';
    formSuccess.textContent = '';

    const text   = textInput.value.trim();
    const author = authorInput.value.trim();

    if (!text)   { formError.textContent = 'Please enter the quote text.'; return; }
    if (!author) { formError.textContent = 'Please enter the author name.'; return; }

    addBtn.disabled = true;
    addBtn.innerHTML = `<div class="spinner" style="width:18px;height:18px;border-width:2px"></div> Adding…`;

    try {
      await insertQuote(text, author);
      textInput.value   = '';
      authorInput.value = '';
      formSuccess.textContent = '✓ Quote added successfully!';
      setTimeout(() => { formSuccess.textContent = ''; }, 3500);
      // Refresh the list
      loadQuotesList();
    } catch (err) {
      formError.textContent = 'Error adding quote: ' + err.message;
    } finally {
      addBtn.disabled = false;
      addBtn.innerHTML = `
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
          <line x1="12" y1="5" x2="12" y2="19"/>
          <line x1="5" y1="12" x2="19" y2="12"/>
        </svg>
        Add Quote
      `;
    }
  });
});