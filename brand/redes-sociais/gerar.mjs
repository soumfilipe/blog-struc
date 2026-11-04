// Gera as imagens de fundo para posts nas redes sociais com as cores,
// texturas e o wordmark do brandbook (mesmas capas automáticas do site).
// Uso, na primeira vez:  cd brand/redes-sociais && npm install
// Depois:                npm run gerar   (ou node brand/redes-sociais/gerar.mjs)
import { createRequire } from 'node:module';
import { mkdirSync, writeFileSync, rmSync } from 'node:fs';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { dirname, join } from 'node:path';

const here = dirname(fileURLToPath(import.meta.url));
const fonts = pathToFileURL(join(here, '../../themes/filipe-costa/static/fonts/')).href;
const out = join(here, 'png');
mkdirSync(out, { recursive: true });
let chromium;
try {
  ({ chromium } = createRequire(import.meta.url)('playwright'));
} catch {
  console.error('Playwright não encontrado. Rode antes:\n  cd brand/redes-sociais && npm install');
  process.exit(1);
}

// Formatos. "safe" = margem livre de interface do app (stories: topo e base).
const formatos = {
  quadrado: { w: 1080, h: 1080, pad: 72, safeTop: 0, safeBottom: 0 },    // Instagram, LinkedIn, Mastodon
  retrato:  { w: 1080, h: 1350, pad: 72, safeTop: 0, safeBottom: 0 },    // Instagram 4:5
  story:    { w: 1080, h: 1920, pad: 72, safeTop: 250, safeBottom: 250 }, // stories e reels 9:16
  paisagem: { w: 1600, h: 900,  pad: 80, safeTop: 0, safeBottom: 0 },    // Bluesky, Mastodon 16:9
  link:     { w: 1200, h: 630,  pad: 64, safeTop: 0, safeBottom: 0 },    // cartão de link (Open Graph)
};

// Variantes. 0 a 3 repetem as capas automáticas do tema (components.css), em escala.
// "destaque" é o card roxo: no máximo um por sequência de posts.
const variantes = {
  aurora: { tema: 'escuro', bg: (s) => `
    radial-gradient(circle at 85% 15%, rgb(185 148 255 / .85), transparent 45%),
    linear-gradient(160deg, #5B3FD1, #0B0A10 70%)` },
  concreto: { tema: 'escuro', bg: (s) => `
    radial-gradient(circle at 20% 25%, rgb(185 148 255 / .7), transparent 35%),
    repeating-linear-gradient(115deg, #3A3835 0 ${2 * s}px, transparent ${2 * s}px ${14 * s}px),
    #0B0A10` },
  orbita: { tema: 'escuro', bg: (s) => `
    radial-gradient(circle at 70% 35%, transparent 0 28%, #B994FF 28% 29%, transparent 29% 40%, rgb(185 148 255 / .5) 40% 40.6%, transparent 40.6%),
    linear-gradient(200deg, #5B3FD1, #2B1F66 55%, #0B0A10)` },
  pontos: { tema: 'escuro',
    trama: (s) => `radial-gradient(circle, rgb(185 148 255 / .55) ${1.5 * s}px, transparent ${2 * s}px) 0 0 / ${18 * s}px ${18 * s}px`,
    bg: (s) => `
    radial-gradient(circle at 80% 90%, #5B3FD1, transparent 60%),
    #0B0A10` },
  destaque: { tema: 'roxo',
    trama: (s) => `radial-gradient(circle, rgb(11 10 16 / .14) ${1.5 * s}px, transparent ${2 * s}px) 0 0 / ${18 * s}px ${18 * s}px`,
    bg: () => '#B994FF' },
  nevoa: { tema: 'claro', bg: (s) => `
    radial-gradient(circle at 85% 15%, rgb(185 148 255 / .55), transparent 45%),
    linear-gradient(160deg, #FFFFFF, #F4F1FA 60%)` },
};

// Cores do wordmark por tema. No claro o acento é Profundo, nunca o pastel.
const cores = {
  escuro: { texto: '#F4F1FA', cursor: '#B994FF', borda: 'rgb(244 241 250 / .14)' },
  roxo:   { texto: '#0B0A10', cursor: '#0B0A10', borda: 'rgb(11 10 16 / .18)' },
  claro:  { texto: '#0B0A10', cursor: '#5B3FD1', borda: 'rgb(11 10 16 / .12)' },
};

const pagina = (f, v) => {
  const s = f.w / 400; // capas do site têm cerca de 400px de largura
  const c = cores[v.tema];
  const fs = Math.round(f.w * 0.04);
  return `<!doctype html><html><head><meta charset="utf-8"><style>
@font-face { font-family: 'Bricolage Grotesque'; font-weight: 200 800; src: url('${fonts}bricolage-grotesque-latin-opsz-normal.woff2') format('woff2'); }
@font-face { font-family: 'JetBrains Mono'; font-weight: 100 800; src: url('${fonts}jetbrains-mono-latin-wght-normal.woff2') format('woff2'); }
html, body { margin: 0; width: ${f.w}px; height: ${f.h}px; overflow: hidden; }
.bg, .trama { position: absolute; inset: 0; }
.bg { background: ${v.bg(s)}; }
.trama { background: ${v.trama ? v.trama(s) : 'none'};
  /* a trama some perto do wordmark para não atrapalhar a leitura */
  mask-image: linear-gradient(to top, transparent ${f.safeBottom + f.pad + fs * 2.5}px, #000 ${f.safeBottom + f.pad + fs * 7}px); }
.marca { position: absolute; left: ${f.pad}px; right: ${f.pad}px; bottom: ${f.pad + f.safeBottom}px;
  display: flex; align-items: center; justify-content: space-between;
  padding-top: ${Math.round(fs * 0.7)}px; border-top: 2px solid ${c.borda}; }
.logo { font: 800 ${fs}px/1 'Bricolage Grotesque'; letter-spacing: -.04em; color: ${c.texto}; display: flex; align-items: center; }
.cursor { display: inline-block; width: .3em; height: .82em; margin-left: .06em; background: ${c.cursor}; }
.url { font: 400 ${Math.round(fs * 0.5)}px/1 'JetBrains Mono'; letter-spacing: .04em; text-transform: uppercase; color: ${c.texto}; opacity: .75; }
</style></head><body><div class="bg"></div><div class="trama"></div>
<div class="marca"><span class="logo">filipe costa<span class="cursor"></span></span><span class="url">filipecosta.eti.br</span></div>
</body></html>`;
};

const browser = await chromium.launch();
const page = await browser.newPage();
for (const [fn, f] of Object.entries(formatos)) {
  await page.setViewportSize({ width: f.w, height: f.h });
  for (const [vn, v] of Object.entries(variantes)) {
    // Arquivo em disco (não setContent) para a página poder ler as fontes por file://
    const html = join(out, '_tmp.html');
    writeFileSync(html, pagina(f, v));
    await page.goto(pathToFileURL(html).href, { waitUntil: 'load' });
    const ok = await page.evaluate(async () => { await document.fonts.ready; return document.fonts.check("800 40px 'Bricolage Grotesque'") && document.fonts.check("400 20px 'JetBrains Mono'"); });
    if (!ok) throw new Error('Fontes da marca não carregaram');
    await page.screenshot({ path: join(out, `${fn}-${vn}.png`) });
    console.log(`png/${fn}-${vn}.png`);
  }
}
await browser.close();
rmSync(join(out, '_tmp.html'), { force: true });
