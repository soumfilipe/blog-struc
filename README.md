# Filipe Costa — site pessoal

Código e conteúdo de dois sites que compartilham o mesmo tema:

- **[filipecosta.eti.br](https://filipecosta.eti.br/)**: o blog, com textos sobre tecnologia, poder e o que é de todos. Fica na raiz do repositório.
- **[trabalho.filipecosta.eti.br](https://trabalho.filipecosta.eti.br/)**: consultoria e treinamentos, com o formulário de contato. Fica na pasta `trabalho/`.

Os sites não têm cookies, análise de visitas nem conteúdo de terceiros. Veja a [política de privacidade](https://filipecosta.eti.br/privacidade/).

## Como funciona

```
painel /admin (Decap CMS) → commit no GitHub → GitHub Actions gera os sites (Hugo)
  → publica na Cloudflare (Workers) → divulga os posts novos no Mastodon e no Bluesky
```

- **[Hugo](https://gohugo.io/)** gera os dois sites com o tema `themes/filipe-costa`.
- **[Decap CMS](https://decapcms.org/)** em `/admin` permite escrever e publicar pelo celular.
- **Cloudflare Workers** servem os arquivos e recebem o formulário de contato, que chega por e-mail. O mesmo código (`worker/`) também faz o login do painel.
- **GitHub Actions** (`.github/workflows/publicar.yml`) gera e publica os sites a cada commit no branch `principal` e divulga cada post novo uma única vez.

## Estrutura

```
content/posts/            textos do blog (um arquivo Markdown por texto)
content/                  páginas do blog: Sobre e política de privacidade
data/                     trajetória e experiências (usadas pelos dois sites)
static/admin/             configuração do painel Decap CMS
static/uploads/           imagens enviadas pelo painel (usadas pelos dois sites)
hugo.toml, wrangler.toml  configuração e Worker do blog

trabalho/content/         páginas, serviços e treinamentos do site de consultoria
trabalho/hugo.toml        configuração do site de consultoria
trabalho/wrangler.toml    Worker do site de consultoria

themes/filipe-costa/      tema com a identidade visual (veja o README do tema)
worker/                   formulário de contato e login do painel
.github/                  publicação, divulgação nas redes e modelos de issue e PR
brand/                    gerador das artes para redes sociais
```

## Rodar localmente

Com o [Hugo](https://gohugo.io/installation/) 0.128 ou mais novo, versão extended:

```bash
hugo server
```

```bash
hugo server --source trabalho
```

O primeiro comando abre o blog e o segundo o site de consultoria. O formulário e o login do painel só funcionam no site publicado.

## Publicar um texto

Crie o texto no `/admin`, deixe "Rascunho" desligado e publique. A capa é opcional: sem ela, o site desenha uma com as cores da marca. Depois de divulgar nas redes, a Action grava `syndicated: true` no arquivo para não repetir.

## Configuração

O workflow precisa destes secrets no GitHub (Settings → Secrets and variables → Actions):

| Nome | Para quê |
| --- | --- |
| `CLOUDFLARE_API_TOKEN`, `CLOUDFLARE_ACCOUNT_ID` | publicar os Workers (token com o modelo "Edit Cloudflare Workers") |
| `MASTODON_URL`, `MASTODON_TOKEN` | divulgar no Mastodon (escopo `write:statuses`) |
| `BLUESKY_HANDLE`, `BLUESKY_APP_PASSWORD` | divulgar no Bluesky (senha de app) |

E da variável `SITE_URL` = `https://filipecosta.eti.br`.

O Worker do blog precisa dos secrets `GITHUB_CLIENT_ID` e `GITHUB_CLIENT_SECRET`, de um OAuth App do GitHub com a callback `https://filipecosta.eti.br/api/auth/callback`. O endereço que envia e recebe o formulário fica em `wrangler.toml`.

Não ligue o Web Analytics nem o Bot Fight Mode da Cloudflare: o primeiro coloca um script de outro domínio nas páginas e o segundo pode criar cookies, o que mudaria a política de privacidade.

## Contribuir

Correções e avisos de erro são bem-vindos. Leia o [guia de contribuição](CONTRIBUTING.md) e o [código de conduta](CODE_OF_CONDUCT.md). Para falhas de segurança, siga a [política de segurança](SECURITY.md).

## Licença

O código está sob a licença [MIT](LICENSE). Os textos e as imagens estão sob a [CC BY-SA 4.0](LICENCA-CONTEUDO.md). O nome, o logotipo e a identidade visual não estão incluídos em nenhuma das duas.
