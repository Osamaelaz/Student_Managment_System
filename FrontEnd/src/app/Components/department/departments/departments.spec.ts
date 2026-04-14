import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { Departments } from './departments';

describe('Departments', () => {
  let component: Departments;
  let fixture: ComponentFixture<Departments>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Departments],
      providers: [provideRouter([]), provideHttpClient()],
    }).compileComponents();

    fixture = TestBed.createComponent(Departments);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
