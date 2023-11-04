import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AcceptMessageProposalComponent } from './accept-message-proposal.component';

describe('AcceptMessageProposalComponent', () => {
  let component: AcceptMessageProposalComponent;
  let fixture: ComponentFixture<AcceptMessageProposalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AcceptMessageProposalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AcceptMessageProposalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
