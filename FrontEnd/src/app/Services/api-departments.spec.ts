import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ApiDepartments } from './api-departments';
import { environment } from '../../environments/environment';
import { Idepartment } from '../Models/idepartment';

describe('ApiDepartments', () => {
  let service: ApiDepartments;
  let httpMock: HttpTestingController;

  const mockDepartments: Idepartment[] = [
    { Dept_Id: 10, Dept_Name: 'SD', Dept_Desc: 'Software', Dept_Location: 'Cairo' },
    { Dept_Id: 20, Dept_Name: 'OS', Dept_Desc: 'Open Source', Dept_Location: 'Alex' },
  ];

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ApiDepartments],
    });
    service = TestBed.inject(ApiDepartments);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch all departments', () => {
    service.getAllDepartments().subscribe((departments) => {
      expect(departments.length).toBe(2);
      expect(departments).toEqual(mockDepartments);
    });

    const req = httpMock.expectOne(`${environment.baseUrl}/Department`);
    expect(req.request.method).toBe('GET');
    req.flush(mockDepartments);
  });

  it('should add department', () => {
    const newDepartment: Idepartment = {
      Dept_Id: 30,
      Dept_Name: 'AI',
      Dept_Desc: 'Artificial Intelligence',
      Dept_Location: 'Smart Village',
    };

    service.addDepartment(newDepartment).subscribe((department) => {
      expect(department).toEqual(newDepartment);
    });

    const req = httpMock.expectOne(`${environment.baseUrl}/Department`);
    expect(req.request.method).toBe('POST');
    req.flush(newDepartment);
  });

  it('should delete department', () => {
    service.deleteDepartment(10).subscribe();

    const req = httpMock.expectOne(`${environment.baseUrl}/Department/10`);
    expect(req.request.method).toBe('DELETE');
    req.flush({});
  });
});
