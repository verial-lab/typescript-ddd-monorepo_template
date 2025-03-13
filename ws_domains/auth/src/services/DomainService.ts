/**
 * Base interface for all domain services.
 * Each service should implement this interface and provide its own specific
 * input parameters and return type.
 *
 * @template T - The return type of the service
 * @template Args - The type of arguments the service accepts
 */
export interface DomainService<T, Args extends unknown[] = unknown[]> {
  execute(...args: Args): Promise<T>;
}
