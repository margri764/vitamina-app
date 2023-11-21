import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AskDelProjectComponent } from './ask-del-project.component';

describe('AskDelProjectComponent', () => {
  let component: AskDelProjectComponent;
  let fixture: ComponentFixture<AskDelProjectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AskDelProjectComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AskDelProjectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
