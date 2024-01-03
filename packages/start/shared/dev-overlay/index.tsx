import { ErrorBoundary, Show, createEffect, createSignal, onCleanup, resetErrorBoundaries, type JSX } from "solid-js";
import clientOnly from "../clientOnly";


export interface DevOverlayProps {
  children?: JSX.Element;
}

const DevOverlayDialog = clientOnly(() => import('./DevOverlayDialog'));

export function DevOverlay(props: DevOverlayProps): JSX.Element {
  const [errors, setErrors] = createSignal<unknown[]>([]);

  function resetError() {
    setErrors([]);
    resetErrorBoundaries();
  }

  function pushError(error: unknown) {
    console.error(error);
    setErrors((current) => [error, ...current]);
  }

  createEffect(() => {
    const onErrorEvent = (error: ErrorEvent) => {
      pushError(error.error);
    };

    window.addEventListener('error', onErrorEvent);

    onCleanup(() => {
      window.removeEventListener('error', onErrorEvent);
    });
  });

  return (
    <>
      <ErrorBoundary fallback={error => {
        pushError(error);
        return null;
      }}>
        {props.children}
      </ErrorBoundary>
      <Show when={errors().length}>
        <DevOverlayDialog errors={errors()} resetError={resetError} />
      </Show>
    </>
  );
}