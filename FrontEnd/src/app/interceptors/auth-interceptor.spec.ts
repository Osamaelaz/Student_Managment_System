import { HttpRequest, HttpResponse } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { authInterceptor } from './auth-interceptor';
import { UserAuth } from '../Services/user-auth';
import { vi } from 'vitest';

describe('authInterceptor', () => {
  const next = vi.fn();

  beforeEach(() => {
    next.mockReset();
  });

  it('should pass requests through unchanged when no token exists', () => {
    TestBed.configureTestingModule({
      providers: [
        {
          provide: UserAuth,
          useValue: {
            getToken: () => null,
          },
        },
      ],
    });

    const request = new HttpRequest('GET', '/api/test');

    TestBed.runInInjectionContext(() => {
      next.mockReturnValue(of(new HttpResponse({ status: 200 })));
      authInterceptor(request, next);
    });

    expect(next).toHaveBeenCalledWith(request);
  });

  it('should attach the bearer token when available', () => {
    TestBed.configureTestingModule({
      providers: [
        {
          provide: UserAuth,
          useValue: {
            getToken: () => 'jwt-token',
          },
        },
      ],
    });

    const request = new HttpRequest('GET', '/api/test');

    TestBed.runInInjectionContext(() => {
      next.mockReturnValue(of(new HttpResponse({ status: 200 })));
      authInterceptor(request, next);
    });

    const forwardedRequest = next.mock.calls.at(-1)?.[0] as HttpRequest<unknown>;
    expect(forwardedRequest.headers.get('Authorization')).toBe('Bearer jwt-token');
    expect(forwardedRequest.url).toBe('/api/test');
    expect(request.headers.has('Authorization')).toBeFalsy();
  });
});
