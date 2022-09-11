import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CacheKey, CacheManager } from './classes/CacheManager';

@Injectable({
  providedIn: 'root',
})
export class NgQueryService {
  private cacheManager = new CacheManager();

  get cache() {
    return this.cacheManager.cache;
  }

  useQuery(key: CacheKey, $: Observable<any>) {
    return this.cacheManager.useQuery(key, $);
  }

  invalidateQuery(key: CacheKey) {
    return this.cacheManager.invalidateQuery(key);
  }

  deleteQuery(key: CacheKey) {
    return this.cacheManager.deleteQuery(key);
  }
}
