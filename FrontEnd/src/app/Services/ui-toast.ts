import { Injectable, signal } from '@angular/core';

export type ToastType = 'success' | 'error' | 'info';

export interface UiToastMessage {
  id: number;
  type: ToastType;
  title: string;
  message: string;
}

@Injectable({
  providedIn: 'root',
})
export class UiToast {
  private readonly _toasts = signal<UiToastMessage[]>([]);
  private nextId = 1;

  readonly toasts = this._toasts.asReadonly();

  success(message: string, title = 'Success', durationMs = 3200): void {
    this.show('success', message, title, durationMs);
  }

  error(message: string, title = 'Error', durationMs = 4200): void {
    this.show('error', message, title, durationMs);
  }

  info(message: string, title = 'Info', durationMs = 3200): void {
    this.show('info', message, title, durationMs);
  }

  dismiss(id: number): void {
    this._toasts.set(this._toasts().filter((toast) => toast.id !== id));
  }

  private show(type: ToastType, message: string, title: string, durationMs: number): void {
    const toast: UiToastMessage = {
      id: this.nextId++,
      type,
      title,
      message,
    };

    this._toasts.set([...this._toasts(), toast]);

    if (durationMs > 0) {
      setTimeout(() => {
        this.dismiss(toast.id);
      }, durationMs);
    }
  }
}
