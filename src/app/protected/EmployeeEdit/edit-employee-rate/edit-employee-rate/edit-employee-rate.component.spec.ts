import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditEmployeeRateComponent } from './edit-employee-rate.component';

describe('EditEmployeeRateComponent', () => {
  let component: EditEmployeeRateComponent;
  let fixture: ComponentFixture<EditEmployeeRateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditEmployeeRateComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditEmployeeRateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
