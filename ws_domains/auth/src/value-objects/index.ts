/**
 * Base value object interface
 */
export interface ValueObject<T> {
  value: T;
  equals(vo: ValueObject<T>): boolean;
}

/**
 * Base value object implementation
 */
export class BaseValueObject<T> implements ValueObject<T> {
  value: T;

  constructor(value: T) {
    this.value = value;
  }

  equals(vo: ValueObject<T>): boolean {
    return JSON.stringify(this.value) === JSON.stringify(vo.value);
  }
}

/**
 * Email value object
 */
export class Email extends BaseValueObject<string> {
  private static EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  private constructor(email: string) {
    super(email.toLowerCase().trim());
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

/**
 * Password value object
 */
export class Password extends BaseValueObject<string> {
  private static MIN_LENGTH = 8;
  private static STRONG_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/;

  private constructor(password: string) {
    super(password);
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
