const translations = {
    ar: {
        appTitle: "دَار يحيي",
        whyReadQuran: "لماذا نقرأ القرآن ونتعلمه؟! ",
        selectKhatmah: "حدد الختمة",
        weekly: "أسبوعية",
        monthly: "شهرية",
        custom: "مخصصة",
        byDays: "بالأيام",
        byPages: "بعدد الصفحات",
        startDate: "تاريخ البدء",
        endDate: "تاريخ الختام",
        dailyPagesCount: "الصفحات اليومية",
        dailyPages: "الورد اليومي:",
        hizbRatio: "نسبة الحزب:",
        juzRatio: "نسبة الجزء:",
        estTime: "الوقت التقريبي:",
        reminderTitle: "التذكير اليومي بورد القرآن",
        enableNotifications: "تفعيل التنبيهات"
    },
    en: {
        appTitle: "Dar Yahya",
        whyReadQuran: "Why Do We Read & Learn the Quran?!",
        selectKhatmah: "Select Khatmah Plan",
        weekly: "Weekly",
        monthly: "Monthly",
        custom: "Custom",
        byDays: "By Days",
        byPages: "By Daily Pages",
        startDate: "Start Date",
        endDate: "End Date",
        dailyPagesCount: "Daily Pages",
        dailyPages: "Daily Reading:",
        hizbRatio: "Hizb Ratio:",
        juzRatio: "Juz Ratio:",
        estTime: "Est. Reading Time:",
        reminderTitle: "Daily Quran Reminder",
        enableNotifications: "Enable Notifications"
    },
    fr: {
        appTitle: "Dar Yahya",
        whyReadQuran: "Pourquoi lisons-nous et apprenons-nous le Coran?!",
        selectKhatmah: "Sélectionner la Khatmah",
        weekly: "Hebdomadaire",
        monthly: "Mensuel",
        custom: "Personnalisé",
        byDays: "Par Jours",
        byPages: "Par Pages",
        startDate: "Date de Début",
        endDate: "Date de Fin",
        dailyPagesCount: "Pages Quotidiennes",
        dailyPages: "Lecture Quotidienne:",
        hizbRatio: "Proportion du Hizb:",
        juzRatio: "Proportion du Juz:",
        estTime: "Temps Estimé:",
        reminderTitle: "Rappel Quotidien du Coran",
        enableNotifications: "Activer les Notifications"
    },
    es: {
        appTitle: "Dar Yahya",
        whyReadQuran: "¿Por qué leemos y aprendemos el Corán?!",
        selectKhatmah: "Seleccionar Khatmah",
        weekly: "Semanal",
        monthly: "Mensual",
        custom: "Personalizado",
        byDays: "Por Días",
        byPages: "Por Páginas",
        startDate: "Fecha de Inicio",
        endDate: "Fecha de Fin",
        dailyPagesCount: "Páginas Diarias",
        dailyPages: "Lectura Diaria:",
        hizbRatio: "Proporción de Hizb:",
        juzRatio: "Proporción de Juz:",
        estTime: "Tiempo Estimado:",
        reminderTitle: "Recordatorio Diario del Corán",
        enableNotifications: "Activar Notificaciones"
    }
};

function autoDetectLanguage() {
    const savedLang = localStorage.getItem('dar_yahya_lang');
    if (savedLang) return savedLang;

    const navLang = (navigator.language || navigator.userLanguage || 'ar').substring(0, 2);
    return ['ar', 'en', 'fr', 'es'].includes(navLang) ? navLang : 'ar';
}

function applyLanguage(lang) {
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    localStorage.setItem('dar_yahya_lang', lang);

    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (translations[lang] && translations[lang][key]) {
            el.textContent = translations[lang][key];
        }
    });
}
