import { logger } from '@repo-packages/logger';
import bcrypt from 'bcryptjs';
import { User, type UserProps } from '../entities';
import { UserCreatedEvent } from '../events';
import type { UserRepository } from '../repositories';
import { Email, Password } from '../value-objects';

/**
 * Base interface for all domain services.
 * Each service should implement this interface and provide its own specific
 * input parameters and return type.
 *
 * @template T - The return type of the service
 * @template Args - The type of arguments the service accepts
 */
export interface DomainService<T, Args extends unknown[] = unknown[]> {
  execute(...args: Args): Promise<T>;
}

export * from './AuthService';

/**
 * Authentication service
 */
export class AuthService {
  constructor(private readonly userRepository: UserRepository) {}

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

      // Hash password
      const salt = await bcrypt.genSalt(10);
      const passwordHash = await bcrypt.hash(validPassword.value, salt);

      // Create and save user
      const userProps: UserProps = {
        email: validEmail.value,
        username,
        passwordHash,
      };

      const user = User.create(userProps);
      const savedUser = await this.userRepository.save(user);

      // Emit event (in a real app, this would use an event bus)
      new UserCreatedEvent(savedUser.id).publish();

      return savedUser;
    } catch (error) {
      logger.error({ error }, 'Failed to register user');
      throw error;
    }
  }

  /**
   * Authenticate a user
   */
  async authenticateUser(email: string, password: string): Promise<User> {
    try {
      // Find user by email
      const user = await this.userRepository.findByEmail(email);
      if (!user) {
        throw new Error('Invalid credentials');
      }

      // Check if user is active
      if (!user.isActive) {
        throw new Error('User account is inactive');
      }

      // Verify password
      const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
      if (!isPasswordValid) {
        throw new Error('Invalid credentials');
      }

      return user;
    } catch (error) {
      logger.error({ error }, 'Failed to authenticate user');
      throw error;
    }
  }
}
