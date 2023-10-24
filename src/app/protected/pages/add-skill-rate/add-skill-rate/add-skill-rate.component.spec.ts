import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddSkillRateComponent } from './add-skill-rate.component';

describe('AddSkillRateComponent', () => {
  let component: AddSkillRateComponent;
  let fixture: ComponentFixture<AddSkillRateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddSkillRateComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddSkillRateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
