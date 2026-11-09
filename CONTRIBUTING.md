# Como contribuir

Obrigado pelo interesse! Este é o repositório de um site pessoal, então as contribuições mais úteis são pequenas e pontuais. Ao participar, você concorda com o [código de conduta](CODE_OF_CONDUCT.md).

## O que é bem-vindo

- **Erros no site:** página quebrada, link que não funciona, problema de layout em algum navegador ou tamanho de tela.
- **Acessibilidade:** contraste, navegação por teclado, leitores de tela, textos alternativos.
- **Correções nos textos:** erros de digitação, gramática ou um link que mudou de endereço.
- **Melhorias no tema ou nos scripts**, desde que mantenham o site simples.

## O que não é aceito

- Textos novos ou mudanças de opinião nos textos publicados. Para discutir o conteúdo de um texto, escreva para [ola@filipecosta.eti.br](mailto:ola@filipecosta.eti.br) ou responda no Mastodon.
- Qualquer coisa que coloque nas páginas recursos de outros domínios, cookies, análise de visitas ou rastreamento (veja "Privacidade" abaixo).

## Como fazer

1. Para algo pequeno (um erro de digitação, por exemplo), abra o pull request direto.
2. Para algo maior, abra antes uma [issue](../../issues/new/choose) explicando a ideia, para não perder tempo com algo que não vai entrar.
3. Faça a mudança num branch a partir de `principal`.
4. Teste localmente com o Hugo 0.128 ou mais novo:
   - blog: `hugo server`
   - site de consultoria: `hugo server --source trabalho`
5. Abra o pull request para `principal` e preencha o modelo.

O `README.md` explica a estrutura do repositório e onde fica cada coisa.

## Privacidade

O site não tem cookies, análise de visitas nem conteúdo de terceiros, e a [política de privacidade](content/privacidade.md) diz exatamente isso. Toda mudança precisa ser verificada contra ela. A política precisa mudar quando uma mudança:

- carrega recursos de outro domínio nas páginas (fontes, scripts, imagens, vídeos, mapas, widgets);
- grava cookies, `localStorage` ou outro dado no navegador;
- adiciona análise de visitas, newsletter, comentários ou outra coleta de dados;
- muda os campos, a finalidade, o destino ou o tempo de guarda dos dados do formulário de contato;
- troca o serviço de hospedagem ou de e-mail.

Se for o caso, diga no pull request. Mudanças desse tipo dificilmente serão aceitas.

## Licença

Ao contribuir, você concorda que o seu código fica sob a licença [MIT](LICENSE) e que correções em textos ficam sob a [CC BY-SA 4.0](LICENCA-CONTEUDO.md), as mesmas do restante do repositório.

## Falhas de segurança

Não abra issue pública. Siga a [política de segurança](SECURITY.md).
