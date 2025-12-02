/* ===== MusiGroove — Integrated SPA (Discover, Playlists, Blog, Profile) ===== */
/* Beginner tips:
   - Change moods/genres in MOODS, GENRES
   - Add tracks in TRACKS
   - Edit blog posts in BLOG_POSTS
   - Recommendation weights in scoreTrack()
*/

/* ---- Config: Moods, Genres, Energy ---- */
const MOODS = ["Happy", "Chill", "Sad", "Energetic", "Romantic", "Focus"];
const GENRES = ["Pop", "Hip-Hop", "R&B", "Rock", "Indie", "EDM", "Jazz", "Classical", "Lo-fi"];
const ENERGY = ["Low", "Medium", "High"];

/* ---- Sample Catalog (mock) ---- */
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

/* ---- Blog Data (edit-friendly) ---- */
const BLOG_POSTS = [
  {
    id: 1,
    title: "Soundtrack to a Better Day",
    date: "2025-10-01",
    cover: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=1200&auto=format&fit=crop",
    excerpt: "Simple ways to use music to nudge your mood toward calm or uplift the day, week, or month.",
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
      "Use 45–60 minute sessions; pause the music during breaks to reset your attention."
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
      "Pick 5 songs that make you want to move. Start easy, build pace, finish with a celebration track and finish off strong.",
      "Short on time? Two songs are enough to wake up your body and mood."
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
      "Lower volume gradually and dim the lights—teach your body it’s time to rest."
    ]
  }
];

/* ---- App State ---- */
const state = {
  prefs: load("mg:prefs") || { mood: "Happy", genres: ["Pop"] },
  filters: { mood: new Set(), genre: new Set(), energy: new Set(), q: "" },
  queue: [],
  nowPlaying: null,
  playlists: load("mg:playlists") || []
};

/* ---- Helpers ---- */
function $(sel, root=document){ return root.querySelector(sel); }
function $all(sel, root=document){ return [...root.querySelectorAll(sel)]; }
function load(key){ try { return JSON.parse(localStorage.getItem(key)); } catch { return null; } }
function save(key, val){ localStorage.setItem(key, JSON.stringify(val)); }
function formatDuration(s){ const m = Math.floor(s/60), r = s%60; return `${m}:${String(r).padStart(2,"0")}`; }
function escapeHtml(s){ return String(s).replace(/[&<>"']/g, m => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m])); }

/* ---- Filter Chips ---- */
function renderChips(container, items, kind, {multi=true, max=Infinity, selected=[]}={}){
  container.innerHTML = "";
  items.forEach(item=>{
    const btn = document.createElement("button");
    btn.className = "chip";
    btn.type = "button";
    btn.textContent = item;

    const isSelected = selected.includes(item);
    if (isSelected){ btn.classList.add("active"); }
    btn.setAttribute("aria-pressed", String(isSelected));

    btn.addEventListener("click", ()=>{
      const pressed = btn.classList.toggle("active");
      btn.setAttribute("aria-pressed", String(pressed));
      const set = state.filters[kind];

      if (!multi){
        $all(".chip", container).forEach(c=>{
          if (c!==btn){ c.classList.remove("active"); c.setAttribute("aria-pressed","false"); }
        });
        set.clear();
      }

      if (pressed){
        if (set.size >= max){ btn.classList.remove("active"); btn.setAttribute("aria-pressed","false"); return; }
        set.add(item);
      } else set.delete(item);

      renderResults();
    });

    container.appendChild(btn);
  });
}

function renderFilterBar(){
  const moodGroup = document.querySelector('.chip-group[data-filter="mood"]');
  const genreGroup = document.querySelector('.chip-group[data-filter="genre"]');
  const energyGroup = document.querySelector('.chip-group[data-filter="energy"]');

  const moodDefault = state.prefs.mood ? [state.prefs.mood] : [];
  const genresDefault = state.prefs.genres || [];

  state.filters.mood = new Set(moodDefault);
  state.filters.genre = new Set(genresDefault);

  renderChips(moodGroup, MOODS, "mood", {multi:false, selected: moodDefault});
  renderChips(genreGroup, GENRES, "genre", {multi:true, max:3, selected: genresDefault});
  renderChips(energyGroup, ENERGY, "energy", {multi:false});
}

/* ---- Track Cards & Results ---- */
function card(track){
  const el = document.createElement("article");
  el.className = "card";
  el.innerHTML = `
    <div class="cover" aria-hidden="true">${track.cover || "🎵"}</div>
    <div class="meta">
      <div class="title">${escapeHtml(track.title)}</div>
      <div class="sub">${escapeHtml(track.artist)} • ${track.genres.join(", ")} • ${track.mood} • ${track.energy} • ${formatDuration(track.duration)}</div>
      <div class="row">
        <button class="play">Play</button>
        <button class="secondary add" title="Add to queue (Ctrl/Cmd-click to add to first playlist)">+ Queue</button>
      </div>
    </div>
  `;
  el.querySelector(".play").addEventListener("click", ()=>playTrack(track));
  el.querySelector(".add").addEventListener("click", (e)=>{
    addToQueue(track);
    // tip: Ctrl/Cmd + click also adds to first playlist if exists
    if (e.metaKey || e.ctrlKey) addToFirstPlaylist(track);
  });
  return el;
}

function scoreTrack(t, prefs){
  // Simple, tweakable rec scoring
  let score = 0;
  if (prefs.mood && t.mood === prefs.mood) score += 3;
  const gset = new Set(prefs.genres || []);
  t.genres.forEach(g => { if (gset.has(g)) score += 1; });
  return score;
}

function renderResults(){
  const q = state.filters.q.toLowerCase().trim();
  const moodSel = [...state.filters.mood];
  const genreSel = [...state.filters.genre];
  const energySel = [...state.filters.energy];

  const results = TRACKS
    .filter(t => !q || t.title.toLowerCase().includes(q) || t.artist.toLowerCase().includes(q) ||
                  t.genres.some(g=>g.toLowerCase().includes(q)) || t.mood.toLowerCase().includes(q))
    .filter(t => !moodSel.length || moodSel.includes(t.mood))
    .filter(t => !genreSel.length || t.genres.some(g=>genreSel.includes(g)))
    .filter(t => !energySel.length || energySel.includes(t.energy))
    .map(t => ({ t, s: scoreTrack(t, state.prefs) }))
    .sort((a,b)=> b.s - a.s)
    .map(x => x.t);

  const container = $("#results");
  container.innerHTML = "";
  results.forEach(t=>container.appendChild(card(t)));
}

/* ---- Player & Queue ---- */
function playTrack(track){
  state.nowPlaying = track;
  $("#now-playing").textContent = `Now Playing: ${track.title} — ${track.artist}`;
  if (!state.queue.length || state.queue[0]?.id !== track.id){
    state.queue.unshift(track);
  }
  renderQueue();
}
function addToQueue(track){
  state.queue.push(track);
  renderQueue();
}
function renderQueue(){
  const qbtn = $("#queue-btn");
  const list = $("#queue-list");
  list.innerHTML = "";
  state.queue.forEach((t)=>{
    const li = document.createElement("li");
    li.textContent = `${t.title} — ${t.artist}`;
    li.title = `${t.genres.join(", ")} • ${t.mood} • ${t.energy}`;
    list.appendChild(li);
  });
  qbtn.onclick = ()=>{
    const open = !list.hasAttribute("hidden");
    list.toggleAttribute("hidden", open);
    qbtn.setAttribute("aria-expanded", String(!open));
  };
}

/* ---- Playlists ---- */
function renderPlaylists(){
  const list = $("#playlist-list");
  list.innerHTML = "";
  if (!state.playlists.length){
    const p = document.createElement("p");
    p.textContent = "No playlists yet. Create one and add tracks from Discover.";
    list.appendChild(p);
    return;
  }
  state.playlists.forEach((pl, idx)=>{
    const div = document.createElement("div");
    div.className = "card";
    const trackTitles = pl.tracks.map(id => TRACKS.find(t=>t.id===id)?.title).filter(Boolean);
    div.innerHTML = `
      <div class="meta">
        <div class="title">${escapeHtml(pl.name)}</div>
        <div class="sub">${pl.tracks.length} tracks</div>
        <div class="row">
          playPlay</button>
          <buttonelete</button>
        </div>
        <div class="sub">${trackTitles.join(" • ") || "No tracks yet."}</div>
      </div>
    `;
    div.addEventListener("click", (e)=>{
      const action = e.target?.dataset?.action;
      if (action==="play"){
        if (pl.tracks.length){
          state.queue = pl.tracks.map(id=>TRACKS.find(t=>t.id===id)).filter(Boolean);
          if (state.queue.length) playTrack(state.queue[0]);
        }
      } else if (action==="delete"){
        if (confirm(`Delete playlist "${pl.name}"?`)){
          state.playlists.splice(idx,1);
          save("mg:playlists", state.playlists);
          renderPlaylists();
        }
      }
    });
    list.appendChild(div);
  });
}

function initCreatePlaylist(){
  $("#create-playlist").addEventListener("submit", (e)=>{
    e.preventDefault();
    const name = $("#pl-name").value.trim() || `Playlist ${state.playlists.length+1}`;
    state.playlists.push({ name, tracks: [] });
    save("mg:playlists", state.playlists);
    $("#pl-name").value = "";
    renderPlaylists();
  });
}

function addToFirstPlaylist(track){
  if (!state.playlists.length) { alert("Create a playlist first."); return; }
  state.playlists[0].tracks.push(track.id);
  save("mg:playlists", state.playlists);
  renderPlaylists();
  alert(`Added "${track.title}" to "${state.playlists[0].name}"`);
}

/* ---- Profile / Preferences ---- */
function renderChipSet(container, items, selected, onChange, opts={}){
  const { single=false, max=Infinity } = opts;
  container.innerHTML = "";
  const selSet = new Set(Array.isArray(selected)? selected : [selected]);
  items.forEach(item=>{
    const btn = document.createElement("button");
    btn.className = "chip-toggle";
    btn.type = "button";
    const active = selSet.has(item);
    btn.textContent = item;
    btn.setAttribute("aria-pressed", String(active));
    btn.addEventListener("click", ()=>{
      if (single){
        $all(".chip-toggle", container).forEach(b=>b.setAttribute("aria-pressed","false"));
        btn.setAttribute("aria-pressed","true");
        onChange(item);
      } else {
        const current = $all(".chip-toggle[aria-pressed='true']", container).map(b=>b.textContent);
        if (btn.getAttribute("aria-pressed")==="true"){
          btn.setAttribute("aria-pressed","false");
          onChange(current.filter(v=>v!==item));
        } else {
          if (current.length >= max) return;
          btn.setAttribute("aria-pressed","true");
          onChange([...current, item]);
        }
      }
    });
    container.appendChild(btn);
  });
}

function renderPrefs(){
  renderChipSet($("#pref-mood"), MOODS, state.prefs.mood, (val)=>{
    state.prefs.mood = val; save("mg:prefs", state.prefs); renderFilterBar(); renderResults();
  }, {single:true});

  renderChipSet($("#pref-genre"), GENRES, state.prefs.genres||[], (vals)=>{
    state.prefs.genres = vals.slice(0,3); save("mg:prefs", state.prefs); renderFilterBar(); renderResults();
  }, {max:3});

  $("#prefs-form").addEventListener("submit", (e)=>{
    e.preventDefault();
    alert("Preferences saved!");
  });
}

/* ---- Tabs & Search ---- */
function initTabs(){
  $all(".tab-btn").forEach(btn=>{
    btn.addEventListener("click", ()=>{
      const tab = btn.dataset.tab;
      $all(".tab-btn").forEach(b=>{ b.classList.toggle("active", b===btn); b.setAttribute("aria-pressed", String(b===btn)); });
      $all(".tab").forEach(sec=>sec.classList.toggle("active", sec.id===tab));
    });
  });
}

function initSearch(){
  $("#search").addEventListener("input", (e)=>{
    state.filters.q = e.target.value;
    renderResults();
  });
}

/* ---- Onboarding ---- */
function maybeShowOnboarding(){
  const dlg = $("#onboarding");
  if (!dlg || localStorage.getItem("mg:onboarded")) return;

  // Fill choices
  renderChipSet($("#ob-moods"), MOODS, state.prefs.mood, (val)=>{ state.prefs.mood = val; }, {single:true});
  renderChipSet($("#ob-genres"), GENRES, state.prefs.genres||[], (vals)=>{ state.prefs.genres = vals.slice(0,3); }, {max:3});

  if (typeof dlg.showModal === "function"){
    dlg.showModal();
  } else {
    dlg.setAttribute("open",""); // fallback
  }

  $("#save-onboard").addEventListener("click", ()=>{
    localStorage.setItem("mg:onboarded", "1");
    save("mg:prefs", state.prefs);
    dlg.close();
    renderFilterBar();
    renderResults();
  });
  $("#skip-onboard").addEventListener("click", ()=>{
    localStorage.setItem("mg:onboarded", "1");
  });
}

/* ---- Blog: grid & reader ---- */
function renderBlog(){
  const grid = document.getElementById("blog-grid");
  if (!grid) return;

  const frag = document.createDocumentFragment();
  BLOG_POSTS.forEach(post => {
    const card = document.createElement("article");
    card.className = "post-card";
    card.tabIndex = 0;
    card.innerHTML = `
      <{post.cover}
      <div class="info">
        <div class="title">${escapeHtml(post.title)}</div>
        <div class="excerpt">${escapeHtml(post.excerpt)}</div>
        <div class="meta">${formatBlogDate(post.date)}</div>
        <div class="tags">${post.tags.map(t=>`<span class="tag">${escapeHtml(t)}</span>`).join("")}</div>
      </div>
    `;
    card.addEventListener("click", ()=> openPost(post.id));
    card.addEventListener("keypress", (e)=>{ if (e.key === "Enter") openPost(post.id); });
    frag.appendChild(card);
  });
  grid.innerHTML = "";
  grid.appendChild(frag);

  const closeBtn = document.getElementById("close-post");
  if (closeBtn) closeBtn.onclick = closePost;
}

function formatBlogDate(iso){
  try{
    const d = new Date(iso);
    return d.toLocaleDateString(undefined,{year:"numeric", month:"short", day:"numeric"});
  } catch { return iso; }
}

function openPost(id){
  const post = BLOG_POSTS.find(p=>p.id===id);
  if (!post) return;
  const dlg = document.getElementById("post-viewer");
  if (!dlg) return;

  document.getElementById("post-title").textContent = post.title;
  document.getElementById("post-meta").textContent = formatBlogDate(post.date);

  const cover = document.getElementById("post-cover");
  cover.src = post.cover;
  cover.alt = post.title;

  const body = document.getElementById("post-body");
  body.innerHTML = post.content.map(p => {
    const trimmed = p.trim();
    if (trimmed.startsWith("<img")) return trimmed;            // allow explicit <img> HTML
    if (trimmed.startsWith("http"))  return `${trimmed}`; // treat URL as image
    return `<p>${escapeHtml(trimmed)}</p>`;
  }).join("");

  const tags = document.getElementById("post-tags");
  tags.innerHTML = post.tags.map(t=>`<span class="tag">${escapeHtml(t)}</span>`).join("");

  if (typeof dlg.showModal === "function") dlg.showModal();
  else dlg.setAttribute("open",""); // fallback
}
function closePost(){
  const dlg = document.getElementById("post-viewer");
  if (!dlg) return;
  if (typeof dlg.close === "function") dlg.close();
  else dlg.removeAttribute("open");
}

/* ---- Bootstrap ---- */
function init(){
  initTabs();
  initSearch();
  initCreatePlaylist();

  renderFilterBar();
  renderResults();
  renderPlaylists();
  renderPrefs();
  renderQueue();
  renderBlog();
  maybeShowOnboarding();

  // Player controls (mock)
  $("#play").addEventListener("click", ()=>{
    const btn = $("#play");
    btn.textContent = (btn.textContent.includes("▶️")) ? "⏸️" : "▶️";
  });
  $("#prev").addEventListener("click", ()=>alert("Previous (mock)"));
  $("#next").addEventListener("click", ()=>alert("Next (mock)"));
}

window.addEventListener("DOMContentLoaded", init);

function card(track){
  const el = document.createElement("article");
  el.className = "card";
  el.innerHTML = `
    <div class="cover" aria-hidden="${track.coverUrl ? "false" : "true"}">
      ${renderCover(track)}
    </div>
    <div class="meta">
      <div class="title">${escapeHtml(track.title)}</div>
      <div class="sub">${escapeHtml(track.artist)} • ${track.genres.join(", ")} • ${track.mood} • ${track.energy} • ${formatDuration(track.duration)}</div>
      <div class="row">
        <button class="play">Play</button>
        <button class="secondary add" title="Add to queue (Ctrl/Cmd-click to add to first playlist)">+ Queue</button>
      </div>
    </div>
  `;
  el.querySelector(".play").addEventListener("click", ()=>playTrack(track));
  el.querySelector(".add").addEventListener("click", (e)=>{
    addToQueue(track);
    if (e.metaKey || e.ctrlKey) addToFirstPlaylist(track);
  });
  return el;
}
// Add this helper near the top of your JS:
function renderCover(track){
  // Prefer explicit coverUrl (or data URI / SVG), otherwise fall back to emoji cover string.
  if (track.coverUrl) {
    const alt = track.coverAlt || `${track.title} — ${track.artist} cover art`;
    return `
      <img class="thumb" src="${track.coverUrl}"
           alt="${escapeHtml(alt)}"
           loading="lazy" decoding="ue">${track.cover || "🎵"}</span>`;
}
}
