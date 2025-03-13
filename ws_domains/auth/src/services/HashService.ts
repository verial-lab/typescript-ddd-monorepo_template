import type { DomainService } from '@repo-domains/domain-core';

/**
 * Interface for hashing passwords and comparing hashed values
 */
export interface HashService extends DomainService {
  /**
   * Hash a plain text value
   * @param plaintext The value to hash
   * @returns Promise resolving to the hashed value
   */
  hash(plaintext: string): Promise<string>;

  /**
   * Compare a plain text value against a hash
   * @param plaintext The plain text to compare
   * @param hash The hash to compare against
   * @returns Promise resolving to true if they match
   */
  compare(plaintext: string, hash: string): Promise<boolean>;
}
