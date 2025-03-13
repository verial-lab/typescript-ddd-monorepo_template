import { ValueObject } from '@repo-domains/domain-core';

/**
 * Password value object
 */
export class Password extends ValueObject<{ value: string }> {
  private static MIN_LENGTH = 8;
  private static STRONG_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/;

  private constructor(password: string) {
    super({ value: password });
  }

  get value(): string {
    return this.props.value;
  }

  static create(password: string): Password {
    if (!Password.isValid(password)) {
      throw new Error(
        'Password must be at least 8 characters and include uppercase, lowercase, number, and special character'
      );
    }
    return new Password(password);
  }

  static isValid(password: string): boolean {
    return password.length >= Password.MIN_LENGTH && Password.STRONG_REGEX.test(password);
  }
}
