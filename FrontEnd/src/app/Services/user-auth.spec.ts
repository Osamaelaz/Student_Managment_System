import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { UserAuth } from './user-auth';
import { environment } from '../../environments/environment';

describe('UserAuth', () => {
  let service: UserAuth;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [UserAuth],
    });
    service = TestBed.inject(UserAuth);
    httpMock = TestBed.inject(HttpTestingController);
    localStorage.clear();
  });

  afterEach(() => {
    httpMock.verify();
    localStorage.clear();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should start with login status false', () => {
    service.getAuthSubject().subscribe(status => {
      expect(status).toBe(false);
    });
  });

  it('should login and store JWT token', () => {
    service.login('admin', 'Admin123!').subscribe((response) => {
      expect(response.token).toBe('jwt-token');
      expect(localStorage.getItem('Token')).toBe('jwt-token');
      service.getAuthSubject().subscribe((status) => {
        expect(status).toBe(true);
      });
    });

    const req = httpMock.expectOne(`${environment.baseUrl}/Auth/login`);
    expect(req.request.method).toBe('POST');
    req.flush({ token: 'jwt-token', expiresAt: '2026-04-13T00:00:00Z', userName: 'admin', email: 'admin@iti.local' });
  });

  it('should register and store JWT token', () => {
    service.register({
      userName: 'newUser',
      email: 'new@iti.local',
      password: 'Admin123!',
      fullName: 'New User',
    }).subscribe((response) => {
      expect(response.token).toBe('jwt-token');
      expect(localStorage.getItem('Token')).toBe('jwt-token');
    });

    const req = httpMock.expectOne(`${environment.baseUrl}/Auth/register`);
    expect(req.request.method).toBe('POST');
    req.flush({ token: 'jwt-token', expiresAt: '2026-04-13T00:00:00Z', userName: 'newUser', email: 'new@iti.local' });
  });

  it('should logout and remove Token from localStorage', () => {
    localStorage.setItem('Token', 'some-token');
    service.logout();

    const req = httpMock.expectOne(`${environment.baseUrl}/Auth/logout`);
    expect(req.request.method).toBe('POST');
    req.flush({ message: 'Logged out.' });

    expect(localStorage.getItem('Token')).toBeNull();
    service.getAuthSubject().subscribe(status => {
      expect(status).toBe(false);
    });
  });

  it('should return true for getUserLogged if Token exists', () => {
    localStorage.setItem('Token', 'some-token');
    expect(service.getUserLogged()).toBe(true);
  });

  it('should return false for getUserLogged if Token does not exist', () => {
    expect(service.getUserLogged()).toBe(false);
  });
});
