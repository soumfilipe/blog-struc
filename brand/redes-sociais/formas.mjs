// Variantes só de formas: cores chapadas da marca, sem textura, degradê ou sombra.
// O vazio (Noite) desenha a forma e é onde entra o texto do post.
// Cada função recebe W × H e "chao", o topo da área do rodapé.

const C = { noite: '#0B0A10', roxo: '#B994FF', profundo: '#5B3FD1' };
const escala = (W, H) => Math.sqrt(W * H) / 1080;
const svg = (W, H, body) =>
  `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}"><rect width="${W}" height="${H}" fill="${C.noite}"/>${body}</svg>`;
const rect = (x, y, w, h, fill) => `<rect x="${Math.round(x)}" y="${Math.round(y)}" width="${Math.round(w)}" height="${Math.round(h)}" fill="${fill}"/>`;

// vão: viga e dois pilares; o vão livre entre eles é o espaço do texto
function vao(W, H, chao) {
  const u = escala(W, H);
  const deitado = W > H;
  const viga = Math.round(H * (deitado ? 0.3 : 0.26));
  const pilar = Math.round(W * (deitado ? 0.1 : 0.14));
  const base = chao - 36 * u;
  return svg(W, H,
    rect(0, 0, W, viga, C.profundo) +
    rect(0, viga, pilar, base - viga, C.profundo) +
    rect(W - pilar, viga, pilar, base - viga, C.profundo) +
    // faixa roxa sob a viga, como o vidro de um pavimento suspenso
    rect(pilar, viga - 26 * u, W - 2 * pilar, 26 * u, C.roxo));
}

// escada: massa em degraus pendurada no topo; o vazio em escada fica à esquerda
function escada(W, H, chao) {
  const deitado = W > H;
  const n = 4;
  const x0 = W * (deitado ? 0.42 : 0.28);
  const passo = (W - x0) / n;
  const alto = (deitado ? chao * 0.82 : H * 0.62) / n;
  let s = '';
  for (let i = 0; i < n; i++)
    s += rect(x0 + i * passo, 0, W - x0 - i * passo, alto * (i + 1), i === n - 1 ? C.roxo : C.profundo);
  return svg(W, H, s);
}

// arco: laje roxa com um arco vazado na borda de baixo
function arco(W, H, chao) {
  const deitado = W > H;
  const h = deitado ? chao * 0.62 : H * 0.44;
  const r = Math.min(W * (deitado ? 0.2 : 0.3), h * 0.75);
  const cx = W * (deitado ? 0.68 : 0.5);
  const path = `M0 0H${W}V${h}H${cx + r}A${r} ${r} 0 0 0 ${cx - r} ${h}H0Z`;
  return svg(W, H, `<path d="${path}" fill="${C.roxo}"/>`);
}

// encaixe: um L roxo e um quadrado Profundo no canto vazio, separados por uma junta de Noite
function encaixe(W, H, chao) {
  const u = escala(W, H);
  const deitado = W > H;
  const lado = deitado ? chao * 0.86 : W * 0.62;
  const x = W - lado - (deitado ? 0 : 0), y = 0;
  const e = lado * 0.42;          // espessura do L
  const junta = Math.round(22 * u);
  const L = `M${x} ${y}H${x + lado}V${y + lado}H${x + lado - e}V${y + e}H${x}Z`;
  const q = lado - e - junta;
  return svg(W, H,
    `<path d="${L}" fill="${C.roxo}"/>` +
    rect(x + lado - e - junta - q, y + e + junta, q, q, C.profundo));
}

export const formas = { vao, escada, arco, encaixe };
