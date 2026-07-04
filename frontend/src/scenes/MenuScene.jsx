import { useState } from "react";
import { useGame, SCENES } from "../state/GameStateContext.jsx";

// Nome válido: 2–16 chars, letras/números/espaço/_/- (sem chars de controle).
const NAME_RE = /^[\p{L}\p{N} _-]{2,16}$/u;

export default function MenuScene() {
  const { setScene, setUsername } = useGame();
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function handleSubmit(e) {
    e.preventDefault();
    if (loading) return;
    const trimmed = name.trim();
    if (!NAME_RE.test(trimmed)) {
      setError("Nome precisa ter 2 a 16 letras, números, espaço, _ ou -.");
      return;
    }
    // fade preto em degraus antes de seguir pro lobby.
    setLoading(true);
    setUsername(trimmed);
    setTimeout(() => setScene(SCENES.LOBBY), 620);
  }

  return (
    <div className="pixel-screen">
      <div className="pixel-content">
        <header>
          <h1 className="pixel-title">
            Carnaval
            <br />
            das Sombras
          </h1>
          <p className="pixel-tagline">
            A cada lua cheia, os portões se abrem. Ninguém convidou.
          </p>
        </header>

        <form onSubmit={handleSubmit} noValidate>
          <div className="pixel-field">
            <label className="pixel-label" htmlFor="cs-name">
              Nome de artista
            </label>
            <input
              id="cs-name"
              className={"pixel-input" + (error ? " is-error" : "")}
              type="text"
              maxLength={16}
              autoComplete="off"
              spellCheck={false}
              placeholder="quem entra no parque?"
              value={name}
              disabled={loading}
              aria-invalid={Boolean(error)}
              aria-describedby="cs-name-error"
              onChange={(e) => {
                setName(e.target.value);
                if (error) setError("");
              }}
            />
            <p id="cs-name-error" className="pixel-error" role="alert">
              {error ? "! " + error : ""}
            </p>
          </div>

          {/* submit estilo item de menu de title screen */}
          <button type="submit" className="pixel-btn" disabled={loading}>
            {loading ? "Os portões rangem" : "Entrar no espetáculo"}
            {loading && <span className="pixel-dots" aria-hidden="true" />}
          </button>
        </form>
      </div>

      {/* fade preto em degraus ao confirmar */}
      <div
        className={"pixel-fade" + (loading ? " closing" : "")}
        aria-hidden="true"
      />
    </div>
  );
}
