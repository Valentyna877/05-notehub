import css from "./ErrorMessage.module.css";

export interface ErrorMessageProps {
  message?: string;
  children?: React.ReactNode;
}

export default function ErrorMessage({ message, children }: ErrorMessageProps) {
  return (
    <div className={css.error} role="alert">
      <p>{message ?? "There was an error, please try again..."}</p>
      {children}
    </div>
  );
}