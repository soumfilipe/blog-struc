# Instruções para o Claude neste repositório

Site pessoal de Filipe Costa, em dois endereços: o blog (https://filipecosta.eti.br, raiz do repositório) e o site de consultoria e treinamentos (https://consultoria.filipecosta.eti.br, pasta `consultoria/`, com o formulário de contato). Hugo com o tema `themes/filipe-costa`, painel Decap CMS em `/admin`, hospedagem, formulário e login do painel em dois Workers da Cloudflare com o mesmo código (`worker/`, `wrangler.toml` e `consultoria/wrangler.toml`), com build e deploy pelo GitHub Actions, divulgação de posts no Mastodon e no Bluesky por GitHub Actions. Branch principal: `v5`. Detalhes no `README.md`.

## Regra obrigatória: política de privacidade

A cada mudança neste repositório ou no site, verifique se a política de privacidade (`content/privacidade.md`, publicada em `/privacidade/`) precisa ser alterada, e diga o resultado dessa verificação ao concluir o trabalho.

A política vale para os dois endereços. Ela lista só quem recebe dados de visitantes ou de quem usa o formulário. Hoje são a Cloudflare (hospedagem e envio do formulário por e-mail) e o Proton Mail (e-mail que recebe as mensagens). O site não tem cookies, análise de visitas nem conteúdo de terceiros, e as fontes são servidas pelo próprio site. A única coisa guardada no navegador é a preferência de tema (`localStorage`, chave `fc-theme`).

A política precisa mudar quando uma mudança:

- carrega qualquer recurso de outro domínio nas páginas públicas (fontes, scripts, imagens, vídeos, mapas, botões ou widgets de redes sociais, CDNs);
- adiciona cookies, `localStorage` ou outro armazenamento no navegador;
- adiciona análise de visitas, newsletter, comentários ou qualquer coleta de dados;
- muda os campos, a finalidade, o destino ou o tempo de guarda dos dados do formulário de contato;
- troca o serviço de hospedagem ou de e-mail.

Ferramentas que não tratam dados de visitantes (GitHub, Decap CMS, Actions de deploy e de divulgação) não entram na política. O cookie `decap_state`, criado só durante o login no `/admin`, também não entra: não é usado com visitantes.

Quando a política mudar, atualize também a data de "Última atualização" no `subtitulo` do arquivo.
