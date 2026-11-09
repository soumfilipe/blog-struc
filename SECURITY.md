# Política de segurança

## Como avisar sobre uma falha

**Não abra issue pública.** Use uma destas formas:

- o botão **Report a vulnerability**, na aba [Security](../../security/advisories/new) deste repositório; ou
- um e-mail para [ola@filipecosta.eti.br](mailto:ola@filipecosta.eti.br), com "Segurança" no assunto.

Conte o que encontrou, em qual endereço ou arquivo, como reproduzir e qual o impacto que você imagina. Respondo em até 7 dias e aviso quando a correção for publicada. Se quiser, seu nome entra nos agradecimentos da correção.

## O que está no escopo

- Os sites [filipecosta.eti.br](https://filipecosta.eti.br/) e [trabalho.filipecosta.eti.br](https://trabalho.filipecosta.eti.br/).
- O formulário de contato e o login do painel `/admin`, que rodam no Worker (`worker/`).
- Os workflows e scripts do GitHub Actions (`.github/`), que publicam o site e divulgam os posts.
- Vazamento de dados pessoais de quem usa o formulário.

## O que está fora do escopo

- Falhas nos serviços usados pelo site (Cloudflare, GitHub, Decap CMS, Proton Mail). Avise diretamente quem mantém cada um.
- Ataques de negação de serviço, testes automatizados em massa e engenharia social.
- Envio de mensagens em massa pelo formulário de contato para testar. Um teste ou dois é o suficiente.

## Versões com suporte

Só a versão publicada no momento, que é a do branch `principal`.
