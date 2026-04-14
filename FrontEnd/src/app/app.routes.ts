import { Routes } from '@angular/router';
import { NotFound } from './Components/not-found/not-found';
import { Students } from './Components/student/students/students';
import { Details } from './Components/student/details/details';
import { DepartmentDetails } from './Components/department/department-details/department-details';
import { Login } from './Components/login/login';
import { Register } from './Components/register/register';
import { authGuard } from './guards/auth-guard';
import { AddStudent } from './Components/student/add-student/add-student';
import { EditStudent } from './Components/student/edit-student/edit-student';
import { Departments } from './Components/department/departments/departments';
import { AddDepartment } from './Components/department/add-department/add-department';
import { EditDepartment } from './Components/department/edit-department/edit-department';
import { Courses } from './Components/course/courses/courses';
import { AddCourse } from './Components/course/add-course/add-course';
import { EditCourse } from './Components/course/edit-course/edit-course';
import { CourseDetails } from './Components/course/course-details/course-details';
import { ManageCourses } from './Components/department/manage-courses/manage-courses';
import { StudentCourseAssignment } from './Components/course/student-course-assignment/student-course-assignment';

export const routes: Routes = [
  { path: '', redirectTo: 'Students', pathMatch: 'full' },
  { path: 'AddStudent', component: AddStudent, canActivate: [authGuard] },
  { path: 'AddDepartment', component: AddDepartment, canActivate: [authGuard] },
  { path: 'AddCourse', component: AddCourse, canActivate: [authGuard] },
  { path: 'Login', component: Login },
  { path: 'Register', component: Register },
  { path: 'StudentDetails/:id', component: Details, canActivate: [authGuard] },
  { path: 'DepartmentDetails/:id', component: DepartmentDetails, canActivate: [authGuard] },
  { path: 'DepartmentManageCourses/:id', component: ManageCourses, canActivate: [authGuard] },
  { path: 'CourseDetails/:id', component: CourseDetails, canActivate: [authGuard] },
  { path: 'StudentCourseAssignment', component: StudentCourseAssignment, canActivate: [authGuard] },
  { path: 'EditStudent/:id', component: EditStudent, canActivate: [authGuard] },
  { path: 'EditDepartment/:id', component: EditDepartment, canActivate: [authGuard] },
  { path: 'EditCourse/:id', component: EditCourse, canActivate: [authGuard] },
  { path: 'Students', component: Students, canActivate: [authGuard] },
  { path: 'Departments', component: Departments, canActivate: [authGuard] },
  { path: 'Courses', component: Courses, canActivate: [authGuard] },
  { path: '**', component: NotFound, canActivate: [authGuard] },
];
