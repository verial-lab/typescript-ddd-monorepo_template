import { v4 as uuidv4 } from 'uuid';
import { BaseEntity } from './BaseEntity';

/**
 * User entity for authentication
 */
export interface UserProps {
  email: string;
  username: string;
  passwordHash: string;
  isActive?: boolean;
}

export class User extends BaseEntity<string> {
  email: string;
  username: string;
  passwordHash: string;
  isActive: boolean;

  private constructor(props: UserProps, id?: string) {
    super(id ?? uuidv4());
    this.email = props.email;
    this.username = props.username;
    this.passwordHash = props.passwordHash;
    this.isActive = props.isActive ?? true;
  }

  static create(props: UserProps, id?: string): User {
    return new User(props, id);
  }

  deactivate(): void {
    this.isActive = false;
    this.updatedAt = new Date();
  }

  activate(): void {
    this.isActive = true;
    this.updatedAt = new Date();
  }
}
