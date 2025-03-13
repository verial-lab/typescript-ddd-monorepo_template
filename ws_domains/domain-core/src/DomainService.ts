/**
 * Base interface for all domain services.
 * This is a marker interface that provides common metadata for services.
 * Each service should implement this interface and provide its own specific methods.
 */
export interface DomainService {
  /**
   * The name of the service
   */
  readonly name: string;

  /**
   * Optional description of the service's purpose
   */
  readonly description?: string;
}
