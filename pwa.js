/* BBPM — camada PWA: service worker, armazenamento persistente e botão de instalação. */
(function () {
  'use strict';
  const log = e => { try { console.debug('[BBPM-PWA]', e && e.message ? e.message : e); } catch (_) {} };
  const toast = msg => {
    try { if (typeof window.notify === 'function') return window.notify(msg); } catch (_) {}
    log(msg);
  };

  // 1) Service worker (exige HTTPS ou localhost — GitHub Pages já é HTTPS).
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('./sw.js').then(reg => {
        reg.addEventListener('updatefound', () => {
          const nw = reg.installing;
          if (!nw) return;
          nw.addEventListener('statechange', () => {
            if (nw.state === 'installed' && navigator.serviceWorker.controller) {
              toast('Nova versão do BBPM disponível. Feche e reabra o app para atualizar.');
            }
          });
        });
      }).catch(log);
    });
  }

  // 2) Pede armazenamento persistente: evita que o navegador apague IndexedDB/localStorage (faixas, samples, sessão).
  async function requestPersistence() {
    try {
      if (!navigator.storage || !navigator.storage.persist) return;
      let granted = await navigator.storage.persisted();
      if (!granted) granted = await navigator.storage.persist();
      window.BBPM_STORAGE_PERSISTENT = !!granted;
      if (navigator.storage.estimate) {
        const e = await navigator.storage.estimate();
        window.BBPM_STORAGE_ESTIMATE = e;
        log('Armazenamento persistente: ' + granted + ' | uso ' + Math.round((e.usage || 0) / 1048576) + ' MB de ' + Math.round((e.quota || 0) / 1048576) + ' MB');
      }
    } catch (e) { log(e); }
  }
  // Chrome concede com base em engajamento/instalação; tentamos no carregamento e após o 1º toque do usuário.
  requestPersistence();
  window.addEventListener('pointerdown', requestPersistence, { once: true });

  // 3) Botão "Instalar app" (Chrome/Edge/Android). No iOS: Compartilhar > Adicionar à Tela de Início.
  let deferredPrompt = null;
  function installButton() {
    let b = document.getElementById('bbpmInstallBtn');
    if (b) return b;
    b = document.createElement('button');
    b.id = 'bbpmInstallBtn';
    b.type = 'button';
    b.textContent = '⬇ Instalar app';
    b.style.cssText = 'position:fixed;right:10px;bottom:calc(10px + env(safe-area-inset-bottom,0px));z-index:30;display:none;' +
      'background:linear-gradient(#a8e300,#6d9700);color:#111;font-weight:bold;border:1px solid #465563;border-radius:5px;padding:8px 12px;box-shadow:0 2px 8px #0008';
    b.addEventListener('click', async () => {
      if (!deferredPrompt) return;
      deferredPrompt.prompt();
      try { await deferredPrompt.userChoice; } catch (_) {}
      deferredPrompt = null;
      b.style.display = 'none';
    });
    document.body.appendChild(b);
    return b;
  }
  window.addEventListener('beforeinstallprompt', e => {
    e.preventDefault();
    deferredPrompt = e;
    installButton().style.display = 'block';
  });
  window.addEventListener('appinstalled', () => {
    const b = document.getElementById('bbpmInstallBtn');
    if (b) b.style.display = 'none';
    deferredPrompt = null;
    requestPersistence();
    toast('BBPM instalado.');
  });
})();
