// code for the demo version of the app
var firstTone;
var secondTone;
let toneLength = 0.7;
let pauseLength = 0.2;
var oscType = "sine";
var soundeffectCorrect;
var soundeffectWrong;
let intervalArray = [0.9707, 1.0293];
const AudioContext = window.AudioContext || window.webkitAudioContext;
const audioContext = new AudioContext();
var answerGiven = false;
var buttonDelay = 0;
var lastClick = 0;
var soundeffectCorrect = new Audio('/sounds/correct.wav');
var soundeffectWrong = new Audio('/sounds/wrong.wav');


function play(freq, start, stop, fadeInTime, fadeOutTime) {
        const osc = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        osc.connect(gainNode).connect(audioContext.destination);
        osc.frequency.value = freq;
        osc.type = oscType;
        gainNode.gain.value = 0.001;
        osc.start(audioContext.currentTime + start);
        gainNode.gain.linearRampToValueAtTime(0.001, audioContext.currentTime + start);
        gainNode.gain.exponentialRampToValueAtTime(1, audioContext.currentTime + start + fadeInTime);
        gainNode.gain.linearRampToValueAtTime(1, audioContext.currentTime + stop - fadeOutTime)
        gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + stop);
        osc.stop(audioContext.currentTime + stop);
}

function next() {
    if (lastClick <= Date.now()-buttonDelay) { 
        firstTone = getRndInteger(100,400); //define good range of freqs
        secondTone = getRndFromArray(intervalArray)*firstTone;
        document.getElementById('feedback_img').src = '/images/questionmark.png';
        play(firstTone, 0, toneLength, 0.05, 0.05);
        play(secondTone, toneLength+pauseLength, 2*toneLength+pauseLength, 0.05, 0.05);
        answerGiven = false;
        lastClick = Date.now();
        buttonDelay = (2*toneLength+pauseLength)*1000;
        localStorage.setItem('firstTone', firstTone);
        localStorage.setItem('secondTone', secondTone);
    }
}

function again() {
    if (lastClick <= Date.now()-buttonDelay) {
        if (localStorage.getItem('firstTone') == '') {localStorage.setItem('firstTone', 250)}
        if (localStorage.getItem('secondTone') == '') {localStorage.setItem('secondTone', 242.675)}
        firstTone = localStorage.getItem('firstTone');
        secondTone = localStorage.getItem('secondTone');
        play(firstTone, 0, toneLength, 0.05, 0.05);
        play(secondTone, toneLength+pauseLength, 2*toneLength+pauseLength, 0.05, 0.05);        
        lastClick = Date.now();
        buttonDelay = (2*toneLength+pauseLength)*1000;
        if (!answerGiven) {
            document.getElementById('feedback_img').src = '/images/questionmark.png';
        }
    }
}

function higher() {
    if (!answerGiven) {
        if (firstTone < secondTone) {
            document.getElementById('feedback_img').src = '/images/checkmark.png';
            soundeffectCorrect.play();
        } else {
            showCorrectAnswer(firstTone, secondTone);
        }
        answerGiven = true;
    }
}  

function lower() {
    if (!answerGiven) {
        if (firstTone > secondTone) {
            document.getElementById('feedback_img').src = '/images/checkmark.png';
            soundeffectCorrect.play();
        } else {
            showCorrectAnswer(firstTone, secondTone);
        }
        answerGiven = true;
    }
}

function getRndInteger(min, max) {
  return Math.floor(Math.random() * (max - min + 1) ) + min;
}

function getRndFromArray(Array) {
    return Array[Math.floor(Math.random()*Array.length)];
}

function showCorrectAnswer(firstTone, secondTone) {
    if (firstTone > secondTone) {
        document.getElementById('feedback_img').src = '/images/arrow.down.png';
    } else {
        document.getElementById('feedback_img').src = '/images/arrow.up.png';
    }
    soundeffectWrong.play();
}


// Code for the different language support

// Detect language and change it on start
document.addEventListener('DOMContentLoaded', async () => {
  let lang = localStorage.getItem('lang');
  if (!lang) {
  const userLang = navigator.language.split('-')[0];
  const supportedLangs = ['en', 'de'];
  lang = supportedLangs.includes(userLang) ? userLang : 'en';
  }
  // update <html lang="...">
  document.documentElement.lang = lang;
  // Load and apply translations
  try {
    const translations = await fetch(`locales/${lang}.json`).then(res => res.json());
      document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        const attr = el.getAttribute('data-i18n-attr');
        if (translations[key]) {
          el.innerHTML = translations[key] || el.innerHTML;
        }
        if (attr) {
          const hrefKey = key + "_href";
          const value = translations[hrefKey] !== undefined ? translations[hrefKey] : translations[key];
          el.setAttribute(attr, value);
        }
      });
  } catch (err) {
    console.error('Translation load failed: ', err)
  }
    // 4. Update UI (e.g., current language button)
  if (document.getElementById('current-lang')) {
    document.getElementById('current-lang').textContent = lang.toUpperCase();
  }
  // 5. Ensure dropdown is closed
  const dropdown = document.querySelectorAll('[onclick*="nextElementSibling"]')[0]?.nextElementSibling;
  if (dropdown) {
    dropdown.classList.add('hidden');
  }
})

// Sprache setzen – speichert, aktualisiert UI & schließt
async function setLanguage(lang) {
  // 3.1 Speichern
  localStorage.setItem('lang', lang);
  // 3.2 Button‑Label aktualisieren
  document.getElementById('current-lang').textContent = lang.toUpperCase();
  // 3.3 Dropdown schließen
  document.querySelectorAll('[onclick*="nextElementSibling"]')[0].nextElementSibling.classList.add('hidden');
  // 3.4 Übersetzungen laden & anwenden
  const dict = await loadTranslations(lang);
  applyTranslations(dict);

  toggleLangArrow()
}

// Hilfsfunktion: JSON‑Datei für die gewünschte Sprache holen
async function loadTranslations(lang) {
  try {
    const resp = await fetch(`./locales/${lang}.json`);
    if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
    return await resp.json();               // → Objekt {key: "Übersetzung"}
  } catch (e) {
    console.warn(`i18n: konnte ${lang}.json nicht laden`, e);
    return {};                              // leeres Objekt → keine Änderungen
  }
}
// Übersetzungen im DOM anwenden
function applyTranslations(dict) {
  // Alle Elemente mit data-i18n finden
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    const attr = el.getAttribute('data-i18n-attr');
    const hrefKey = el.getAttribute('data-i18n-href-key');

    const textValue = dict[key];
      if (textValue !== undefined) {
        el.innerHTML = textValue;
    }
    if (attr) {
      const attrValue = hrefKey ? dict[hrefKey] : dict[key];
      if (attrValue !== undefined) {
        el.setAttribute(attr, attrValue);
      }
    }
  });
}

// toggle the arrow of the language picker when opening/closing
function toggleLangArrow() {
  const arrow = document.getElementById('lang-arrow');
  const dropdown = document.getElementById('lang-dropdown');

  if (dropdown.classList.contains('hidden')) {
    arrow.textContent = '▾';
  } else {
    arrow.textContent = '▴';
  }
}

function closeLangDropdown() {
  const dropdown = document.getElementById('lang-dropdown');
      if (dropdown && !dropdown.classList.contains('hidden')) {
      dropdown.classList.add('hidden');
      const arrow = document.getElementById('lang-arrow');
      if(arrow) arrow.innerText = '▾';
      }
}

document.addEventListener('click', function(event) {
  const dropdown = document.getElementById('lang-dropdown');
  const toggleBtn = document.querySelector('button[onclick*="toggleLangArrow"]');

  if (dropdown.contains(event.target)) {
    return;
  }
  if (toggleBtn && toggleBtn.contains(event.target)) {
    return;
  }
  closeLangDropdown();
});


//OS specific link to AppStore / Play Store
function redirectToAppStore() {
  const userAgent = navigator.userAgent.toLowerCase();
  const isiOS = /iphone|ipad|ipod/.test(userAgent);
  const isAndroid = /android/.test(userAgent);

  if (isiOS) {
    window.location.href = 'https://apps.apple.com/us/app/sing-on-pitch/id6443449637'
  } else if (isAndroid) {
    window.location.href = 'https://play.google.com/store/apps/details?id=com.singonpitch.pitch_android_v1'
  } else {
    document.getElementById('qr_overlay').style.display = 'flex';
    document.body.style.overflow = 'hidden' //prevent scrolling background
  }
}

function hideQR() {
  document.getElementById('qr_overlay').style.display = 'none';
  document.body.style.overflow = '' //enable scrolling background
}