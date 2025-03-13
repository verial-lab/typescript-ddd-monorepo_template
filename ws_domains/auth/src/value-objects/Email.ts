import { ValueObject } from '@repo-packages/domain-core';

/**
 * Email value object
 */
export class Email extends ValueObject<{ value: string }> {
  private static EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  private constructor(email: string) {
    super({ value: email.toLowerCase().trim() });
  }

  get value(): string {
    return this.props.value;
  }

  static create(email: string): Email {
    if (!Email.isValid(email)) {
      throw new Error('Invalid email address');
    }
    return new Email(email);
  }

  static isValid(email: string): boolean {
    return Email.EMAIL_REGEX.test(email);
  }
}
