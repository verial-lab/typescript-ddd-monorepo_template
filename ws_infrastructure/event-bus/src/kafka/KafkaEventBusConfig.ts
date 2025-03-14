import type { KafkaConfig } from 'kafkajs';

/**
 * Dead letter queue configuration
 */
export interface DeadLetterQueueConfig {
  /**
   * Topic to publish failed events to
   */
  topic: string;

  /**
   * Maximum number of retry attempts before sending to DLQ
   */
  maxAttempts: number;
}

/**
 * Kafka event bus configuration
 */
export interface KafkaEventBusConfig {
  /**
   * Client ID for Kafka
   */
  clientId: string;

  /**
   * Kafka connection configuration
   */
  kafka: KafkaConfig;

  /**
   * Topic to publish events to
   */
  topic: string;

  /**
   * Consumer group ID
   */
  groupId: string;

  /**
   * Dead letter queue configuration
   */
  deadLetterQueue?: DeadLetterQueueConfig;
}
