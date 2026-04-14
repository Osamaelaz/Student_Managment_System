import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { of, throwError } from 'rxjs';
import { Login } from './login';
import { UserAuth } from '../../Services/user-auth';
import { Router } from '@angular/router';
import { vi } from 'vitest';

describe('Login', () => {
  let component: Login;
  let fixture: ComponentFixture<Login>;
  let userAuthMock: {
    login: ReturnType<typeof vi.fn>;
    logout: ReturnType<typeof vi.fn>;
    getUserLogged: ReturnType<typeof vi.fn>;
  };
  let routerMock: {
    navigate: ReturnType<typeof vi.fn>;
  };

  beforeEach(async () => {
    userAuthMock = {
      login: vi.fn(),
      logout: vi.fn(),
      getUserLogged: vi.fn().mockReturnValue(false),
    };

    routerMock = {
      navigate: vi.fn(),
    };

    await TestBed.configureTestingModule({
      imports: [Login],
      providers: [
        provideRouter([]),
        { provide: UserAuth, useValue: userAuthMock },
        { provide: Router, useValue: routerMock },
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(Login);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should login and navigate to Students on success', () => {
    userAuthMock.login.mockReturnValue(
      of({
        token: 'jwt-token',
        expiresAt: '2026-04-13T00:00:00Z',
        userName: 'admin',
        email: 'admin@iti.local',
      })
    );

    component.userName = 'admin';
    component.password = 'Admin123!';
    component.login();

    expect(userAuthMock.login).toHaveBeenCalledWith('admin', 'Admin123!');
    expect(routerMock.navigate).toHaveBeenCalledWith(['/Students']);
    expect(component.errorMessage).toBe('');
  });

  it('should show an error message on failed login', () => {
    userAuthMock.login.mockReturnValue(throwError(() => new Error('invalid')));

    component.userName = 'admin';
    component.password = 'wrong';
    component.login();

    expect(component.errorMessage).toBe('Invalid username or password.');
    expect(routerMock.navigate).not.toHaveBeenCalled();
  });

  it('should logout through the auth service', () => {
    component.logout();

    expect(userAuthMock.logout).toHaveBeenCalled();
  });
});
