import { Entity } from '@repo-domains/domain-core';
import type { Logger } from '@repo-domains/domain-core';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { User } from '../entities';
import { UserCreatedEvent } from '../events';
import type { UserRepository } from '../repositories';
import { Email, Password } from '../value-objects';
import { AuthService } from './AuthService';
import type { HashService } from './HashService';

// Mock value objects
vi.mock('../value-objects/Email', () => ({
  Email: {
    create: vi.fn().mockImplementation((email) => ({ value: email })),
  },
}));

vi.mock('../value-objects/Password', () => ({
  Password: {
    create: vi.fn().mockImplementation((password) => ({ value: password })),
  },
}));

describe('AuthService', () => {
  let authService: AuthService;
  let userRepository: UserRepository;
  let hashService: HashService;
  let logger: Logger;

  beforeEach(() => {
    // Set up mock IdGenerator
    Entity.setIdGenerator({
      generate: () => 'mock-id',
    });

    userRepository = {
      findById: vi.fn(),
      findAll: vi.fn(),
      save: vi.fn(),
      delete: vi.fn(),
      findByEmail: vi.fn(),
      findByUsername: vi.fn(),
    };

    hashService = {
      name: 'HashService',
      hash: vi.fn(),
      compare: vi.fn(),
    };

    logger = {
      info: vi.fn(),
      error: vi.fn(),
      warn: vi.fn(),
      debug: vi.fn(),
    };

    authService = new AuthService(userRepository, hashService, logger);

    // Clear mock calls
    vi.clearAllMocks();
  });

  describe('registerUser', () => {
    const validEmail = 'test@example.com';
    const validUsername = 'testuser';
    const validPassword = 'Password123!';
    const hashedPassword = 'hashedpassword123';

    beforeEach(() => {
      vi.mocked(userRepository.findByEmail).mockResolvedValue(null);
      vi.mocked(userRepository.findByUsername).mockResolvedValue(null);
      vi.mocked(hashService.hash).mockResolvedValue(hashedPassword);
      vi.mocked(userRepository.save).mockImplementation((user) => Promise.resolve(user));
    });

    it('should register a new user successfully', async () => {
      const user = await authService.registerUser(validEmail, validUsername, validPassword);

      expect(user.email).toBe(validEmail);
      expect(user.username).toBe(validUsername);
      expect(user.passwordHash).toBe(hashedPassword);
      expect(user.isActive).toBe(true);

      expect(Email.create).toHaveBeenCalledWith(validEmail);
      expect(Password.create).toHaveBeenCalledWith(validPassword);
      expect(userRepository.findByEmail).toHaveBeenCalledWith(validEmail);
      expect(userRepository.findByUsername).toHaveBeenCalledWith(validUsername);
      expect(hashService.hash).toHaveBeenCalledWith(validPassword);
      expect(userRepository.save).toHaveBeenCalled();
      expect(logger.info).toHaveBeenCalled();
    });

    it('should throw error if email already exists', async () => {
      vi.mocked(userRepository.findByEmail).mockResolvedValue(
        User.create({
          email: validEmail,
          username: 'existing',
          passwordHash: 'hash',
        })
      );

      await expect(
        authService.registerUser(validEmail, validUsername, validPassword)
      ).rejects.toThrow('Email already in use');

      expect(Email.create).toHaveBeenCalledWith(validEmail);
      expect(Password.create).toHaveBeenCalledWith(validPassword);
      expect(hashService.hash).not.toHaveBeenCalled();
      expect(userRepository.save).not.toHaveBeenCalled();
      expect(logger.error).toHaveBeenCalled();
    });

    it('should throw error if username already exists', async () => {
      vi.mocked(userRepository.findByUsername).mockResolvedValue(
        User.create({
          email: 'other@example.com',
          username: validUsername,
          passwordHash: 'hash',
        })
      );

      await expect(
        authService.registerUser(validEmail, validUsername, validPassword)
      ).rejects.toThrow('Username already in use');

      expect(Email.create).toHaveBeenCalledWith(validEmail);
      expect(Password.create).toHaveBeenCalledWith(validPassword);
      expect(hashService.hash).not.toHaveBeenCalled();
      expect(userRepository.save).not.toHaveBeenCalled();
      expect(logger.error).toHaveBeenCalled();
    });
  });

  describe('authenticateUser', () => {
    const validEmail = 'test@example.com';
    const validPassword = 'Password123!';
    const hashedPassword = 'hashedpassword123';
    let existingUser: User;

    beforeEach(() => {
      existingUser = User.create({
        email: validEmail,
        username: 'testuser',
        passwordHash: hashedPassword,
      });

      vi.mocked(userRepository.findByEmail).mockResolvedValue(existingUser);
      vi.mocked(hashService.compare).mockResolvedValue(true);
    });

    it('should authenticate user successfully', async () => {
      const user = await authService.authenticateUser(validEmail, validPassword);

      expect(user).toBe(existingUser);
      expect(Email.create).toHaveBeenCalledWith(validEmail);
      expect(userRepository.findByEmail).toHaveBeenCalledWith(validEmail);
      expect(hashService.compare).toHaveBeenCalledWith(validPassword, hashedPassword);
    });

    it('should throw error if user not found', async () => {
      vi.mocked(userRepository.findByEmail).mockResolvedValue(null);

      await expect(authService.authenticateUser(validEmail, validPassword)).rejects.toThrow(
        'Invalid credentials'
      );

      expect(Email.create).toHaveBeenCalledWith(validEmail);
      expect(hashService.compare).not.toHaveBeenCalled();
      expect(logger.error).toHaveBeenCalled();
    });

    it('should throw error if password is invalid', async () => {
      vi.mocked(hashService.compare).mockResolvedValue(false);

      await expect(authService.authenticateUser(validEmail, validPassword)).rejects.toThrow(
        'Invalid credentials'
      );

      expect(Email.create).toHaveBeenCalledWith(validEmail);
      expect(logger.error).toHaveBeenCalled();
    });

    it('should throw error if user is inactive', async () => {
      const inactiveUser = User.create({
        email: validEmail,
        username: 'testuser',
        passwordHash: hashedPassword,
      }).deactivate();
      vi.mocked(userRepository.findByEmail).mockResolvedValue(inactiveUser);

      await expect(authService.authenticateUser(validEmail, validPassword)).rejects.toThrow(
        'User account is inactive'
      );

      expect(Email.create).toHaveBeenCalledWith(validEmail);
      expect(hashService.compare).not.toHaveBeenCalled();
      expect(logger.error).toHaveBeenCalled();
    });
  });
});
