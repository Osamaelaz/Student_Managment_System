import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { Header } from './Components/header/header';
import { Footer } from './Components/footer/footer';
import { ToastHost } from './Components/shared/toast-host/toast-host';
import { ConfirmDialog } from './Components/shared/confirm-dialog/confirm-dialog';
import { UserAuth } from './Services/user-auth';

@Component({
  selector: 'app-root',
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive, Header, Footer, ToastHost, ConfirmDialog],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  constructor(private _userAuth: UserAuth) {}

  get isUserLoggedIn(): boolean {
    return this._userAuth.isLoggedIn();
  }
}
