import { describe, expect, it, vi } from 'vitest';
import type { CryptoService } from '../../domain/interfaces/services/CryptoService';
import { Command, type CommandCreateProps } from './Command';

// Define test payload type
interface TestPayload {
  id: string;
  name: string;
}

// Mock CryptoService
const mockCryptoService: CryptoService = {
  generateId: vi.fn().mockReturnValue('test-id'),
};

// Create a concrete implementation for testing
class TestCommand extends Command<TestPayload> {
  constructor(payload: TestPayload) {
    const props: CommandCreateProps<TestPayload> = {
      type: 'TEST_COMMAND',
      payload,
    };
    super(mockCryptoService, props);
  }

  get commandType(): string {
    return 'TEST_COMMAND';
  }
}

describe('Command', () => {
  it('should create a command with the correct properties', () => {
    const payload = { id: '123', name: 'Test Command' };
    const command = new TestCommand(payload);

    expect(command.type).toBe('TEST_COMMAND');
    expect(command.payload).toEqual(payload);
    expect(command.timestamp).toBeInstanceOf(Date);
    expect(command.commandId).toBe('test-id');
    expect(mockCryptoService.generateId).toHaveBeenCalled();
  });

  it('should create a command with provided system properties', () => {
    const payload = { id: '123', name: 'Test Command' };
    const command = new TestCommand(payload);
    expect(command.payload).toEqual(payload);
    expect(command.type).toBe('TEST_COMMAND');
    expect(command.timestamp).toBeInstanceOf(Date);
    expect(command.commandId).toBe('test-id');
    expect(mockCryptoService.generateId).toHaveBeenCalled();
  });
});
