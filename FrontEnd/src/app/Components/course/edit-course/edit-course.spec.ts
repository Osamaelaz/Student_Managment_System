import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { EditCourse } from './edit-course';

describe('EditCourse', () => {
  let component: EditCourse;
  let fixture: ComponentFixture<EditCourse>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditCourse],
      providers: [provideRouter([]), provideHttpClient()],
    }).compileComponents();

    fixture = TestBed.createComponent(EditCourse);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
