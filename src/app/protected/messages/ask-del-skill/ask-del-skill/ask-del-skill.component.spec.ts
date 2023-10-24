import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AskDelSkillComponent } from './ask-del-skill.component';

describe('AskDelSkillComponent', () => {
  let component: AskDelSkillComponent;
  let fixture: ComponentFixture<AskDelSkillComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AskDelSkillComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AskDelSkillComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
