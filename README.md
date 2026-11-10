# BBPM

Player/mixer de DJ instalável (PWA). Funciona offline após a primeira visita.

## Publicar no GitHub Pages
1. Crie um repositório e envie **todos** os arquivos desta pasta para a raiz (inclusive `.nojekyll` e `icons/`).
2. Settings → Pages → Source: *Deploy from a branch* → Branch `main` / pasta `/ (root)` → Save.
3. Acesse `https://SEU-USUARIO.github.io/NOME-DO-REPO/`.

## Instalar
- Android/Chrome/Edge: botão **⬇ Instalar app** (canto inferior direito) ou menu ⋮ → *Instalar aplicativo*.
- iPhone/iPad (Safari): Compartilhar → *Adicionar à Tela de Início*.

## Persistência
- Biblioteca, sessão, loops, presets e configurações: `localStorage`.
- Arquivos de áudio e samples: `IndexedDB` (`BBPMMediaStoreV1`).
- `pwa.js` pede `navigator.storage.persist()` para o navegador não apagar esses dados sozinho.
- Os dados ficam **por navegador e por origem**: instalar o app e abrir no navegador compartilham dados, mas trocar de domínio ou limpar dados do site apaga tudo. Use o backup de sessão/presets do próprio app.

## Atualizar uma versão publicada
Altere `CACHE_VERSION` em `sw.js` (ex.: `bbpm-shell-v3`) a cada deploy.
