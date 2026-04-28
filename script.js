(function () {
    // ✏️  
    const START_DATE = new Date('2026-01-20T00:00:00');

    function updateCounter() {
        const now = new Date();
        const diffMs = now - START_DATE;
        const days = Math.max(0, Math.floor(diffMs / (1000 * 60 * 60 * 24)));
        const el = document.getElementById('daysCount');
        if (el) el.textContent = days;
    }

    updateCounter();
    setInterval(updateCounter, 60000);
})();


(function () {
    const container = document.getElementById('floatingHearts');
    if (!container) return;

    const hearts = ['💜', '🤍', '✨', '💫', '🩷', '💗'];

    function spawnHeart() {
        const el = document.createElement('span');
        el.className = 'fh';
        el.textContent = hearts[Math.floor(Math.random() * hearts.length)];

        const size = 10 + Math.random() * 14;
        const left = Math.random() * 100;
        const duration = 12 + Math.random() * 16;
        const delay = Math.random() * 8;

        el.style.cssText = `
            left: ${left}%;
            bottom: -30px;
            font-size: ${size}px;
            animation-duration: ${duration}s;
            animation-delay: ${delay}s;
        `;

        container.appendChild(el);
        setTimeout(() => el.remove(), (duration + delay) * 1000);
    }

    // Spawn a batch, then keep trickling
    for (let i = 0; i < 12; i++) spawnHeart();
    setInterval(spawnHeart, 2200);
})();

const audio = document.getElementById('audioPlayer');
const playBtn = document.getElementById('playBtn');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const npTitle = document.getElementById('npTitle');
const npArtist = document.getElementById('npArtist');
const progressFill = document.getElementById('progressFill');
const progressWrap = document.getElementById('progressWrap');
const currentTimeEl = document.getElementById('currentTime');
const totalTimeEl = document.getElementById('totalTime');
const volumeSlider = document.getElementById('volumeSlider');
const vinyl = document.getElementById('vinylDisc');
const miniDisc = document.getElementById('miniDisc');
const trackItems = document.querySelectorAll('.track-item');

let currentIndex = 0;
let isPlaying = false;

function formatTime(secs) {
    if (isNaN(secs)) return '0:00';
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
}

function loadTrack(index) {
    const track = trackItems[index];
    audio.src = track.dataset.src;
    audio.volume = parseFloat(volumeSlider.value);
    npTitle.textContent = track.dataset.title;
    npArtist.textContent = track.dataset.artist;

    trackItems.forEach(t => t.classList.remove('active'));
    track.classList.add('active');
    currentIndex = index;

    progressFill.style.width = '0%';
    currentTimeEl.textContent = '0:00';
    totalTimeEl.textContent = '0:00';
}

function play() {
    audio.play().then(() => {
        isPlaying = true;
        playBtn.textContent = '⏸';
        vinyl.classList.add('playing');
        if (miniDisc) miniDisc.classList.add('spinning');
    }).catch(() => {
        isPlaying = true;
        playBtn.textContent = '⏸';
        vinyl.classList.add('playing');
        if (miniDisc) miniDisc.classList.add('spinning');
    });
}

function pause() {
    audio.pause();
    isPlaying = false;
    playBtn.textContent = '▶';
    vinyl.classList.remove('playing');
    if (miniDisc) miniDisc.classList.remove('spinning');
}

playBtn.addEventListener('click', () => {
    if (isPlaying) pause(); else play();
});

prevBtn.addEventListener('click', () => {
    currentIndex = (currentIndex - 1 + trackItems.length) % trackItems.length;
    loadTrack(currentIndex);
    if (isPlaying) play();
});

nextBtn.addEventListener('click', () => {
    currentIndex = (currentIndex + 1) % trackItems.length;
    loadTrack(currentIndex);
    if (isPlaying) play();
});

audio.addEventListener('timeupdate', () => {
    if (audio.duration) {
        const pct = (audio.currentTime / audio.duration) * 100;
        progressFill.style.width = pct + '%';
        currentTimeEl.textContent = formatTime(audio.currentTime);
        totalTimeEl.textContent = formatTime(audio.duration);
    }
});

audio.addEventListener('ended', () => {
    currentIndex = (currentIndex + 1) % trackItems.length;
    loadTrack(currentIndex);
    play();
});

progressWrap.addEventListener('click', (e) => {
    const rect = progressWrap.getBoundingClientRect();
    const pct = (e.clientX - rect.left) / rect.width;
    if (audio.duration) audio.currentTime = pct * audio.duration;
});

volumeSlider.addEventListener('input', () => {
    audio.volume = parseFloat(volumeSlider.value);
});

trackItems.forEach((item, i) => {
    item.addEventListener('click', () => {
        const spotifyUrl = item.dataset.spotify;
        loadTrack(i);
        play();
        if (spotifyUrl) window.open(spotifyUrl, '_blank');
    });
});

loadTrack(0);

document.querySelectorAll('.gallery-item').forEach(item => {
    item.addEventListener('click', () => {
        item.classList.toggle('revealed');
    });
});

const sections = document.querySelectorAll('section');
const navLinks = document.querySelectorAll('.navbar ul li a');

window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(sec => {
        if (window.scrollY >= sec.offsetTop - 120) {
            current = sec.id;
        }
    });
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === '#' + current) {
            link.classList.add('active');
        }
    });
});