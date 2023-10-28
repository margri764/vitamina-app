import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssignTimeComponent } from './assign-time.component';

describe('AssignTimeComponent', () => {
  let component: AssignTimeComponent;
  let fixture: ComponentFixture<AssignTimeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AssignTimeComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AssignTimeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
