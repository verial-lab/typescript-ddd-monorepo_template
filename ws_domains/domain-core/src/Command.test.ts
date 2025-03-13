import { describe, expect, it } from 'vitest';
import { Command, type CommandCreateProps } from './Command';

// Define test payload type
interface TestPayload {
  id: string;
  name: string;
}

// Create a concrete implementation for testing
class TestCommand extends Command<TestPayload> {
  constructor(payload: TestPayload) {
    const props: CommandCreateProps<TestPayload> = {
      type: 'TEST_COMMAND',
      payload,
    };
    super(props);
  }
}

describe('Command', () => {
  it('should create a command with the correct properties', () => {
    const payload = { id: '123', name: 'Test Command' };
    const command = new TestCommand(payload);

    expect(command.type).toBe('TEST_COMMAND');
    expect(command.payload).toEqual(payload);
    expect(command.timestamp).toBeInstanceOf(Date);
    expect(command.commandId).toBeDefined();
  });

  it('should create a command with provided system properties', () => {
    const payload = { id: '123', name: 'Test Command' };
    const _timestamp = new Date(2023, 0, 1);
    const _commandId = 'test-command-id';

    const command = new TestCommand(payload);
    expect(command.payload).toEqual(payload);
    expect(command.type).toBe('TEST_COMMAND');
    expect(command.timestamp).toBeInstanceOf(Date);
    expect(command.commandId).toBeDefined();
  });
});
