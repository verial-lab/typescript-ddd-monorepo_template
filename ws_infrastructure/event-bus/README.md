# Event Bus

A type-safe event bus implementation with Kafka support for TypeScript domain-driven design applications.

## Features

- 🎯 **Type Safety**: Full TypeScript support with generic event types
- 🚀 **Kafka Support**: Built-in Kafka implementation with robust error handling
- 🧪 **Testing Utilities**: Comprehensive test helpers for mocking and assertions
- 🛡️ **Event Validation**: Optional event validation with custom validators
- 🔄 **Retry Strategies**: Configurable retry policies for failed events
- 📬 **Dead Letter Queue**: Support for handling failed message processing

## Installation

```bash
# Using pnpm (recommended)
pnpm add @repo-infrastructure/event-bus

# Using npm
npm install @repo-infrastructure/event-bus

# Using yarn
yarn add @repo-infrastructure/event-bus
```

## Quick Start

1. Define your event types:

```typescript
import { CreatedEventPayload, IDomainEvent } from '@repo-domains/domain-core';

interface UserCreatedEvent extends CreatedEventPayload {
    eventType: 'created';
    userId: string;
    email: string;
}

// Optional: Create a type-safe event handler
class UserCreatedHandler implements IEventHandler<UserCreatedEvent> {
    async handle(event: IDomainEvent<UserCreatedEvent>): Promise<void> {
        const { userId, email } = event.payload;
        // Handle the event...
    }
}
```

2. Configure the event bus:

```typescript
import { KafkaEventBus, KafkaEventBusConfig } from '@repo-infrastructure/event-bus';

const config: KafkaEventBusConfig = {
    kafka: {
        clientId: 'my-app',
        brokers: ['localhost:9092'],
    },
    topic: 'domain-events',
    groupId: 'my-app-group',
    deadLetterQueue: {
        topic: 'domain-events-dlq',
        maxRetries: 3,
    },
};

const eventBus = new KafkaEventBus<UserCreatedEvent>(config);
```

3. Use the event bus:

```typescript
// Subscribe to events
const handler = new UserCreatedHandler();
await eventBus.subscribe('created', handler);

// Publish events
await eventBus.publish({
    eventId: 'unique-id',
    eventType: 'created',
    occurredOn: new Date(),
    aggregateId: 'user-123',
    version: 1,
    payload: {
        eventType: 'created',
        timestamp: new Date(),
        userId: 'user-123',
        email: 'user@example.com',
    },
});
```

## Configuration

### Kafka Configuration

The `KafkaEventBusConfig` interface provides all available configuration options:

```typescript
interface KafkaEventBusConfig {
    kafka: {
        clientId: string;
        brokers: string[];
        ssl?: boolean;
        sasl?: {
            mechanism: 'plain' | 'scram-sha-256' | 'scram-sha-512';
            username: string;
            password: string;
        };
    };
    topic: string;
    groupId: string;
    deadLetterQueue?: {
        topic: string;
        maxRetries?: number;
    };
}
```

### Event Validation

You can add custom event validation by implementing the `IEventValidator` interface:

```typescript
class ZodEventValidator<T extends BaseEventPayload> implements IEventValidator<T> {
    private readonly schema: ZodSchema;

    constructor(schema: ZodSchema) {
        this.schema = schema;
    }

    async validate(event: IDomainEvent<T>): Promise<void> {
        await this.schema.parseAsync(event);
    }
}

const validator = new ZodEventValidator(userCreatedSchema);
const eventBus = new KafkaEventBus(config, validator);
```

## Testing

The package provides comprehensive testing utilities:

```typescript
import {
    createMockEvent,
    createMockCreatedEvent,
    createMockEventHandler,
    assertEventEqual,
    assertEventHandlerCalled,
} from '@repo-infrastructure/event-bus/testing';

describe('UserCreatedHandler', () => {
    it('should handle user created events', async () => {
        const handler = new UserCreatedHandler();
        const event = createMockCreatedEvent<UserCreatedEvent>({
            payload: {
                userId: '123',
                email: 'test@example.com',
            },
        });

        await handler.handle(event);
        // Add assertions...
    });
});
```

## Domain Layer Integration

1. Define your domain events:

```typescript
// domain/user/events/UserCreatedEvent.ts
export interface UserCreatedEvent extends CreatedEventPayload {
    eventType: 'user.created';
    userId: string;
    email: string;
    role: string;
}

// domain/user/events/index.ts
export type UserEventTypes = UserCreatedEvent | UserUpdatedEvent | UserDeletedEvent;
```

2. Create domain-specific event handlers:

```typescript
// domain/user/handlers/UserCreatedHandler.ts
@Injectable()
export class UserCreatedHandler implements IEventHandler<UserCreatedEvent> {
    constructor(private readonly userRepository: UserRepository) {}

    async handle(event: IDomainEvent<UserCreatedEvent>): Promise<void> {
        const { userId, email, role } = event.payload;
        await this.userRepository.create({ id: userId, email, role });
    }
}
```

3. Configure event bus in your application:

```typescript
// infrastructure/eventBus.ts
@Injectable()
export class EventBusProvider {
    private eventBus: KafkaEventBus<UserEventTypes>;

    constructor(config: ConfigService) {
        this.eventBus = new KafkaEventBus(config.get('kafka'));
    }

    async onModuleInit() {
        await this.eventBus.connect();
    }

    async onModuleDestroy() {
        await this.eventBus.disconnect();
    }
}
```

## Error Handling

The event bus provides several layers of error handling:

1. **Handler Errors**: Individual handler errors are caught and aggregated
2. **Validation Errors**: Event validation errors prevent invalid events from being published
3. **Connection Errors**: Kafka connection issues are handled gracefully
4. **Dead Letter Queue**: Failed messages can be moved to a DLQ for later processing

Example error handling:

```typescript
try {
    await eventBus.publish(event);
} catch (error) {
    if (error instanceof EventBusError) {
        if (error.cause instanceof Array) {
            // Multiple handler errors
            error.cause.forEach(handleError);
        } else {
            // Single error
            handleError(error.cause);
        }
    }
}
```

## Best Practices

1. **Event Naming**:
   - Use past tense verbs (e.g., `UserCreated`, `OrderPlaced`)
   - Include the aggregate name (e.g., `user.created`, `order.placed`)

2. **Event Schema**:
   - Keep events immutable
   - Include only necessary data
   - Version your events

3. **Error Handling**:
   - Always implement proper error handling
   - Use dead letter queues for failed messages
   - Implement retry strategies for transient failures

4. **Testing**:
   - Use provided test utilities
   - Test both success and failure scenarios
   - Test event validation
   - Test error handling

## Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md) for contribution guidelines.

## License

MIT 