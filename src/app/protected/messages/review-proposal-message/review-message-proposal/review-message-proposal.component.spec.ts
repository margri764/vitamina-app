import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReviewMessageProposalComponent } from './review-message-proposal.component';

describe('ReviewMessageProposalComponent', () => {
  let component: ReviewMessageProposalComponent;
  let fixture: ComponentFixture<ReviewMessageProposalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReviewMessageProposalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReviewMessageProposalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
