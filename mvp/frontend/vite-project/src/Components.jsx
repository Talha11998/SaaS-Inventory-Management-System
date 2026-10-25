export function Errors({ errors }) {
  if (!errors || !errors.length) return null;
  return (
    <div className="alert error" role="alert">
      <ul>{errors.map((e, i) => <li key={i}>{e}</li>)}</ul>
    </div>
  );
}

export function Flash({ message }) {
  return message ? <div className="alert success" role="status">{message}</div> : null;
}

export function Field({ id, label, hint, children }) {
  return (
    <div className="field">
      <label htmlFor={id}>{label} {hint && <span className="hint">{hint}</span>}</label>
      {children}
    </div>
  );
}
