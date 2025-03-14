import type { KafkaConfig as KafkaJSConfig } from 'kafkajs';

export interface KafkaEventBusConfig {
  kafka: KafkaJSConfig;
  topic: string;
  groupId: string;
  clientId: string;
  retryPolicy?: {
    maxRetries: number;
    initialRetryTime: number;
    maxRetryTime: number;
  };
  deadLetterQueue?: {
    topic: string;
    maxAttempts: number;
  };
}
