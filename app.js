const statusEl = document.getElementById('status');
const phraseEl = document.getElementById('phrase');
const sourceEl = document.getElementById('source');
const timeEl = document.getElementById('time');
const nextPhraseBtn = document.getElementById('nextPhraseBtn');

const NAAS_ENDPOINT = 'https://naas.isalman.dev/no';

const normalizePhrase = (value) => {
const text = String(value || '').trim();
if (!text) return 'No.';
return text.endsWith('.') ? text : text + '.';
};

const setMetaTime = () => {
timeEl.textContent = new Date().toLocaleTimeString([],{
hour:'2-digit',
minute:'2-digit'
});
};

const setLoading = (loading) => {

nextPhraseBtn.disabled = loading;

statusEl.textContent = loading
? 'Buscando una excusa perfecta...'
: 'Excusa lista para usar';

};

const fetchNo = async () => {

const response = await fetch(NAAS_ENDPOINT);

if(!response.ok){
throw new Error('API no disponible');
}

const text = await response.text();

return {
phrase: normalizePhrase(text),
source:'NAAS API'
};

};

const renderPhrase = ({phrase,source}) => {

phraseEl.textContent = phrase;
sourceEl.textContent = source;

setMetaTime();

};

const loadPhrase = async () => {

setLoading(true);

try{

const data = await fetchNo();

renderPhrase(data);

}catch{

phraseEl.textContent = 'No pudimos generar una excusa.';
sourceEl.textContent = 'Error de conexión';

}

setLoading(false);

};

nextPhraseBtn.addEventListener('click', loadPhrase);

loadPhrase();