import { ValueObject, type ValueObjectProps } from '@repo-domains/domain-core';

interface PasswordProps extends ValueObjectProps {
  value: string;
  isHashed: boolean;
  [key: string]: unknown;
}

/**
 * Password value object
 */
export class Password extends ValueObject<PasswordProps> {
  private static MIN_LENGTH = 8;
  private static STRONG_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/;

  private constructor(props: PasswordProps) {
    super(props);
  }

  public static create(password: string, isHashed = false): Password {
    if (!isHashed && !Password.isValidPassword(password)) {
      throw new Error('Invalid password format');
    }
    return new Password({ value: password, isHashed });
  }

  private static isValidPassword(password: string): boolean {
    return password.length >= 8;
  }

  get value(): string {
    return this.props.value;
  }

  get isHashed(): boolean {
    return this.props.isHashed;
  }

  static isValid(password: string): boolean {
    return password.length >= Password.MIN_LENGTH && Password.STRONG_REGEX.test(password);
  }
}
