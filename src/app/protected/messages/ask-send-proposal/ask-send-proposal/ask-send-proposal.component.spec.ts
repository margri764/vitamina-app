import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AskSendProposalComponent } from './ask-send-proposal.component';

describe('AskSendProposalComponent', () => {
  let component: AskSendProposalComponent;
  let fixture: ComponentFixture<AskSendProposalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AskSendProposalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AskSendProposalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
