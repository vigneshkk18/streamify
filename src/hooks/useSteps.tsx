import { useSyncExternalStore } from "react";

let currentStep = 0;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let listeners: any[] = [];

const stepsStore = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  subscribe(listener: any) {
    listeners = [...listeners, listener];
    return () => {
      listeners = listeners.filter((l) => l !== listener);
    };
  },
  getSnapshot() {
    return currentStep;
  },
};

function emitChange() {
  for (const listener of listeners) {
    listener();
  }
}

function goToNextStep() {
  currentStep++;
  emitChange();
}

export function resetSteps() {
  currentStep = 0;
  emitChange();
}

export function useSteps() {
  const currentStep = useSyncExternalStore(
    stepsStore.subscribe,
    stepsStore.getSnapshot
  );

  return { currentStep, goToNextStep, resetSteps };
}
