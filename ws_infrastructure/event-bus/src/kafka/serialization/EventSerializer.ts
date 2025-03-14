import type { BaseEventPayload, IDomainEvent } from '@repo-domains/domain-core';

type JsonValue = string | number | boolean | null | JsonValue[] | { [key: string]: JsonValue };

export class EventSerializer {
  public serialize<T extends BaseEventPayload>(event: IDomainEvent<T>): Buffer {
    // Deep clone and convert dates to ISO strings
    const payload = this.convertDatesToISOStrings(event.payload);

    const serializedEvent = {
      eventId: event.eventId,
      eventType: event.eventType,
      occurredOn: event.occurredOn.toISOString(),
      aggregateId: event.aggregateId,
      version: event.version,
      payload,
    };

    return Buffer.from(JSON.stringify(serializedEvent));
  }

  public deserialize<T extends BaseEventPayload>(data: Buffer): IDomainEvent<T> {
    const parsed = JSON.parse(data.toString());

    // Convert ISO strings back to Date objects
    const payload = this.convertISOStringsToDates(parsed.payload);

    return {
      eventId: parsed.eventId,
      eventType: parsed.eventType,
      occurredOn: new Date(parsed.occurredOn),
      aggregateId: parsed.aggregateId,
      version: parsed.version,
      payload: payload as T,
    };
  }

  private convertDatesToISOStrings(obj: unknown): JsonValue {
    if (obj === null || obj === undefined) {
      return obj as null;
    }

    if (obj instanceof Date) {
      return obj.toISOString();
    }

    if (Array.isArray(obj)) {
      return obj.map((item) => this.convertDatesToISOStrings(item));
    }

    if (typeof obj === 'object') {
      const result: Record<string, JsonValue> = {};
      for (const key in obj as Record<string, unknown>) {
        if (Object.prototype.hasOwnProperty.call(obj, key)) {
          result[key] = this.convertDatesToISOStrings((obj as Record<string, unknown>)[key]);
        }
      }
      return result;
    }

    return obj as JsonValue;
  }

  private convertISOStringsToDates(obj: unknown): unknown {
    if (obj === null || obj === undefined) {
      return obj;
    }

    if (typeof obj === 'string' && this.isISODateString(obj)) {
      return new Date(obj);
    }

    if (Array.isArray(obj)) {
      return obj.map((item) => this.convertISOStringsToDates(item));
    }

    if (typeof obj === 'object') {
      const result: Record<string, unknown> = {};
      for (const key in obj as Record<string, unknown>) {
        if (Object.prototype.hasOwnProperty.call(obj, key)) {
          result[key] = this.convertISOStringsToDates((obj as Record<string, unknown>)[key]);
        }
      }
      return result;
    }

    return obj;
  }

  private isISODateString(str: string): boolean {
    const isoDatePattern = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d{3})?Z$/;
    return isoDatePattern.test(str);
  }
}
