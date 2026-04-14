import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { UiToast } from '../../../Services/ui-toast';

@Component({
  selector: 'app-toast-host',
  imports: [CommonModule],
  templateUrl: './toast-host.html',
})
export class ToastHost {
  constructor(public toast: UiToast) {}

  iconFor(type: string): string {
    switch (type) {
      case 'success':
        return 'bi-check-circle-fill';
      case 'error':
        return 'bi-x-circle-fill';
      default:
        return 'bi-info-circle-fill';
    }
  }
}
