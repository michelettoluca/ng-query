import { Observable } from 'rxjs';
import { Query, QueryOptions } from './Query';
import { hashKey } from '../utils/hashKey';

export type CacheKey = string | Array<any>;

export type Cache = Map<string, Query<any>>;

export class CacheManager {
  protected readonly _cache: Cache;

  constructor() {
    this._cache = new Map();
  }

  get cache() {
    return Object.fromEntries(this._cache);
  }

  private saveQuery(key: CacheKey, query: Query<any>) {
    const hashedKey: string = hashKey(key);
    this._cache.set(hashedKey, query);
  }

  private getQuery(key: CacheKey) {
    const hashedKey: string = hashKey(key);
    return this._cache.get(hashedKey);
  }

  useQuery(key: CacheKey, $: Observable<any>, options: QueryOptions = {}) {
    const cachedQuery = this.getQuery(key);
    if (cachedQuery) return cachedQuery;

    const query: Query<any> = new Query($, options);
    this.saveQuery(key, query);

    return query;
  }

  invalidateQuery(key: CacheKey): boolean {
    const cachedQuery = this.getQuery(key);
    if (!cachedQuery) return false;

    cachedQuery.fetch(true);

    return true;
  }

  deleteQuery(key: CacheKey) {
    const hashedKey = hashKey(key);
    return this._cache.delete(hashedKey);
  }
}
