// MusiGroove - JavaScript

const MOODS = ["Happy", "Chill", "Sad", "Energetic", "Romantic", "Focus"];
const GENRES = ["Pop", "Hip-Hop", "R&B", "Rock", "Indie", "EDM", "Jazz", "Classical", "Lo-fi"];
const ENERGY = ["Low", "Medium", "High"];

const TRACKS = [
  { id: 1, title: "Neon Skies", artist: "Luna Nova", genres: ["Indie","Pop"], mood: "Chill", energy: "Low", cover:"🌌", duration: 194 },
  { id: 2, title: "Heartbeat High", artist: "PulseWave", genres: ["EDM"], mood: "Energetic", energy: "High", cover:"💓", duration: 212 },
  { id: 3, title: "Coffee & Rain", artist: "Soft Static", genres: ["Lo-fi","Jazz"], mood: "Focus", energy: "Low", cover:"☕", duration: 168 },
  { id: 4, title: "Afterglow", artist: "Midnight Talk", genres: ["R&B"], mood: "Romantic", energy: "Medium", cover:"✨", duration: 205 },
  { id: 5, title: "Paper Planes", artist: "Sunday Drive", genres: ["Indie","Rock"], mood: "Happy", energy: "Medium", cover:"🛩️", duration: 199 },
  { id: 6, title: "Blue Window", artist: "Echo Harbor", genres: ["Rock"], mood: "Sad", energy: "Medium", cover:"🪟", duration: 231 },
  { id: 7, title: "City Lights", artist: "Violet Loop", genres: ["Pop"], mood: "Happy", energy: "High", cover:"🌃", duration: 188 },
  { id: 8, title: "Monochrome", artist: "Glass & Grain", genres: ["Classical"], mood: "Focus", energy: "Low", cover:"🎼", duration: 240 },
  { id: 9, title: "Velvet Night", artist: "Noir Bloom", genres: ["R&B","Jazz"], mood: "Romantic", energy: "Low", cover:"🌙", duration: 210 },
  { id: 10, title: "Run Wild", artist: "Street Circuit", genres: ["Hip-Hop"], mood: "Energetic", energy: "High", cover:"🏃", duration: 176 },
];

const BLOG_POSTS = [
  {
    id: 1,
    title: "Soundtrack to a Better Day",
    date: "2025-10-01",
    cover: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=1200&auto=format&fit=crop",
    excerpt: "Simple ways to use music to nudge your mood toward calm or uplift.",
    tags: ["Mood", "Getting Started"],
    content: [
      "Music is a fast, friendly way to shift how you feel. Try two quick playlists: one to ground you and one to lift you.",
      "Tip: Keep the first track familiar—your brain recognizes it and settles faster.",
      "https://images.unsplash.com/photo-1510915228340-29c85a43dcfe?q=80&w=1200&auto=format&fit=crop"
    ]
  },
  {
    id: 2,
    title: "Focus Flow: Find Your Deep Work Sound",
    date: "2025-10-05",
    cover: "https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?q=80&w=1200&auto=format&fit=crop",
    excerpt: "Lo‑fi, classical, and ambient textures that help you sink into flow.",
    tags: ["Focus", "Lo‑fi", "Classical"],
    content: [
      "If words distract you, try instrumental: lo‑fi beats, soft piano, or strings.",
      "Use 45–60 minute sessions; pause the music during breaks to reset your attention.",
      "https://images.unsplash.com/photo-1507838153414-b86b8e33be94?q=80&w=1200&auto=format&fit=crop"
    ]
  },
  {
    id: 3,
    title: "Move to the Beat",
    date: "2025-10-12",
    cover: "https://images.unsplash.com/photo-1552674605-db6ffd4facb5?q=80&w=1200&auto=format&fit=crop",
    excerpt: "High‑energy tracks to fuel a quick walk, lift, or room dance.",
    tags: ["Energy", "Workout"],
    content: [
      "Pick 3 songs that make you want to move. Start easy, build pace, finish with a celebration track.",
      "Short on time? Two songs are enough to wake up your body and mood.",
      "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?q=80&w=1200&auto=format&fit=crop"
    ]
  },
  {
    id: 4,
    title: "Wind‑Down Rituals",
    date: "2025-10-20",
    cover: "https://images.unsplash.com/photo-1505483531331-85b78802c4f9?q=80&w=1200&auto=format&fit=crop",
    excerpt: "Gentle sounds to help you de‑stress and prep for sleep.",
    tags: ["Sleep", "Calm"],
    content: [
      "Try a 10‑minute slow set: soft pads, acoustic guitar, or nature textures.",
      "Lower volume gradually and dim the lights—teach your body it's time to rest.",
      "https://images.unsplash.com/photo-1545569341-9eb8b30979d9?q=80&w=1200&auto=format&fit=crop"
    ]
  }
];

const state = {
  prefs: { mood: "Happy", genres: ["Pop"] },
  filters: { mood: new Set(), genre: new Set(), energy: new Set(), q: "" },
  queue: [],
  nowPlaying: null,
  playlists: []
};

function $(sel) { return document.querySelector(sel); }
function $all(sel) { return [...document.querySelectorAll(sel)]; }
function escapeHtml(s) { 
  return String(s).replace(/[&<>"']/g, m => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":"&#39;"}[m])); 
}
function formatDuration(s) { 
  const m = Math.floor(s/60), r = s%60; 
  return `${m}:${String(r).padStart(2,"0")}`; 
}
function formatDate(iso) {
  try {
    const d = new Date(iso);
    return d.toLocaleDateString(undefined,{year:"numeric", month:"short", day:"numeric"});
  } catch { return iso; }
}

// TAB NAVIGATION
function showTab(tabName) {
  $all(".tab-btn").forEach(btn => {
    btn.classList.toggle("active", btn.dataset.tab === tabName);
  });
  $all(".tab").forEach(sec => {
    sec.classList.toggle("active", sec.id === tabName);
  });
  window.scrollTo(0, 0);
}

// BURGER MENU
function initBurgerMenu() {
  const burger = $("#burger");
  const nav = $("#main-nav");
  
  burger.addEventListener("click", () => {
    const isOpen = nav.classList.toggle("open");
    burger.setAttribute("aria-expanded", String(isOpen));
    burger.textContent = isOpen ? "✕" : "☰";
  });

  $all(".tab-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      if (window.innerWidth <= 768) {
        nav.classList.remove("open");
        burger.setAttribute("aria-expanded", "false");
        burger.textContent = "☰";
      }
    });
  });
}

// TABS
function initTabs() {
  $all(".tab-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      showTab(btn.dataset.tab);
    });
  });
}

// FILTERS
function renderChips(container, items, type, selected = []) {
  container.innerHTML = "";
  items.forEach(item => {
    const btn = document.createElement("button");
    btn.className = "chip";
    btn.type = "button";
    btn.textContent = item;
    btn.setAttribute("aria-pressed", selected.includes(item) ? "true" : "false");
    if (selected.includes(item)) btn.classList.add("active");
    
    btn.addEventListener("click", () => {
      const isActive = btn.classList.toggle("active");
      btn.setAttribute("aria-pressed", String(isActive));
      
      if (type === "mood") {
        $all(".chip", container).forEach(c => {
          if (c !== btn) {
            c.classList.remove("active");
            c.setAttribute("aria-pressed", "false");
          }
        });
        state.filters.mood.clear();
        if (isActive) state.filters.mood.add(item);
      } else if (type === "genre") {
        if (isActive) {
          if (state.filters.genre.size >= 3) {
            btn.classList.remove("active");
            btn.setAttribute("aria-pressed", "false");
            return;
          }
          state.filters.genre.add(item);
        } else {
          state.filters.genre.delete(item);
        }
      } else if (type === "energy") {
        $all(".chip", container).forEach(c => {
          if (c !== btn) {
            c.classList.remove("active");
            c.setAttribute("aria-pressed", "false");
          }
        });
        state.filters.energy.clear();
        if (isActive) state.filters.energy.add(item);
      }
      
      renderResults();
    });
    
    container.appendChild(btn);
  });
}

function initFilters() {
  const moodDefaults = state.prefs.mood ? [state.prefs.mood] : [];
  const genreDefaults = state.prefs.genres || [];
  
  state.filters.mood = new Set(moodDefaults);
  state.filters.genre = new Set(genreDefaults);
  
  renderChips($("#mood-chips"), MOODS, "mood", moodDefaults);
  renderChips($("#genre-chips"), GENRES, "genre", genreDefaults);
  renderChips($("#energy-chips"), ENERGY, "energy");
}

// SEARCH
function initSearch() {
  $("#search").addEventListener("input", (e) => {
    state.filters.q = e.target.value;
    renderResults();
  });
}

// RESULTS
function renderResults() {
  const q = state.filters.q.toLowerCase().trim();
  const moodSel = [...state.filters.mood];
  const genreSel = [...state.filters.genre];
  const energySel = [...state.filters.energy];

  const results = TRACKS
    .filter(t => !q || 
      t.title.toLowerCase().includes(q) || 
      t.artist.toLowerCase().includes(q) ||
      t.genres.some(g => g.toLowerCase().includes(q)) || 
      t.mood.toLowerCase().includes(q))
    .filter(t => !moodSel.length || moodSel.includes(t.mood))
    .filter(t => !genreSel.length || t.genres.some(g => genreSel.includes(g)))
    .filter(t => !energySel.length || energySel.includes(t.energy));

  const container = $("#results");
  container.innerHTML = "";
  
  results.forEach(track => {
    const card = document.createElement("article");
    card.className = "card";
    card.innerHTML = `
      <div class="cover">${track.cover || "🎵"}</div>
      <div class="meta">
        <div class="title">${escapeHtml(track.title)}</div>
        <div class="sub">${escapeHtml(track.artist)} • ${track.genres.join(", ")} • ${track.mood} • ${track.energy} • ${formatDuration(track.duration)}</div>
        <div class="row">
          <button class="play-btn">Play</button>
          <button class="secondary queue-btn">+ Queue</button>
        </div>
      </div>
    `;
    
    card.querySelector(".play-btn").addEventListener("click", () => {
      state.nowPlaying = track;
      $("#now-playing").textContent = `Now Playing: ${track.title} — ${track.artist}`;
      if (!state.queue.find(t => t.id === track.id)) {
        state.queue.unshift(track);
        updateQueue();
      }
    });
    
    card.querySelector(".queue-btn").addEventListener("click", () => {
      if (!state.queue.find(t => t.id === track.id)) {
        state.queue.push(track);
        updateQueue();
      }
    });
    
    container.appendChild(card);
  });
}

// PLAYLISTS
function renderPlaylists() {
  const list = $("#playlist-list");
  list.innerHTML = "";
  
  if (!state.playlists.length) {
    const empty = document.createElement("div");
    empty.className = "empty-state";
    empty.textContent = "No playlists yet. Create one and add tracks from Discover.";
    list.appendChild(empty);
    return;
  }
  
  state.playlists.forEach((pl, idx) => {
    const card = document.createElement("div");
    card.className = "card";
    const trackTitles = pl.tracks.map(id => TRACKS.find(t => t.id === id)?.title).filter(Boolean);
    
    card.innerHTML = `
      <div class="meta">
        <div class="title">${escapeHtml(pl.name)}</div>
        <div class="sub">${pl.tracks.length} tracks</div>
        <div class="row">
          <button class="play-btn">Play All</button>
          <button class="secondary delete-btn">Delete</button>
        </div>
        <div class="sub" style="margin-top: 8px;">${trackTitles.join(" • ") || "No tracks yet."}</div>
      </div>
    `;
    
    card.querySelector(".play-btn").addEventListener("click", () => {
      if (pl.tracks.length) {
        state.queue = pl.tracks.map(id => TRACKS.find(t => t.id === id)).filter(Boolean);
        if (state.queue.length) {
          state.nowPlaying = state.queue[0];
          $("#now-playing").textContent = `Now Playing: ${state.queue[0].title} — ${state.queue[0].artist}`;
          updateQueue();
        }
      }
    });
    
    card.querySelector(".delete-btn").addEventListener("click", () => {
      if (confirm(`Delete playlist "${pl.name}"?`)) {
        state.playlists.splice(idx, 1);
        renderPlaylists();
      }
    });
    
    list.appendChild(card);
  });
}

function initPlaylists() {
  $("#create-playlist").addEventListener("submit", (e) => {
    e.preventDefault();
    const name = $("#pl-name").value.trim() || `Playlist ${state.playlists.length + 1}`;
    state.playlists.push({ name, tracks: [] });
    $("#pl-name").value = "";
    renderPlaylists();
  });
}

// BLOG
function renderBlog() {
  const grid = $("#blog-grid");
  grid.innerHTML = "";
  
  BLOG_POSTS.forEach(post => {
    const card = document.createElement("article");
    card.className = "post-card";
    card.innerHTML = `
      <img class="thumb" src="${post.cover}" alt="${escapeHtml(post.title)}" loading="lazy" />
      <div class="info">
        <div class="title">${escapeHtml(post.title)}</div>
        <div class="excerpt">${escapeHtml(post.excerpt)}</div>
        <div class="meta">${formatDate(post.date)}</div>
        <div class="tags">${post.tags.map(t => `<span class="tag">${escapeHtml(t)}</span>`).join("")}</div>
      </div>
    `;
    
    card.addEventListener("click", () => openPost(post.id));
    grid.appendChild(card);
  });
}

// HOME PAGE BLOG PREVIEW
function renderHomeBlogPreview() {
  const grid = $("#home-blog-preview");
  if (!grid) return;
  grid.innerHTML = "";
  
  BLOG_POSTS.slice(0, 3).forEach(post => {
    const card = document.createElement("article");
    card.className = "preview-card";
    card.innerHTML = `
      <img src="${post.cover}" alt="${escapeHtml(post.title)}" loading="lazy" />
      <div class="preview-card-content">
        <h3>${escapeHtml(post.title)}</h3>
        <p>${escapeHtml(post.excerpt)}</p>
      </div>
    `;
    card.addEventListener("click", () => openPost(post.id));
    grid.appendChild(card);
  });
}

function openPost(id) {
  const post = BLOG_POSTS.find(p => p.id === id);
  if (!post) return;
  
  const dlg = $("#post-viewer");
  $("#post-title").textContent = post.title;
  $("#post-meta").textContent = formatDate(post.date);
  $("#post-cover").src = post.cover;
  $("#post-cover").alt = post.title;
  
  const body = $("#post-body");
  body.innerHTML = post.content.map(p => {
    const trimmed = p.trim();
    if (trimmed.startsWith("http")) {
      return `<img src="${trimmed}" alt="Blog content image" loading="lazy" />`;
    }
    return `<p>${escapeHtml(trimmed)}</p>`;
  }).join("");
  
  $("#post-tags").innerHTML = post.tags.map(t => `<span class="tag">${escapeHtml(t)}</span>`).join("");
  
  if (typeof dlg.showModal === "function") dlg.showModal();
  else dlg.setAttribute("open", "");
}

$("#close-post").addEventListener("click", () => {
  const dlg = $("#post-viewer");
  if (typeof dlg.close === "function") dlg.close();
  else dlg.removeAttribute("open");
});

// PROFILE
function renderPrefs() {
  renderChipSet($("#pref-mood"), MOODS, state.prefs.mood, (val) => {
    state.prefs.mood = val;
    initFilters();
    renderResults();
  }, true);
  
  renderChipSet($("#pref-genre"), GENRES, state.prefs.genres || [], (vals) => {
    state.prefs.genres = vals.slice(0, 3);
    initFilters();
    renderResults();
  }, false, 3);
}

function renderChipSet(container, items, selected, onChange, single = false, max = Infinity) {
  container.innerHTML = "";
  const selSet = new Set(Array.isArray(selected) ? selected : [selected]);
  
  items.forEach(item => {
    const btn = document.createElement("button");
    btn.className = "chip-toggle";
    btn.type = "button";
    btn.textContent = item;
    const active = selSet.has(item);
    btn.setAttribute("aria-pressed", String(active));
    
    btn.addEventListener("click", () => {
      if (single) {
        $all(".chip-toggle", container).forEach(b => b.setAttribute("aria-pressed", "false"));
        btn.setAttribute("aria-pressed", "true");
        onChange(item);
      } else {
        const current = $all(".chip-toggle[aria-pressed='true']", container).map(b => b.textContent);
        if (btn.getAttribute("aria-pressed") === "true") {
          btn.setAttribute("aria-pressed", "false");
          onChange(current.filter(v => v !== item));
        } else {
          if (current.length >= max) return;
          btn.setAttribute("aria-pressed", "true");
          onChange([...current, item]);
        }
      }
    });
    
    container.appendChild(btn);
  });
}

$("#prefs-form").addEventListener("submit", (e) => {
  e.preventDefault();
  alert("Preferences saved!");
});

// NEWSLETTER
$("#newsletter-form").addEventListener("submit", (e) => {
  e.preventDefault();
  const email = e.target.querySelector("input[type='email']").value;
  alert(`Thanks for subscribing with: ${email}`);
  e.target.reset();
});

// QUEUE
function updateQueue() {
  const list = $("#queue-list");
  list.innerHTML = "";
  state.queue.forEach(t => {
    const li = document.createElement("li");
    li.textContent = `${t.title} — ${t.artist}`;
    list.appendChild(li);
  });
}

$("#queue-btn").addEventListener("click", () => {
  const list = $("#queue-list");
  const isHidden = list.hasAttribute("hidden");
  list.toggleAttribute("hidden", !isHidden);
});

// PLAYER
$("#play").addEventListener("click", () => {
  const btn = $("#play");
  btn.textContent = btn.textContent.includes("▶️") ? "⏸️" : "▶️";
});

$("#prev").addEventListener("click", () => alert("Previous track (mock)"));
$("#next").addEventListener("click", () => alert("Next track (mock)"));

// INIT
function init() {
  initBurgerMenu();
  initTabs();
  initFilters();
  initSearch();
  initPlaylists();
  renderResults();
  renderPlaylists();
  renderBlog();
  renderHomeBlogPreview();
  renderPrefs();
}

window.addEventListener("DOMContentLoaded", init);
