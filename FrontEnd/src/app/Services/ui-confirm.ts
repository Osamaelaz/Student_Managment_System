import { Injectable, signal } from '@angular/core';

export interface ConfirmOptions {
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  danger?: boolean;
}

export interface ConfirmState extends Required<ConfirmOptions> {}

@Injectable({
  providedIn: 'root',
})
export class UiConfirm {
  private readonly _state = signal<ConfirmState | null>(null);
  private resolver: ((result: boolean) => void) | null = null;

  readonly state = this._state.asReadonly();

  confirm(options: ConfirmOptions): Promise<boolean> {
    if (this.resolver) {
      this.resolve(false);
    }

    this._state.set({
      title: options.title,
      message: options.message,
      confirmText: options.confirmText ?? 'Confirm',
      cancelText: options.cancelText ?? 'Cancel',
      danger: options.danger ?? false,
    });

    return new Promise<boolean>((resolve) => {
      this.resolver = resolve;
    });
  }

  accept(): void {
    this.resolve(true);
  }

  cancel(): void {
    this.resolve(false);
  }

  private resolve(result: boolean): void {
    if (this.resolver) {
      this.resolver(result);
      this.resolver = null;
    }
    this._state.set(null);
  }
}
