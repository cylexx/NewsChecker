import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WikipopupComponent } from './wikipopup.component';

describe('WikipopupComponent', () => {
  let component: WikipopupComponent;
  let fixture: ComponentFixture<WikipopupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WikipopupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WikipopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
