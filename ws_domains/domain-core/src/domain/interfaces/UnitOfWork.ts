export interface IUnitOfWork {
  commit(): Promise<void>;
  rollback(): Promise<void>;
  withTransaction<T>(work: () => Promise<T>): Promise<T>;
}
