// Worker do site na Cloudflare.
// As páginas estáticas (pasta public/, gerada pelo Hugo) são servidas direto pela
// Cloudflare. Este código só roda nos endereços /api/*:
//   POST /api/contato         formulário de contato → e-mail para a caixa do Proton
//   GET  /api/auth            login do Decap CMS (/admin) com o GitHub
//   GET  /api/auth/callback   volta do GitHub com o código de acesso
import { EmailMessage } from "cloudflare:email";

const OBRIGADO = "/contato/obrigado/";
const ERRO = "/contato/erro/";

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    try {
      if (url.pathname === "/api/contato") return await contato(request, env, url);
      if (url.pathname === "/api/auth") return authStart(env, url);
      if (url.pathname === "/api/auth/callback") return await authCallback(request, env, url);
    } catch (e) {
      console.error(e);
      if (url.pathname === "/api/contato") return redirect(url, ERRO);
      return new Response("Erro interno", { status: 500 });
    }
    return env.ASSETS.fetch(request);
  },
};

const redirect = (url, path) => Response.redirect(new URL(path, url).toString(), 303);

/* ---------- Formulário de contato ---------- */

const CAMPOS = [
  ["nome", "Nome", 200],
  ["email", "E-mail", 200],
  ["organizacao", "Organização", 200],
  ["tipo", "Tipo de organização", 100],
  ["interesse", "Assunto", 300],
  ["mensagem", "Mensagem", 10000],
];

async function contato(request, env, url) {
  if (request.method !== "POST") return redirect(url, "/contato/");

  const form = await request.formData();
  // Campo invisível: só robôs preenchem. Finge que deu certo e descarta.
  if (String(form.get("empresa-site") || "").trim()) return redirect(url, OBRIGADO);

  const dados = {};
  for (const [nome, , max] of CAMPOS) {
    dados[nome] = String(form.get(nome) || "").trim().slice(0, max);
  }
  const emailOk = /^[^\s@<>"]+@[^\s@<>"]+\.[^\s@<>"]+$/.test(dados.email);
  if (!dados.nome || !emailOk || !dados.mensagem || form.get("aceite") !== "sim") {
    return redirect(url, ERRO);
  }

  const texto = CAMPOS.filter(([n]) => dados[n])
    .map(([n, rotulo]) => (n === "mensagem" ? `\n${rotulo}:\n${dados[n]}` : `${rotulo}: ${dados[n]}`))
    .join("\n");
  const assunto = `Contato pelo site: ${dados.interesse || dados.nome}`;

  const mime = montaMime({
    from: env.FORM_FROM,
    to: env.FORM_TO,
    replyTo: dados.email,
    subject: assunto,
    text: texto + "\n\n— Enviado pelo formulário de filipecosta.eti.br/contato/",
  });
  await env.EMAIL.send(new EmailMessage(env.FORM_FROM, env.FORM_TO, mime));
  return redirect(url, OBRIGADO);
}

// Monta a mensagem em MIME, com acentos codificados em UTF-8.
function montaMime({ from, to, replyTo, subject, text }) {
  const b64 = (s) => {
    const bytes = new TextEncoder().encode(s);
    let bin = "";
    for (const b of bytes) bin += String.fromCharCode(b);
    return btoa(bin);
  };
  const corpo = b64(text.replace(/\r?\n/g, "\r\n")).replace(/.{1,76}/g, "$&\r\n");
  const dominio = from.split("@")[1];
  return [
    `From: Site Filipe Costa <${from}>`,
    `To: <${to}>`,
    `Reply-To: <${replyTo}>`,
    `Subject: =?UTF-8?B?${b64(subject)}?=`,
    `Date: ${new Date().toUTCString().replace("GMT", "+0000")}`,
    `Message-ID: <${crypto.randomUUID()}@${dominio}>`,
    "MIME-Version: 1.0",
    "Content-Type: text/plain; charset=utf-8",
    "Content-Transfer-Encoding: base64",
    "",
    corpo,
  ].join("\r\n");
}

/* ---------- Login do Decap CMS com o GitHub ---------- */

function authStart(env, url) {
  const state = crypto.randomUUID();
  const github = new URL("https://github.com/login/oauth/authorize");
  github.searchParams.set("client_id", env.GITHUB_CLIENT_ID);
  github.searchParams.set("redirect_uri", new URL("/api/auth/callback", url).toString());
  github.searchParams.set("scope", "repo,user");
  github.searchParams.set("state", state);
  return new Response(null, {
    status: 302,
    headers: {
      Location: github.toString(),
      // Só para quem faz login no /admin: confere que a volta do GitHub é deste pedido.
      "Set-Cookie": `decap_state=${state}; Path=/api/auth; Max-Age=600; HttpOnly; Secure; SameSite=Lax`,
    },
  });
}

async function authCallback(request, env, url) {
  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");
  const cookie = (request.headers.get("Cookie") || "").match(/(?:^|;\s*)decap_state=([^;]+)/);
  if (!code || !state || !cookie || cookie[1] !== state) {
    return authPage("error", { message: "Login inválido ou expirado. Tente de novo." }, url);
  }

  const res = await fetch("https://github.com/login/oauth/access_token", {
    method: "POST",
    headers: { Accept: "application/json", "Content-Type": "application/json", "User-Agent": "filipecosta-site" },
    body: JSON.stringify({
      client_id: env.GITHUB_CLIENT_ID,
      client_secret: env.GITHUB_CLIENT_SECRET,
      code,
      redirect_uri: new URL("/api/auth/callback", url).toString(),
    }),
  });
  const data = await res.json();
  if (!data.access_token) {
    return authPage("error", { message: data.error_description || "O GitHub recusou o login." }, url);
  }
  return authPage("success", { token: data.access_token, provider: "github" }, url);
}

// Página que devolve o resultado ao Decap, na janela que abriu o login.
function authPage(status, content, url) {
  const msg = JSON.stringify(`authorization:github:${status}:${JSON.stringify(content)}`);
  const origin = JSON.stringify(url.origin);
  const html = `<!doctype html><meta charset="utf-8"><title>Login</title><p>Concluindo o login…</p>
<script>
(function () {
  var origin = ${origin};
  window.addEventListener("message", function (e) {
    if (e.origin !== origin || e.data !== "authorizing:github") return;
    window.opener.postMessage(${msg}, origin);
    setTimeout(function () { window.close(); }, 500);
  });
  window.opener && window.opener.postMessage("authorizing:github", origin);
})();
</script>`;
  return new Response(html, {
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      "Cache-Control": "no-store",
      "Set-Cookie": "decap_state=; Path=/api/auth; Max-Age=0; HttpOnly; Secure; SameSite=Lax",
    },
  });
}
