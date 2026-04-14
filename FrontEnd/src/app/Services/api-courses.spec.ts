import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ApiCourses } from './api-courses';
import { environment } from '../../environments/environment';
import { Icourse } from '../Models/icourse';

describe('ApiCourses', () => {
  let service: ApiCourses;
  let httpMock: HttpTestingController;

  const mockCourses: Icourse[] = [
    { Crs_Id: 1, Crs_Name: 'HTML', Crs_Duration: 20, Top_Id: 1 },
    { Crs_Id: 2, Crs_Name: 'Angular', Crs_Duration: 30, Top_Id: 2 },
  ];

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ApiCourses],
    });
    service = TestBed.inject(ApiCourses);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch all courses', () => {
    service.getAllCourses().subscribe((courses) => {
      expect(courses.length).toBe(2);
      expect(courses).toEqual(mockCourses);
    });

    const req = httpMock.expectOne(`${environment.baseUrl}/Courses`);
    expect(req.request.method).toBe('GET');
    req.flush(mockCourses);
  });

  it('should add course', () => {
    const newCourse: Icourse = { Crs_Id: 3, Crs_Name: 'C#', Crs_Duration: 25, Top_Id: 3 };

    service.addCourse(newCourse).subscribe((course) => {
      expect(course).toEqual(newCourse);
    });

    const req = httpMock.expectOne(`${environment.baseUrl}/Courses`);
    expect(req.request.method).toBe('POST');
    req.flush(newCourse);
  });

  it('should delete course', () => {
    service.deleteCourse(1).subscribe();

    const req = httpMock.expectOne(`${environment.baseUrl}/Courses/1`);
    expect(req.request.method).toBe('DELETE');
    req.flush({});
  });
});
