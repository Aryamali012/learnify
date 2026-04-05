// ===== LEARNIFY — NEO-BRUTALIST APP.JS =====

const COLORS = ['red', 'blue', 'green', 'yellow'];
const CATEGORIES = ['Tutorial', 'Deep Dive', 'Crash Course', 'Workshop', 'Guide'];
const BATCH_SIZE = 5;

// Global state for shuffle
let allVideos = [];
let currentPage = 0;
let totalPages = 0;

// ===== SEARCH =====
async function searchVideos() {
  const topic = document.getElementById('searchBox').value.trim();
  if (!topic) return;

  const resultsGrid = document.getElementById('resultsGrid');
  const loader = document.getElementById('loader');
  const emptyState = document.getElementById('emptyState');
  const resultsHeader = document.getElementById('resultsHeader');
  const resultsTitle = document.getElementById('resultsTitle');

  // Show loader
  resultsGrid.innerHTML = '';
  emptyState.style.display = 'none';
  resultsHeader.style.display = 'none';
  loader.style.display = 'flex';

  try {
    const res = await fetch(`http://127.0.0.1:8000/search?topic=${encodeURIComponent(topic)}`);
    const data = await res.json();

    loader.style.display = 'none';

    if (!data.videos || data.videos.length === 0) {
      emptyState.style.display = 'flex';
      emptyState.querySelector('p').textContent = `No videos found for "${topic}". Try a different search.`;
      document.getElementById('shuffleWrap').style.display = 'none';
      return;
    }

    // Store all videos for shuffling
    allVideos = data.videos;
    currentPage = 0;
    totalPages = Math.ceil(allVideos.length / BATCH_SIZE);

    // Show results header
    resultsTitle.textContent = `Top Results for "${topic}"`;
    resultsHeader.style.display = 'flex';

    // Render first batch
    showCurrentBatch();

    // Scroll to results
    document.getElementById('results').scrollIntoView({ behavior: 'smooth', block: 'start' });

  } catch (err) {
    loader.style.display = 'none';
    emptyState.style.display = 'flex';
    emptyState.querySelector('p').textContent = 'Something went wrong. Make sure the backend is running.';
    document.getElementById('shuffleWrap').style.display = 'none';
    console.error('Search error:', err);
  }
}

// ===== SHOW CURRENT BATCH =====
function showCurrentBatch() {
  const start = currentPage * BATCH_SIZE;
  const batch = allVideos.slice(start, start + BATCH_SIZE);
  renderCards(batch);

  // Show/hide shuffle button
  const shuffleWrap = document.getElementById('shuffleWrap');
  if (totalPages > 1) {
    shuffleWrap.style.display = 'flex';
    document.getElementById('shuffleCount').textContent = `${currentPage + 1} / ${totalPages}`;
  } else {
    shuffleWrap.style.display = 'none';
  }
}

// ===== SHUFFLE =====
function shuffleVideos() {
  currentPage = (currentPage + 1) % totalPages;
  showCurrentBatch();
  document.getElementById('results').scrollIntoView({ behavior: 'smooth', block: 'start' });
}

// ===== QUICK SEARCH =====
function quickSearch(topic) {
  document.getElementById('searchBox').value = topic;
  searchVideos();
}

// ===== RENDER CARDS =====
function renderCards(videos) {
  const grid = document.getElementById('resultsGrid');
  grid.innerHTML = '';

  // Find max score for normalizing
  const maxScore = Math.max(...videos.map(v => v.score || 1));

  videos.forEach((video, index) => {
    const color = COLORS[index % COLORS.length];
    const category = CATEGORIES[index % CATEGORIES.length];
    const number = String(index + 1).padStart(2, '0');

    const card = document.createElement('div');
    card.className = 'video-card';
    card.setAttribute('data-color', color);
    card.style.animationDelay = `${index * 0.08}s`;
    card.onclick = () => window.open(video.url, '_blank');

    card.innerHTML = `
      <div class="card-thumb">
        <img src="${video.thumbnail}" alt="${escapeHtml(video.title)}" loading="lazy" />
        <span class="card-category cat-${color}">${category}</span>
        <span class="card-number">${number}</span>
      </div>
      <div class="card-body">
        <h3 class="card-title">${escapeHtml(video.title)}</h3>
        <div class="card-divider"></div>

        <div class="card-meta">
          <div class="meta-item">
            <div class="meta-icon icon-${color}">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
              </svg>
            </div>
            <span>${formatNumber(video.views)} views</span>
          </div>
          <div class="meta-item">
            <div class="meta-icon icon-${color}">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"/>
              </svg>
            </div>
            <span>${formatNumber(video.likes)} likes</span>
          </div>
        </div>

        <a class="card-cta cta-${color}" href="${video.url}" target="_blank" onclick="event.stopPropagation()">
          Watch Now
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
            <path d="M5 12h14M12 5l7 7-7 7"/>
          </svg>
        </a>
      </div>
    `;

    grid.appendChild(card);
  });
}

// ===== FORMAT NUMBER =====
function formatNumber(num) {
  if (!num) return '0';
  if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
  if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
  return num.toString();
}

// ===== ESCAPE HTML =====
function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text || '';
  return div.innerHTML;
}

// ===== FILTER =====
function setFilter(filter, btn) {
  document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  // Filter logic would go here for real categories
}

// ===== MOBILE MENU =====
function toggleMobileMenu() {
  const navLinks = document.getElementById('navLinks');
  navLinks.classList.toggle('mobile-open');
}

// ===== SCROLL TO TOP =====
function scrollToTop() {
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Show/hide scroll button
window.addEventListener('scroll', () => {
  const btn = document.getElementById('scrollTopBtn');
  if (window.scrollY > 400) {
    btn.classList.add('visible');
  } else {
    btn.classList.remove('visible');
  }
});

// ===== ENTER KEY SEARCH =====
document.addEventListener('DOMContentLoaded', () => {
  const searchBox = document.getElementById('searchBox');
  if (searchBox) {
    searchBox.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') searchVideos();
    });
  }
});