const SESSION_KEY = 'solace_session';

const params = new URLSearchParams(window.location.search);
const selectedBlocker = (params.get('blocker') || 'blocksi').toLowerCase();
const MESSAGES_KEY = `solace_messages_${selectedBlocker}`;

let session = null;
try {
  session = JSON.parse(localStorage.getItem(SESSION_KEY) || 'null');
} catch {
  session = null;
}

if (!session?.username) {
  window.location.href = `auth.html?blocker=${selectedBlocker}`;
}

const channelTitle = document.getElementById('channel-title');
const activeUser = document.getElementById('active-user');
const logoutBtn = document.getElementById('logout-btn');
const messageForm = document.getElementById('message-form');
const messageInput = document.getElementById('message-input');
const messagesEl = document.getElementById('messages');

channelTitle.textContent = `${selectedBlocker} link chat`;
activeUser.textContent = `${session.username} • ${session.role}`;

function readMessages() {
  try {
    return JSON.parse(localStorage.getItem(MESSAGES_KEY) || '[]');
  } catch {
    return [];
  }
}

function saveMessages(messages) {
  localStorage.setItem(MESSAGES_KEY, JSON.stringify(messages));
}

function renderMessages() {
  const messages = readMessages();
  messagesEl.innerHTML = '';

  messages.forEach((entry) => {
    const li = document.createElement('li');
    const meta = document.createElement('div');
    const body = document.createElement('div');

    meta.className = 'meta';
    meta.textContent = `${entry.user} • ${entry.time}`;
    body.textContent = entry.text;

    li.append(meta, body);
    messagesEl.appendChild(li);
  });
}

messageForm?.addEventListener('submit', (event) => {
  event.preventDefault();
  const text = messageInput.value.trim();
  if (!text) return;

  const messages = readMessages();
  messages.push({
    user: session.username,
    text,
    time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
  });

  saveMessages(messages);
  messageInput.value = '';
  renderMessages();
});

logoutBtn?.addEventListener('click', () => {
  localStorage.removeItem(SESSION_KEY);
  window.location.href = `auth.html?blocker=${selectedBlocker}`;
});

renderMessages();
