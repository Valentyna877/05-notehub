import css from "./Loader.module.css";

export default function Loader({ message = "Loading notes, please wait..." }) {
  return (
    <div className={css.loader} role="status" aria-live="polite">
      <div className={css.spinner}></div>
      <p>{message}</p>
    </div>
  );
}