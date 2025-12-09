/**
 * =======================================================
 * 1. Data Definitions
 * =======================================================
 */

const MOODS = ["Happy", "Chill", "Sad", "Energetic", "Romantic", "Focus"];
const GENRES = ["Pop", "Hip-Hop", "R&B", "Rock", "Indie", "EDM", "Jazz", "Classical", "Lo-fi"];
const ENERGY = ["Low", "Medium", "High"];

// Dummy data for tracks (a full list of 15 tracks)
const TRACKS = [
  { id: 1, title: "Neon Skies", artist: "Luna Nova", genres: ["Indie", "Pop"], mood: "Chill", energy: "Low", cover: "🌌", duration: 194 },
  { id: 2, title: "Heartbeat High", artist: "PulseWave", genres: ["EDM"], mood: "Energetic", energy: "High", cover: "⚡", duration: 220 },
  { id: 3, title: "Quiet Thoughts", artist: "AeroFlow", genres: ["Lo-fi", "Jazz"], mood: "Focus", energy: "Low", cover: "🌧️", duration: 180 },
  { id: 4, title: "Sunset Drive", artist: "The Groovers", genres: ["Funk", "R&B"], mood: "Happy", energy: "Medium", cover: "🌞", duration: 245 },
  { id: 5, title: "Blue Rain", artist: "Crysalis", genres: ["Classical", "Rock"], mood: "Sad", energy: "Medium", cover: "💧", duration: 280 },
  { id: 6, title: "Midnight Waltz", artist: "ValenTino", genres: ["Pop"], mood: "Romantic", energy: "Medium", cover: "🌹", duration: 210 },
  { id: 7, title: "Code Breaker", artist: "SynthWave", genres: ["EDM"], mood: "Focus", energy: "High", cover: "💾", duration: 190 },
  { id: 8, title: "Echo Chamber", artist: "Silent Muse", genres: ["Indie"], mood: "Chill", energy: "Low", cover: "⛰️", duration: 175 },
  { id: 9, title: "Friday Fire", artist: "J-Roc", genres: ["Hip-Hop"], mood: "Energetic", energy: "High", cover: "🔥", duration: 155 },
  { id: 10, title: "The Planner", artist: "Study Beats Co.", genres: ["Lo-fi"], mood: "Focus", energy: "Low", cover: "☕", duration: 205 },
  { id: 11, title: "First Kiss", artist: "Soft Tones", genres: ["R&B"], mood: "Romantic", energy: "Medium", cover: "💖", duration: 230 },
  { id: 12, title: "Urban Pulse", artist: "City Lights", genres: ["Pop"], mood: "Happy", energy: "Medium", cover: "🏙️", duration: 188 },
  { id: 13, title: "Empty Pages", artist: "The Poets", genres: ["Rock"], mood: "Sad", energy: "Medium", cover: "🖤", duration: 260 },
  { id: 14, title: "Joyride", artist: "SunnyDayz", genres: ["Pop", "EDM"], mood: "Happy", energy: "High", cover: "🎉", duration: 165 },
  { id: 15, title: "Deep Dive", artist: "Mindstream", genres: ["Classical"], mood: "Focus", energy: "Low", cover: "🧠", duration: 300 },
];

const BLOG_POSTS = [
  { id: 1, title: "The Science of Flow State: Music for Focus", tags: ["Science", "Focus", "Productivity"], cover: "🧠" },
  { id: 2, title: "Decoding Genres: What Makes Music Happy?", tags: ["Pop", "Happy", "Theory"], cover: "🎶" },
  { id: 3, title: "The Therapeutic Power of Lo-fi and Chill Beats", tags: ["Wellness", "Chill", "Lo-fi"], cover: "🧘" },
];

let currentTab = 'home';
let currentTrack = null;
let queue = [];

/**
 * =======================================================
 * 2. Navigation and Tab Switching
 * =======================================================
 */

// Function to handle tab switching
window.showTab = function(tabId) {
  // 1. Hide all tab content
  document.querySelectorAll('.tab').forEach(tab => {
    tab.classList.remove('active');
  });

  // 2. Show the requested tab content
  const newTab = document.getElementById(tabId);
  if (newTab) {
    newTab.classList.add('active');
    currentTab = tabId;

    // 3. Update the navigation buttons' active state
    document.querySelectorAll('.tab-btn').forEach(btn => {
      btn.classList.remove('active');
      if (btn.getAttribute('data-tab') === tabId) {
        btn.classList.add('active');
      }
    });
    
    // 4. Close the mobile menu if it's open
    document.getElementById('main-nav').classList.remove('open');
    document.getElementById('burger').setAttribute('aria-expanded', 'false');

    // 5. Scroll to the top of the main content
    document.getElementById('app').scrollTo(0, 0);

    // 6. Special actions on tab load
    if (tabId === 'discover') renderDiscoverView(TRACKS);
    if (tabId === 'blog') renderBlogView();
    if (tabId === 'my-playlists') renderPlaylists();
  }
};

// Event listeners for navigation buttons
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.tab-btn').forEach(button => {
    button.addEventListener('click', (event) => {
      const tabId = event.target.getAttribute('data-tab');
      if (tabId) {
        showTab(tabId);
      }
    });
  });

  // Event listener for the Burger Menu button
  const burgerBtn = document.getElementById('burger');
  const mainNav = document.getElementById('main-nav');

  burgerBtn.addEventListener('click', () => {
    const isOpen = mainNav.classList.toggle('open');
    burgerBtn.setAttribute('aria-expanded', isOpen);
  });
  
  // Initialize the first view
  showTab(currentTab);
  
  // Initial rendering of feature components
  renderFilters();
  renderBlogPreview();
});


/**
 * =======================================================
 * 3. Discover Page Functionality
 * (Rendering of Chips and Cards)
 * =======================================================
 */

function createChip(label, group) {
  const chip = document.createElement('button');
  chip.classList.add('chip');
  chip.textContent = label;
  chip.setAttribute('role', 'button');
  chip.setAttribute('aria-pressed', 'false');
  chip.dataset.label = label;
  chip.dataset.group = group;
  
  chip.addEventListener('click', function() {
    const isActive = this.getAttribute('aria-pressed') === 'true';
    // Simple toggle logic for this example
    this.setAttribute('aria-pressed', String(!isActive));
    this.classList.toggle('active');
    
    // Rerender tracks based on selection (simplified)
    renderDiscoverView(filterTracks());
  });
  return chip;
}

function renderFilters() {
  const moodContainer = document.getElementById('mood-chips');
  const genreContainer = document.getElementById('genre-chips');
  const energyContainer = document.getElementById('energy-chips');
  
  // Render Mood Chips
  MOODS.forEach(mood => moodContainer.appendChild(createChip(mood, 'mood')));
  
  // Render Genre Chips
  GENRES.forEach(genre => genreContainer.appendChild(createChip(genre, 'genre')));
  
  // Render Energy Chips
  ENERGY.forEach(energy => energyContainer.appendChild(createChip(energy, 'energy')));

  // Render Preferences Chips (using a simplified version of the main chips)
  const prefMoodContainer = document.getElementById('pref-mood');
  const prefGenreContainer = document.getElementById('pref-genre');
  
  MOODS.forEach(mood => {
    const chip = createChip(mood, 'pref-mood');
    chip.setAttribute('role', 'radio');
    chip.setAttribute('aria-checked', 'false');
    prefMoodContainer.appendChild(chip);
  });
  
  GENRES.forEach(genre => {
    const chip = createChip(genre, 'pref-genre');
    chip.setAttribute('role', 'checkbox');
    chip.setAttribute('aria-checked', 'false');
    prefGenreContainer.appendChild(chip);
  });
}

function renderDiscoverView(tracks) {
  const resultsContainer = document.getElementById('results');
  resultsContainer.innerHTML = ''; // Clear existing results
  
  if (tracks.length === 0) {
    resultsContainer.innerHTML = '<div class="empty-state">No tracks found matching your selection. Try adjusting your filters!</div>';
    return;
  }
  
  tracks.forEach(track => {
    const card = document.createElement('div');
    card.classList.add('card');
    card.innerHTML = `
      <div class="cover">${track.cover}</div>
      <div class="meta">
        <div class="title">${track.title}</div>
        <div class="sub">${track.artist} (${track.duration}s)</div>
        <div class="row">
          <button data-track-id="${track.id}" class="play-btn">▶️ Play</button>
          <button data-track-id="${track.id}" class="secondary queue-btn">Queue</button>
        </div>
      </div>
    `;
    
    // Add event listeners for the player buttons
    card.querySelector('.play-btn').addEventListener('click', (e) => playTrack(track));
    card.querySelector('.queue-btn').addEventListener('click', (e) => addToQueue(track));
    
    resultsContainer.appendChild(card);
  });
}

// Simplified filtering function for the discover view
function filterTracks() {
  const activeMoods = Array.from(document.getElementById('mood-chips').querySelectorAll('.active'))
    .map(chip => chip.dataset.label);
  const activeGenres = Array.from(document.getElementById('genre-chips').querySelectorAll('.active'))
    .map(chip => chip.dataset.label);
  const activeEnergy = Array.from(document.getElementById('energy-chips').querySelectorAll('.active'))
    .map(chip => chip.dataset.label);

  return TRACKS.filter(track => {
    const moodMatch = activeMoods.length === 0 || activeMoods.includes(track.mood);
    const genreMatch = activeGenres.length === 0 || track.genres.some(g => activeGenres.includes(g));
    const energyMatch = activeEnergy.length === 0 || activeEnergy.includes(track.energy);
    
    // Search input filtering (basic title/artist search)
    const searchTerm = document.getElementById('search').value.toLowerCase();
    const searchMatch = !searchTerm || 
                        track.title.toLowerCase().includes(searchTerm) || 
                        track.artist.toLowerCase().includes(searchTerm);

    return moodMatch && genreMatch && energyMatch && searchMatch;
  });
}

document.getElementById('search').addEventListener('input', () => {
    renderDiscoverView(filterTracks());
});

/**
 * =======================================================
 * 4. Blog and Other Views (Rendering)
 * =======================================================
 */

function renderBlogPreview() {
  const container = document.getElementById('home-blog-preview');
  container.innerHTML = '';
  
  BLOG_POSTS.slice(0, 3).forEach(post => {
    const card = document.createElement('div');
    card.classList.add('preview-card');
    card.dataset.postId = post.id;
    card.addEventListener('click', () => viewPost(post));
    card.innerHTML = `
      <img src="https://picsum.photos/400/180?random=${post.id}" alt="Post cover image" />
      <div class="preview-card-content">
        <h3>${post.title}</h3>
        <div class="tags">${post.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}</div>
      </div>
    `;
    container.appendChild(card);
  });
}

function renderBlogView() {
  const container = document.getElementById('blog-grid');
  container.innerHTML = '';

  BLOG_POSTS.forEach(post => {
    const card = document.createElement('div');
    card.classList.add('post-card');
    card.dataset.postId = post.id;
    card.addEventListener('click', () => viewPost(post));
    card.innerHTML = `
      <img class="thumb" src="https://picsum.photos/400/200?random=${post.id}" alt="Post thumbnail" />
      <div class="info">
        <div class="title">${post.title}</div>
        <p class="excerpt">A brief introduction to the topic of ${post.title.toLowerCase()}...</p>
        <div class="meta">5 min read • Jan 2025</div>
        <div class="tags">${post.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}</div>
      </div>
    `;
    container.appendChild(card);
  });
}

function viewPost(post) {
  const viewer = document.getElementById('post-viewer');
  
  document.getElementById('post-cover').src = `https://picsum.photos/900/400?random=${post.id}`;
  document.getElementById('post-title').textContent = post.title;
  document.getElementById('post-meta').textContent = `5 min read • Jan 2025 • By MusiGroove Team`;
  document.getElementById('post-tags').innerHTML = post.tags.map(tag => `<span class="tag">${tag}</span>`).join('');
  
  // Dummy body content for demonstration
  document.getElementById('post-body').innerHTML = `
    <p>Music is a fundamental part of the human experience, and its impact on the mind is profound. 
    The study of ${post.title.toLowerCase()} reveals how auditory stimuli can dramatically alter our cognitive and emotional states.</p>
    <img src="https://picsum.photos/600/300?random=${post.id + 100}" alt="Related concept image" />
    <p>When you listen to music, your brain releases neurotransmitters like dopamine, which creates feelings of pleasure and reward.
    This is especially true for the genres and moods discussed here. For instance, **${post.tags[0]}** music is often characterized by 
    a fast tempo and major keys, which are universally perceived as upbeat and positive.</p>
    <p>Ultimately, choosing the right soundtrack is key to optimizing your day. Use our mood filters to find your flow!</p>
  `;

  document.getElementById('close-post').onclick = () => viewer.close();
  viewer.showModal();
}

// Dummy Playlist Rendering (as a basic list)
function renderPlaylists() {
    const list = document.getElementById('playlist-list');
    list.innerHTML = `
        <div class="empty-state" id="empty-playlist-msg">You haven't created any playlists yet!</div>
    `;
}

document.getElementById('create-playlist').addEventListener('submit', (e) => {
    e.preventDefault();
    const nameInput = document.getElementById('pl-name');
    const name = nameInput.value.trim();
    if (name) {
        const list = document.getElementById('playlist-list');
        const emptyMsg = document.getElementById('empty-playlist-msg');
        if(emptyMsg) emptyMsg.remove();
        
        const playlistItem = document.createElement('div');
        playlistItem.classList.add('card', 'playlist-item');
        playlistItem.innerHTML = `
            <div class="meta">
                <div class="title">🎧 ${name}</div>
                <div class="sub">0 tracks | Created just now</div>
            </div>
            <button class="secondary" style="grid-column: 2 / -1;">View</button>
        `;
        list.appendChild(playlistItem);
        nameInput.value = '';
        alert(`Playlist "${name}" created! (Functionality is simulated)`);
    }
});


/**
 * =======================================================
 * 5. Player Functionality (Simulated)
 * =======================================================
 */

function updatePlayer() {
  const nowPlaying = document.getElementById('now-playing');
  const playButton = document.getElementById('play');
  
  if (currentTrack) {
    nowPlaying.textContent = `▶️ Playing: ${currentTrack.title} by ${currentTrack.artist}`;
    playButton.textContent = '⏸️';
  } else {
    nowPlaying.textContent = 'Nothing playing';
    playButton.textContent = '▶️';
  }
}

function playTrack(track) {
  currentTrack = track;
  updatePlayer();
  // Clear the queue if a new track is explicitly played
  queue = []; 
  renderQueue();
}

function addToQueue(track) {
  queue.push(track);
  renderQueue();
  alert(`Added "${track.title}" to queue!`);
}

function nextTrack() {
  if (queue.length > 0) {
    const next = queue.shift();
    playTrack(next);
  } else if (currentTrack) {
    // Replay the current track or stop if no queue
    alert("Queue finished. Stopping playback.");
    currentTrack = null;
    updatePlayer();
  }
  renderQueue();
}

function togglePlayPause() {
  if (currentTrack) {
    // Simple state toggle
    alert(document.getElementById('play').textContent === '▶️' ? 
          `Resuming ${currentTrack.title}` : 
          `Pausing ${currentTrack.title}`);
  } else if (queue.length > 0) {
    nextTrack();
  } else {
    // Start with the first track from the main list if nothing is playing
    playTrack(TRACKS[0]);
  }
}

function renderQueue() {
  const queueList = document.getElementById('queue-list');
  queueList.innerHTML = '';
  if (queue.length === 0) {
    queueList.innerHTML = '<li>Queue is empty</li>';
  } else {
    queue.forEach((track, index) => {
      const li = document.createElement('li');
      li.textContent = `${index + 1}. ${track.title} by ${track.artist}`;
      queueList.appendChild(li);
    });
  }
}

// Initial setup for player buttons
document.getElementById('play').addEventListener('click', togglePlayPause);
document.getElementById('next').addEventListener('click', nextTrack);
document.getElementById('prev').addEventListener('click', () => alert("Skipping back (Simulated)"));
document.getElementById('queue-btn').addEventListener('click', () => {
    document.getElementById('queue-list').toggleAttribute('hidden');
});
