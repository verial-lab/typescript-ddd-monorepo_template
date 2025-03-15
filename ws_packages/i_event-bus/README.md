# Event Bus Infrastructure Package

This package provides a Kafka-based event bus implementation for handling domain events in a distributed system. It implements the `IEventBus` interface from the domain core, providing a robust and type-safe way to publish and subscribe to domain events.

## Table of Contents

- [Event Bus Infrastructure Package](#event-bus-infrastructure-package)
  - [Table of Contents](#table-of-contents)
  - [Features](#features)
  - [Installation](#installation)
  - [Configuration](#configuration)
    - [Configuration Options](#configuration-options)
  - [Usage](#usage)
    - [Connecting to Kafka](#connecting-to-kafka)
    - [Publishing Events](#publishing-events)
    - [Subscribing to Events](#subscribing-to-events)
    - [Unsubscribing from Events](#unsubscribing-from-events)
    - [Cleanup](#cleanup)
  - [Development](#development)
    - [Prerequisites](#prerequisites)
    - [Setup](#setup)
    - [Testing](#testing)
  - [Production Setup](#production-setup)
    - [Kafka Requirements](#kafka-requirements)
    - [Environment Variables](#environment-variables)
    - [Docker Example](#docker-example)
    - [Kubernetes Configuration Example](#kubernetes-configuration-example)
  - [Monitoring](#monitoring)
    - [Health Checks](#health-checks)
    - [Metrics](#metrics)
    - [Logging](#logging)
  - [Error Handling](#error-handling)
  - [Additional Documentation](#additional-documentation)
  - [Contributing](#contributing)
  - [License](#license)

## Features

[↑](#table-of-contents)

- Type-safe event publishing and subscription
- Kafka-based message broker integration
- Automatic reconnection handling
- Configurable consumer groups
- Comprehensive error handling
- Full test coverage

## Installation

[↑](#table-of-contents)

```bash
pnpm add @repo-packages/i_event-bus
```

## Configuration

[↑](#table-of-contents)

The event bus requires a Kafka configuration object:

```typescript
import { KafkaEventBus } from '@repo-packages/i_event-bus';

const config = {
  clientId: 'your-client-id',
  brokers: ['kafka-broker:9092'],
  groupId: 'your-consumer-group'
};

const eventBus = new KafkaEventBus(config);
```

### Configuration Options

[↑](#table-of-contents)

- `clientId`: Unique identifier for your application
- `brokers`: Array of Kafka broker addresses (at least one required)
- `groupId`: Consumer group identifier for event subscriptions

## Usage

[↑](#table-of-contents)

### Connecting to Kafka

[↑](#table-of-contents)

```typescript
await eventBus.connect();
```

### Publishing Events

[↑](#table-of-contents)

```typescript
import { DomainEvent } from '@repo-domains/domain-core';

class UserCreatedEvent extends DomainEvent<UserCreatedPayload> {
  // ... event implementation
}

const event = new UserCreatedEvent(/* ... */);
await eventBus.publish(event);
```

### Subscribing to Events

[↑](#table-of-contents)

```typescript
const handler = {
  handle: async (event: UserCreatedEvent) => {
    // Handle the event
  }
};

await eventBus.subscribe('user.created', handler);
```

### Unsubscribing from Events

[↑](#table-of-contents)

```typescript
await eventBus.unsubscribe('user.created', handler);
```

### Cleanup

[↑](#table-of-contents)

```typescript
await eventBus.disconnect();
```

## Development

[↑](#table-of-contents)

### Prerequisites

[↑](#table-of-contents)

- Node.js 18+
- pnpm
- Running Kafka instance (for integration tests)

### Setup

[↑](#table-of-contents)

1. Install dependencies:

```bash
pnpm install
```

2. Run tests:

```bash
pnpm test
```

3. Run tests with coverage:

```bash
pnpm test -- --coverage
```

### Testing

[↑](#table-of-contents)

The package includes comprehensive unit tests. To run them:

```bash
pnpm test
```

For coverage report:

```bash
pnpm test -- --coverage
```

## Production Setup

[↑](#table-of-contents)

### Kafka Requirements

[↑](#table-of-contents)

- Kafka 2.8+ recommended
- Properly configured brokers with:
  - Authentication (if required)
  - Topic auto-creation enabled or topics pre-created
  - Appropriate retention policies
  - Monitoring setup

### Environment Variables

[↑](#table-of-contents)

```env
KAFKA_BROKERS=broker1:9092,broker2:9092
KAFKA_CLIENT_ID=your-app-name
KAFKA_GROUP_ID=your-consumer-group
```

### Docker Example

[↑](#table-of-contents)

```dockerfile
FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package.json pnpm-lock.yaml ./

# Install dependencies
RUN npm install -g pnpm && pnpm install

# Copy application files
COPY . .

# Build the application
RUN pnpm build

# Start the application
CMD ["node", "dist/index.js"]
```

### Kubernetes Configuration Example

[↑](#table-of-contents)

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: event-bus-service
spec:
  replicas: 2
  selector:
    matchLabels:
      app: event-bus-service
  template:
    metadata:
      labels:
        app: event-bus-service
    spec:
      containers:
      - name: event-bus-service
        image: your-registry/event-bus-service:latest
        env:
        - name: KAFKA_BROKERS
          valueFrom:
            configMapKeyRef:
              name: kafka-config
              key: brokers
        - name: KAFKA_CLIENT_ID
          valueFrom:
            configMapKeyRef:
              name: kafka-config
              key: client-id
        - name: KAFKA_GROUP_ID
          valueFrom:
            configMapKeyRef:
              name: kafka-config
              key: group-id
```

## Monitoring

[↑](#table-of-contents)

### Health Checks

[↑](#table-of-contents)

Implement health checks in your service:

```typescript
class EventBusHealthCheck {
  constructor(private eventBus: KafkaEventBus) {}

  async check(): Promise<boolean> {
    try {
      // Check connection status
      return this.eventBus.isConnected;
    } catch (error) {
      return false;
    }
  }
}
```

### Metrics

[↑](#table-of-contents)

Monitor the following metrics:

- Connection status
- Message throughput
- Error rates
- Consumer lag
- Processing time

### Logging

[↑](#table-of-contents)

The event bus logs important events:

- Connection established/lost
- Message publishing failures
- Subscription errors
- Consumer group rebalancing

## Error Handling

[↑](#table-of-contents)

The event bus handles various error scenarios:

- Connection failures: Automatic reconnection attempts
- Message publishing failures: Throws errors that should be handled by the caller
- Message processing errors: Logged and reported, but doesn't crash the consumer
- Invalid message format: Logged and skipped

## Additional Documentation

[↑](#table-of-contents)

For more detailed information about Kafka and its features, see [README-kafka.md](./README-kafka.md).

## Contributing

[↑](#table-of-contents)

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

[↑](#table-of-contents)

This project is licensed under the MIT License - see the LICENSE file for details.
