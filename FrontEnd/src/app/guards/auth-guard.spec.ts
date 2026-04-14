import { TestBed } from '@angular/core/testing';
import { CanActivateFn, provideRouter } from '@angular/router';
import { Router } from '@angular/router';
import { vi } from 'vitest';

import { authGuard } from './auth-guard';
import { UserAuth } from '../Services/user-auth';

describe('authGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) =>
    TestBed.runInInjectionContext(() => authGuard(...guardParameters));

  const routerMock = {
    navigateByUrl: vi.fn(),
  };

  const userAuthMock = {
    getUserLogged: vi.fn(),
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideRouter([]),
        { provide: Router, useValue: routerMock },
        { provide: UserAuth, useValue: userAuthMock },
      ]
    });
  });

  it('should allow navigation when a token exists', () => {
    userAuthMock.getUserLogged.mockReturnValue(true);

    expect(executeGuard({} as never, {} as never)).toBeTruthy();
    expect(routerMock.navigateByUrl).not.toHaveBeenCalled();
  });

  it('should redirect to Login when there is no token', () => {
    userAuthMock.getUserLogged.mockReturnValue(false);

    expect(executeGuard({} as never, {} as never)).toBeFalsy();
    expect(routerMock.navigateByUrl).toHaveBeenCalledWith('/Login');
  });
});
