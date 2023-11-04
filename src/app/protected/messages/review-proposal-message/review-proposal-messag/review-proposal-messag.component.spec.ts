import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReviewProposalMessagComponent } from './review-proposal-messag.component';

describe('ReviewProposalMessagComponent', () => {
  let component: ReviewProposalMessagComponent;
  let fixture: ComponentFixture<ReviewProposalMessagComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReviewProposalMessagComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReviewProposalMessagComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
