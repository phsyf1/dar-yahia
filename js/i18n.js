const translations = {
    ar: {
        slogan: "لا نهجر القرآن.. حتي تطيب حياتنا",
        why_read_quran: "لماذا نقرأ القرآن ونتعلمه؟!",
        select_khatmah: "حدد الختمة",
        weekly: "أسبوعية",
        monthly: "شهرية",
        custom: "مخصصة",
        start_date: "تاريخ البدء",
        end_date: "تاريخ الختام",
        daily_target_label: "الورد اليومي:",
        view_schedule: "عرض جدول الختمة",
        add_to_calendar: "إضافة الخريطة إلى تقويم الهاتف",
        download_schedule: "تحميل جدول الختمة",
        about_me_title: "من أنا \"مؤسس الموقع\"",
        contact_title: "تواصل معي",
        your_name: "اسمك الكريم",
        your_email: "بريدك الإلكتروني",
        your_message: "اكتب رسالتك هنا...",
        send_message: "إرسال الرسالة",
        visitor_welcome: "ضيفنا الكريم رقم",
        follow_us: "شرفنا بمتابعتك",
        youtube: "يوتيوب",
        tiktok: "تيك توك",
        telegram: "تيليجرام",
        facebook: "فيسبوك",
        subscribe_now: "اشترك الآن",
        search_placeholder: "ادخل نص البحث...",
        khatmah_schedule_details: "خريطة جدول الختمة",
        download: "تحميل",
        author_name: "فارس محمد داهش"
    },
    en: {
        slogan: "Do not abandon the Qur'an.. so that our lives may blossom",
        why_read_quran: "Why do we read and learn the Qur'an?!",
        select_khatmah: "Select Khatmah Duration",
        weekly: "Weekly",
        monthly: "Monthly",
        custom: "Custom",
        start_date: "Start Date",
        end_date: "End Date",
        daily_target_label: "Daily Reading:",
        view_schedule: "View Schedule",
        add_to_calendar: "Add Map to Calendar",
        download_schedule: "Download Schedule",
        about_me_title: "About Me (Founder)",
        contact_title: "Contact Me",
        your_name: "Your Name",
        your_email: "Your Email",
        your_message: "Type your message here...",
        send_message: "Send Message",
        visitor_welcome: "Honored Guest No.",
        follow_us: "Follow Us",
        youtube: "YouTube",
        tiktok: "TikTok",
        telegram: "Telegram",
        facebook: "Facebook",
        subscribe_now: "Subscribe",
        search_placeholder: "Search text...",
        khatmah_schedule_details: "Khatmah Schedule Map",
        download: "Download",
        author_name: "Faris Mohammed Dahesh Ash-Shiref"
    }
};

document.addEventListener('DOMContentLoaded', () => {
    const langBtn = document.getElementById('langToggleBtn');
    let currentLang = localStorage.getItem('app_lang') || 'ar';
    
    applyLanguage(currentLang);

    if (langBtn) {
        langBtn.addEventListener('click', () => {
            currentLang = currentLang === 'ar' ? 'en' : 'ar';
            localStorage.setItem('app_lang', currentLang);
            applyLanguage(currentLang);
        });
    }
});

function applyLanguage(lang) {
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';

    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (translations[lang] && translations[lang][key]) {
            el.innerText = translations[lang][key];
        }
    });

    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
        const key = el.getAttribute('data-i18n-placeholder');
        if (translations[lang] && translations[lang][key]) {
            el.placeholder = translations[lang][key];
        }
    });

    // تحديث ترجمة الاسم للإنجليزية حسب الرغبة
    const authorLink = document.getElementById('authorName');
    if (authorLink) {
        authorLink.innerText = lang === 'en' ? 'Faris Mohammed Dahesh Ash-Shiref' : 'فارس محمد داهش';
    }
}
