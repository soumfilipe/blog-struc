# Instruções para o Claude neste repositório

Site pessoal de Filipe Costa (https://filipecosta.eti.br): Hugo com o tema `themes/filipe-costa`, painel Decap CMS em `/admin`, hospedagem e formulário no Netlify, divulgação de posts no Mastodon e no Bluesky por GitHub Actions. Branch principal: `v5`. Detalhes no `README.md`.

## Regra obrigatória: política de privacidade

A cada mudança neste repositório ou no site, verifique se a política de privacidade (`content/privacidade.md`, publicada em `/privacidade/`) precisa ser alterada, e diga o resultado dessa verificação ao concluir o trabalho.

A política lista só quem recebe dados de visitantes ou de quem usa o formulário. Hoje são o Netlify (hospedagem e formulário) e o Proton Mail (e-mail que recebe as mensagens). O site não tem cookies, análise de visitas nem conteúdo de terceiros, e as fontes são servidas pelo próprio site. A única coisa guardada no navegador é a preferência de tema (`localStorage`, chave `fc-theme`).

A política precisa mudar quando uma mudança:

- carrega qualquer recurso de outro domínio nas páginas públicas (fontes, scripts, imagens, vídeos, mapas, botões ou widgets de redes sociais, CDNs);
- adiciona cookies, `localStorage` ou outro armazenamento no navegador;
- adiciona análise de visitas, newsletter, comentários ou qualquer coleta de dados;
- muda os campos, a finalidade, o destino ou o tempo de guarda dos dados do formulário de contato;
- troca o serviço de hospedagem ou de e-mail.

Ferramentas que não tratam dados de visitantes (GitHub, Decap CMS, Actions de divulgação) não entram na política.

Quando a política mudar, atualize também a data de "Última atualização" no `subtitulo` do arquivo.
