import type { Profile } from '../../models/Profile';
import type { ProfileCreateProps } from '../../models/Profile';
import type { Repository } from './Repository';

export interface ProfileRepository extends Repository<Profile, string> {
  findByUserId(userId: string): Promise<Profile | null>;
}
