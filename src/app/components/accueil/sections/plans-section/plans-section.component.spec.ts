import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlansSectionComponent } from './plans-section.component';

describe('PlansSectionComponent', () => {
  let component: PlansSectionComponent;
  let fixture: ComponentFixture<PlansSectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PlansSectionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PlansSectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
