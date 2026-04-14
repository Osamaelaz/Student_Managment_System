import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { AddCourse } from './add-course';

describe('AddCourse', () => {
  let component: AddCourse;
  let fixture: ComponentFixture<AddCourse>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddCourse],
      providers: [provideRouter([]), provideHttpClient()],
    }).compileComponents();

    fixture = TestBed.createComponent(AddCourse);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
