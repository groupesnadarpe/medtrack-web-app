import type { AppErrorView } from "@/core/errors/app-error";

type ApiErrorAlertProps = {
  error: AppErrorView;
};

export function ApiErrorAlert({ error }: ApiErrorAlertProps) {
  return (
    <div role="alert" aria-live="polite">
      <p>{error.title}</p>
      <p>{error.message}</p>
      {error.requestId ? <small>request_id: {error.requestId}</small> : null}
    </div>
  );
}