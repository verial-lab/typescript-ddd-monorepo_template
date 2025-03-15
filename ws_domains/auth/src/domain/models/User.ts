import {
  Entity,
  type EntityCreateProps,
  type EntityProps,
  type EntitySystemProps,
} from '@repo-domains/domain-core';

/**
 * User entity props for authentication
 */
export interface UserCreateProps extends EntityCreateProps {
  email: string;
  username: string;
  passwordHash: string;
}

export interface UserSystemProps extends EntitySystemProps {
  createdAt: Date;
  updatedAt: Date;
  isActive: boolean;
}

export type UserProps = EntityProps<UserCreateProps, UserSystemProps>;

export class User extends Entity<UserProps> {
  constructor(createProps: UserCreateProps, id?: string) {
    const now = new Date();
    const props: UserProps = {
      ...createProps,
      createdAt: now,
      updatedAt: now,
      isActive: true,
    };
    super(props, id);
  }

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
    return this.props.isActive;
  }

  get createdAt(): Date {
    return this.props.createdAt;
  }

  get updatedAt(): Date {
    return this.props.updatedAt;
  }

  deactivate(): User {
    const user = new User(
      {
        email: this.email,
        username: this.username,
        passwordHash: this.passwordHash,
      },
      this.id
    );
    user.props.isActive = false;
    return user;
  }

  activate(): User {
    const user = new User(
      {
        email: this.email,
        username: this.username,
        passwordHash: this.passwordHash,
      },
      this.id
    );
    user.props.isActive = true;
    return user;
  }
}
