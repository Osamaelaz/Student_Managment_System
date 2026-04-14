import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { UserAuth } from '../../Services/user-auth';

@Component({
  selector: 'app-header',
  imports: [RouterLink, CommonModule],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header {
  get isUserLoggedIn() {
    return this._userAuth.isLoggedIn();
  }

  constructor(private _userAuth: UserAuth, private _router: Router) { }

  logout(): void {
    this._userAuth.logout();
    this._router.navigateByUrl('/Login');
  }
}
