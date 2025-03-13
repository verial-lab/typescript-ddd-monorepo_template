import { BaseEntity } from '@repo-domains/domain-core';
import type { BaseEntityCreateProps, IEntity } from '@repo-domains/domain-core';

/**
 * User entity props for authentication
 */
export interface UserCreateProps extends BaseEntityCreateProps {
  email: string;
  username: string;
  passwordHash: string;
  isActive?: boolean;
}

export class User extends BaseEntity<UserCreateProps> implements IEntity<UserCreateProps> {
  static create(props: UserCreateProps, id?: string): User {
    return new User(props, id);
  }

  get email(): string {
    return this._props.email;
  }

  get username(): string {
    return this._props.username;
  }

  get passwordHash(): string {
    return this._props.passwordHash;
  }

  get isActive(): boolean {
    return this._props.isActive ?? true;
  }

  deactivate(): User {
    const newProps = {
      ...this._props,
      isActive: false,
    };
    return new User(newProps, this.id);
  }

  activate(): User {
    const newProps = {
      ...this._props,
      isActive: true,
    };
    return new User(newProps, this.id);
  }
}
