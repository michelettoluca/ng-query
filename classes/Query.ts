import { Observable, Subscription } from 'rxjs';

export type Status = 'idle' | 'loading' | 'success' | 'error' | 'stale';
export type OnSuccessCallback = (response: any) => void;
export type OnErrorCallback = (error: any) => void;
export type OnCompleteCallback = () => void;

export interface QueryOptions {
  onSuccess?: OnSuccessCallback;
  onError?: OnErrorCallback;
  onComplete?: OnCompleteCallback;
  cacheTime?: number;
}

export class Query<Response> {
  $: Observable<Response>;
  status: Status;
  data?: Response;
  error?: any;
  private subscription?: Subscription;
  onSuccess?: OnSuccessCallback;
  onError?: OnErrorCallback;
  onComplete?: OnCompleteCallback;
  cacheTime?: number;
  cacheTimeHandle?: number;

  constructor($: Observable<Response>, options: QueryOptions = {}) {
    this.$ = $;
    this.status = 'idle';
    this.onSuccess = options.onSuccess;
    this.onError = options.onError;
    this.onComplete = options.onComplete;
    this.cacheTime = options.cacheTime || 3 * 60 * 1000;
  }

  fetch(invalidate: boolean = false) {
    if (this.status === 'loading' && !invalidate) return;

    if (this.data && this.status !== 'stale' && !invalidate) return;

    if (this.cacheTimeHandle) clearInterval(this.cacheTimeHandle);
    if (!this.data) this.status = 'loading';

    this.subscription = this.$.subscribe({
      next: (response) => {
        this.status = 'success';
        this.data = response;

        this.cacheTimeHandle = setTimeout(() => {
          this.status = 'stale';
        }, this.cacheTime);

        this.onSuccess?.(response);
      },
      error: (error) => {
        this.status = 'error';
        this.error = error;

        this.onError?.(error);
      },
      complete: () => {
        this.onComplete?.();
      },
    });
  }

  cancel() {
    this.subscription?.unsubscribe();
  }
}
