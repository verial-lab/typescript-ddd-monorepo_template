import { beforeEach, describe, expect, it } from 'vitest';
import { User } from './User';

describe('User Entity', () => {
  const validUserProps = {
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
    const beforeUpdate = new Date(user.updatedAt.getTime() - 1000); // Set to 1 second before
    user.updatedAt = beforeUpdate;

    user.deactivate();

    expect(user.isActive).toBe(false);
    expect(user.updatedAt.getTime()).toBeGreaterThan(beforeUpdate.getTime());
  });

  it('should activate a user', async () => {
    const user = User.create(validUserProps);
    user.deactivate();
    const beforeUpdate = new Date(user.updatedAt.getTime() - 1000); // Set to 1 second before
    user.updatedAt = beforeUpdate;

    user.activate();

    expect(user.isActive).toBe(true);
    expect(user.updatedAt.getTime()).toBeGreaterThan(beforeUpdate.getTime());
  });
});
