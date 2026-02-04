import { HttpClient } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { AuthService } from './auth.service';

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;

  const mockApiUrl = 'http://localhost:3000/api';

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [AuthService]
    });

    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
    localStorage.clear();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('login', () => {
    it('should login user and store token', () => {
      const mockResponse = {
        token: 'mock-jwt-token',
        user: {
          id: 'user-123',
          email: 'test@example.com',
          createdAt: new Date().toISOString()
        }
      };

      service.login({ email: 'test@example.com' }).subscribe(response => {
        expect(response.token).toBe('mock-jwt-token');
        expect(response.user.email).toBe('test@example.com');
        expect(service.getToken()).toBe('mock-jwt-token');
      });

      const req = httpMock.expectOne(`${mockApiUrl}/auth/login`);
      expect(req.request.method).toBe('POST');
      req.flush(mockResponse);
    });

    it('should handle login error', () => {
      service.login({ email: 'test@example.com' }).subscribe({
        error: (error) => {
          expect(error.status).toBe(400);
        }
      });

      const req = httpMock.expectOne(`${mockApiUrl}/auth/login`);
      req.flush({ message: 'Email required' }, { status: 400, statusText: 'Bad Request' });
    });
  });

  describe('logout', () => {
    it('should clear user session', () => {
      localStorage.setItem('token', 'mock-token');
      localStorage.setItem('user', JSON.stringify({ id: '1', email: 'test@test.com' }));

      service.logout();

      expect(service.getToken()).toBeNull();
      expect(service.getCurrentUser()).toBeNull();
    });
  });

  describe('isAuthenticated', () => {
    it('should return true when user is logged in', () => {
      localStorage.setItem('token', 'mock-token');
      localStorage.setItem('user', JSON.stringify({ id: '1', email: 'test@test.com' }));
      
      // Re-create service to load from storage
      const newService = new AuthService(TestBed.inject(HttpClient));
      expect(newService.isAuthenticated()).toBe(true);
    });

    it('should return false when no token', () => {
      const newService = new AuthService(TestBed.inject(HttpClient));
      expect(newService.isAuthenticated()).toBe(false);
    });
  });
});
