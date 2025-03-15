import type { DomainService } from '@repo-domains/domain-core';

/**
 * Interface for hashing passwords and comparing hashed values
 */
export interface IHashService extends DomainService {
  /**
   * Hash a plain text value
   * @param value The value to hash
   * @returns Promise resolving to the hashed value
   */
  hash(value: string): Promise<string>;

  /**
   * Compare a plain text value against a hash
   * @param value The plain text to compare
   * @param hash The hash to compare against
   * @returns Promise resolving to true if they match
   */
  compare(value: string, hash: string): Promise<boolean>;
}
