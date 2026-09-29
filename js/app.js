// Quran Constants (Madinah Mushaf 604 pages)
const TOTAL_QURAN_PAGES = 604;
const PAGES_PER_JUZ = 20.133;
const PAGES_PER_HIZB = 10.066;
const MINUTES_PER_PAGE = 1.25; // Average reading pace

// Quotes Data Array
const QURAN_QUOTES = [
    { text: "وَلَقَدْ يَسَّرْنَا الْقُرْآنَ لِلذِّكْرِ فَهَلْ مِن مُّدَّكِرٍ", source: "[القمر - ١٧]" },
    { text: "وَقَالَ الرَّسُولُ يَا رَبِّ إِنَّ قَوْمِي اتَّخَذُوا هَٰذَا الْقُرْآنَ مَهْجُورًا", source: "[الفرقان - ٣٠]" },
    { text: "خَيْرُكُمْ مَنْ تَعَلَّمَ القُرْآنَ وَعَلَّمَهُ", source: "[رواه البخاري]" },
    { text: "الْمَاهِرُ بِالْقُرْآنِ مَعَ السَّفَرَةِ الْكِرَامِ الْبَرَرَةِ، وَالَّذِي يَقْرَأُ الْقُرْآنَ وَيَتَتَعْتَعُ فِيهِ، وَهُوَ عَلَيْهِ شَاقٌّ، لَهُ أَجْرَانِ", source: "[رواه البخاري ومسلم]" },
    { text: "تَعَاهَدُوا هذا القُرْآنَ، فَوالَّذِي نَفْسُ مُحَمَّدٍ بِيَدِهِ لَهُوَ أشَدُّ تفَلُّتًا مِنَ الإبِلِ فِي عُقُلِهَا", source: "[رواه البخاري ومسلم]" },
    { text: "اقْرَؤُوا القُرْآنَ فإنَّه يَأْتي يَومَ القِيَامَةِ شَفِيعًا لأَصْحَابِهِ", source: "[رواه مسلم]" }
];

let activeTab = 'weekly';
let customMode = 'days'; // 'days' or 'pages'

document.addEventListener('DOMContentLoaded', () => {
    initThemeAndLang();
    startQuotesCarousel();
    setupKhatmahPlanner();
    registerServiceWorker();
});

// Theme & Language Initialization
function initThemeAndLang() {
    const savedTheme = localStorage.getItem('dar_yahya_theme') || 'dark';
    document.documentElement.setAttribute('data-theme', savedTheme);
    document.getElementById('themeToggleBtn').textContent = savedTheme === 'dark' ? '🌙' : '☀️';

    document.getElementById('themeToggleBtn').addEventListener('click', () => {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('dar_yahya_theme', newTheme);
        document.getElementById('themeToggleBtn').textContent = newTheme === 'dark' ? '🌙' : '☀️';
    });

    const currentLang = autoDetectLanguage();
    document.getElementById('langSelect').value = currentLang;
    applyLanguage(currentLang);

    document.getElementById('langSelect').addEventListener('change', (e) => {
        applyLanguage(e.target.value);
    });
}

// Quote Carousel (Random Every 4s with Fade Animation)
function startQuotesCarousel() {
    const container = document.getElementById('quoteContainer');
    const textEl = document.getElementById('quoteText');
    const sourceEl = document.getElementById('quoteSource');
    let lastIndex = -1;

    function renderNextQuote() {
        let randomIndex;
        do {
            randomIndex = Math.floor(Math.random() * QURAN_QUOTES.length);
        } while (randomIndex === lastIndex && QURAN_QUOTES.length > 1);
        
        lastIndex = randomIndex;
        const quote = QURAN_QUOTES[randomIndex];

        container.classList.add('fade-out');
        setTimeout(() => {
            textEl.textContent = quote.text;
            sourceEl.textContent = quote.source;
            container.classList.remove('fade-out');
        }, 500);
    }

    renderNextQuote();
    setInterval(renderNextQuote, 4000);
}

// Khatmah Mathematics & Rules Engine
function setupKhatmahPlanner() {
    const startDateInput = document.getElementById('startDate');
    const endDateInput = document.getElementById('endDate');
    const pagesInput = document.getElementById('dailyPagesInput');
    
    // Set Today as Default Start Date
    const today = new Date().toISOString().split('T')[0];
    startDateInput.value = today;

    // Tabs Switcher
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');
            activeTab = e.target.getAttribute('data-type');
            
            toggleModeUI();
            calculateKhatmah();
        });
    });

    // Custom Mode Sub-Toggle (Days / Pages)
    document.getElementById('modeDaysBtn').addEventListener('click', () => {
        customMode = 'days';
        document.getElementById('modeDaysBtn').classList.add('active');
        document.getElementById('modePagesBtn').classList.remove('active');
        toggleModeUI();
        calculateKhatmah();
    });

    document.getElementById('modePagesBtn').addEventListener('click', () => {
        customMode = 'pages';
        document.getElementById('modePagesBtn').classList.add('active');
        document.getElementById('modeDaysBtn').classList.remove('active');
        toggleModeUI();
        calculateKhatmah();
    });

    [startDateInput, endDateInput, pagesInput].forEach(input => {
        input.addEventListener('input', calculateKhatmah);
    });

    toggleModeUI();
    calculateKhatmah();
}

function toggleModeUI() {
    const customToggleBox = document.getElementById('customToggleBox');
    const pagesGroup = document.getElementById('pagesInputGroup');
    const endDateInput = document.getElementById('endDate');

    if (activeTab === 'custom') {
        customToggleBox.classList.remove('hidden');
        if (customMode === 'pages') {
            pagesGroup.classList.remove('hidden');
            endDateInput.readOnly = true;
        } else {
            pagesGroup.classList.add('hidden');
            endDateInput.readOnly = false;
        }
    } else {
        customToggleBox.classList.add('hidden');
        pagesGroup.classList.add('hidden');
        endDateInput.readOnly = true;
    }
}

function calculateKhatmah() {
    const startVal = new Date(document.getElementById('startDate').value);
    const endDateInput = document.getElementById('endDate');
    const pagesInput = document.getElementById('dailyPagesInput');

    if (isNaN(startVal.getTime())) return;

    let dailyPages = 0;
    let daysDiff = 0;

    if (activeTab === 'weekly') {
        daysDiff = 7;
        const end = new Date(startVal);
        end.setDate(end.getDate() + daysDiff);
        endDateInput.value = end.toISOString().split('T')[0];
        dailyPages = Math.ceil(TOTAL_QURAN_PAGES / daysDiff);
    } 
    else if (activeTab === 'monthly') {
        daysDiff = 30;
        const end = new Date(startVal);
        end.setDate(end.getDate() + daysDiff);
        endDateInput.value = end.toISOString().split('T')[0];
        dailyPages = Math.ceil(TOTAL_QURAN_PAGES / daysDiff);
    } 
    else if (activeTab === 'custom') {
        if (customMode === 'days') {
            const endVal = new Date(endDateInput.value);
            if (!isNaN(endVal.getTime()) && endVal > startVal) {
                daysDiff = Math.ceil((endVal - startVal) / (1000 * 60 * 60 * 24));
                dailyPages = Math.ceil(TOTAL_QURAN_PAGES / daysDiff);
            }
        } else {
            dailyPages = parseInt(pagesInput.value) || 20;
            daysDiff = Math.ceil(TOTAL_QURAN_PAGES / dailyPages);
            const end = new Date(startVal);
            end.setDate(end.getDate() + daysDiff);
            endDateInput.value = end.toISOString().split('T')[0];
        }
    }

    // Render Calculations
    const hizbPercent = Math.round((dailyPages / PAGES_PER_HIZB) * 100);
    const juzPercent = Math.round((dailyPages / PAGES_PER_JUZ) * 100);
    const estMinutes = Math.round(dailyPages * MINUTES_PER_PAGE);

    document.getElementById('resPages').textContent = `${dailyPages} صفحة`;
    document.getElementById('resHizb').textContent = `${(dailyPages / PAGES_PER_HIZB).toFixed(1)} حزب (${hizbPercent}%)`;
    document.getElementById('resJuz').textContent = `${(dailyPages / PAGES_PER_JUZ).toFixed(1)} جزء (${juzPercent}%)`;
    document.getElementById('resTime').textContent = `~ ${estMinutes} دقيقة`;
}

// Service Worker & Notifications
function registerServiceWorker() {
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('sw.js')
            .then(reg => console.log('PWA SW Registered'))
            .catch(err => console.error('SW Failed', err));
    }

    document.getElementById('enableNotifyBtn').addEventListener('click', () => {
        if ('Notification' in window) {
            Notification.requestPermission().then(permission => {
                if (permission === 'granted') {
                    alert('تم تفعيل التنبيهات المحلية بنجاح!');
                }
            });
        }
    });
}
