const toggle = document.getElementById('chat-toggle');
const panel = document.getElementById('chat-panel');
const closeBtn = document.getElementById('chat-close');
const heroOpen = document.getElementById('hero-open');
const form = document.getElementById('chat-form');
const input = document.getElementById('user-input');
const chatBox = document.getElementById('chat-box');
const sendButton = form.querySelector('button');

// Riwayat percakapan, dikirim utuh ke backend supaya bot ingat konteks
const conversation = [];

function openChat() {
  panel.hidden = false;
  toggle.hidden = true;
  toggle.setAttribute('aria-expanded', 'true');
  input.focus();
}
function closeChat() {
  panel.hidden = true;
  toggle.hidden = false;
  toggle.setAttribute('aria-expanded', 'false');
  toggle.focus();
}
toggle.addEventListener('click', openChat);
heroOpen.addEventListener('click', openChat);
closeBtn.addEventListener('click', closeChat);

function appendMessage(role, text) {
  const el = document.createElement('div');
  el.classList.add('message', role);
  el.textContent = text;
  chatBox.appendChild(el);
  chatBox.scrollTop = chatBox.scrollHeight;
  return el;
}

appendMessage('bot', 'Halo! Aku Asisten Kampus STMIK Catur Sakti Kendari. Ada yang bisa kubantu?');

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const userMessage = input.value.trim();
  if (!userMessage) return;

  appendMessage('user', userMessage);
  conversation.push({ role: 'user', text: userMessage });
  input.value = '';
  sendButton.disabled = true;

  const pending = appendMessage('bot', 'Sedang mengetik...');
  pending.classList.add('pending');

  try {
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ conversation }),
    });
    const data = await response.json();
    pending.classList.remove('pending');
    if (data.result) {
      pending.textContent = data.result;
      conversation.push({ role: 'model', text: data.result });
    } else {
      pending.textContent = 'Maaf, tidak ada jawaban yang diterima.';
      conversation.pop();
    }
  } catch (err) {
    pending.classList.remove('pending');
    pending.textContent = 'Gagal terhubung ke server. Coba lagi sebentar.';
    conversation.pop();
  } finally {
    sendButton.disabled = false;
    input.focus();
    chatBox.scrollTop = chatBox.scrollHeight;
  }
});