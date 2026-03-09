const statusEl = document.getElementById('status');
const phraseEl = document.getElementById('phrase');
const sourceEl = document.getElementById('source');
const timeEl = document.getElementById('time');
const nextPhraseBtn = document.getElementById('nextPhraseBtn');
const cardEl = document.querySelector('.card');
const fortuneShellEl = document.querySelector('.fortune-shell');
const rainLayerEl = document.getElementById('rainLayer');
const rejectStampEl = document.getElementById('rejectStamp');
const defaultButtonLabel = nextPhraseBtn.textContent;

const NAAS_ENDPOINT = 'https://naas.isalman.dev/no';
const CHIP_LABELS = ['NO', 'JAMÁS', 'NEGADO', 'NI EN SUEÑOS', 'NOPE'];

let rainTimeoutId = null;
let lastDropX = null;

const normalizePhrase = (value) => {
    const text = String(value || '').trim();
    if (!text) return 'No.';
    return text.endsWith('.') ? text : `${text}.`;
};

const setLoading = (isLoading) => {
    nextPhraseBtn.disabled = isLoading;
    nextPhraseBtn.classList.toggle('is-loading', isLoading);
    cardEl.classList.toggle('is-loading', isLoading);
    document.body.classList.toggle('is-fetching', isLoading);
    cardEl.setAttribute('aria-busy', String(isLoading));
    nextPhraseBtn.textContent = isLoading ? '⏳ Buscando excusa...' : defaultButtonLabel;

    statusEl.textContent = isLoading
        ? '🔄 Fabricando una negativa de alta calidad…'
        : '✅ Excusa lista para usar';
};

const setMetaTime = () => {
    timeEl.textContent = new Date().toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit'
    });
};

const fetchNoAsAService = async () => {
    const response = await fetch(`${NAAS_ENDPOINT}?t=${Date.now()}`, { cache: 'no-store' });
    if (!response.ok) throw new Error('No as a Service no disponible');

    const contentType = response.headers.get('content-type') || '';
    let phrase = '';

    if (contentType.includes('application/json')) {
        const data = await response.json();
        phrase = data?.reason || data?.response || data?.message || data?.no || data?.answer || '';
    } else {
        phrase = await response.text();
    }

    return {
        phrase: normalizePhrase(phrase),
        source: 'by jeesssik'
    };
};

const getRandomWaitingMessage = () => {
    const messages = [
        '🙅 Consultando el libro sagrado de las negativas…',
        '💅 Puliendo una excusa de nivel olímpico…',
        '🚫 Negociando con las fuerzas del NO universal…',
        '😤 Buscando la forma más elegante de decirte que no…',
        '🎭 Ensayando el rechazo perfecto…',
    ];
    return messages[Math.floor(Math.random() * messages.length)];
};

const randomInRange = (min, max) => Math.random() * (max - min) + min;

const spawnNoChip = () => {
    if (!rainLayerEl) return;

    const chipEl = document.createElement('span');
    chipEl.className = 'rain-chip';
    chipEl.textContent = CHIP_LABELS[Math.floor(Math.random() * CHIP_LABELS.length)];

    let xPercent = randomInRange(1, 96);
    if (lastDropX !== null && Math.abs(xPercent - lastDropX) < 12) {
        xPercent = (xPercent + randomInRange(14, 28)) % 97;
    }
    lastDropX = xPercent;

    chipEl.style.left = `${xPercent}%`;
    chipEl.style.setProperty('--chip-duration', `${randomInRange(5.0, 8.5).toFixed(2)}s`);
    chipEl.style.setProperty('--chip-drift', `${randomInRange(-28, 28).toFixed(1)}px`);
    chipEl.style.setProperty('--chip-rotation', `${randomInRange(-15, 15).toFixed(1)}deg`);

    rainLayerEl.appendChild(chipEl);

    const lifeTimeMs = parseFloat(chipEl.style.getPropertyValue('--chip-duration')) * 1000;
    window.setTimeout(() => chipEl.remove(), lifeTimeMs + 250);
};

const scheduleRain = () => {
    spawnNoChip();
    rainTimeoutId = window.setTimeout(scheduleRain, randomInRange(500, 1100));
};

const startNoRain = () => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches || rainTimeoutId) return;
    scheduleRain();
};

const renderPhrase = ({ phrase, source }) => {
    phraseEl.textContent = phrase;
    sourceEl.textContent = source;
    setMetaTime();

    const stampLabels = ['DENEGADO', 'RECHAZADO', 'BLOQUEADO', 'IMPOSIBLE', 'NI LOCO'];
    rejectStampEl.textContent = stampLabels[Math.floor(Math.random() * stampLabels.length)];
    cardEl.classList.remove('is-stamped');
    void cardEl.offsetWidth;
    cardEl.classList.add('is-stamped');

    fortuneShellEl.classList.remove('is-revealed');
    void fortuneShellEl.offsetWidth;
    fortuneShellEl.classList.add('is-revealed');
};

const loadPhrase = async () => {
    statusEl.textContent = getRandomWaitingMessage();
    setLoading(true);

    try {
        const payload = await fetchNoAsAService();
        renderPhrase(payload);
        statusEl.textContent = '🎯 No as a Service respondió con cero compromiso.';
    } catch {
        phraseEl.textContent = '📡 Ni para negarte estamos conectados. Intenta de nuevo.';
        sourceEl.textContent = 'Error de conexión con NAAS';
        setMetaTime();
        statusEl.textContent = '💥 Se cayó la fábrica de excusas';
    } finally {
        setLoading(false);
    }
};

nextPhraseBtn.addEventListener('click', loadPhrase);
startNoRain();
loadPhrase();