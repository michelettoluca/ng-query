import * as hash from 'object-hash';
import { CacheKey } from '../classes/CacheManager';

export function hashKey(key: CacheKey) {
  const normalizedKey = JSON.parse(JSON.stringify(key));
  return hash(normalizedKey);
}
