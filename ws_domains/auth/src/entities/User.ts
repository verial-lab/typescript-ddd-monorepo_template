import { BaseEntity } from '@repo-packages/domain-core';
import type { BaseEntityCreateProps } from '@repo-packages/domain-core';

/**
 * User entity props for authentication
 */
export interface UserCreateProps extends BaseEntityCreateProps {
  email: string;
  username: string;
  passwordHash: string;
  isActive?: boolean;
}

export class User extends BaseEntity<UserCreateProps> {
  static create(props: UserCreateProps, id?: string): User {
    return new User(props, id);
  }

  get email(): string {
    return this.props.email;
  }

  get username(): string {
    return this.props.username;
  }

  get passwordHash(): string {
    return this.props.passwordHash;
  }

  get isActive(): boolean {
    return this.props.isActive ?? true;
  }

  deactivate(): void {
    // In a real implementation, you'd need to handle immutability properly
    (this.props as { isActive: boolean }).isActive = false;
    this.updateTimestamp();
  }

  activate(): void {
    // In a real implementation, you'd need to handle immutability properly
    (this.props as { isActive: boolean }).isActive = true;
    this.updateTimestamp();
  }
}
