export default function Button({ children, variant, ...rest }) {
  const cls = "btn" + (variant === "ghost" ? " ghost" : "");
  return (
    <button className={cls} {...rest}>
      {children}
    </button>
  );
}
