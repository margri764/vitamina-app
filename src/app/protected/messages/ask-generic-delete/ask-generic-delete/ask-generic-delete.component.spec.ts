import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AskGenericDeleteComponent } from './ask-generic-delete.component';

describe('AskGenericDeleteComponent', () => {
  let component: AskGenericDeleteComponent;
  let fixture: ComponentFixture<AskGenericDeleteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AskGenericDeleteComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AskGenericDeleteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
