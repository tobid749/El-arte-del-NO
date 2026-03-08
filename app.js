const statusEl = document.getElementById('status');
const phraseEl = document.getElementById('phrase');
const sourceEl = document.getElementById('source');
const timeEl = document.getElementById('time');
const nextPhraseBtn = document.getElementById('nextPhraseBtn');
const cardEl = document.querySelector('.card');
const fortuneShellEl = document.querySelector('.fortune-shell');
const rejectStampEl = document.getElementById('rejectStamp');
const defaultButtonLabel = nextPhraseBtn.textContent;

const NAAS_ENDPOINT = 'https://naas.isalman.dev/no';

const normalizePhrase = (value) => {
    const text = String(value || '').trim();
    if (!text) {
        return 'No.';
    }

    if (text.endsWith('.')) {
        return text;
    }

    return `${text}.`;
};

const setLoading = (isLoading) => {
    nextPhraseBtn.disabled = isLoading;
    nextPhraseBtn.classList.toggle('is-loading', isLoading);
    cardEl.classList.toggle('is-loading', isLoading);
    document.body.classList.toggle('is-fetching', isLoading);
    cardEl.setAttribute('aria-busy', String(isLoading));
    nextPhraseBtn.textContent = isLoading ? 'Buscando excusa...' : defaultButtonLabel;

    statusEl.textContent = isLoading
    ? 'Fabricando una excusa premium…'
    : 'Excusa lista para usar';
};

const setMetaTime = () => {
    timeEl.textContent = new Date().toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit'
    });
};

const fetchNoAsAService = async () => {
    const response = await fetch(`${NAAS_ENDPOINT}?t=${Date.now()}`, { cache: 'no-store' });
    if (!response.ok) {
        throw new Error('No as a Service no disponible');
    }

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
        source: 'naas.isalman.dev'
    };
};

const getRandomWaitingMessage = () => {
    const messages = [
        'Buscando una forma creativa de decir que no…',
        'Puliendo una excusa socialmente aceptable…',
        'Negociando con la pereza universal…'
    ];

    return messages[Math.floor(Math.random() * messages.length)];
};

const renderPhrase = ({ phrase, source }) => {
    phraseEl.textContent = phrase;
    sourceEl.textContent = source;
    setMetaTime();

    const stampLabels = ['DENEGADO', 'NOPE', 'RECHAZADO'];
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
        statusEl.textContent = 'No as a Service respondió con cero compromiso.';
    } catch {
        phraseEl.textContent = 'Ni para negarte estamos conectados. Intenta de nuevo.';
        sourceEl.textContent = 'Error de conexión con NAAS';
        setMetaTime();
        statusEl.textContent = 'Se cayó la fábrica de excusas';
    } finally {
        setLoading(false);
    }
};

nextPhraseBtn.addEventListener('click', loadPhrase);
loadPhrase();
