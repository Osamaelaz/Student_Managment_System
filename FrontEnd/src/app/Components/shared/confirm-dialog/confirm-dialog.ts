import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { UiConfirm } from '../../../Services/ui-confirm';

@Component({
  selector: 'app-confirm-dialog',
  imports: [CommonModule],
  templateUrl: './confirm-dialog.html',
})
export class ConfirmDialog {
  constructor(public confirm: UiConfirm) {}
}
