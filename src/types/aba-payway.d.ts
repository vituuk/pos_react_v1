declare global {
  interface Window {
    AbaPayway?: {
      checkout: () => void;
    };
    checkout_callback?: () => void;
  }

  const AbaPayway: {
    checkout: () => void;
  } | undefined;
}

export {};
