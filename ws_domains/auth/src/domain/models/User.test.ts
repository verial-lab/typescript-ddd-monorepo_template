import { Entity } from '@repo-domains/domain-core';
import { beforeEach, describe, expect, it } from 'vitest';
import { User, type UserCreateProps } from './User';

describe('User Entity', () => {
  const validUserProps: UserCreateProps = {
    email: 'test@example.com',
    username: 'testuser',
    passwordHash: 'hashedpassword123',
  };

  beforeEach(() => {
    // Set up mock IdGenerator
    Entity.setIdGenerator({
      generate: () => 'mock-id',
    });
  });

  it('should create a user with valid props', () => {
    const user = User.create(validUserProps);

    expect(user.email).toBe(validUserProps.email);
    expect(user.username).toBe(validUserProps.username);
    expect(user.passwordHash).toBe(validUserProps.passwordHash);
    expect(user.isActive).toBe(true);
    expect(user.id).toBeDefined();
    expect(user.createdAt).toBeInstanceOf(Date);
    expect(user.updatedAt).toBeInstanceOf(Date);
  });

  it('should create a user with custom id', () => {
    const customId = 'custom-id-123';
    const user = User.create(validUserProps, customId);

    expect(user.id).toBe(customId);
  });

  it('should deactivate a user', () => {
    const user = User.create(validUserProps);
    const deactivatedUser = user.deactivate();

    expect(deactivatedUser.isActive).toBe(false);
    expect(deactivatedUser.id).toBe(user.id);
    expect(deactivatedUser.email).toBe(user.email);
    expect(deactivatedUser.username).toBe(user.username);
    expect(deactivatedUser.passwordHash).toBe(user.passwordHash);
  });

  it('should activate a user', () => {
    let user = User.create(validUserProps);
    user = user.deactivate();
    const activatedUser = user.activate();

    expect(activatedUser.isActive).toBe(true);
    expect(activatedUser.id).toBe(user.id);
    expect(activatedUser.email).toBe(user.email);
    expect(activatedUser.username).toBe(user.username);
    expect(activatedUser.passwordHash).toBe(user.passwordHash);
  });
});
