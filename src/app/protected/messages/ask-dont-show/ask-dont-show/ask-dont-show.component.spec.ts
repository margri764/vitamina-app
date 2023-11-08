import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AskDontShowComponent } from './ask-dont-show.component';

describe('AskDontShowComponent', () => {
  let component: AskDontShowComponent;
  let fixture: ComponentFixture<AskDontShowComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AskDontShowComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AskDontShowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
