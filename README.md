# Blog — Filipe Costa

Markdown + Hugo + Decap CMS + divulgação automática.

Celular → `/admin` (Decap) → commit no GitHub → Netlify (Hugo) → Action posta no Mastodon e Bluesky.

## Estrutura

```
content/posts/          posts em Markdown (um arquivo por post)
content/consultoria/    serviços de consultoria (um arquivo por serviço)
content/treinamentos/   cursos (um arquivo por curso; status: disponivel, em-atualizacao ou em-breve)
content/sobre.md        página Sobre ("no que acredito")
content/contato.md      página de contato com formulário (Netlify Forms)
data/trajetoria.yaml    linha do tempo da página Sobre
data/experiencias.yaml  formações e projetos (página inicial e Sobre)
static/admin/           painel do Decap CMS (config.yml)
static/uploads/         imagens enviadas pelo painel
themes/filipe-costa/    tema com a identidade visual (ver o README do tema)
.github/workflows/      syndicate.yml: divulga posts novos nas redes
.github/scripts/        script da divulgação
hugo.toml               configuração do site
netlify.toml            build no Netlify
```

Os posts publicados antes da migração já têm `syndicated: true`, para não serem divulgados de novo, e `aliases` com os endereços antigos (WordPress `/blog/aaaa/mm/dd/slug/` e Quartz `/aaaa-mm-dd-slug/`), que redirecionam para o endereço novo `/posts/slug/`.

## Setup (uma vez)

1. **Netlify:** New site → Import from Git → escolha `soumfilipe/blog-struc`, branch `v5` (o `netlify.toml` já configura o build).
2. **Domínio:** Netlify → Domain management → Add custom domain `filipecosta.eti.br`, e aponte o DNS como ele indicar. Hoje o domínio aponta para o GitHub Pages: desative o Pages depois que o Netlify estiver no ar.
3. **Login do Decap:** GitHub → Settings → Developer settings → OAuth Apps → New.
   - Homepage URL: `https://filipecosta.eti.br`
   - Callback URL: `https://api.netlify.com/auth/done`

   Copie Client ID e Secret e cadastre em Netlify → Site configuration → Access & security → OAuth → Install provider (GitHub).
4. **Secrets/variáveis no GitHub** (Settings → Secrets and variables → Actions):
   - Variable: `SITE_URL` = `https://filipecosta.eti.br`
   - Secrets: `MASTODON_URL` (ex.: `https://mastodon.social`), `MASTODON_TOKEN` (Preferências → Desenvolvimento → Nova aplicação, escopo `write:statuses`), `BLUESKY_HANDLE` (ex.: `voce.bsky.social`), `BLUESKY_APP_PASSWORD` (Configurações → Senhas de app).
5. Acesse `https://filipecosta.eti.br/admin/`, faça login e adicione à tela inicial do celular.

6. **Formulário de contato:** Netlify → Forms → Enable form detection. As mensagens aparecem em Forms → contato; em Forms → Form notifications dá para recebê-las por e-mail.

## Uso

Crie o post no `/admin`, deixe "Rascunho" desligado e publique. A imagem de capa é opcional: sem ela, o site desenha uma capa com as cores da marca. A Action espera o site ficar no ar, posta nas redes e grava `syndicated: true` no arquivo para não repetir.

Para ver o site localmente: `hugo server` (Hugo 0.128 ou mais novo).
