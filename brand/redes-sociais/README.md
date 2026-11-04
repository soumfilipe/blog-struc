# Fundos para posts nas redes sociais

Imagens de fundo com a identidade do brandbook: Noite `#0B0A10`, Roxo Neon Pastel `#B994FF`, Profundo `#5B3FD1`, Névoa `#F4F1FA`, wordmark `filipe costa▌` em Bricolage Grotesque 800 e endereço do site em JetBrains Mono. As texturas são as mesmas das capas automáticas do site (`themes/filipe-costa/assets/css/components.css`).

O rodapé com o wordmark já vem na imagem; o resto fica livre para o título e o texto do post.

Esta pasta não é publicada no site: o Hugo não lê `brand/`.

## Formatos (`png/<formato>-<variante>.png`)

| Formato | Tamanho | Uso |
| --- | --- | --- |
| `quadrado` | 1080 × 1080 | Instagram, LinkedIn, Mastodon |
| `retrato` | 1080 × 1350 | Instagram 4:5 |
| `story` | 1080 × 1920 | Stories e reels. Wordmark fora dos 250px de baixo, que o app cobre; deixe também os 250px de cima sem texto |
| `paisagem` | 1600 × 900 | Bluesky e Mastodon (16:9) |
| `link` | 1200 × 630 | Cartão de link (Open Graph) |

## Variantes

| Variante | Tema | Onde o texto fica melhor |
| --- | --- | --- |
| `aurora` | Escuro, brilho roxo no canto superior direito | Metade de baixo, à esquerda |
| `concreto` | Escuro, listras de concreto | Metade de baixo; use texto grande e peso alto |
| `orbita` | Profundo com anéis à direita | Coluna da esquerda |
| `pontos` | Escuro, grade de pontos | Qualquer área; a grade some perto do rodapé |
| `destaque` | Roxo pastel com texto Noite | Card de destaque: no máximo um por sequência de posts |
| `nevoa` | Claro | Texto em Noite e acento em Profundo, nunca em roxo pastel |

Regras da marca para o texto por cima: títulos em Bricolage Grotesque, uma única palavra em roxo por título (no escuro `#B994FF`, no claro `#5B3FD1`, no `destaque` sublinhado ou em Noite), rótulos em JetBrains Mono maiúsculo.

## Gerar de novo

Na primeira vez, instale o Playwright e o Chromium que ele usa (cerca de 150 MB, só nesta pasta):

```sh
cd brand/redes-sociais
npm install
```

Depois, de dentro da pasta:

```sh
npm run gerar
```

Ou, da raiz do repositório, `node brand/redes-sociais/gerar.mjs`. Formatos e variantes ficam no começo do script.
