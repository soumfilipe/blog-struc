// Variantes brutalistas: concreto aparente sobre Noite, arestas duras, estrutura exposta.
// Paleta Concreto do brandbook (só em ilustrações e texturas, sempre sobre Noite)
// e um único elemento em roxo pastel por imagem.
// Cada variante devolve o SVG do fundo para um canvas W × H. "chao" é o topo da
// área do rodapé: nos formatos deitados, a arte termina acima dele.

const C = { c100: '#D7D4CE', c300: '#A9A59F', c500: '#8F8B85', c800: '#3A3835', noite: '#0B0A10', roxo: '#B994FF' };

// Textura de concreto: grão fino + manchas largas, aplicada recortada em cada forma.
const defs = (id) => `
<filter id="grao-${id}" x="0" y="0" width="100%" height="100%">
  <feTurbulence type="fractalNoise" baseFrequency=".9" numOctaves="3" seed="7" stitchTiles="stitch"/>
  <feColorMatrix type="saturate" values="0"/>
  <feComponentTransfer><feFuncA type="table" tableValues="0 .8"/></feComponentTransfer>
</filter>
<filter id="poro-${id}" x="0" y="0" width="100%" height="100%">
  <feTurbulence type="fractalNoise" baseFrequency=".22" numOctaves="3" seed="11"/>
  <feColorMatrix values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  1 0 0 0 0"/>
  <feComponentTransfer><feFuncA type="discrete" tableValues="0 0 0 0 0 0 0 .75"/></feComponentTransfer>
</filter>
<filter id="mancha-${id}" x="0" y="0" width="100%" height="100%">
  <feTurbulence type="fractalNoise" baseFrequency=".014" numOctaves="5" seed="3"/>
  <feColorMatrix type="saturate" values="0"/>
  <feComponentTransfer><feFuncA type="table" tableValues="0 .6"/></feComponentTransfer>
</filter>`;

const textura = (id, W, H, clip) => `
<g clip-path="url(#${clip})">
  <rect width="${W}" height="${H}" filter="url(#mancha-${id})" style="mix-blend-mode:multiply"/>
  <rect width="${W}" height="${H}" filter="url(#grao-${id})" style="mix-blend-mode:overlay"/>
  <rect width="${W}" height="${H}" filter="url(#poro-${id})"/>
</g>`;

const rects = (rs) => rs.map((r) => `<rect x="${r.x}" y="${r.y}" width="${r.w}" height="${r.h}"/>`).join('');
const svg = (W, H, body) =>
  `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">${body}</svg>`;

// Escala: 1 no quadrado 1080 × 1080
const escala = (W, H) => Math.sqrt(W * H) / 1080;

// ---------- laje: concreto de fôrma de tábuas, furos de tirante ----------
function laje(W, H, chao = H) {
  const u = escala(W, H);
  const deitado = W > H;
  const L = deitado ? { x: Math.round(W * 0.54), y: 0, w: W - Math.round(W * 0.54), h: chao } : { x: 0, y: 0, w: W, h: Math.round(H * 0.5) };
  const tabua = Math.round(54 * u);
  let linhas = '';
  for (let y = L.y + tabua; y < L.y + L.h; y += tabua)
    linhas += `<rect x="${L.x}" y="${y}" width="${L.w}" height="${Math.max(2, Math.round(2 * u))}" fill="${C.noite}" opacity=".28"/>`;
  let furos = '';
  const dx = Math.round(216 * u), dy = tabua * 3;
  for (let y = L.y + dy - tabua / 2; y < L.y + L.h - tabua / 2; y += dy)
    for (let x = L.x + dx / 2; x < L.x + L.w; x += dx)
      furos += `<circle cx="${x}" cy="${y}" r="${9 * u}" fill="${C.noite}" opacity=".75"/><circle cx="${x}" cy="${y}" r="${13 * u}" fill="none" stroke="${C.c100}" stroke-opacity=".35" stroke-width="${2 * u}"/>`;
  // viga roxa na aresta da laje (único acento)
  const viga = deitado
    ? `<rect x="${L.x - 14 * u}" y="0" width="${14 * u}" height="${L.h}" fill="${C.roxo}"/>`
    : `<rect x="0" y="${L.h}" width="${Math.round(W * 0.42)}" height="${14 * u}" fill="${C.roxo}"/>`;
  const sombra = deitado
    ? `<rect x="${L.x - 14 * u - 40 * u}" y="0" width="${40 * u}" height="${L.h}" fill="#000" opacity=".45"/>
       <rect x="${L.x - 54 * u}" y="${L.h}" width="${L.w + 54 * u}" height="${30 * u}" fill="#000" opacity=".45"/>`
    : `<rect x="0" y="${L.h}" width="${W}" height="${40 * u}" fill="#000" opacity=".45"/>`;
  return svg(W, H, `<defs>${defs('laje')}<clipPath id="laje">${rects([L])}</clipPath></defs>
<rect width="${W}" height="${H}" fill="${C.noite}"/>
${sombra}
<rect x="${L.x}" y="${L.y}" width="${L.w}" height="${L.h}" fill="${C.c500}"/>
${textura('laje', W, H, 'laje')}
${linhas}${furos}${viga}`);
}

// ---------- grelha: estrutura modular exposta, eixos em mono ----------
function grelha(W, H, chao = H) {
  const u = escala(W, H);
  const cols = W > H ? 6 : 4;
  const m = W / cols;
  const rows = Math.ceil(H / m);
  const traco = Math.max(3, Math.round(4 * u));
  let linhas = '';
  for (let i = 1; i < cols; i++) linhas += `<rect x="${i * m - traco / 2}" y="0" width="${traco}" height="${H}" fill="${C.c800}"/>`;
  for (let j = 1; j < rows; j++) linhas += `<rect x="0" y="${j * m - traco / 2}" width="${W}" height="${traco}" fill="${C.c800}"/>`;
  // módulos cheios: três de concreto e um roxo, no canto superior direito
  const modulo = (i, j) => ({ x: i * m + traco / 2, y: j * m + traco / 2, w: m - traco, h: m - traco });
  const conc = [modulo(cols - 1, 0), modulo(cols - 2, 0), modulo(cols - 1, 1)];
  const roxo = modulo(cols - 2, 1);
  const cheio = (i, j) => (i === cols - 2 && j === 1) || (i >= cols - 2 && j === 0) || (i === cols - 1 && j === 1);
  let eixos = '';
  const fs = Math.round(18 * u);
  for (let i = 0; i < cols; i++)
    for (let j = 0; j < Math.min(rows, 2); j++)
      eixos += `<text x="${i * m + 14 * u}" y="${j * m + 14 * u + fs}" font-family="JetBrains Mono" font-size="${fs}" letter-spacing="${fs * 0.04}" fill="${cheio(i, j) ? C.noite : C.c500}"${cheio(i, j) ? ' fill-opacity=".7"' : ''}>${String.fromCharCode(65 + i)}${j + 1}</text>`;
  return svg(W, H, `<defs>${defs('grelha')}<clipPath id="grelha">${rects(conc)}</clipPath></defs>
<rect width="${W}" height="${H}" fill="${C.noite}"/>
${linhas}
<g fill="${C.c500}">${rects(conc)}</g>
${textura('grelha', W, H, 'grelha')}
<rect x="${roxo.x}" y="${roxo.y}" width="${roxo.w}" height="${roxo.h}" fill="${C.roxo}"/>
${eixos}`);
}

// ---------- bloco: volumes em balanço com sombra dura ----------
function bloco(W, H, chao = H) {
  const u = escala(W, H);
  const deitado = W > H;
  const k = deitado ? { x0: 0.5, y: [0.1, 0.4, 0.64], h: [0.28, 0.24, 0.36] } : { x0: 0.3, y: [0.07, 0.21, 0.31], h: [0.13, 0.1, 0.17] };
  const Y = deitado ? chao - 22 * u : H; // espaço vertical da composição, já descontada a sombra
  const r = (x, y, w, h) => ({ x: Math.round(W * x), y: Math.round(Y * y), w: Math.round(W * w), h: Math.round(Y * h) });
  const B = [
    r(k.x0 + 0.14, k.y[0], 1 - k.x0 - 0.14 - 0.07, k.h[0]),
    r(k.x0, k.y[1], 1 - k.x0 - 0.07, k.h[1]),
    r(1 - 0.07 - 0.2, k.y[2], 0.2, k.h[2]),
  ];
  const off = Math.round(22 * u);
  const sombras = B.map((b) => `<rect x="${b.x + off}" y="${b.y + off}" width="${b.w}" height="${b.h}" fill="#000" opacity=".7"/>`).join('');
  const arestas = B.map((b) => `<rect x="${b.x}" y="${b.y}" width="${b.w}" height="${Math.max(2, Math.round(3 * u))}" fill="${C.c100}" opacity=".5"/>`).join('');
  // rasgo de janela roxo no volume do meio (único acento)
  const b = B[1];
  const rasgo = `<rect x="${b.x + 28 * u}" y="${b.y + b.h - 26 * u}" width="${b.w * 0.38}" height="${12 * u}" fill="${C.roxo}"/>`;
  return svg(W, H, `<defs>${defs('bloco')}<clipPath id="bloco">${rects(B)}</clipPath></defs>
<rect width="${W}" height="${H}" fill="${C.noite}"/>
${sombras}
<g fill="${C.c500}">${rects([B[0], B[2]])}</g><g fill="${C.c300}">${rects([B[1]])}</g>
${textura('bloco', W, H, 'bloco')}
${arestas}${rasgo}`);
}

// ---------- brise: brise-soleil vertical com luz roxa entre as lâminas ----------
function brise(W, H, chao = H) {
  const u = escala(W, H);
  const deitado = W > H;
  const A = deitado ? { x: Math.round(W * 0.5), y: 0, w: W - Math.round(W * 0.5), h: chao - Math.round(70 * u) - Math.round(28 * u) } : { x: 0, y: 0, w: W, h: Math.round(H * 0.52) };
  const passo = Math.round(92 * u), lam = Math.round(44 * u), lado = Math.round(16 * u);
  const L = [];
  for (let x = A.x + passo / 2 - lam / 2; x < A.x + A.w; x += passo) L.push({ x, y: A.y, w: lam, h: A.h });
  const faces = L.map((l) => `<rect x="${l.x + l.w}" y="${l.y}" width="${lado}" height="${l.h}" fill="#000" opacity=".55"/>`).join('');
  const viga = { x: A.x, y: A.y + A.h, w: A.w, h: Math.round(70 * u) };
  const formas = [...L, viga];
  return svg(W, H, `<defs>${defs('brise')}<clipPath id="brise">${rects(formas)}</clipPath>
  <radialGradient id="luz" cx="${deitado ? 0.78 : 0.72}" cy="${deitado ? 0.35 : 0.22}" r="${deitado ? 0.5 : 0.45}">
    <stop offset="0" stop-color="${C.roxo}" stop-opacity=".95"/><stop offset="1" stop-color="${C.roxo}" stop-opacity="0"/>
  </radialGradient>
  <linearGradient id="face" x1="0" x2="1"><stop offset="0" stop-color="${C.c300}"/><stop offset="1" stop-color="${C.c500}"/></linearGradient></defs>
<rect width="${W}" height="${H}" fill="${C.noite}"/>
<rect x="${A.x}" y="${A.y}" width="${A.w}" height="${A.h}" fill="url(#luz)"/>
${faces}
<g fill="url(#face)">${rects(L)}</g>
<rect x="${viga.x}" y="${viga.y}" width="${viga.w}" height="${viga.h}" fill="${C.c500}"/>
<rect x="${viga.x}" y="${viga.y + viga.h}" width="${viga.w}" height="${Math.round(28 * u)}" fill="#000" opacity=".5"/>
${textura('brise', W, H, 'brise')}`);
}

export const brutalistas = { laje, grelha, bloco, brise };
