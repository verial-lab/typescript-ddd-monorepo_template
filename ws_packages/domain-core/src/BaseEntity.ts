import { Entity } from './Entity';
import type { EntityCreateProps, EntityProps, EntitySystemProps } from './Entity';

/**
 * Base entity props for domain entities with timestamps
 */
export interface BaseEntityCreateProps extends EntityCreateProps {
    // Add any common properties for all entities here
}

export interface BaseEntitySystemProps extends EntitySystemProps {
    createdAt: Date;
    updatedAt: Date;
}

export type BaseEntityProps<T extends BaseEntityCreateProps> = EntityProps<T, BaseEntitySystemProps>;

/**
 * Base entity implementation with timestamps
 * This provides a common base for all domain entities that need timestamp tracking
 */
export abstract class BaseEntity<T extends BaseEntityCreateProps> extends Entity<BaseEntityProps<T>> {
    constructor(createProps: T, id?: string) {
        const now = new Date();

        // Combine user props with system props
        const props: BaseEntityProps<T> = {
            ...createProps,
            createdAt: now,
            updatedAt: now,
        };

        super(props, id);
    }

    get createdAt(): Date {
        return this.props.createdAt;
    }

    get updatedAt(): Date {
        return this.props.updatedAt;
    }

    protected updateTimestamp(): void {
        // In a real implementation, you'd need to handle immutability properly
        (this.props as { updatedAt: Date }).updatedAt = new Date();
    }
} 