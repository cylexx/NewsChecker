import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ScorespinnerComponent } from './scorespinner.component';

describe('ScorespinnerComponent', () => {
  let component: ScorespinnerComponent;
  let fixture: ComponentFixture<ScorespinnerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ScorespinnerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ScorespinnerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
