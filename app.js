// =============================
// MIGRANTMAP / GETSETTLE APP JS
// =============================

// ======== NAV MENU =========
let navToggle = document.querySelector('.nav-toggle');
let navLinks = document.querySelector('.nav-links');

if (navToggle && navLinks) {
  navToggle.addEventListener('click', () => {
    navLinks.classList.toggle('show');
    navToggle.classList.toggle('active');
  });
}

// ======== THEME TOGGLE ========
const themeToggle = document.getElementById('theme-toggle');
const currentTheme = localStorage.getItem('theme');

if (currentTheme === 'dark') {
  document.body.classList.add('dark-mode');
  if (themeToggle) themeToggle.textContent = '☀️';
}

if (themeToggle) {
  themeToggle.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
    const theme = document.body.classList.contains('dark-mode') ? 'dark' : 'light';
    localStorage.setItem('theme', theme);
    themeToggle.textContent = theme === 'dark' ? '☀️' : '🌙';
  });
}

// ======== TASK TRACKER ========
const tasks = [
  { id: 'arrival-docs', title: 'Secure your important documents', description: 'Store your BRP, passport, and visa decision letter safely.' },
  { id: 'gp-registration', title: 'Register with a GP', description: 'Find and register with a local NHS GP surgery.' },
  { id: 'bank-account', title: 'Open a UK bank account', description: 'Choose a suitable high-street or digital bank.' },
  { id: 'ni-number', title: 'Apply for your National Insurance number', description: 'Apply online to work and access UK services.' },
  { id: 'english-classes', title: 'Join an English language course', description: 'Register for free ESOL classes near you.' },
  { id: 'community-links', title: 'Connect with community groups', description: 'Join newcomer meetups and local initiatives.' }
];

const STORAGE_KEY = 'settleInTasks';
const taskListEl = document.getElementById('task-list');
const progressBarEl = document.getElementById('progress-bar');
const progressPercentageEl = document.getElementById('progress-percentage');
const nextStepEl = document.getElementById('next-step');

let taskState = JSON.parse(localStorage.getItem(STORAGE_KEY)) || tasks.reduce((acc, t) => ({ ...acc, [t.id]: false }), {});

function saveTasks() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(taskState));
}

function updateProgress() {
  const total = tasks.length;
  const completed = tasks.filter((t) => taskState[t.id]).length;
  const percentage = Math.round((completed / total) * 100);

  if (progressBarEl) progressBarEl.style.width = `${percentage}%`;
  if (progressPercentageEl) progressPercentageEl.textContent = `${percentage}%`;

  if (nextStepEl) {
    nextStepEl.textContent =
      completed === total
        ? '🎉 Amazing work! You’ve completed all your essential steps.'
        : `Next: ${tasks.find((t) => !taskState[t.id]).title}`;
  }
}

function renderTasks() {
  if (!taskListEl) return;
  taskListEl.innerHTML = '';

  tasks.forEach((task) => {
    const wrapper = document.createElement('article');
    wrapper.className = 'task-item';
    if (taskState[task.id]) wrapper.classList.add('completed');

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.id = task.id;
    checkbox.checked = taskState[task.id];

    checkbox.addEventListener('change', () => {
      taskState[task.id] = checkbox.checked;
      wrapper.classList.toggle('completed', checkbox.checked);
      saveTasks();
      updateProgress();
    });

    const label = document.createElement('label');
    label.setAttribute('for', task.id);
    label.innerHTML = `<strong>${task.title}</strong><p>${task.description}</p>`;

    wrapper.appendChild(checkbox);
    wrapper.appendChild(label);
    taskListEl.appendChild(wrapper);
  });
}

renderTasks();
updateProgress();

// ======== CHATBOT =========
const chatWindow = document.getElementById('chat-window');
const chatForm = document.getElementById('chat-form');
const chatInput = document.getElementById('chat-message');
const hintButtons = document.querySelectorAll('.chat-hints button');

function scrollChat() {
  if (chatWindow) chatWindow.scrollTop = chatWindow.scrollHeight;
}

function addMessage(text, sender = 'bot') {
  if (!chatWindow) return;
  const message = document.createElement('div');
  message.className = `message ${sender}`;
  message.textContent = text;
  message.style.opacity = 0;
  chatWindow.appendChild(message);

  setTimeout(() => {
    message.style.transition = 'opacity 0.4s ease-in';
    message.style.opacity = 1;
  }, 50);

  scrollChat();
}

function getBotResponse(message) {
  const msg = message.toLowerCase();
  if (msg.includes('gp')) return 'To register with a GP, visit nhs.uk/service-search/find-a-gp.';
  if (msg.includes('bank')) return 'Most banks accept passports and BRPs as ID.';
  if (msg.includes('housing')) return 'For housing help, see shelter.org.uk or your local council.';
  if (msg.includes('progress')) {
    const done = tasks.filter((t) => taskState[t.id]).length;
    return `You’ve completed ${done} of ${tasks.length} steps. Keep going!`;
  }
  if (msg.includes('hello') || msg.includes('hi')) return '👋 Hi! How can I help you today?';
  return 'Sorry, I didn’t catch that. Try asking about housing, healthcare, or your plan.';
}

function handleChat(e) {
  e.preventDefault();
  if (!chatInput.value.trim()) return;
  const userMsg = chatInput.value.trim();
  addMessage(userMsg, 'user');
  chatInput.value = '';
  setTimeout(() => addMessage(getBotResponse(userMsg), 'bot'), 400);
}

if (chatForm) chatForm.addEventListener('submit', handleChat);

hintButtons.forEach((btn) => {
  btn.addEventListener('click', () => {
    if (chatInput) {
      chatInput.value = btn.dataset.hint;
      chatInput.focus();
    }
  });
});

if (chatWindow) {
  addMessage('👋 Welcome to GetSettle UK! Ask me about housing, GP registration, or your tasks.');
}

// ======== FOOTER YEAR ========
const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = new Date().getFullYear();
