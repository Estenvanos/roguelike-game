# 🎪 Carnaval das Sombras

> Um roguelike cooperativo de sobrevivência a hordas, multiplayer em tempo real, com netcode autoritativo construído do zero sobre WebSockets.

---

## 📖 Lore

A cada lua cheia, uma cidadezinha esquecida é visitada pelo **Carnaval Bemvindo** — que ninguém convidou e ninguém consegue impedir de chegar.

Décadas atrás, um grupo de artistas itinerantes fez um pacto com uma entidade só conhecida como **O Empresário** para nunca envelhecer, nunca parar de se apresentar. O preço: a cada noite de show, o carnaval precisa "alimentar a plateia" — e a plateia são os monstros que ele cria.

Os jogadores são sobreviventes presos dentro da cerca do parque quando os portões se fecham sozinhos ao anoitecer. A única saída é resistir até o carnaval "encerrar a sessão" ao amanhecer, ou encontrar e derrotar O Empresário antes disso.

---

## 🎭 Os atos (ondas de inimigos)

### Ato 1 — Abertura *(fácil)*
| Inimigo | Comportamento |
|---|---|
| Palhaços Balão | Fracos, explodem em confete cortante ao morrer (dano em área) |
| Marionetes Soltas | Lentas, se movem em grupo puxadas por fios invisíveis |
| Pipoqueiros Fantasma | Parados, atiram pipoca em chamas à distância |

### Ato 2 — Atrações Principais *(médio)*
| Inimigo | Comportamento |
|---|---|
| Homem-Forte Enferrujado | Tanque lento, quebra cobertura |
| Contorcionista Sombra | Rápida, se desloca por espaços apertados, ataques imprevisíveis |
| Domador Sem Rosto | Controla um grupo de feras distorcidas como minions |

### Ato 3 — Espetáculo Final *(difícil)*
| Inimigo | Comportamento |
|---|---|
| Malabarista de Facas | Ataques à distância em padrão giratório, obriga movimentação constante |
| Gêmeos do Espelho | Só morrem se atacados simultaneamente (força cooperação) |
| A Plateia | Espectadores mascarados que só aparecem quando os jogadores ficam parados tempo demais — pune camping |

### Chefe de ciclo — **O Empresário**
Muda de forma conforme a fase (mestre de cerimônias → mágico → figura de sombra pura), literalmente "dirige" as próximas ondas como se fosse um show ao vivo.

---

## 🎡 Mecânicas centrais

- **Sistema de Aplausos** — matar inimigos de forma estilosa (combos, headshots) gera "aplausos" da plateia invisível: uma moeda de progressão dentro da run, tipo hype meter que dá buffs temporários.
- **Barracas amaldiçoadas** — upgrades vêm de barraquinhas temáticas: *Tiro ao Alvo* (upgrade de arma), *Casa dos Espelhos* (duplicação/clone), *Roda da Fortuna* (upgrade aleatório de risco/recompensa).
- **Iluminação como mecânica** — holofotes móveis revelam inimigos escondidos, mas também atraem mais hordas: tensão entre visibilidade e segurança.
- **Cooperação forçada** — mecânicas como os Gêmeos do Espelho exigem multiplayer real, não só farming em paralelo.

---

## 🛠️ Stack técnica

| Camada | Tecnologia |
|---|---|
| Runtime | Node.js |
| Servidor HTTP | Express |
| Comunicação em tempo real | WebSockets (`ws`) |
| Persistência | MongoDB |
| Cliente | JavaScript + Canvas |
| Linguagem | JavaScript (ESM) |

---

## 🧠 Netcode — o coração técnico do projeto

Este projeto não é só um jogo — é um estudo aplicado de **sistemas distribuídos em tempo real**. Toda a sincronização multiplayer foi construída do zero, sem engine de netcode pronta, implementando os mesmos princípios usados em jogos competitivos AAA:

- **Servidor autoritativo** — o servidor é a única fonte de verdade do estado do jogo. Clientes nunca decidem posição, dano ou resultado de combate sozinhos; eles apenas enviam *intenção* (input), nunca *estado*.
- **Tick loop de timestep fixo** — a simulação do servidor roda em um ritmo fixo e determinístico (independente da carga do processador), garantindo física consistente e reproduzível a cada tick.
- **Client-side prediction** — o cliente simula localmente o próprio input antes da confirmação do servidor chegar, eliminando a sensação de input lag mesmo em conexões com latência alta.
- **Server reconciliation** — quando a previsão do cliente diverge do servidor, a correção é aplicada reprocessando o input buffer local, evitando o efeito de rubber-banding.
- **Entity interpolation** — o movimento de outros jogadores e inimigos é suavizado entre snapshots recebidos do servidor, mantendo fluidez visual mesmo com atualizações periódicas (não contínuas).

### Fluxo simplificado de um input

```
[Cliente]                          [Servidor]
   |  aperta tecla                     |
   |--- envia input (tick N) --------->|
   |  aplica localmente                |  processa no tick loop
   |  (prediction)                     |  valida física/colisão
   |                                   |
   |<-- estado confirmado (tick N) ----|
   |  reconcilia buffer local          |
   |  (reconciliation)                 |
```

---

## 🗺️ Roadmap de desenvolvimento

- [x] Setup WebSocket + Express
- [x] Tick loop de timestep fixo no servidor
- [x] Estado do jogo + broadcast básico
- [x] Client-side prediction
- [x] Server reconciliation
- [x] Entity interpolation (outros jogadores)
- [ ] Combate autoritativo (hit detection no servidor)
- [ ] Sistema de hordas por ato (IA server-side)
- [ ] Sistema de Aplausos + barracas de upgrade
- [ ] Persistência de progresso (MongoDB)
- [ ] Reconexão + validação anti-cheat básica
- [ ] Deploy público

---

## 🚀 Rodando localmente

```bash
git clone https://github.com/seu-usuario/carnaval-das-sombras.git
cd carnaval-das-sombras
npm install
npm run dev
```

O servidor sobe em `http://localhost:3000`, servindo o cliente estático e aceitando conexões WebSocket no mesmo endereço.

---

## 📄 Licença

Este projeto é experimental e desenvolvido para fins de estudo e portfólio.
