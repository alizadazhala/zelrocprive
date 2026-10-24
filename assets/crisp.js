/* Shared Crisp installation. Explicit user actions only; no automatic messages or AI configuration. */
(() => {
  if (typeof URLSearchParams!=="undefined" && new URLSearchParams(location.search).get("embed")==="1" && window.parent!==window) return;
  if (window.__zelrocCrispInstalled) return;
  window.__zelrocCrispInstalled = true;
  window.$crisp = window.$crisp || [];
  window.CRISP_WEBSITE_ID = '61ecae3f-f1da-4bb8-b57f-42809a607fed';
  let returnFocus;
  let failed = false;
  let requested = false;
  let waitTimer;
  const status = document.querySelector('[data-chat-status]');
  const say = message => { if (status) { status.textContent = message; status.classList.add('is-visible'); } };
  const queue = command => window.$crisp.push(command);
  // The site's own labelled launcher replaces the vendor bubble, preventing overlap with the contact bar.
  queue(['do', 'chat:hide']);
  queue(['config', 'sound:mute', [true]]);
  queue(['config', 'color:theme', ['blue_grey']]);
  queue(['config', 'container:index', [70]]);
  const markOpen = () => {
    document.documentElement.classList.add('crisp-chat-open');
    if (status) status.classList.remove('is-visible');
    clearTimeout(waitTimer);
  };
  const openChat = () => {
    queue(['do', 'chat:show']);
    queue(['do', 'chat:open']);
    // A restored conversation may already be open but hidden; no new opened event is emitted.
    if (typeof window.$crisp.is === 'function' && window.$crisp.is('chat:opened')) markOpen();
  };
  queue(['on', 'chat:opened', markOpen]);
  queue(['on', 'chat:closed', () => {
    document.documentElement.classList.remove('crisp-chat-open');
    queue(['do', 'chat:hide']);
    requested = false;
    returnFocus?.focus();
  }]);
  queue(['on', 'session:loaded', () => {
    if (requested) openChat();
  }]);
  document.querySelectorAll('[data-crisp-open]').forEach(button => {
    button.addEventListener('click', () => {
      returnFocus = button;
      if (failed) {
        say('Chat could not load. Please email info@zelrocprive.com or use Instagram.');
        return;
      }
      requested = true;
      say('Opening chat… Email info@zelrocprive.com is also available.');
      openChat();
      clearTimeout(waitTimer);
      waitTimer = setTimeout(() => {
        if (!document.documentElement.classList.contains('crisp-chat-open')) say('Chat is taking longer to load. You can still email info@zelrocprive.com or use Instagram.');
      }, 12000);
    });
  });
  const existing = document.querySelector('script[src="https://client.crisp.chat/l.js"]');
  if (!existing) {
    const script = document.createElement('script');
    script.src = 'https://client.crisp.chat/l.js';
    script.async = true;
    script.id = 'zelroc-crisp-client';
    script.onerror = () => {
      failed = true;
      clearTimeout(waitTimer);
      document.documentElement.classList.remove('crisp-chat-open');
      if (requested) say('Chat could not load. Please email info@zelrocprive.com or use Instagram.');
    };
    document.head.appendChild(script);
  }
})();
