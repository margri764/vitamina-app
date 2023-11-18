import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditionAssignTimeComponent } from './edition-assign-time.component';

describe('EditionAssignTimeComponent', () => {
  let component: EditionAssignTimeComponent;
  let fixture: ComponentFixture<EditionAssignTimeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditionAssignTimeComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditionAssignTimeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
