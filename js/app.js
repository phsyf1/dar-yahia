document.addEventListener('DOMContentLoaded', () => {
    initTheme();
    initDatePickerRestriction();
    initDurationSelector();
    initModalEvents();
    initContactForm();
    initTranslationFetcher();
});

// 1. التحكم بالثيم وتحديث لون شريط النظام المترابط مع الهاتف
function initTheme() {
    const themeBtn = document.getElementById('themeToggleBtn');
    const savedTheme = localStorage.getItem('theme') || 'dark-theme';
    document.body.className = savedTheme;
    updateThemeColorMeta();

    themeBtn.addEventListener('click', () => {
        if (document.body.classList.contains('dark-theme')) {
            document.body.className = 'light-theme';
            localStorage.setItem('theme', 'light-theme');
        } else {
            document.body.className = 'dark-theme';
            localStorage.setItem('theme', 'dark-theme');
        }
        updateThemeColorMeta();
    });
}

function updateThemeColorMeta() {
    const metaTheme = document.querySelector('meta[name="theme-color"]');
    const icon = document.querySelector('#themeToggleBtn i');
    if (document.body.classList.contains('dark-theme')) {
        if (metaTheme) metaTheme.setAttribute('content', '#0d1117');
        if (icon) icon.className = 'fa-solid fa-sun';
    } else {
        if (metaTheme) metaTheme.setAttribute('content', '#f4f6f9');
        if (icon) icon.className = 'fa-solid fa-moon';
    }
}

// 2. تقييم تاريخ البدء بحيث لا يكون أقدم من 5 أيام
function initDatePickerRestriction() {
    const startDateInput = document.getElementById('startDate');
    const endDateInput = document.getElementById('endDate');

    const today = new Date();
    const minDate = new Date();
    minDate.setDate(today.getDate() - 5); // أقصى حد 5 أيام سابقة

    const minDateStr = minDate.toISOString().split('T')[0];
    const todayStr = today.toISOString().split('T')[0];

    startDateInput.min = minDateStr;
    startDateInput.value = todayStr;

    // تعيين التاريخ الافتراضي للختام (بعد أسبوع)
    const defaultEnd = new Date();
    defaultEnd.setDate(today.getDate() + 7);
    endDateInput.value = defaultEnd.toISOString().split('T')[0];

    startDateInput.addEventListener('change', calculatePages);
    endDateInput.addEventListener('change', calculatePages);
    calculatePages();
}

// 3. اختيار المدة وتفاعل الخيارات
function initDurationSelector() {
    const buttons = document.querySelectorAll('.duration-btn');
    buttons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            buttons.forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');

            const type = e.target.getAttribute('data-type');
            const startDate = new Date(document.getElementById('startDate').value || Date.now());
            const endDateInput = document.getElementById('endDate');

            let targetEnd = new Date(startDate);

            if (type === 'weekly') {
                targetEnd.setDate(startDate.getDate() + 7);
                endDateInput.value = targetEnd.toISOString().split('T')[0];
            } else if (type === 'monthly') {
                targetEnd.setDate(startDate.getDate() + 30);
                endDateInput.value = targetEnd.toISOString().split('T')[0];
            }
            calculatePages();
        });
    });
}

// حساب عدد صفحات الورد اليومي
function calculatePages() {
    const start = new Date(document.getElementById('startDate').value);
    const end = new Date(document.getElementById('endDate').value);
    const resultElement = document.getElementById('dailyPagesCount');

    if (isNaN(start) || isNaN(end) || end <= start) {
        resultElement.innerText = 'يرجى تحديد تواريخ صالحة';
        return;
    }

    const diffDays = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
    const totalPages = 604; // عدد صفحات المصحف الشريف
    const pagesPerDay = Math.ceil(totalPages / diffDays);

    resultElement.innerText = `${pagesPerDay} صفحة / يومياً (${diffDays} يوم)`;
}

// 4. النافذة المنبثقة وأحداث التصدير للتقويم
function initModalEvents() {
    const modal = document.getElementById('scheduleModal');
    const showBtn = document.getElementById('showScheduleBtn');
    const closeBtn = document.getElementById('closeModalBtn');
    const addCalBtn = document.getElementById('addCalendarBtn');
    const modalAddCalBtn = document.getElementById('modalAddCalendarBtn');
    const downloadBtn = document.getElementById('downloadScheduleBtn');
    const modalDownloadBtn = document.getElementById('modalDownloadBtn');

    showBtn.addEventListener('click', () => {
        generateScheduleView();
        modal.classList.add('active');
    });

    closeBtn.addEventListener('click', () => modal.classList.remove('active'));
    modal.addEventListener('click', (e) => {
        if (e.target === modal) modal.classList.remove('active');
    });

    const triggerCalendar = () => downloadICSFile();
    const triggerDownload = () => downloadScheduleDoc();

    addCalBtn.addEventListener('click', triggerCalendar);
    modalAddCalBtn.addEventListener('click', triggerCalendar);
    downloadBtn.addEventListener('click', triggerDownload);
    modalDownloadBtn.addEventListener('click', triggerDownload);
}

function generateScheduleView() {
    const body = document.getElementById('modalScheduleBody');
    const start = new Date(document.getElementById('startDate').value);
    const end = new Date(document.getElementById('endDate').value);

    if (isNaN(start) || isNaN(end) || end <= start) {
        body.innerHTML = '<p>يرجى اختيار تواريخ صحيحة أولاً.</p>';
        return;
    }

    const diffDays = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
    const totalPages = 604;
    const pagesPerDay = Math.ceil(totalPages / diffDays);

    let html = '<div class="schedule-list" style="display:flex; flex-direction:column; gap:6px;">';
    let currentPage = 1;

    for (let i = 1; i <= diffDays; i++) {
        let nextPage = Math.min(currentPage + pagesPerDay - 1, totalPages);
        html += `
            <div style="background:var(--input-bg); padding:8px 12px; border-radius:6px; display:flex; justify-shadow:space-between; font-size:0.85rem;">
                <span>اليوم ${i}</span>
                <strong style="color:var(--accent-gold)">من ص ${currentPage} إلى ص ${nextPage}</strong>
            </div>
        `;
        currentPage = nextPage + 1;
        if (currentPage > totalPages) break;
    }

    html += '</div>';
    body.innerHTML = html;
}

// إنشاء وتنزيل ملف .ics الخاص بجدول تقويم الهاتف
function downloadICSFile() {
    const startStr = document.getElementById('startDate').value.replace(/-/g, '');
    const endStr = document.getElementById('endDate').value.replace(/-/g, '');

    const icsContent = 
`BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Dar Yahia//Khatmah Calendar//AR
BEGIN:VEVENT
SUMMARY:ورد ختمة القرآن الكريم - دار يحيي
DESCRIPTION:لا نهجر القرآن حتى تطيب حياتنا. مراجعة وردك اليومي حسب الجدول.
DTSTART:${startStr}T080000Z
DTEND:${endStr}T090000Z
STATUS:CONFIRMED
END:VEVENT
END:VCALENDAR`;

    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.setAttribute('download', 'Dar_Yahia_Khatmah.ics');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

// تنزيل جدول الختمة كنص/مستند
function downloadScheduleDoc() {
    const start = document.getElementById('startDate').value;
    const end = document.getElementById('endDate').value;
    const pagesInfo = document.getElementById('dailyPagesCount').innerText;

    const content = `جدول ختمة القرآن الكريم - دار يحيي\nتاريخ البدء: ${start}\nتاريخ الختام: ${end}\nالورد اليومي: ${pagesInfo}\n\n"لا نهجر القرآن.. حتى تطيب حياتنا"`;

    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.setAttribute('download', 'جدول_الختمة_دار_يحيي.txt');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

// 5. استقبال رسائل تواصل معي
function handleContactSubmit(event) {
    event.preventDefault();
    const name = document.getElementById('contactName').value;
    const email = document.getElementById('contactEmail').value;
    const message = document.getElementById('contactMessage').value;

    const mailtoUrl = `mailto:faris.dahesh@gmail.com?subject=رسالة من موقع دار يحيي من ${encodeURIComponent(name)}&body=${encodeURIComponent(message + "\n\nالبريد: " + email)}`;
    window.location.href = mailtoUrl;
}

// 6. الترجمات التلقائية للآيات
function initTranslationFetcher() {
    const currentLang = localStorage.getItem('app_lang') || 'ar';
    if (currentLang !== 'ar') {
        const quoteTranslation = document.getElementById('quoteTranslation');
        quoteTranslation.style.display = 'block';
        quoteTranslation.innerText = '"The best among you are those who learn the Qur\'an and teach it." [Sahih al-Bukhari]';
    }
}
