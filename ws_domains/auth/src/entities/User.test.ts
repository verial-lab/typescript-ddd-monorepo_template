import { beforeEach, describe, expect, it } from 'vitest';
import { User, type UserCreateProps } from './User';

describe('User Entity', () => {
  const validUserProps: UserCreateProps = {
    email: 'test@example.com',
    username: 'testuser',
    passwordHash: 'hashedpassword123',
  };

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

  it('should deactivate a user', async () => {
    const user = User.create(validUserProps);

    // Store the original updatedAt time
    const beforeUpdate = user.updatedAt;

    // Wait a small amount of time to ensure the timestamp changes
    await new Promise((resolve) => setTimeout(resolve, 10));

    user.deactivate();

    expect(user.isActive).toBe(false);
    expect(user.updatedAt.getTime()).toBeGreaterThan(beforeUpdate.getTime());
  });

  it('should activate a user', async () => {
    const user = User.create(validUserProps);
    user.deactivate();

    // Store the original updatedAt time
    const beforeUpdate = user.updatedAt;

    // Wait a small amount of time to ensure the timestamp changes
    await new Promise((resolve) => setTimeout(resolve, 10));

    user.activate();

    expect(user.isActive).toBe(true);
    expect(user.updatedAt.getTime()).toBeGreaterThan(beforeUpdate.getTime());
  });
});
