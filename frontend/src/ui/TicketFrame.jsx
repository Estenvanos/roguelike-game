// Moldura de "bilheteria" da tenda principal, 100% CSS (sem SVG): painel de
// madeira remendada levemente torto, borda dourada desgastada (muda por `state`)
// e um toldo listrado com babado no topo. `children` (o formulário) fica na área
// com padding. Reusável em outras telas.
export default function TicketFrame({ state = "normal", children }) {
  return (
    <div className={`entry-frame is-${state}`}>
      <div className="entry-awning" />
      <div className="entry-frame-content">{children}</div>
    </div>
  );
}
