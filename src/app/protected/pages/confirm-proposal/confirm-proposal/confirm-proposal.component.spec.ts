import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmProposalComponent } from './confirm-proposal.component';

describe('ConfirmProposalComponent', () => {
  let component: ConfirmProposalComponent;
  let fixture: ComponentFixture<ConfirmProposalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConfirmProposalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConfirmProposalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
