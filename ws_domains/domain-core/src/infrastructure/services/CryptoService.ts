import { randomUUID } from 'crypto';
import type { CryptoService } from '../../domain/interfaces';

export class CryptoServiceImpl implements CryptoService {
  generateId(): string {
    return randomUUID();
  }
}
