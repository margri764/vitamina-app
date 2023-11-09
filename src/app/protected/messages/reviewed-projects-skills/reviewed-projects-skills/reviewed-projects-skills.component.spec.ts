import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReviewedProjectsSkillsComponent } from './reviewed-projects-skills.component';

describe('ReviewedProjectsSkillsComponent', () => {
  let component: ReviewedProjectsSkillsComponent;
  let fixture: ComponentFixture<ReviewedProjectsSkillsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReviewedProjectsSkillsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReviewedProjectsSkillsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
