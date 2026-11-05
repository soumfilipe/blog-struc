# Blog — Filipe Costa

Markdown + Hugo + Decap CMS + divulgação automática.

Celular → `/admin` (Decap) → commit no GitHub → Action gera o site (Hugo), publica na Cloudflare e posta no Mastodon e Bluesky.

Não há limite prático de deploys: o build roda no GitHub Actions e a Cloudflare só recebe os arquivos prontos.

## Estrutura

```
content/posts/          posts em Markdown (um arquivo por post)
content/consultoria/    serviços de consultoria (um arquivo por serviço)
content/treinamentos/   cursos (um arquivo por curso; status: disponivel, em-atualizacao ou em-breve)
content/sobre.md        página Sobre ("no que acredito")
content/contato.md      página de contato com formulário (recebido pelo Worker)
data/trajetoria.yaml    linha do tempo da página Sobre
data/experiencias.yaml  formações e projetos (página inicial e Sobre)
static/admin/           painel do Decap CMS (config.yml)
static/uploads/         imagens enviadas pelo painel
themes/filipe-costa/    tema com a identidade visual (ver o README do tema)
.github/workflows/      publicar.yml: gera o site, publica e divulga posts novos nas redes
.github/scripts/        script da divulgação
hugo.toml               configuração do site
worker/index.js         Worker da Cloudflare: formulário de contato e login do Decap
wrangler.toml           configuração do Worker (domínio, e-mail, arquivos estáticos)
static/_headers         cabeçalhos HTTP (cache das fontes)
```

Os posts publicados antes da migração já têm `syndicated: true`, para não serem divulgados de novo, e `aliases` com os endereços antigos (WordPress `/blog/aaaa/mm/dd/slug/` e Quartz `/aaaa-mm-dd-slug/`), que redirecionam para o endereço novo `/posts/slug/`.

## Setup (uma vez)

A ordem importa: o site antigo no Netlify continua no ar até o passo 5.

1. **Domínio na Cloudflare:** em dash.cloudflare.com, Add a domain → `filipecosta.eti.br`, plano Free. Confira se os registros importados incluem os do Proton Mail (MX, e os TXT de SPF, DKIM e DMARC), e só então troque os servidores DNS no registro.br pelos que a Cloudflare indicar. Espere a zona ficar "Active".
2. **E-mail do formulário:** em Email → Email Routing, cadastre `ola@filipecosta.eti.br` em Destination addresses e confirme pelo link que chega no Proton. **Não deixe a Cloudflare trocar os registros MX do domínio principal**: eles precisam continuar apontando para o Proton, senão o e-mail para de chegar. Se o painel só liberar o envio trocando o MX, ative o Email Routing num subdomínio (ex.: `site.filipecosta.eti.br`) e troque `FORM_FROM` no `wrangler.toml` para um endereço dele (ex.: `formulario@site.filipecosta.eti.br`).
3. **Login do Decap:** no GitHub, abra o OAuth App que já existe (Settings → Developer settings → OAuth Apps) e troque a Authorization callback URL para `https://filipecosta.eti.br/api/auth/callback`. Gere um Client secret novo.
4. **Secrets no GitHub** (Settings → Secrets and variables → Actions):
   - `CLOUDFLARE_API_TOKEN`: na Cloudflare, My Profile → API Tokens → Create Token → modelo "Edit Cloudflare Workers".
   - `CLOUDFLARE_ACCOUNT_ID`: aparece na página inicial da conta na Cloudflare.
   - Continuam valendo a variável `SITE_URL` = `https://filipecosta.eti.br` e os secrets da divulgação: `MASTODON_URL` (ex.: `https://mastodon.social`), `MASTODON_TOKEN` (Preferências → Desenvolvimento → Nova aplicação, escopo `write:statuses`), `BLUESKY_HANDLE` (ex.: `voce.bsky.social`), `BLUESKY_APP_PASSWORD` (Configurações → Senhas de app).
5. **Virada:** na Cloudflare, em DNS → Records, apague os registros de `filipecosta.eti.br` que apontam para o Netlify (A, AAAA ou CNAME do domínio principal; não mexa no MX nem nos TXT). Logo em seguida, rode o workflow "Publicar" (Actions → Publicar → Run workflow). Ele publica o Worker e liga o domínio a ele.
6. **Segredos do Worker:** na Cloudflare, Workers & Pages → `filipecosta` → Settings → Variables and Secrets, crie os secrets `GITHUB_CLIENT_ID` e `GITHUB_CLIENT_SECRET` com os dados do OAuth App. Teste o `/admin` e mande uma mensagem de teste pelo formulário.
7. **Netlify:** exporte as mensagens antigas do formulário (Forms → contato), apague-as lá e exclua o site do Netlify.
8. Acesse `https://filipecosta.eti.br/admin/`, faça login e adicione à tela inicial do celular.

Se o endereço `www.filipecosta.eti.br` for usado, crie na Cloudflare uma Redirect Rule de `www` para o domínio principal.

**Privacidade:** não ligue o Web Analytics nem o Bot Fight Mode da Cloudflare. O primeiro coloca um script de outro domínio nas páginas, e o segundo pode criar cookies. Os dois mudariam a política de privacidade.

## Uso

Crie o post no `/admin`, deixe "Rascunho" desligado e publique. A imagem de capa é opcional: sem ela, o site desenha uma capa com as cores da marca. A Action publica o site, posta nas redes e grava `syndicated: true` no arquivo para não repetir.

Para ver o site localmente: `hugo server` (Hugo 0.128 ou mais novo).
