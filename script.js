const $ = (s, root = document) => root.querySelector(s);
const $$ = (s, root = document) => [...root.querySelectorAll(s)];
const storageKey = "stepikCourseFullSiteStateV1";
const defaultState = {
  user: null,
  savedAccount: null,
  access: {
    status: "none",
    trialDate: null,
    purchaseDate: null,
    giftDate: null,
    plan: null,
  },
  avatar: { color: "#2563eb", image: "" },
  settings: {
    accent: "#2563eb",
    darkTheme: false,
    compact: false,
    largeText: false,
    contrast: false,
    reducedMotion: false,
  },
  loginHistory: [],
  actions: [],
  notifications: [],
  operations: [],
  bookmarks: [],
  recentTopics: [],
  feedbackRequests: [],
  reviews: [],
  certificate: null,
};
let state = loadState();
let selectedPlan = "full";
let paymentMode = "self";
let reviewIndex = 0;

const lessons = [
  {
    id: "l1",
    module: "intro",
    type: "theory",
    title: "Целостность курса и входное тестирование",
    desc: "Общее знакомство с форматом курса и стартовой проверкой знаний.",
  },
  {
    id: "l2",
    module: "intro",
    type: "video",
    title: "Информационные технологии в бизнесе",
    desc: "Роль информационных систем в управлении предприятием.",
  },
  {
    id: "l3",
    module: "intro",
    type: "theory",
    title: "Понятие, задачи и состав КИС",
    desc: "Базовые компоненты корпоративной информационной системы.",
  },
  {
    id: "l4",
    module: "erp",
    type: "theory",
    title: "Методология MRP",
    desc: "Планирование потребности в материалах и производственные процессы.",
  },
  {
    id: "l5",
    module: "erp",
    type: "theory",
    title: "Методология MRP II",
    desc: "Расширенное планирование ресурсов производства.",
  },
  {
    id: "l6",
    module: "erp",
    type: "test",
    title: "ERP и ERP II",
    desc: "Проверка понимания современных методологий управления предприятием.",
  },
  {
    id: "l7",
    module: "oneC",
    type: "practice",
    title: "Скачивание и установка учебной версии 1С",
    desc: "Подготовка окружения для практических заданий.",
  },
  {
    id: "l8",
    module: "oneC",
    type: "practice",
    title: "Первоначальная настройка информационной базы",
    desc: "Создание и базовая настройка информационной базы.",
  },
  {
    id: "l9",
    module: "oneC",
    type: "practice",
    title: "Заполнение справочников организации",
    desc: "Подразделения, номенклатурные группы, склады и контрагенты.",
  },
  {
    id: "l10",
    module: "hr",
    type: "practice",
    title: "Учет кадров организации",
    desc: "Физические лица, должности и сотрудники.",
  },
  {
    id: "l11",
    module: "salary",
    type: "practice",
    title: "Настройка начисления заработной платы",
    desc: "Базовые операции для расчёта зарплаты.",
  },
  {
    id: "l12",
    module: "salary",
    type: "practice",
    title: "Больничные листы и отпускные",
    desc: "Практика начислений и расчетов с сотрудниками.",
  },
  {
    id: "l13",
    module: "materials",
    type: "practice",
    title: "Поступление и выбытие материалов",
    desc: "Учет материалов и складские документы.",
  },
  {
    id: "l14",
    module: "materials",
    type: "practice",
    title: "Выпуск и реализация готовой продукции",
    desc: "Готовая продукция, склад и реализация.",
  },
  {
    id: "l15",
    module: "final",
    type: "final",
    title: "Итоговое задание",
    desc: "Финальная работа по основным операциям курса.",
  },
];
const moduleNames = {
  intro: "Введение",
  erp: "MRP / ERP",
  oneC: "1С",
  hr: "Кадры",
  salary: "Зарплата",
  materials: "Материалы",
  final: "Итог",
};
const typeNames = {
  theory: "Теория",
  practice: "Практика",
  test: "Тест",
  video: "Видео",
  final: "Итоговое",
};
const baseReviews = [
  {
    name: "Анастасия Цораева",
    rating: 5,
    text: "Курс понравился: всё доступно и понятно, удобно проходить материалы по порядку.",
    date: "13 дней назад",
  },
  {
    name: "Георгий",
    rating: 5,
    text: "Хороший старт для понимания 1С и корпоративных информационных систем.",
    date: "в прошлом месяце",
  },
  {
    name: "Мария Тедеева",
    rating: 5,
    text: "Интересный курс, понятные объяснения, практические темы помогают закрепить материал.",
    date: "6 месяцев назад",
  },
  {
    name: "Диана Гергиева",
    rating: 4,
    text: "Много полезных тем, особенно понравились разделы по учёту и справочникам.",
    date: "6 месяцев назад",
  },
  {
    name: "Юлия",
    rating: 5,
    text: "Есть теория, видео и тесты. Если внимательно проходить материалы, разобраться реально.",
    date: "9 месяцев назад",
  },
];

function loadState() {
  try {
    return {
      ...structuredClone(defaultState),
      ...(JSON.parse(localStorage.getItem(storageKey)) || {}),
    };
  } catch {
    return structuredClone(defaultState);
  }
}
function saveState() {
  localStorage.setItem(storageKey, JSON.stringify(state));
}
function nowText() {
  return new Date().toLocaleString("ru-RU", {
    dateStyle: "short",
    timeStyle: "short",
  });
}
function isValidEmail(v) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
}
function initials(name = "", email = "") {
  const src = (name || email || "Гость").trim();
  const parts = src.split(/\s+/).filter(Boolean);
  return (
    parts.length > 1 ? parts[0][0] + parts[1][0] : src.slice(0, 2)
  ).toUpperCase();
}
function addAction(text) {
  state.actions.unshift({ text, date: nowText() });
  state.actions = state.actions.slice(0, 30);
  saveState();
  renderAccount();
}
function addNotification(text) {
  state.notifications.unshift({ text, date: nowText(), read: false });
  state.notifications = state.notifications.slice(0, 40);
  saveState();
  renderNotifications();
  showToast(text);
}
function addOperation(type, sum, status, details = "") {
  state.operations.unshift({ type, sum, status, details, date: nowText() });
  saveState();
  renderAccount();
}
function showToast(text, type = "success") {
  const box = $("#toastContainer");
  if (!box) return;
  const toast = document.createElement("div");
  toast.className = `toast ${type === "error" ? "error" : ""}`;
  toast.textContent = text;
  box.appendChild(toast);
  setTimeout(() => toast.remove(), 3200);
}
function openModal(id) {
  const modal = document.getElementById(id);
  if (modal) {
    modal.classList.add("active");
    document.body.style.overflow = "hidden";
  }
}
function closeModal(modal) {
  if (modal) {
    modal.classList.remove("active");
    if (!$(".modal.active")) document.body.style.overflow = "";
  }
}
function requireLogin() {
  if (state.user) return true;
  showToast("Сначала войдите или зарегистрируйтесь", "error");
  openModal("loginModal");
  return false;
}

function applySettings() {
  state.settings = {
    accent: "#2563eb",
    darkTheme: false,
    compact: false,
    largeText: false,
    contrast: false,
    reducedMotion: false,
    ...(state.settings || {}),
  };
  document.documentElement.style.setProperty(
    "--accent",
    state.settings.accent || "#2563eb",
  );
  document.body.classList.toggle("dark-theme", !!state.settings.darkTheme);
  const themeBtn = document.getElementById("themeToggleBtn");
  if (themeBtn) {
    themeBtn.textContent = state.settings.darkTheme ? "☀️" : "🌙";
    themeBtn.setAttribute(
      "aria-label",
      state.settings.darkTheme
        ? "Включить светлую тему"
        : "Включить ночную тему",
    );
  }
  document.body.classList.toggle("compact-mode", !!state.settings.compact);
  document.body.classList.toggle("large-text", !!state.settings.largeText);
  document.body.classList.toggle("contrast-mode", !!state.settings.contrast);
  document.body.classList.toggle(
    "reduced-motion",
    !!state.settings.reducedMotion,
  );
  const map = {
    settingAccent: "accent",
    settingDarkTheme: "darkTheme",
    settingCompact: "compact",
    settingLargeText: "largeText",
    settingContrast: "contrast",
    settingReducedMotion: "reducedMotion",
  };
  Object.entries(map).forEach(([id, key]) => {
    const el = document.getElementById(id);
    if (el) {
      if (el.type === "color") el.value = state.settings[key];
      else el.checked = !!state.settings[key];
    }
  });
}

function renderHeader() {
  const logged = !!state.user;
  $("#loginBtn")?.classList.toggle("hidden", logged);
  $("#registerBtn")?.classList.toggle("hidden", logged);
  $("#profileChip")?.classList.toggle("hidden", !logged);
  if (logged) {
    $("#chipName").textContent =
      state.user.name || state.user.email.split("@")[0];
    const av = $("#chipAvatar");
    av.textContent = initials(state.user.name, state.user.email);
    av.style.backgroundColor = state.avatar.color || state.settings.accent;
    if (state.avatar.image) {
      av.style.backgroundImage = `url(${state.avatar.image})`;
      av.textContent = "";
      av.style.backgroundSize = "cover";
      av.style.backgroundPosition = "center";
    } else {
      av.style.backgroundImage = "";
    }
  }
}
function renderAvatar(el) {
  if (!el) return;
  el.textContent = initials(state.user?.name, state.user?.email);
  el.style.backgroundColor = state.avatar.color || state.settings.accent;
  if (state.avatar.image) {
    el.style.backgroundImage = `url(${state.avatar.image})`;
    el.textContent = "";
  } else {
    el.style.backgroundImage = "";
  }
}
function renderAccount() {
  renderHeader();
  const name = state.user
    ? state.user.name || state.user.email.split("@")[0]
    : "Гость";
  const email = state.user ? state.user.email : "Войдите в аккаунт";
  if ($("#accountName")) $("#accountName").textContent = name;
  if ($("#accountEmail")) $("#accountEmail").textContent = email;
  renderAvatar($("#accountAvatar"));
  if ($("#profileNameInput"))
    $("#profileNameInput").value = state.user?.name || "";
  if ($("#profileEmailInput"))
    $("#profileEmailInput").value = state.user?.email || "";
  if ($("#avatarColorInput"))
    $("#avatarColorInput").value = state.avatar.color || state.settings.accent;
  const accessText =
    {
      none: "Нет доступа",
      trial: "Пробный доступ",
      full: "Полный доступ",
      gift: "Подарочный доступ",
    }[state.access.status] || "Нет доступа";
  if ($("#accessStatus")) $("#accessStatus").textContent = accessText;
  if ($("#trialDateText"))
    $("#trialDateText").textContent = state.access.trialDate
      ? `Пробный доступ активирован: ${state.access.trialDate}`
      : "Пробный доступ не активирован";
  renderMiniList(
    "#recentTopics",
    state.recentTopics.map(
      (x) => `<b>${x.title}</b><br><small>${x.date}</small>`,
    ),
    "Пока нет открытых тем",
  );
  renderMiniList(
    "#lessonBookmarks",
    state.bookmarks
      .map((id) => {
        const l = lessons.find((x) => x.id === id);
        return l
          ? `<b>${l.title}</b><br><small>${moduleNames[l.module]} · ${typeNames[l.type]}</small>`
          : "";
      })
      .filter(Boolean),
    "Закладок пока нет",
  );
  renderMiniList(
    "#loginHistory",
    state.loginHistory.map(
      (x) => `<b>${x.type}</b><br><small>${x.date}</small>`,
    ),
    "Истории пока нет",
  );
  renderMiniList(
    "#actionHistory",
    state.actions.map((x) => `<b>${x.text}</b><br><small>${x.date}</small>`),
    "Действий пока нет",
  );
  renderOperations();
  renderMiniList(
    "#savedRequests",
    state.feedbackRequests.map(
      (r) =>
        `<b>${r.topic}</b> — ${r.name}<br><small>${r.date}</small><br>${r.message}`,
    ),
    "Обращений пока нет",
  );
}
function renderMiniList(selector, items, empty) {
  const box = $(selector);
  if (!box) return;
  if (!items.length) {
    box.className = "mini-list empty-list";
    box.textContent = empty;
    return;
  }
  box.className = "mini-list";
  box.innerHTML = items
    .map((i) => `<div class="mini-list-item">${i}</div>`)
    .join("");
}
function renderOperations() {
  const box = $("#operationHistory");
  if (!box) return;
  if (!state.operations.length) {
    box.className = "operation-table empty-list";
    box.textContent = "Операций пока нет";
    return;
  }
  box.className = "operation-table";
  box.innerHTML = state.operations
    .map(
      (o) =>
        `<div class="operation-row"><b>${o.type}</b><span>${o.date}</span><span>${o.sum}</span><small>${o.status}${o.details ? "<br>" + o.details : ""}</small></div>`,
    )
    .join("");
}
function renderNotifications() {
  const unread = state.notifications.filter((n) => !n.read).length;
  const counter = $("#notificationCount");
  if (counter) {
    counter.textContent = unread;
    counter.style.display = unread ? "grid" : "none";
  }
  const box = $("#notificationList");
  if (!box) return;
  if (!state.notifications.length) {
    box.className = "mini-list empty-list";
    box.textContent = "Пока нет уведомлений";
    return;
  }
  box.className = "mini-list";
  box.innerHTML = state.notifications
    .map(
      (n) =>
        `<div class="mini-list-item"><b>${n.read ? "" : "● "}${n.text}</b><br><small>${n.date}</small></div>`,
    )
    .join("");
}

function renderProgram() {
  const search = ($("#programSearch")?.value || "").trim().toLowerCase();
  const module = $("#moduleFilter")?.value || "all";
  const type = $("#typeFilter")?.value || "all";
  const filtered = lessons.filter((l) => {
    const hay =
      `${l.title} ${l.desc} ${moduleNames[l.module]} ${typeNames[l.type]}`.toLowerCase();
    return (
      (!search || hay.includes(search)) &&
      (module === "all" || l.module === module) &&
      (type === "all" || l.type === type)
    );
  });
  $("#programResultCount").textContent = `Найдено: ${filtered.length}`;
  const box = $("#programList");
  if (!box) return;
  box.innerHTML =
    filtered
      .map(
        (l) => `
    <article class="card program-item">
      <div class="program-tags"><span class="tag">${moduleNames[l.module]}</span><span class="tag">${typeNames[l.type]}</span></div>
      <h3>${l.title}</h3><p>${l.desc}</p>
      <div class="program-actions">
        <button class="tiny-btn" data-open-lesson="${l.id}" type="button">Открыть</button>
        <button class="tiny-btn ${state.bookmarks.includes(l.id) ? "active" : ""}" data-bookmark="${l.id}" type="button">${state.bookmarks.includes(l.id) ? "В закладках" : "Закладка"}</button>
      </div>
    </article>`,
      )
      .join("") ||
    '<div class="card">По вашему запросу ничего не найдено.</div>';
}
function openLesson(id) {
  const l = lessons.find((x) => x.id === id);
  if (!l) return;
  state.recentTopics = state.recentTopics.filter((x) => x.id !== id);
  state.recentTopics.unshift({ id: l.id, title: l.title, date: nowText() });
  state.recentTopics = state.recentTopics.slice(0, 6);
  saveState();
  renderAccount();
  addNotification(`Открыта тема: ${l.title}`);
}
function toggleBookmark(id) {
  const has = state.bookmarks.includes(id);
  state.bookmarks = has
    ? state.bookmarks.filter((x) => x !== id)
    : [...state.bookmarks, id];
  const l = lessons.find((x) => x.id === id);
  saveState();
  renderProgram();
  renderAccount();
  addAction(
    `${has ? "Удалена закладка" : "Добавлена закладка"}: ${l?.title || "тема"}`,
  );
}

function planInfo(plan = selectedPlan) {
  if (plan === "split")
    return { name: "Сплит", sum: "1 750 ₽ × 4", total: "7 000 ₽" };
  if (plan === "parts")
    return { name: "Долями", sum: "1 750 ₽ × 4", total: "7 000 ₽" };
  return { name: "Полная оплата", sum: "7 000 ₽", total: "7 000 ₽" };
}
function renderPaymentModal() {
  const p = planInfo();
  $("#paymentPlanText").textContent = p.name;
  $("#paymentSumText").textContent = p.sum;
  $("#giftFields").classList.toggle("hidden", paymentMode !== "gift");
  $$(".payment-tab").forEach((btn) =>
    btn.classList.toggle("active", btn.dataset.mode === paymentMode),
  );
}
function confirmPayment() {
  if (!requireLogin()) return;
  if (!$("#paymentAgree").checked) {
    showToast("Подтвердите, что это учебная демо-операция", "error");
    return;
  }
  const p = planInfo();
  if (paymentMode === "gift") {
    const name = $("#giftName").value.trim();
    const email = $("#giftEmail").value.trim();
    const message = $("#giftMessage").value.trim();
    if (!name || !email || !isValidEmail(email) || message.length < 3) {
      showToast("Заполните данные подарка корректно", "error");
      return;
    }
    state.access.status = "gift";
    state.access.giftDate = nowText();
    state.access.plan = p.name;
    addOperation(
      "Подарочный доступ",
      p.total,
      "Оформлено",
      `${name}, ${email}`,
    );
    addAction(`Оформлен подарок для ${name}`);
    addNotification("Подарочный доступ оформлен");
  } else {
    state.access.status = "full";
    state.access.purchaseDate = nowText();
    state.access.plan = p.name;
    addOperation("Демо-оплата курса", p.total, "Активно", p.name);
    addAction(`Оформлен полный доступ: ${p.name}`);
    addNotification("Полный доступ к курсу активирован");
  }
  saveState();
  renderAccount();
  closeModal($("#paymentModal"));
  $("#paymentAgree").checked = false;
}
function activateTrial() {
  if (!requireLogin()) return;
  state.access.status =
    state.access.status === "full" || state.access.status === "gift"
      ? state.access.status
      : "trial";
  state.access.trialDate = state.access.trialDate || nowText();
  addOperation("Пробный доступ", "0 ₽", "Активно", "Вводный модуль");
  addAction("Активирован пробный доступ");
  addNotification("Пробный доступ активирован");
  saveState();
  renderAccount();
}

function updateInstallment() {
  const months = Number($("#installmentRange")?.value || 4);
  const amount = Math.ceil(7000 / months);
  $("#installmentMonths").textContent =
    `${months} ${months === 2 || months === 3 || months === 4 ? "месяца" : "месяцев"}`;
  $("#installmentAmount").textContent =
    `${amount.toLocaleString("ru-RU")} ₽ / мес.`;
}

function generateCertificate() {
  if (!requireLogin()) return;
  if (!["full", "gift"].includes(state.access.status)) {
    showToast("Сначала оформите полный или подарочный доступ", "error");
    return;
  }
  state.certificate = {
    name: state.user.name || state.user.email,
    date: new Date().toLocaleDateString("ru-RU"),
  };
  saveState();
  renderCertificate();
  openModal("certificateModal");
  addAction("Сформирован демо-сертификат");
  addNotification("Демо-сертификат готов");
}
function renderCertificate() {
  const cert = state.certificate || {
    name: state.user?.name || "Имя пользователя",
    date: new Date().toLocaleDateString("ru-RU"),
  };
  $("#certificateName").textContent = cert.name;
  $("#certificateDate").textContent = cert.date;
}
function downloadCertificate() {
  if (!state.certificate) {
    showToast("Сначала сформируйте сертификат", "error");
    return;
  }
  const cert = state.certificate;
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="800"><rect width="100%" height="100%" fill="#fffdf7"/><rect x="50" y="50" width="1100" height="700" fill="none" stroke="${state.settings.accent}" stroke-width="12"/><text x="600" y="150" text-anchor="middle" font-family="Arial" font-size="34" fill="#64748b" letter-spacing="8">СЕРТИФИКАТ</text><text x="600" y="245" text-anchor="middle" font-family="Arial" font-size="58" font-weight="700" fill="${state.settings.accent}">Stepik Course</text><text x="600" y="330" text-anchor="middle" font-family="Arial" font-size="28" fill="#475569">подтверждает, что</text><text x="600" y="415" text-anchor="middle" font-family="Arial" font-size="52" font-weight="700" fill="#111827">${escapeHtml(cert.name)}</text><text x="600" y="490" text-anchor="middle" font-family="Arial" font-size="28" fill="#475569">успешно завершил(а) демонстрационный курс</text><text x="600" y="560" text-anchor="middle" font-family="Arial" font-size="30" font-weight="700" fill="#111827">1С:Предприятие и КИС</text><text x="600" y="660" text-anchor="middle" font-family="Arial" font-size="24" fill="#64748b">${cert.date}</text></svg>`;
  const blob = new Blob([svg], { type: "image/svg+xml" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = "stepik-course-certificate.svg";
  a.click();
  URL.revokeObjectURL(a.href);
  addAction("Скачан демо-сертификат");
}
function escapeHtml(str) {
  return String(str).replace(
    /[&<>"]/g,
    (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c],
  );
}

function renderReviews() {
  const all = [...baseReviews, ...state.reviews];
  const filter = $("#reviewFilter")?.value || "all";
  const list =
    filter === "all" ? all : all.filter((r) => String(r.rating) === filter);
  if (reviewIndex >= list.length) reviewIndex = 0;
  const r = list[reviewIndex];
  const view = $("#reviewView");
  const dots = $("#reviewDots");
  if (!r) {
    view.innerHTML = '<p class="muted">Отзывов с такой оценкой пока нет.</p>';
    dots.innerHTML = "";
    return;
  }
  view.innerHTML = `<div class="review-stars">${"★".repeat(r.rating)}${"☆".repeat(5 - r.rating)}</div><p class="review-text">${r.text}</p><div class="review-author">${r.name}</div><small class="muted">${r.date || "сейчас"}</small>`;
  dots.innerHTML = list
    .map(
      (_, i) =>
        `<button class="${i === reviewIndex ? "active" : ""}" data-review-dot="${i}" type="button" aria-label="Отзыв ${i + 1}"></button>`,
    )
    .join("");
}
function shiftReview(step) {
  const all = [...baseReviews, ...state.reviews];
  const filter = $("#reviewFilter")?.value || "all";
  const list =
    filter === "all" ? all : all.filter((r) => String(r.rating) === filter);
  if (!list.length) return;
  reviewIndex = (reviewIndex + step + list.length) % list.length;
  renderReviews();
}

function handleFeedback(e) {
  e.preventDefault();
  const fd = new FormData(e.target);
  const name = fd.get("name").trim();
  const email = fd.get("email").trim();
  const topic = fd.get("topic");
  const message = fd.get("message").trim();
  const agree = fd.get("agree");
  if (name.length < 2) {
    showToast("Введите имя", "error");
    return;
  }
  if (!isValidEmail(email)) {
    showToast("Введите корректный email", "error");
    return;
  }
  if (message.length < 10) {
    showToast("Сообщение должно быть минимум 10 символов", "error");
    return;
  }
  if (!agree) {
    showToast("Подтвердите согласие", "error");
    return;
  }
  state.feedbackRequests.unshift({
    name,
    email,
    topic,
    message,
    date: nowText(),
  });
  saveState();
  e.target.reset();
  renderAccount();
  addAction(`Отправлено обращение: ${topic}`);
  addNotification("Ваш вопрос сохранён в личном кабинете");
}

function initEvents() {
  $("#burgerBtn")?.addEventListener("click", () =>
    $("#navMenu").classList.toggle("active"),
  );
  $$(".nav-link, .bottom-nav a").forEach((a) =>
    a.addEventListener("click", () =>
      $("#navMenu")?.classList.remove("active"),
    ),
  );
  $("#themeToggleBtn")?.addEventListener("click", () => {
    state.settings = {
      accent: "#2563eb",
      darkTheme: false,
      compact: false,
      largeText: false,
      contrast: false,
      reducedMotion: false,
      ...(state.settings || {}),
    };
    state.settings.darkTheme = !state.settings.darkTheme;
    saveState();
    applySettings();
    showToast(
      state.settings.darkTheme
        ? "Ночная тема включена"
        : "Светлая тема включена",
    );
  });
  $("#settingsBtn")?.addEventListener("click", () =>
    openModal("settingsModal"),
  );
  $("#notificationBtn")?.addEventListener("click", () =>
    openModal("notificationModal"),
  );
  $("#loginBtn")?.addEventListener("click", () => openModal("loginModal"));
  $("#registerBtn")?.addEventListener("click", () =>
    openModal("registerModal"),
  );
  $("#profileChip")?.addEventListener("click", () =>
    document.getElementById("account").scrollIntoView({ behavior: "smooth" }),
  );
  $$(".close-modal").forEach((btn) =>
    btn.addEventListener("click", () =>
      closeModal(document.getElementById(btn.dataset.close)),
    ),
  );
  $$(".modal").forEach((m) =>
    m.addEventListener("click", (e) => {
      if (e.target === m) closeModal(m);
    }),
  );
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") $$(".modal.active").forEach(closeModal);
  });

  $("#saveSettingsBtn")?.addEventListener("click", () => {
    state.settings = {
      accent: $("#settingAccent").value,
      darkTheme: $("#settingDarkTheme").checked,
      compact: $("#settingCompact").checked,
      largeText: $("#settingLargeText").checked,
      contrast: $("#settingContrast").checked,
      reducedMotion: $("#settingReducedMotion").checked,
    };
    state.avatar.color = state.avatar.color || state.settings.accent;
    saveState();
    applySettings();
    addNotification("Настройки сохранены");
    closeModal($("#settingsModal"));
  });
  $("#clearNotificationsBtn")?.addEventListener("click", () => {
    state.notifications.forEach((n) => (n.read = true));
    saveState();
    renderNotifications();
  });

  $("#registerForm")?.addEventListener("submit", (e) => {
    e.preventDefault();
    const fd = new FormData(e.target);
    const name = fd.get("name").trim();
    const email = fd.get("email").trim();
    const pass = fd.get("password").trim();
    if (name.length < 2 || !isValidEmail(email) || pass.length < 6) {
      showToast("Заполните имя, email и пароль от 6 символов", "error");
      return;
    }
    state.savedAccount = { name, email, pass };
    state.user = { name, email };
    state.loginHistory.unshift({ type: "Регистрация и вход", date: nowText() });
    saveState();
    e.target.reset();
    closeModal($("#registerModal"));
    renderAccount();
    addNotification("Регистрация выполнена");
  });
  $("#loginForm")?.addEventListener("submit", (e) => {
    e.preventDefault();
    const fd = new FormData(e.target);
    const email = fd.get("email").trim();
    const pass = fd.get("password").trim();
    if (!state.savedAccount) {
      showToast("Сначала зарегистрируйтесь", "error");
      return;
    }
    if (
      email !== state.savedAccount.email ||
      pass !== state.savedAccount.pass
    ) {
      showToast("Неверный email или пароль", "error");
      return;
    }
    state.user = { name: state.savedAccount.name, email };
    state.loginHistory.unshift({ type: "Вход в аккаунт", date: nowText() });
    saveState();
    e.target.reset();
    closeModal($("#loginModal"));
    renderAccount();
    addNotification("Вы вошли в аккаунт");
  });
  $("#profileForm")?.addEventListener("submit", (e) => {
    e.preventDefault();
    if (!requireLogin()) return;
    const name = $("#profileNameInput").value.trim();
    const email = $("#profileEmailInput").value.trim();
    if (name.length < 2 || !isValidEmail(email)) {
      showToast("Введите корректные данные профиля", "error");
      return;
    }
    state.user = { name, email };
    if (state.savedAccount) {
      state.savedAccount.name = name;
      state.savedAccount.email = email;
    }
    state.avatar.color = $("#avatarColorInput").value;
    saveState();
    applySettings();
    renderAccount();
    addNotification("Профиль обновлён");
  });
  $("#avatarColorInput")?.addEventListener("input", (e) => {
    state.avatar.color = e.target.value;
    saveState();
    renderAccount();
  });
  $("#avatarFileInput")?.addEventListener("change", (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      state.avatar.image = reader.result;
      saveState();
      renderAccount();
      addNotification("Аватар загружен");
    };
    reader.readAsDataURL(file);
  });

  ["programSearch", "moduleFilter", "typeFilter"].forEach((id) =>
    document.getElementById(id)?.addEventListener("input", renderProgram),
  );
  $("#clearProgramFilters")?.addEventListener("click", () => {
    $("#programSearch").value = "";
    $("#moduleFilter").value = "all";
    $("#typeFilter").value = "all";
    renderProgram();
  });
  $("#programList")?.addEventListener("click", (e) => {
    const open = e.target.closest("[data-open-lesson]");
    const bm = e.target.closest("[data-bookmark]");
    if (open) openLesson(open.dataset.openLesson);
    if (bm) toggleBookmark(bm.dataset.bookmark);
  });
  $("#continueBtn")?.addEventListener("click", () => {
    const item = state.recentTopics[0];
    if (item) {
      document.getElementById("program").scrollIntoView({ behavior: "smooth" });
      addNotification(`Продолжаем с темы: ${item.title}`);
    } else {
      showToast("Сначала откройте любую тему программы", "error");
    }
  });

  $$(".payment-plan").forEach((btn) =>
    btn.addEventListener("click", () => {
      selectedPlan = btn.dataset.plan;
      $$(".payment-plan").forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
    }),
  );
  $("#buyBtn")?.addEventListener("click", () => {
    if (!requireLogin()) return;
    paymentMode = "self";
    renderPaymentModal();
    openModal("paymentModal");
  });
  $("#giftBtn")?.addEventListener("click", () => {
    if (!requireLogin()) return;
    paymentMode = "gift";
    renderPaymentModal();
    openModal("paymentModal");
  });
  $("#trialBtn")?.addEventListener("click", activateTrial);
  $$(".payment-tab").forEach((btn) =>
    btn.addEventListener("click", () => {
      paymentMode = btn.dataset.mode;
      renderPaymentModal();
    }),
  );
  $("#confirmPaymentBtn")?.addEventListener("click", confirmPayment);
  $("#installmentRange")?.addEventListener("input", updateInstallment);

  $("#generateCertificateBtn")?.addEventListener("click", generateCertificate);
  $("#downloadCertificateBtn")?.addEventListener("click", downloadCertificate);

  $("#feedbackForm")?.addEventListener("submit", handleFeedback);
  $("#reviewFilter")?.addEventListener("change", () => {
    reviewIndex = 0;
    renderReviews();
  });
  $("#prevReview")?.addEventListener("click", () => shiftReview(-1));
  $("#nextReview")?.addEventListener("click", () => shiftReview(1));
  $("#reviewDots")?.addEventListener("click", (e) => {
    const dot = e.target.closest("[data-review-dot]");
    if (dot) {
      reviewIndex = Number(dot.dataset.reviewDot);
      renderReviews();
    }
  });
  $("#reviewForm")?.addEventListener("submit", (e) => {
    e.preventDefault();
    const fd = new FormData(e.target);
    const name = fd.get("name").trim();
    const rating = Number(fd.get("rating"));
    const text = fd.get("text").trim();
    if (name.length < 2 || text.length < 12) {
      showToast("Введите имя и отзыв минимум из 12 символов", "error");
      return;
    }
    state.reviews.unshift({ name, rating, text, date: "только что" });
    saveState();
    e.target.reset();
    reviewIndex = 0;
    renderReviews();
    addNotification("Ваш отзыв опубликован");
  });

  window.addEventListener("scroll", () => {
    const h = document.documentElement.scrollHeight - innerHeight;
    $("#scrollProgress").style.width =
      `${Math.max(0, Math.min(100, (scrollY / h) * 100))}%`;
    $("#toTopBtn").classList.toggle("visible", scrollY > 600);
    const pos = scrollY + 160;
    $$(".nav-link").forEach((link) => {
      const sec = $(link.getAttribute("href"));
      if (sec)
        link.classList.toggle(
          "active",
          pos >= sec.offsetTop && pos < sec.offsetTop + sec.offsetHeight,
        );
    });
  });
  $("#toTopBtn")?.addEventListener("click", () =>
    scrollTo({ top: 0, behavior: "smooth" }),
  );
}

function init() {
  applySettings();
  renderHeader();
  renderAccount();
  renderNotifications();
  renderProgram();
  renderReviews();
  updateInstallment();
  renderCertificate();
  initEvents();
}
init();
