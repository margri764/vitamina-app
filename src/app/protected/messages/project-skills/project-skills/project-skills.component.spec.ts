import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectSkillsComponent } from './project-skills.component';

describe('ProjectSkillsComponent', () => {
  let component: ProjectSkillsComponent;
  let fixture: ComponentFixture<ProjectSkillsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProjectSkillsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProjectSkillsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
