import {
  Entity,
  type EntityCreateProps,
  type EntityProps,
  type EntitySystemProps,
} from '@repo-domains/domain-core';

export interface ProfileCreateProps extends EntityCreateProps {
  userId: string;
  email: string;
  name: string;
  role: string;
}

export interface ProfileSystemProps extends EntitySystemProps {
  createdAt: Date;
  updatedAt: Date;
}

export type ProfileProps = EntityProps<ProfileCreateProps, ProfileSystemProps>;

export class Profile extends Entity<ProfileProps> {
  constructor(createProps: ProfileCreateProps, id?: string) {
    const now = new Date();

    const props: ProfileProps = {
      ...createProps,
      createdAt: now,
      updatedAt: now,
    };

    super(props, id);
  }

  get userId(): string {
    return this.props.userId;
  }

  get email(): string {
    return this.props.email;
  }

  get name(): string {
    return this.props.name;
  }

  get role(): string {
    return this.props.role;
  }

  update(props: Partial<ProfileCreateProps>): void {
    const updatedProps = {
      ...this.props,
      ...props,
      updatedAt: new Date(),
    };

    Object.assign(this._props, updatedProps);
  }
}
