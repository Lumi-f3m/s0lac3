const loginForm = document.getElementById('login-form');
const loginCard = document.getElementById('login-card');
const chatCard = document.getElementById('chat-card');
const errorEl = document.getElementById('login-error');
const activeUserEl = document.getElementById('active-user');
const messageForm = document.getElementById('message-form');
const messageInput = document.getElementById('message-input');
const messagesList = document.getElementById('messages');

let activeUser = '';

loginForm.addEventListener('submit', (event) => {
  event.preventDefault();

  const username = document.getElementById('username').value.trim();
  const password = document.getElementById('password').value;

  if (!username || !password) {
    errorEl.textContent = 'Please enter both username and password.';
    return;
  }

  errorEl.textContent = '';
  activeUser = username;
  activeUserEl.textContent = `Logged in as ${activeUser}`;
  loginCard.classList.add('hidden');
  chatCard.classList.remove('hidden');

  postMessage('System', `${activeUser} joined the room.`);
});

messageForm.addEventListener('submit', (event) => {
  event.preventDefault();
  const text = messageInput.value.trim();

  if (!text) {
    return;
  }

  postMessage(activeUser, text);
  messageInput.value = '';
});

function postMessage(author, text) {
  const item = document.createElement('li');
  const meta = document.createElement('div');
  const body = document.createElement('div');

  meta.className = 'meta';
  meta.textContent = `${author} • ${new Date().toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  })}`;
  body.textContent = text;

  item.append(meta, body);
  messagesList.appendChild(item);
  messagesList.scrollTop = messagesList.scrollHeight;
}

// Minimal monochrome particle background
const canvas = document.getElementById('particles');
const context = canvas.getContext('2d');
const particles = [];
const count = 80;

function fitCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}

function createParticle() {
  return {
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    r: Math.random() * 1.8 + 0.5,
    vx: (Math.random() - 0.5) * 0.3,
    vy: (Math.random() - 0.5) * 0.3,
  };
}

function setupParticles() {
  particles.length = 0;
  for (let i = 0; i < count; i += 1) {
    particles.push(createParticle());
  }
}

function draw() {
  context.clearRect(0, 0, canvas.width, canvas.height);
  context.fillStyle = 'rgba(255,255,255,0.8)';

  particles.forEach((p) => {
    p.x += p.vx;
    p.y += p.vy;

    if (p.x < 0) p.x = canvas.width;
    if (p.x > canvas.width) p.x = 0;
    if (p.y < 0) p.y = canvas.height;
    if (p.y > canvas.height) p.y = 0;

    context.beginPath();
    context.arc(p.x, p.y, p.r, 0, Math.PI * 2);
    context.fill();
  });

  requestAnimationFrame(draw);
}

window.addEventListener('resize', () => {
  fitCanvas();
  setupParticles();
});

fitCanvas();
setupParticles();
draw();
