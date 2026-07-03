# Sprites

Arte das entidades do jogo. Enquanto não há PNG real, o cliente desenha
**placeholders procedurais** (forma + cor por tipo) — a tela nunca fica vazia.

## Como funciona

`manifest.json` mapeia cada `type` (mesma chave do `src/game/entities/registry.js`)
para um descritor de render:

```json
"clown-balloon": { "w": 30, "h": 30, "shape": "balloon", "color": "#f85149" }
```

- **Sem `src`** → desenha placeholder (`shape` + `color`).
- **Com `src`** → carrega o PNG. Ex.: `"src": "enemies/act1/clown-balloon.png"`.

## Trocar por arte real (zero código)

1. Coloque o PNG na subpasta certa (ex.: `enemies/act1/clown-balloon.png`).
2. Adicione `"src"` na entrada do `manifest.json` apontando o caminho relativo
   a esta pasta.
3. Ajuste `w`/`h` se necessário. Pronto — `AssetLoader` carrega e `SpriteRenderer`
   usa a imagem automaticamente.

## Pastas

| Pasta | Conteúdo |
|---|---|
| `characters/` | sprites dos jogadores |
| `enemies/act1` | Palhaço Balão, Marionete Solta, Pipoqueiro Fantasma |
| `enemies/act2` | Homem-Forte, Contorcionista Sombra, Domador Sem Rosto |
| `enemies/act3` | Malabarista de Facas, Gêmeos do Espelho, A Plateia |
| `bosses/` | O Empresário |
| `items/` | Aplauso, upgrades das barracas |
