import type { DomainService, Logger } from '@repo-domains/domain-core';
import { User, type UserCreateProps } from '../entities';
import { UserCreatedEvent } from '../events';
import type { UserRepository } from '../repositories';
import { Email, Password } from '../value-objects';
import type { HashService } from './HashService';

/**
 * Authentication service
 */
export class AuthService implements DomainService {
  readonly name = 'AuthService';
  readonly description = 'Handles user authentication and registration';

  constructor(
    private readonly userRepository: UserRepository,
    private readonly hashService: HashService,
    private readonly logger: Logger
  ) {}

  /**
   * Register a new user
   */
  async registerUser(email: string, username: string, password: string): Promise<User> {
    try {
      // Validate inputs using value objects
      const validEmail = Email.create(email);
      const validPassword = Password.create(password);

      // Check if user already exists
      const existingUserByEmail = await this.userRepository.findByEmail(email);
      if (existingUserByEmail) {
        throw new Error('Email already in use');
      }

      const existingUserByUsername = await this.userRepository.findByUsername(username);
      if (existingUserByUsername) {
        throw new Error('Username already in use');
      }

      // Hash password using injected hash service
      const passwordHash = await this.hashService.hash(validPassword.value);

      // Create and save user
      const userProps: UserCreateProps = {
        email: validEmail.value,
        username,
        passwordHash,
      };

      const user = User.create(userProps);
      const savedUser = await this.userRepository.save(user);

      // Emit event (in a real app, this would use an event bus)
      new UserCreatedEvent(savedUser.id).publish(this.logger);

      return savedUser;
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
      // Validate email using value object
      const validEmail = Email.create(email);

      // Find user by email
      const user = await this.userRepository.findByEmail(validEmail.value);
      if (!user) {
        throw new Error('Invalid credentials');
      }

      // Check if user is active
      if (!user.isActive) {
        throw new Error('User account is inactive');
      }

      // Verify password using injected hash service
      const isPasswordValid = await this.hashService.compare(password, user.passwordHash);
      if (!isPasswordValid) {
        throw new Error('Invalid credentials');
      }

      return user;
    } catch (error) {
      this.logger.error({ error }, 'Failed to authenticate user');
      throw error;
    }
  }
}
