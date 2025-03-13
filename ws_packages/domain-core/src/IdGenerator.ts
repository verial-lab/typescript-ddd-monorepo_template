/**
 * Interface for ID generator service
 */
export interface IIdGenerator {
  /**
   * Generate a new unique ID
   * @returns A unique ID string
   */
  generate(): string;
}
