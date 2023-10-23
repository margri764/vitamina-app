import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditEmployeeNameComponent } from './edit-employee-name.component';

describe('EditEmployeeNameComponent', () => {
  let component: EditEmployeeNameComponent;
  let fixture: ComponentFixture<EditEmployeeNameComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditEmployeeNameComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditEmployeeNameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
