# Blog — Filipe Costa

Markdown + Hugo + Decap CMS + divulgação automática.

São dois sites no mesmo repositório, com o mesmo tema:

- **Blog** em `https://filipecosta.eti.br`: textos, Sobre e política de privacidade. É o site principal, na raiz do repositório.
- **Consultoria** em `https://trabalho.filipecosta.eti.br`: serviços, treinamentos e o formulário de contato. Fica na pasta `trabalho/`.

Os endereços antigos `/consultoria/`, `/treinamentos/` e `/contato/` do domínio principal redirecionam para o subdomínio (`static/_redirects`).

Celular → `/admin` (Decap) → commit no GitHub → Action gera o site (Hugo), publica na Cloudflare e posta no Mastodon e Bluesky.

Não há limite prático de deploys: o build roda no GitHub Actions e a Cloudflare só recebe os arquivos prontos.

## Estrutura

```
content/posts/          posts em Markdown (um arquivo por post)
content/sobre.md        página Sobre ("no que acredito")
content/privacidade.md  política de privacidade (vale para os dois sites)
data/trajetoria.yaml    linha do tempo da página Sobre
data/experiencias.yaml  formações e projetos (Sobre e página inicial da consultoria)
static/admin/           painel do Decap CMS (config.yml), só no blog
static/uploads/         imagens enviadas pelo painel (usadas pelos dois sites)
static/_headers         cabeçalhos HTTP (cache das fontes)
static/_redirects       redirecionamentos dos endereços antigos para o subdomínio
hugo.toml               configuração do blog
wrangler.toml           Worker do blog (domínio, e-mail, arquivos estáticos)

trabalho/hugo.toml                   configuração do site de consultoria
trabalho/wrangler.toml               Worker do site de consultoria
trabalho/content/servicos/           serviços de consultoria (um arquivo por serviço)
trabalho/content/treinamentos/       cursos (um arquivo por curso; status: disponivel, em-atualizacao ou em-breve)
trabalho/content/contato.md          página de contato com formulário (recebido pelo Worker)

themes/filipe-costa/    tema com a identidade visual (ver o README do tema)
worker/index.js         código dos dois Workers: formulário de contato e login do Decap
.github/workflows/      publicar.yml: gera os dois sites, publica e divulga posts novos nas redes
.github/scripts/        script da divulgação
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

**Subdomínio de consultoria:** o Worker `filipecosta-trabalho` e o endereço `trabalho.filipecosta.eti.br` são criados pelo próprio workflow no primeiro deploy (o token "Edit Cloudflare Workers" já permite). Ele usa o mesmo envio de e-mail do blog, sem configuração extra.

Se o endereço `www.filipecosta.eti.br` for usado, crie na Cloudflare uma Redirect Rule de `www` para o domínio principal.

**Privacidade:** não ligue o Web Analytics nem o Bot Fight Mode da Cloudflare. O primeiro coloca um script de outro domínio nas páginas, e o segundo pode criar cookies. Os dois mudariam a política de privacidade.

## Uso

Crie o post no `/admin`, deixe "Rascunho" desligado e publique. A imagem de capa é opcional: sem ela, o site desenha uma capa com as cores da marca. A Action publica o site, posta nas redes e grava `syndicated: true` no arquivo para não repetir.

Para ver os sites localmente (Hugo 0.128 ou mais novo): `hugo server` para o blog e `hugo server --source trabalho` para o de consultoria.
