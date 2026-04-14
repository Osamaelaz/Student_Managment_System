import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { DepartmentDetails } from './department-details';

describe('DepartmentDetails', () => {
  let component: DepartmentDetails;
  let fixture: ComponentFixture<DepartmentDetails>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DepartmentDetails],
      providers: [provideRouter([]), provideHttpClient()],
    }).compileComponents();

    fixture = TestBed.createComponent(DepartmentDetails);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
