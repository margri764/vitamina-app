import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditEmployeeSkillsComponent } from './edit-employee-skills.component';

describe('EditEmployeeSkillsComponent', () => {
  let component: EditEmployeeSkillsComponent;
  let fixture: ComponentFixture<EditEmployeeSkillsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditEmployeeSkillsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditEmployeeSkillsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
