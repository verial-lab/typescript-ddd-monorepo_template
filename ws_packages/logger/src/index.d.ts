declare module '@repo-packages/logger' {
  export const logger: {
    error: (context: Record<string, unknown>, message: string) => void;
    info: (context: Record<string, unknown>, message: string) => void;
    warn: (context: Record<string, unknown>, message: string) => void;
    debug: (context: Record<string, unknown>, message: string) => void;
  };
}
