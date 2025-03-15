import type { DomainService, Logger } from '@repo-domains/domain-core';
import { UserCreatedEvent } from '../../events/UserCreated';
import { Email } from '../../models/Email';
import { Password } from '../../models/Password';
import { User } from '../../models/User';
import type { IUserRepository } from '../repositories/UserRepository';
import type { IHashService } from './HashService';

export interface IAuthService extends DomainService {
  hashPassword(password: Password): Promise<Password>;
  comparePassword(plainPassword: string, hashedPassword: Password): Promise<boolean>;
  generateToken(user: User): Promise<string>;
}

/**
 * Authentication service
 */
export class AuthService implements IAuthService {
  readonly name = 'AuthService';
  readonly description = 'Handles user authentication and registration';

  constructor(
    private readonly userRepository: IUserRepository,
    private readonly hashService: IHashService,
    private readonly logger: Logger
  ) {}

  /**
   * Register a new user
   */
  async registerUser(email: string, username: string, password: string): Promise<User> {
    try {
      // Validate email
      const emailObj = Email.create(email);

      // Validate password
      const passwordObj = Password.create(password);

      // Check if user already exists
      const existingUserByEmail = await this.userRepository.findByEmail(emailObj.value);
      if (existingUserByEmail) {
        throw new Error('Email already in use');
      }

      // Check if username is taken
      const existingUserByUsername = await this.userRepository.findByUsername(username);
      if (existingUserByUsername) {
        throw new Error('Username already in use');
      }

      // Hash password
      const hashedPassword = await this.hashPassword(passwordObj);

      // Create user
      const user = User.create({
        email: emailObj.value,
        username,
        passwordHash: hashedPassword.value,
      });

      // Save user
      await this.userRepository.save(user);

      // Emit event
      new UserCreatedEvent(user.id);

      this.logger.info({ userId: user.id }, 'User registered successfully');
      return user;
    } catch (error) {
      this.logger.error({ error }, 'Failed to register user');
      throw error;
    }
  }

  /**
   * Authenticate a user
   */
  async authenticateUser(email: string, password: string): Promise<User> {
    try {
      // Validate email
      const emailObj = Email.create(email);

      // Find user by email
      const user = await this.userRepository.findByEmail(emailObj.value);
      if (!user) {
        throw new Error('Invalid credentials');
      }

      // Check if user is active
      if (!user.isActive) {
        throw new Error('User account is inactive');
      }

      // Verify password
      const isPasswordValid = await this.comparePassword(
        password,
        Password.create(user.passwordHash)
      );
      if (!isPasswordValid) {
        throw new Error('Invalid credentials');
      }

      return user;
    } catch (error) {
      this.logger.error({ error }, 'Failed to authenticate user');
      throw error;
    }
  }

  async hashPassword(password: Password): Promise<Password> {
    const hashedValue = await this.hashService.hash(password.value);
    return Password.create(hashedValue);
  }

  async comparePassword(plainPassword: string, hashedPassword: Password): Promise<boolean> {
    return this.hashService.compare(plainPassword, hashedPassword.value);
  }

  async generateToken(user: User): Promise<string> {
    // In a real application, this would generate a JWT or other token
    return Buffer.from(`${user.id}:${Date.now()}`).toString('base64');
  }
}
