// Fundo full-bleed da tela de entrada, 100% CSS (sem SVG): céu roxo/ink e
// holofotes verde-doentio varrendo (divs com clip-path + rotação animada).
// Camada .entry-backdrop atrás do conteúdo. Animações em global.css, respeitam
// prefers-reduced-motion.
export default function CarnivalBackdrop() {
  return (
    <div className="entry-backdrop" aria-hidden="true">
      <div className="entry-beam a" />
      <div className="entry-beam b" />
    </div>
  );
}
