import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { UserAuth } from '../Services/user-auth';

export const authGuard: CanActivateFn = (route, state) => {

  let _userAuth = inject(UserAuth);
  let _router = inject(Router);

  if (_userAuth.getUserLogged()) {
    return true;
  } else {
    _router.navigateByUrl('/Login');
    return false;
  }
};
