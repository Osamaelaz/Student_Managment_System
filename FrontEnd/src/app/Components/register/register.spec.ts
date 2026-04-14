import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { of } from 'rxjs';
import { vi } from 'vitest';
import { Register } from './register';
import { UserAuth } from '../../Services/user-auth';

describe('Register', () => {
  let component: Register;
  let fixture: ComponentFixture<Register>;

  const userAuthMock = {
    register: vi.fn().mockReturnValue(
      of({ token: 'jwt-token', expiresAt: '2026-04-13T00:00:00Z', userName: 'newUser', email: 'new@iti.local' })
    ),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Register],
      providers: [
        provideRouter([]),
        { provide: UserAuth, useValue: userAuthMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(Register);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
