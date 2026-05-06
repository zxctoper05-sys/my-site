const burgerBtn = document.getElementById("burgerBtn");
const navMenu = document.getElementById("navMenu");
const headerActions = document.querySelector(".header-actions");

const loginBtn = document.getElementById("loginBtn");
const registerBtn = document.getElementById("registerBtn");

const loginModal = document.getElementById("loginModal");
const registerModal = document.getElementById("registerModal");

const languageBtn = document.getElementById("languageBtn");
const themeBtn = document.getElementById("themeBtn");

const courseLabel = document.querySelector(".course-label");
const courseTitle = document.querySelector(".h-crs");
const courseText = document.querySelector(".p-crs");
const courseButton = document.querySelector(".course-btn");
const courseTags = document.querySelectorAll(".p-img-crs");

const paymentModal = document.getElementById("paymentModal");
const openPaymentBtn = document.getElementById("openPaymentBtn");
const closePaymentBtn = document.getElementById("closePaymentBtn");
const paymentTabs = document.querySelectorAll(".payment-tab");
const paymentPanels = document.querySelectorAll(".payment-panel");
const userEmailTexts = document.querySelectorAll(".user-email-text");
const tryFreeBtn = document.getElementById("tryFreeBtn");
const wantCourseBtn = document.getElementById("wantCourseBtn");

let currentLanguage = "ru";
let currentUserEmail = localStorage.getItem("userEmail") || "";

const translations = {
    ru: {
        courseLabel: "Онлайн-курс Stepik",
        courseTitle: "Корпоративные информационные системы на платформе 1С:Предприятие",
        courseText: "В курсе представлены теоретические основы корпоративных информационных систем, международные стандарты управления предприятием, особенности автоматизации финансов на платформе 1С:Предприятие, а также практические ситуационные задачи.",
        courseLevel: "Начальный уровень",
        courseCertificate: "Сертификат Stepik",
        courseButton: "Перейти к курсу",
        formSend: "Форма отправлена!",
        loginSuccess: "Вы вошли в аккаунт!",
        registerSuccess: "Регистрация выполнена!",
        emailEmpty: "Введите почту",
        paymentEmailEmpty: "Войдите, чтобы увидеть почту",
        paymentSuccess: "Оплата оформлена!",
        giftEmailEmpty: "Введите e-mail получателя",
        freeDemo: "Пробный доступ открыт!",
        wantCourse: "Курс добавлен в избранное!"
    },
    en: {
        courseLabel: "Stepik online course",
        courseTitle: "Corporate information systems on the 1C:Enterprise platform",
        courseText: "The course presents the theoretical foundations of corporate information systems, international enterprise management standards, features of financial automation on the 1C:Enterprise platform, as well as practical case tasks.",
        courseLevel: "Beginner level",
        courseCertificate: "Stepik certificate",
        courseButton: "Go to course",
        formSend: "Form submitted!",
        loginSuccess: "You are logged in!",
        registerSuccess: "Registration completed!",
        emailEmpty: "Enter email",
        paymentEmailEmpty: "Log in to see your email",
        paymentSuccess: "Payment completed!",
        giftEmailEmpty: "Enter recipient e-mail",
        freeDemo: "Free trial access opened!",
        wantCourse: "Course added to favorites!"
    }
};

if (burgerBtn && navMenu && headerActions) {
    burgerBtn.addEventListener("click", () => {
        burgerBtn.classList.toggle("active");
        navMenu.classList.toggle("active");
        headerActions.classList.toggle("active");
    });
}

document.querySelectorAll(".a-home").forEach(link => {
    link.addEventListener("click", () => {
        document.querySelectorAll(".a-home").forEach(item => item.classList.remove("active"));
        link.classList.add("active");

        if (burgerBtn && navMenu && headerActions) {
            burgerBtn.classList.remove("active");
            navMenu.classList.remove("active");
            headerActions.classList.remove("active");
        }
    });
});

if (loginBtn && loginModal) {
    loginBtn.addEventListener("click", () => openModal(loginModal));
}

if (registerBtn && registerModal) {
    registerBtn.addEventListener("click", () => openModal(registerModal));
}

function openModal(modal) {
    modal.classList.add("active");
    document.body.style.overflow = "hidden";
}

function closeModal(modal) {
    modal.classList.remove("active");
    document.body.style.overflow = "";
}

document.querySelectorAll(".close-modal").forEach(button => {
    button.addEventListener("click", () => {
        const modal = document.getElementById(button.getAttribute("data-close"));
        if (modal) closeModal(modal);
    });
});

document.querySelectorAll(".modal").forEach(modal => {
    modal.addEventListener("click", event => {
        if (event.target === modal) closeModal(modal);
    });
});

document.addEventListener("keydown", event => {
    if (event.key === "Escape") {
        if (loginModal) closeModal(loginModal);
        if (registerModal) closeModal(registerModal);
        if (paymentModal) closePaymentModal();
    }
});

if (themeBtn) {
    themeBtn.addEventListener("click", () => {
        document.body.classList.toggle("dark-theme");
        const isDark = document.body.classList.contains("dark-theme");
        themeBtn.textContent = isDark ? "☀️" : "🌙";
        localStorage.setItem("theme", isDark ? "dark" : "light");
    });
}

if (languageBtn) {
    languageBtn.addEventListener("click", () => {
        currentLanguage = currentLanguage === "ru" ? "en" : "ru";
        changeLanguage(currentLanguage);
        localStorage.setItem("language", currentLanguage);
    });
}

function changeLanguage(language) {
    currentLanguage = language;
    document.documentElement.lang = language;

    document.querySelectorAll("[data-ru][data-en]").forEach(element => {
        element.textContent = element.getAttribute(`data-${language}`);
    });

    document.querySelectorAll("[data-ru-placeholder][data-en-placeholder]").forEach(input => {
        input.placeholder = input.getAttribute(`data-${language}-placeholder`);
    });

    if (courseLabel) courseLabel.textContent = translations[language].courseLabel;
    if (courseTitle) courseTitle.textContent = translations[language].courseTitle;
    if (courseText) courseText.textContent = translations[language].courseText;
    if (courseButton) courseButton.textContent = translations[language].courseButton;
    if (courseTags[0]) courseTags[0].textContent = translations[language].courseLevel;
    if (courseTags[1]) courseTags[1].textContent = translations[language].courseCertificate;
    if (languageBtn) languageBtn.textContent = language === "ru" ? "EN" : "RU";

    updateUserEmailText();
    updateAccordionsHeight();
}

document.querySelectorAll(".login-form").forEach(form => {
    form.addEventListener("submit", event => {
        event.preventDefault();

        const emailInput = form.querySelector("input[type='email']");

        if (!emailInput || emailInput.value.trim() === "") {
            alert(translations[currentLanguage].emailEmpty);
            return;
        }

        currentUserEmail = emailInput.value.trim();
        localStorage.setItem("userEmail", currentUserEmail);
        updateUserEmailText();

        closeModal(loginModal);
        alert(translations[currentLanguage].loginSuccess);
    });
});

document.querySelectorAll(".register-form").forEach(form => {
    form.addEventListener("submit", event => {
        event.preventDefault();

        const emailInput = form.querySelector("input[type='email']");

        if (!emailInput || emailInput.value.trim() === "") {
            alert(translations[currentLanguage].emailEmpty);
            return;
        }

        currentUserEmail = emailInput.value.trim();
        localStorage.setItem("userEmail", currentUserEmail);
        updateUserEmailText();

        closeModal(registerModal);
        alert(translations[currentLanguage].registerSuccess);
    });
});

document.querySelectorAll(".accordion-item").forEach(item => {
    const header = item.querySelector(".accordion-header");
    const body = item.querySelector(".accordion-body");

    if (item.classList.contains("active") && body) {
        body.style.maxHeight = body.scrollHeight + "px";
    }

    if (header && body) {
        header.addEventListener("click", () => {
            item.classList.toggle("active");
            body.style.maxHeight = item.classList.contains("active") ? body.scrollHeight + "px" : null;
        });
    }
});

function updateAccordionsHeight() {
    document.querySelectorAll(".accordion-item.active .accordion-body").forEach(body => {
        body.style.maxHeight = body.scrollHeight + "px";
    });
}

function updateUserEmailText() {
    userEmailTexts.forEach(item => {
        item.textContent = currentUserEmail || translations[currentLanguage].paymentEmailEmpty;
    });
}

function openPaymentModal() {
    if (paymentModal) {
        updateUserEmailText();
        paymentModal.classList.add("active");
        document.body.style.overflow = "hidden";
    }
}

function closePaymentModal() {
    if (paymentModal) {
        paymentModal.classList.remove("active");
        document.body.style.overflow = "";
    }
}

if (openPaymentBtn) {
    openPaymentBtn.addEventListener("click", openPaymentModal);
}

if (closePaymentBtn) {
    closePaymentBtn.addEventListener("click", closePaymentModal);
}

if (paymentModal) {
    paymentModal.addEventListener("click", event => {
        if (event.target === paymentModal) closePaymentModal();
    });
}

paymentTabs.forEach(tab => {
    tab.addEventListener("click", () => {
        const tabName = tab.getAttribute("data-payment-tab");

        paymentTabs.forEach(item => item.classList.remove("active"));
        paymentPanels.forEach(panel => panel.classList.remove("active"));

        tab.classList.add("active");

        const activePanel = document.querySelector(`[data-payment-panel="${tabName}"]`);
        if (activePanel) activePanel.classList.add("active");
    });
});

document.querySelectorAll(".payment-main-btn, .payment-outline-btn").forEach(button => {
    button.addEventListener("click", () => {
        const giftPanel = document.querySelector('[data-payment-panel="gift"]');
        const isGiftActive = giftPanel && giftPanel.classList.contains("active");

        if (isGiftActive) {
            const giftEmail = giftPanel.querySelector("input[type='email']");

            if (!giftEmail || giftEmail.value.trim() === "") {
                alert(translations[currentLanguage].giftEmailEmpty);
                return;
            }
        }

        if (!isGiftActive && !currentUserEmail) {
            alert(translations[currentLanguage].paymentEmailEmpty);
            return;
        }

        alert(translations[currentLanguage].paymentSuccess);
        closePaymentModal();
    });
});

if (tryFreeBtn) {
    tryFreeBtn.addEventListener("click", () => {
        alert(translations[currentLanguage].freeDemo);
    });
}

if (wantCourseBtn) {
    wantCourseBtn.addEventListener("click", () => {
        alert(translations[currentLanguage].wantCourse);
    });
}

const animatedSections = document.querySelectorAll(
    ".course, .learn-section, .tariff-section, .about-section, .reviews-section"
);

if ("IntersectionObserver" in window) {
    const sectionObserver = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) entry.target.classList.add("section-visible");
        });
    }, {
        threshold: 0.18
    });

    animatedSections.forEach(section => {
        section.classList.add("section-hidden");
        sectionObserver.observe(section);
    });
} else {
    animatedSections.forEach(section => {
        section.classList.add("section-visible");
    });
}

window.addEventListener("load", () => {
    const savedTheme = localStorage.getItem("theme");
    const savedLanguage = localStorage.getItem("language");

    if (savedTheme === "dark") {
        document.body.classList.add("dark-theme");
        if (themeBtn) themeBtn.textContent = "☀️";
    }

    if (savedLanguage) {
        changeLanguage(savedLanguage);
    } else {
        changeLanguage("ru");
    }

    updateUserEmailText();
    updateAccordionsHeight();
});
