import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ApiStudents } from './api-students';
import { environment } from '../../environments/environment';
import { Istudent } from '../Models/istudent';

describe('ApiStudents', () => {
  let service: ApiStudents;
  let httpMock: HttpTestingController;

  const mockStudents: Istudent[] = [
    { St_Id: 1, St_Fname: 'Ahmed', St_Lname: 'Ali', St_Address: 'Cairo', St_Age: 21, Dept_Id: 10, Dept_Name: 'SD' },
    { St_Id: 2, St_Fname: 'Sara', St_Lname: 'Hassan', St_Address: 'Alex', St_Age: 22, Dept_Id: 20, Dept_Name: 'OS' }
  ];

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ApiStudents]
    });
    service = TestBed.inject(ApiStudents);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch all students', () => {
    service.getAllStudents().subscribe((students) => {
      expect(students.length).toBe(2);
      expect(students).toEqual(mockStudents);
      expect(students[0].Dept_Name).toBe('SD');
    });

    const req = httpMock.expectOne(`${environment.baseUrl}/Students`);
    expect(req.request.method).toBe('GET');
    req.flush(mockStudents);
  });

  it('should add a new student', () => {
    const newStudent: Istudent = {
      St_Id: 3,
      St_Fname: 'Mona',
      St_Lname: 'Samy',
      St_Address: 'Mansoura',
      St_Age: 20,
      Dept_Id: 30,
      Dept_Name: 'AI',
    };
    service.addStudent(newStudent).subscribe((student) => {
      expect(student).toEqual(newStudent);
    });

    const req = httpMock.expectOne(`${environment.baseUrl}/Students`);
    expect(req.request.method).toBe('POST');
    req.flush(newStudent);
  });

  it('should delete a student', () => {
    service.deleteStudent(1).subscribe();

    const req = httpMock.expectOne(`${environment.baseUrl}/Students/1`);
    expect(req.request.method).toBe('DELETE');
    req.flush({});
  });
});
